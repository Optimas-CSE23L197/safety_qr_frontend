// =============================================================================
// base.service.js - Generic CRUD service
// =============================================================================

export class BaseService {
  constructor(api, store = null) {
    this.api = api;
    this.store = store;
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Axios error
   * @throws {Object} - Standardized error
   */
  handleError(error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    const errors = error.response?.data?.errors || null;

    // Rate limiting
    if (status === 429) {
      const retryAfter = error.response?.headers["retry-after"] || 60;
      throw {
        type: "RATE_LIMITED",
        message: "Too many requests. Please wait.",
        retryAfter: parseInt(retryAfter),
      };
    }

    // Validation error
    if (status === 422) {
      throw {
        type: "VALIDATION",
        message,
        errors,
      };
    }

    // Authentication error
    if (status === 401) {
      throw {
        type: "UNAUTHORIZED",
        message: "Session expired. Please login again.",
      };
    }

    // Authorization error
    if (status === 403) {
      throw {
        type: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      };
    }

    throw {
      type: "GENERAL",
      message,
      status,
    };
  }

  /**
   * Execute API call with loading state
   * @param {Function} apiCall - API function
   * @param {Object} options - Options
   * @returns {Promise}
   */
  async execute(apiCall, options = {}) {
    const { setLoading, onSuccess, onError } = options;

    if (setLoading) setLoading(true);

    try {
      const result = await apiCall();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      const processedError = this.handleError(error);
      if (onError) onError(processedError);
      throw processedError;
    } finally {
      if (setLoading) setLoading(false);
    }
  }
}
