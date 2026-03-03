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
  AUTH_STORE: "auth-store",
  SIDEBAR_STATE: "sidebar_collapsed",
};

export const STEPS = [
  { id: 1, label: "School Info" },
  { id: 2, label: "Admin Account" },
  { id: 3, label: "Subscription" },
  { id: 4, label: "Review" },
];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    badge: null,
    tagline: "For small schools getting started",
    features: [
      "Up to 200 students",
      "Email notifications",
      "Basic scan logs",
      "Standard support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    badge: "Popular",
    tagline: "Best for mid-sized schools",
    features: [
      "Up to 1,000 students",
      "SMS + Email alerts",
      "Anomaly detection",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: null,
    tagline: "For large institutions",
    features: [
      "Unlimited students",
      "All notifications",
      "Advanced analytics",
      "Dedicated support",
    ],
  },
];

export const TRIAL_OPTIONS = [
  { value: 0, label: "No trial" },
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
];

/**
 * admin.constants.js — all static data for AdminManagement page.
 * Extracted so the page component stays lean.
 */

import { Shield, Users, Eye } from "lucide-react";

export const ROLE_STYLE = {
  SUPER_ADMIN: { bg: "#FEF3C7", color: "#B45309", icon: Shield },
  ADMIN: { bg: "#EFF6FF", color: "#1D4ED8", icon: Users },
  STAFF: { bg: "#F5F3FF", color: "#6D28D9", icon: Users },
  VIEWER: { bg: "#F1F5F9", color: "#475569", icon: Eye },
};

export const ROLES = ["ALL", "SUPER_ADMIN", "ADMIN", "STAFF", "VIEWER"];

export const MOCK_ADMINS = Array.from({ length: 26 }, (_, i) => ({
  id: `adm-${i + 1}`,
  name: [
    "Rajesh Kumar",
    "Priya Sharma",
    "Anita Verma",
    "Suresh Nair",
    "Meera Iyer",
    "Arun Pillai",
    "Kavitha Reddy",
    "Deepak Singh",
    "Lata Mehta",
    "Rajan Patel",
    "Sunita Joshi",
    "Vijay Bose",
    "Anjali Das",
    "Krishna Rao",
    "Pooja Chopra",
    "Mahesh Kaur",
    "Rekha Shetty",
    "Santosh Nair",
    "Uma Pillai",
    "Vivek Menon",
    "Divya Gupta",
    "Naveen Kumar",
    "Swati Shah",
    "Aditya Mehta",
    "Pallavi Reddy",
    "Manish Saxena",
  ][i],
  email: `admin${i + 1}@school${i + 1}.edu.in`,
  role:
    i < 2
      ? "SUPER_ADMIN"
      : ["ADMIN", "ADMIN", "STAFF", "ADMIN", "VIEWER", "ADMIN"][i % 6],
  school_name:
    i < 2
      ? null
      : [
          "Delhi Public School",
          "St. Mary's Convent",
          "Kendriya Vidyalaya",
          "Ryan International",
          "Cambridge High",
        ][i % 5],
  is_active: i % 8 !== 7,
  last_login_at:
    i % 4 !== 3 ? new Date(Date.now() - i * 3600000 * 24).toISOString() : null,
  created_at: new Date(Date.now() - i * 86400000 * 20).toISOString(),
}));
