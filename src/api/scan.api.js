/**
 * SCAN API — Scan logs & anomalies
 */

import axiosClient from "./axiosClient.js";

export const getScanLogsApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/scan-logs`, { params });

export const getScanLogByIdApi = (schoolId, logId) =>
  axiosClient.get(`/schools/${schoolId}/scan-logs/${logId}`);

export const getScanStatsApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/scan-logs/stats`, { params });

// Anomalies
export const getAnomaliesApi = (schoolId, params) =>
  axiosClient.get(`/schools/${schoolId}/anomalies`, { params });

export const getAnomalyByIdApi = (schoolId, anomalyId) =>
  axiosClient.get(`/schools/${schoolId}/anomalies/${anomalyId}`);

export const resolveAnomalyApi = (schoolId, anomalyId, payload) =>
  axiosClient.post(
    `/schools/${schoolId}/anomalies/${anomalyId}/resolve`,
    payload,
  );

export const flagAnomalyApi = (schoolId, anomalyId) =>
  axiosClient.post(`/schools/${schoolId}/anomalies/${anomalyId}/flag`);
