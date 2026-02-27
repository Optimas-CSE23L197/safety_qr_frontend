/**
 * SUBSCRIPTION API
 */

import axiosClient from "./axiosClient.js";

export const getSubscriptionApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/subscription`);

export const getPaymentHistoryApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/payments`, { params });

// Super Admin only
export const getAllSubscriptionsApi = (params) =>
  axiosClient.get("/subscriptions", { params });

export const updateSubscriptionApi = (subscriptionId, payload) =>
  axiosClient.patch(`/subscriptions/${subscriptionId}`, payload);

export const cancelSubscriptionApi = (subscriptionId) =>
  axiosClient.post(`/subscriptions/${subscriptionId}/cancel`);
