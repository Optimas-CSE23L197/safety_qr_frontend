/**
 * STUDENT SERVICE
 * Business logic for student operations.
 */

import {
  getStudentsApi,
  getStudentByIdApi,
  exportStudentsApi,
} from "../api/student.api.js";
import { getFullName, formatDate } from "../utils/formatters.js";

const getTokenBadge = (status) => {
  const badges = {
    ACTIVE: { bg: "#ECFDF5", color: "#047857", label: "Active" },
    UNASSIGNED: { bg: "#F1F5F9", color: "#475569", label: "Unassigned" },
    EXPIRED: { bg: "#FFFBEB", color: "#B45309", label: "Expired" },
    REVOKED: { bg: "#FEF2F2", color: "#B91C1C", label: "Revoked" },
    ISSUED: { bg: "#E0F2FE", color: "#0369A1", label: "Issued" },
  };
  return badges[status] || badges.UNASSIGNED;
};

export const fetchStudents = async (schoolId, filters = {}) => {
  const response = await getStudentsApi(schoolId, filters);

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch students");
  }

  const students = response.data.data.students.map((student) => ({
    ...student,
    full_name: getFullName(student.first_name, student.last_name),
    created_at_formatted: formatDate(student.created_at),
    token_badge: getTokenBadge(student.token_status),
  }));

  return {
    students,
    meta: response.data.data.meta,
  };
};

export const fetchStudentById = async (schoolId, studentId) => {
  const response = await getStudentByIdApi(schoolId, studentId);

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch student details");
  }

  const student = response.data.data;

  return {
    ...student,
    full_name: getFullName(student.first_name, student.last_name),
    created_at_formatted: formatDate(student.created_at),
    current_token: student.current_token
      ? {
          ...student.current_token,
          status_badge: getTokenBadge(student.current_token.status),
          expires_at_formatted: formatDate(student.current_token.expires_at),
        }
      : null,
  };
};

export const exportStudents = async (schoolId, filters = {}) => {
  return await exportStudentsApi(schoolId, filters);
};
