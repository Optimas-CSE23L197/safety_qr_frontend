// =============================================================================
// school.service.js - School business logic
// =============================================================================

import { BaseService } from "../base.service.js";
import { schoolsApi } from "#api/super-admin/schools.api.js";
import {
  hashPassword,
  generateIdempotencyKey,
  storeIdempotencyKey,
  getStoredIdempotencyKey,
  clearIdempotencyKey,
} from "#utils/crypto.js";

class SchoolService extends BaseService {
  constructor() {
    super(schoolsApi);
  }

  /**
   * Register a new school with idempotency
   * @param {Object} payload - Registration payload
   * @returns {Promise}
   */
  async registerSchool(payload) {
    const action = "register_school";
    const existingKey = getStoredIdempotencyKey(action);

    if (existingKey) {
      throw {
        type: "DUPLICATE",
        message: "Registration already in progress. Please wait.",
      };
    }

    const idempotencyKey = generateIdempotencyKey();
    storeIdempotencyKey(idempotencyKey, action);

    try {
      // Hash password before sending
      const hashedPassword = await hashPassword(payload.admin.password);

      const requestPayload = {
        school: payload.school,
        admin: {
          ...payload.admin,
          password: hashedPassword,
        },
        subscription: payload.subscription,
        agreement: payload.agreement,
        idempotencyKey,
      };

      const result = await this.execute(
        () => this.api.register(requestPayload),
        {
          onError: () => clearIdempotencyKey(action),
        },
      );

      clearIdempotencyKey(action);
      return result;
    } catch (error) {
      clearIdempotencyKey(action);
      throw error;
    }
  }

  /**
   * Get paginated schools list
   * @param {Object} params - Filters and pagination
   * @returns {Promise}
   */
  async getSchools(params) {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      status,
      sort_field,
      sort_dir,
    } = params;

    const queryParams = {
      page,
      limit,
      ...(search && { search }),
      ...(city && { city }),
      ...(status && { status }),
      ...(sort_field && { sort_field }),
      ...(sort_dir && { sort_dir }),
    };

    return this.execute(() => this.api.list(queryParams));
  }

  /**
   * Get school by ID
   * @param {string} id - School UUID
   * @returns {Promise}
   */
  async getSchoolById(id) {
    return this.execute(() => this.api.getById(id));
  }

  /**
   * Toggle school active status
   * @param {string} id - School UUID
   * @param {boolean} isActive - New status
   * @returns {Promise}
   */
  async toggleStatus(id, isActive) {
    return this.execute(() => this.api.toggleStatus(id, isActive));
  }

  /**
   * Get dashboard stats
   * @returns {Promise}
   */
  async getStats() {
    return this.execute(() => this.api.getStats());
  }

  /**
   * Get cities for filter
   * @returns {Promise}
   */
  async getCities() {
    return this.execute(() => this.api.getCities());
  }
}

export const schoolService = new SchoolService();
