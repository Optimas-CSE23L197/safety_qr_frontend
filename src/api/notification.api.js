/**
 * NOTIFICATION API
 */

import axiosClient from "./axiosClient.js";

export const getNotificationsApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/notifications`, { params });

export const markNotificationReadApi = (schoolId, notificationId) =>
  axiosClient.patch(
    `/schools/${schoolId}/notifications/${notificationId}/read`,
  );

export const markAllNotificationsReadApi = (schoolId) =>
  axiosClient.post(`/schools/${schoolId}/notifications/read-all`);

export const getUnreadCountApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/notifications/unread-count`);
