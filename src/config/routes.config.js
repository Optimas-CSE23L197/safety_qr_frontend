/**
 * ROUTES CONFIG
 * Single source of truth for all route paths.
 * Never hardcode path strings in components — always import from here.
 */

export const ROUTES = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: "/login", // School Admin login
  },

  // ── Super Admin ────────────────────────────────────────────────────────────
  SUPER_ADMIN: {
    ROOT: "/super",
    LOGIN: "/super-admin", // Super Admin login (separate URL)
    DASHBOARD: "/super/dashboard",

    // Schools
    ALL_SCHOOLS: "/super/schools",
    SCHOOL_DETAILS: "/super/schools/:schoolId",
    REGISTER_SCHOOL: "/super/schools/register",
    SCHOOL_LOOKUP: "/super/schools/lookup",

    // People
    ADMIN_MANAGEMENT: "/super/admins",
    ALL_STUDENTS: "/super/students",
    ALL_PARENTS: "/super/parents",

    // Tokens
    TOKEN_INVENTORY: "/super/tokens/inventory",
    TOKEN_CONTROL: "/super/tokens/control",
    TOKEN_ORDERS: "/super/tokens/orders",

    // Business
    SUBSCRIPTIONS: "/super/subscriptions",
    PAYMENTS: "/super/payments",
    REVENUE: "/super/revenue",

    // Safety
    SCAN_LOGS: "/super/scan-logs",
    SCAN_ANOMALIES: "/super/scan-anomalies",
    EMERGENCY_PROFILES: "/super/emergency-profiles",
    LOCATION_TRACKING: "/super/locations",

    // System
    FEATURE_FLAGS: "/super/feature-flags",
    AUDIT_LOGS: "/super/audit-logs",
    HEALTH_MONITOR: "/super/health",
    REPORTS: "/super/reports",
    NOTIFICATIONS: "/super/notifications",

    // Developer
    API_KEYS: "/super/api-keys",
    WEBHOOKS: "/super/webhooks",
    SESSIONS: "/super/sessions",
  },

  // ── School Admin ───────────────────────────────────────────────────────────
  SCHOOL_ADMIN: {
    ROOT: "/school",
    LOGIN: "/login", // School Admin login

    // Overview
    DASHBOARD: "/school/dashboard",
    LIVE_SCANS: "/school/live-scans",

    // People
    STUDENTS: "/school/students",
    STUDENT_DETAIL: "/school/students/:studentId",
    STUDENT_CREATE: "/school/students/create",
    PARENTS: "/school/parents",
    PARENT_DETAIL: "/school/parents/:parentId",
    STAFF: "/school/staff",
    STAFF_INVITE: "/school/staff/invite",
    CARD_REQUESTS: "/school/card-requests",

    // Safety
    EMERGENCY_PROFILES: "/school/emergency-profiles",
    EMERGENCY_DETAIL: "/school/emergency-profiles/:studentId",
    LOCATION_TRACKING: "/school/locations",
    SCAN_LOGS: "/school/scan-logs",
    ANOMALIES: "/school/anomalies",

    // ID Cards & Tokens
    TOKEN_INVENTORY: "/school/tokens/inventory",
    TOKEN_CONTROL: "/school/tokens/control",
    TOKEN_ORDERS: "/school/tokens/orders",
    TOKEN_ORDER_DETAIL: "/school/tokens/orders/:orderId",
    QR_MANAGEMENT: "/school/qr",
    CARD_TEMPLATE: "/school/card-template",

    // Communication
    NOTIFICATIONS: "/school/notifications",
    DEVICES: "/school/devices",

    // Analytics
    SCAN_ANALYTICS: "/school/analytics/scans",
    REPORTS: "/school/reports",

    // Billing
    BILLING: "/school/billing",
    BILLING_UPGRADE: "/school/billing/upgrade",

    // Settings
    SCHOOL_PROFILE: "/school/settings/profile",
    NOTIFICATION_PREFS: "/school/settings/notifications",
    AUDIT_LOGS: "/school/audit-logs",
    MY_PROFILE: "/school/profile",
    SETTINGS: "/school/settings",
  },

  // ── Parent App ─────────────────────────────────────────────────────────────
  PARENT: {
    ROOT: "/parent",
    LOGIN: "/parent/login",
    DASHBOARD: "/parent/dashboard",
    CHILDREN: "/parent/children",
    CHILD_DETAIL: "/parent/children/:studentId",
    SCAN_HISTORY: "/parent/scan-history",
    NOTIFICATIONS: "/parent/notifications",
    PROFILE: "/parent/profile",
  },
};

/**
 * Builds a path by replacing :param with actual value.
 * Usage: buildPath(ROUTES.SCHOOL_ADMIN.STUDENT_DETAIL, { studentId: '123' })
 */
export const buildPath = (template, params = {}) => {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    template,
  );
};

/**
 * Checks if a given pathname matches a route template.
 * Usage: matchesRoute("/school/students/123", ROUTES.SCHOOL_ADMIN.STUDENT_DETAIL)
 */
export const matchesRoute = (pathname, template) => {
  const regexStr = template.replace(/:[^/]+/g, "[^/]+");
  return new RegExp(`^${regexStr}$`).test(pathname);
};
