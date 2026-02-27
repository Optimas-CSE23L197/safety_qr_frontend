/**
 * SCHOOL API
 */

import axiosClient from "./axiosClient.js";

export const getAllSchoolsApi = (params) =>
  axiosClient.get("/schools", { params });

export const getSchoolByIdApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}`);

export const createSchoolApi = (payload) =>
  axiosClient.post("/schools", payload);

export const updateSchoolApi = (schoolId, payload) =>
  axiosClient.patch(`/schools/${schoolId}`, payload);

export const deleteSchoolApi = (schoolId) =>
  axiosClient.delete(`/schools/${schoolId}`);

export const getSchoolSettingsApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/settings`);

export const updateSchoolSettingsApi = (schoolId, payload) =>
  axiosClient.patch(`/schools/${schoolId}/settings`, payload);

export const getSchoolStatsApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/stats`);

export const getSchoolDashboardApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/dashboard`);

// Trusted Scan Zones
export const getTrustedZonesApi = (schoolId) =>
  axiosClient.get(`/schools/${schoolId}/trusted-zones`);

export const createTrustedZoneApi = (schoolId, payload) =>
  axiosClient.post(`/schools/${schoolId}/trusted-zones`, payload);

export const updateTrustedZoneApi = (schoolId, zoneId, payload) =>
  axiosClient.patch(`/schools/${schoolId}/trusted-zones/${zoneId}`, payload);

export const deleteTrustedZoneApi = (schoolId, zoneId) =>
  axiosClient.delete(`/schools/${schoolId}/trusted-zones/${zoneId}`);
