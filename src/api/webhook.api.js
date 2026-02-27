/**
 * WEBHOOK API
 */

import axiosClient from "./axiosClient.js";

export const getWebhooksApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/webhooks`);

export const createWebhookApi = (schoolId, payload) =>
  axiosClient.post(`/schools/${schoolId}/webhooks`, payload);

export const updateWebhookApi = (schoolId, webhookId, payload) =>
  axiosClient.patch(`/schools/${schoolId}/webhooks/${webhookId}`, payload);

export const deleteWebhookApi = (schoolId, webhookId) =>
  axiosClient.delete(`/schools/${schoolId}/webhooks/${webhookId}`);

export const testWebhookApi = (schoolId, webhookId) =>
  axiosClient.post(`/schools/${schoolId}/webhooks/${webhookId}/test`);
