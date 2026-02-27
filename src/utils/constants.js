/**
 * CONSTANTS
 * Maps directly to Prisma enums. Keep in sync with backend schema.
 * Use these everywhere — never type raw string values like "ACTIVE" inline.
 */

// ── Roles ─────────────────────────────────────────────────────────────────────
export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  SCHOOL_ADMIN: "ADMIN",
  SCHOOL_STAFF: "STAFF",
  SCHOOL_VIEWER: "VIEWER",
};

export const ACTOR_TYPES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  SCHOOL_USER: "SCHOOL_USER",
  PARENT_USER: "PARENT_USER",
  SYSTEM: "SYSTEM",
};

// ── Token ─────────────────────────────────────────────────────────────────────
export const TOKEN_STATUS = {
  UNASSIGNED: "UNASSIGNED",
  ISSUED: "ISSUED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED",
};

// ── Scan ──────────────────────────────────────────────────────────────────────
export const SCAN_RESULT = {
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED",
  INACTIVE: "INACTIVE",
  RATE_LIMITED: "RATE_LIMITED",
  ERROR: "ERROR",
};

export const SCAN_PURPOSE = {
  EMERGENCY: "EMERGENCY",
  REGISTRATION: "REGISTRATION",
  UNKNOWN: "UNKNOWN",
};

// ── Subscription ──────────────────────────────────────────────────────────────
export const SUBSCRIPTION_STATUS = {
  TRIALING: "TRIALING",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

// ── Requests ──────────────────────────────────────────────────────────────────
export const REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

// ── User Status ───────────────────────────────────────────────────────────────
export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const NOTIFICATION_TYPE = {
  SCAN_ALERT: "SCAN_ALERT",
  SCAN_ANOMALY: "SCAN_ANOMALY",
  CARD_EXPIRING: "CARD_EXPIRING",
  CARD_REVOKED: "CARD_REVOKED",
  CARD_REPLACED: "CARD_REPLACED",
  BILLING_ALERT: "BILLING_ALERT",
  SYSTEM: "SYSTEM",
};

export const NOTIFICATION_CHANNEL = {
  SMS: "SMS",
  EMAIL: "EMAIL",
  PUSH: "PUSH",
};

export const NOTIFICATION_STATUS = {
  QUEUED: "QUEUED",
  SENT: "SENT",
  FAILED: "FAILED",
  SUPPRESSED: "SUPPRESSED",
};

// ── Profile Visibility ────────────────────────────────────────────────────────
export const PROFILE_VISIBILITY = {
  PUBLIC: "PUBLIC",
  MINIMAL: "MINIMAL",
  HIDDEN: "HIDDEN",
};

// ── School Role ───────────────────────────────────────────────────────────────
export const SCHOOL_ROLE = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  VIEWER: "VIEWER",
};

// ── Anomaly Types (from backend logic) ───────────────────────────────────────
export const ANOMALY_TYPE = {
  FOREIGN_LOCATION: "FOREIGN_LOCATION",
  MULTI_TOKEN_SINGLE_DEVICE: "MULTI_TOKEN_SINGLE_DEVICE",
  HIGH_FREQUENCY: "HIGH_FREQUENCY",
  AFTER_HOURS: "AFTER_HOURS",
};

// ── Pagination ────────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// ── Date Formats ──────────────────────────────────────────────────────────────
export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy", // 01 Jan 2025
  DISPLAY_TIME: "dd MMM yyyy, hh:mm a", // 01 Jan 2025, 02:30 PM
  TIME_ONLY: "hh:mm a", // 02:30 PM
  ISO: "yyyy-MM-dd'T'HH:mm:ss", // ISO 8601
  INPUT: "yyyy-MM-dd", // HTML input[type=date]
};

// ── API ───────────────────────────────────────────────────────────────────────
export const API_VERSION = "v1";
export const TOKEN_EXPIRY_WARNING_DAYS = 30; // Show warning when token expires within 30 days

// ── Local Storage Keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user_data",
  SIDEBAR_STATE: "sidebar_collapsed",
};
