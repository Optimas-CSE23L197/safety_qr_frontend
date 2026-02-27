/**
 * ROUTES CONFIG
 * Single source of truth for all route paths.
 * Never hardcode path strings in components — always import from here.
 */

export const ROUTES = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: "/login",
  },

  // ── Super Admin ───────────────────────────────────────────────────────────
  SUPER_ADMIN: {
    ROOT: "/super",
    DASHBOARD: "/super/dashboard",

    ALL_SCHOOLS: "/super/schools",
    SCHOOL_DETAILS: "/super/schools/:schoolId",
    REGISTER_SCHOOL: "/super/schools/register",

    ADMIN_MANAGEMENT: "/super/admins",
    SUBSCRIPTIONS: "/super/subscriptions",

    FEATURE_FLAGS: "/super/feature-flags",
    AUDIT_LOGS: "/super/audit-logs",
    HEALTH_MONITOR: "/super/health",
    REPORTS: "/super/reports",

    API_KEYS: "/super/api-keys",
    WEBHOOKS: "/super/webhooks",

    // ── Tokens ──
    TOKEN_INVENTORY: "/super/tokens/inventory",
    TOKEN_CONTROL: "/super/tokens/control",
  },

  // ── School Admin ──────────────────────────────────────────────────────────
  SCHOOL_ADMIN: {
    ROOT: "/school",
    DASHBOARD: "/school/dashboard",
    STUDENTS: "/school/students",
    STUDENT_DETAIL: "/school/students/:studentId",
    SCAN_LOGS: "/school/scan-logs",
    ANOMALIES: "/school/anomalies",
    PARENT_REQUESTS: "/school/parent-requests",
    CARD_TEMPLATE: "/school/card-template",
    AUDIT_LOGS: "/school/audit-logs",
    NOTIFICATIONS: "/school/notifications",
    SETTINGS: "/school/settings",
    QR_MANAGEMENT: "/school/qr",
    // Tokens
    TOKEN_INVENTORY: "/school/tokens/inventory",
    TOKEN_CONTROL: "/school/tokens/control",
    // Emergency
    EMERGENCY: "/school/emergency/:studentId",
  },
};

/**
 * Builds a path by replacing :param with actual value
 * Usage: buildPath(ROUTES.SCHOOL_ADMIN.STUDENT_DETAIL, { studentId: '123' })
 */
export const buildPath = (template, params = {}) => {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    template,
  );
};
