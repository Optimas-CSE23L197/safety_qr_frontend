/**
 * TOKEN API
 */

import axiosClient from "./axiosClient.js";

export const getTokensApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/tokens`, { params });

export const getTokenByIdApi = (schoolId, tokenId) =>
  axiosClient.get(`/schools/${schoolId}/tokens/${tokenId}`);

export const assignTokenApi = (schoolId, tokenId, studentId) =>
  axiosClient.post(`/schools/${schoolId}/tokens/${tokenId}/assign`, {
    student_id: studentId,
  });

export const revokeTokenApi = (schoolId, tokenId, reason) =>
  axiosClient.post(`/schools/${schoolId}/tokens/${tokenId}/revoke`, { reason });

export const deactivateTokenApi = (schoolId, tokenId) =>
  axiosClient.post(`/schools/${schoolId}/tokens/${tokenId}/deactivate`);

export const reactivateTokenApi = (schoolId, tokenId) =>
  axiosClient.post(`/schools/${schoolId}/tokens/${tokenId}/reactivate`);

export const replaceTokenApi = (schoolId, tokenId) =>
  axiosClient.post(`/schools/${schoolId}/tokens/${tokenId}/replace`);

// Token Batches
export const getTokenBatchesApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/token-batches`, { params });

export const createTokenBatchApi = (schoolId, payload) =>
  axiosClient.post(`/schools/${schoolId}/token-batches`, payload);

export const getTokenBatchByIdApi = (schoolId, batchId) =>
  axiosClient.get(`/schools/${schoolId}/token-batches/${batchId}`);

export const getTokenStatsApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/tokens/stats`);
