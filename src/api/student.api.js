/**
 * STUDENT API
 */

import axiosClient from "./axiosClient.js";

export const getStudentsApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/students`, { params });

export const getStudentByIdApi = (schoolId, studentId) =>
  axiosClient.get(`/schools/${schoolId}/students/${studentId}`);

export const createStudentApi = (schoolId, payload) =>
  axiosClient.post(`/schools/${schoolId}/students`, payload);

export const updateStudentApi = (schoolId, studentId, payload) =>
  axiosClient.patch(`/schools/${schoolId}/students/${studentId}`, payload);

export const deleteStudentApi = (schoolId, studentId) =>
  axiosClient.delete(`/schools/${schoolId}/students/${studentId}`);

export const getStudentEmergencyApi = (schoolId, studentId) =>
  axiosClient.get(`/schools/${schoolId}/students/${studentId}/emergency`);

export const updateStudentEmergencyApi = (schoolId, studentId, payload) =>
  axiosClient.patch(
    `/schools/${schoolId}/students/${studentId}/emergency`,
    payload,
  );

export const getStudentParentsApi = (schoolId, studentId) =>
  axiosClient.get(`/schools/${schoolId}/students/${studentId}/parents`);

export const getStudentScanHistoryApi = (schoolId, studentId, params) =>
  axiosClient.get(`/schools/${schoolId}/students/${studentId}/scans`, {
    params,
  });

// Parent Update Requests
export const getParentRequestsApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/parent-requests`, { params });

export const approveParentRequestApi = (schoolId, requestId) =>
  axiosClient.post(`/schools/${schoolId}/parent-requests/${requestId}/approve`);

export const rejectParentRequestApi = (schoolId, requestId, payload) =>
  axiosClient.post(
    `/schools/${schoolId}/parent-requests/${requestId}/reject`,
    payload,
  );
