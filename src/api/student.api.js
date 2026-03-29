/**
 * STUDENT API
 * Raw HTTP calls for student management.
 * School admin can only VIEW students — no create/update/delete.
 */

import axiosClient from "./axiosClient.js";

export const getStudentsApi = (schoolId, params = {}) =>
  axiosClient.get(`/school-admin/${schoolId}/students`, { params });

export const getStudentByIdApi = (schoolId, studentId) =>
  axiosClient.get(`/school-admin/${schoolId}/students/${studentId}`);

export const exportStudentsApi = (schoolId, params = {}) =>
  axiosClient.get(`/school-admin/${schoolId}/students/export`, {
    params,
    responseType: "blob",
  });
