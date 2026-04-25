// =============================================================================
// schools.api.js - School API calls
// =============================================================================

import axiosClient from "../axiosClient.js";
import { ENDPOINTS } from "../endpoints.js";

export const schoolsApi = {
  /**
   * Get paginated list of schools
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  list: async (params) => {
    const response = await axiosClient.get(ENDPOINTS.SUPER_ADMIN.SCHOOLS.LIST, {
      params,
    });
    return response.data;
  },

  /**
   * Register a new school
   * @param {Object} payload - School registration data
   * @returns {Promise}
   */
  register: async (payload) => {
    const response = await axiosClient.post(
      ENDPOINTS.SUPER_ADMIN.SCHOOLS.REGISTER,
      payload,
    );
    return response.data;
  },

  /**
   * Get school by ID
   * @param {string} id - School UUID
   * @returns {Promise}
   */
  getById: async (id) => {
    const response = await axiosClient.get(
      ENDPOINTS.SUPER_ADMIN.SCHOOLS.DETAILS(id),
    );
    return response.data;
  },

  /**
   * Toggle school active status
   * @param {string} id - School UUID
   * @param {boolean} isActive - New status
   * @returns {Promise}
   */
  toggleStatus: async (id, isActive) => {
    const response = await axiosClient.patch(
      ENDPOINTS.SUPER_ADMIN.SCHOOLS.TOGGLE_STATUS(id),
      { is_active: isActive },
    );
    return response.data;
  },

  /**
   * Get school statistics (total, active, inactive)
   * @returns {Promise}
   */
  getStats: async () => {
    const response = await axiosClient.get(ENDPOINTS.SUPER_ADMIN.SCHOOLS.STATS);
    return response.data;
  },

  /**
   * Get unique cities list for filtering
   * @returns {Promise}
   */
  getCities: async () => {
    const response = await axiosClient.get(
      ENDPOINTS.SUPER_ADMIN.SCHOOLS.CITIES,
    );
    return response.data;
  },
};
