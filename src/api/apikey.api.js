/**
 * API KEY API
 */

import axiosClient from "./axiosClient.js";

export const getApiKeysApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/api-keys`);

export const createApiKeyApi = (schoolId, payload) =>
  axiosClient.post(`/schools/${schoolId}/api-keys`, payload);

export const rotateApiKeyApi = (schoolId, keyId) =>
  axiosClient.post(`/schools/${schoolId}/api-keys/${keyId}/rotate`);

export const revokeApiKeyApi = (schoolId, keyId) =>
  axiosClient.delete(`/schools/${schoolId}/api-keys/${keyId}`);

// Audit logs
export const getAuditLogsApi = (params) =>
  axiosClient.get("/audit-logs", { params });

export const getSchoolAuditLogsApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/audit-logs`, { params });
