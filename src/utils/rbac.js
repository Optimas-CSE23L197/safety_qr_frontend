/**
 * RBAC — Role-Based Access Control
 * Defines what each role can do. Check permissions in components and routes.
 *
 * Usage:
 *   import { hasPermission } from '@/utils/rbac';
 *   hasPermission('ADMIN', 'tokens.revoke') // → true
 *   hasPermission('VIEWER', 'tokens.revoke') // → false
 */

import { USER_ROLES } from "./constants.js";

// ── Permission Definitions ────────────────────────────────────────────────────
const PERMISSIONS = {
  // Dashboard
  "dashboard.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],

  // Students
  "students.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
  "students.create": ["SUPER_ADMIN", "ADMIN"],
  "students.edit": ["SUPER_ADMIN", "ADMIN", "STAFF"],
  "students.delete": ["SUPER_ADMIN", "ADMIN"],
  "students.viewEmergency": ["SUPER_ADMIN", "ADMIN", "STAFF"],

  // Tokens
  "tokens.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
  "tokens.issue": ["SUPER_ADMIN", "ADMIN", "STAFF"],
  "tokens.revoke": ["SUPER_ADMIN", "ADMIN"],
  "tokens.assign": ["SUPER_ADMIN", "ADMIN", "STAFF"],
  "tokens.createBatch": ["SUPER_ADMIN", "ADMIN"],

  // Scan Logs
  "scanLogs.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
  "anomalies.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
  "anomalies.resolve": ["SUPER_ADMIN", "ADMIN"],

  // Parent Requests
  "parentRequests.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
  "parentRequests.approve": ["SUPER_ADMIN", "ADMIN", "STAFF"],
  "parentRequests.reject": ["SUPER_ADMIN", "ADMIN"],

  // Card Template
  "cardTemplate.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
  "cardTemplate.edit": ["SUPER_ADMIN", "ADMIN"],
  "cardTemplate.print": ["SUPER_ADMIN", "ADMIN", "STAFF"],

  // QR
  "qr.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],
  "qr.generate": ["SUPER_ADMIN", "ADMIN"],

  // Notifications
  "notifications.view": ["SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"],

  // Settings (School Admin)
  "settings.view": ["SUPER_ADMIN", "ADMIN"],
  "settings.edit": ["SUPER_ADMIN", "ADMIN"],
  "settings.editWebhooks": ["SUPER_ADMIN", "ADMIN"],
  "settings.editApiKeys": ["SUPER_ADMIN", "ADMIN"],
  "settings.editTrustedZones": ["SUPER_ADMIN", "ADMIN"],

  // Audit Logs
  "auditLogs.view": ["SUPER_ADMIN", "ADMIN"],

  // Super Admin Only
  "schools.viewAll": ["SUPER_ADMIN"],
  "schools.create": ["SUPER_ADMIN"],
  "schools.delete": ["SUPER_ADMIN"],
  "superAdmins.manage": ["SUPER_ADMIN"],
  "subscriptions.manage": ["SUPER_ADMIN"],
  "featureFlags.manage": ["SUPER_ADMIN"],
  "healthMonitor.view": ["SUPER_ADMIN"],
  "reports.view": ["SUPER_ADMIN"],
  "apiKeys.manageSuperAdmin": ["SUPER_ADMIN"],
};

/**
 * Check if a role has permission for an action
 * @param {string} role - USER_ROLES value
 * @param {string} permission - permission key from PERMISSIONS map
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) {
    console.warn(`[RBAC] Unknown permission: "${permission}"`);
    return false;
  }
  return allowedRoles.includes(role);
};

/**
 * Check if a role has ALL listed permissions
 * @param {string} role
 * @param {string[]} permissions
 * @returns {boolean}
 */
export const hasAllPermissions = (role, permissions) => {
  return permissions.every((p) => hasPermission(role, p));
};

/**
 * Check if a role has ANY of the listed permissions
 * @param {string} role
 * @param {string[]} permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (role, permissions) => {
  return permissions.some((p) => hasPermission(role, p));
};

/**
 * Returns true if the user is a Super Admin
 */
export const isSuperAdmin = (role) => role === USER_ROLES.SUPER_ADMIN;

/**
 * Returns true if the user is any school role
 */
export const isSchoolUser = (role) =>
  [
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.SCHOOL_STAFF,
    USER_ROLES.SCHOOL_VIEWER,
  ].includes(role);

/**
 * Get all permissions for a role (for debugging)
 */
export const getPermissionsForRole = (role) => {
  return Object.entries(PERMISSIONS)
    .filter(([, roles]) => roles.includes(role))
    .map(([perm]) => perm);
};

export { PERMISSIONS };
