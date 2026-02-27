/**
 * FORMATTERS — Pure utility functions for displaying data
 * No React, no side effects. Safe to use anywhere.
 */

import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  addDays,
  parseISO,
} from "date-fns";
import { DATE_FORMATS, TOKEN_EXPIRY_WARNING_DAYS } from "./constants.js";

// ── Date & Time ───────────────────────────────────────────────────────────────

/**
 * Format a date string or Date object for display
 * @param {string|Date} date
 * @param {string} formatStr
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, formatStr);
  } catch {
    return "—";
  }
};

/**
 * Format a datetime for full display with time
 */
export const formatDateTime = (date) =>
  formatDate(date, DATE_FORMATS.DISPLAY_TIME);

/**
 * "2 hours ago", "3 days ago"
 */
export const formatRelativeTime = (date) => {
  if (!date) return "—";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
};

/**
 * Returns true if a token expiry date is within the warning window
 */
export const isExpiringSoon = (expiresAt) => {
  if (!expiresAt) return false;
  const expiry =
    typeof expiresAt === "string" ? parseISO(expiresAt) : expiresAt;
  const warningDate = addDays(new Date(), TOKEN_EXPIRY_WARNING_DAYS);
  return isBefore(expiry, warningDate) && isAfter(expiry, new Date());
};

/**
 * Returns true if date is in the past
 */
export const isExpired = (date) => {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return isBefore(d, new Date());
};

// ── Token ─────────────────────────────────────────────────────────────────────

/**
 * Mask token hash for display — show first 8 and last 4 chars
 * Full hash is sensitive; don't display in tables
 * @param {string} hash
 */
export const maskTokenHash = (hash) => {
  if (!hash || hash.length < 12) return hash || "—";
  return `${hash.slice(0, 8)}••••${hash.slice(-4)}`;
};

// ── Name & Text ───────────────────────────────────────────────────────────────

/**
 * Get full name from first + last name parts
 */
export const getFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return "—";
  return [firstName, lastName].filter(Boolean).join(" ");
};

/**
 * Get initials for avatar fallback
 */
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};

/**
 * Truncate long strings with ellipsis
 */
export const truncate = (str, maxLength = 40) => {
  if (!str) return "—";
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
};

/**
 * Title-case a string ("school_admin" → "School Admin")
 */
export const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// ── Numbers & Currency ────────────────────────────────────────────────────────

/**
 * Format INR currency (amounts stored in paise → convert to rupees)
 * @param {number} amountInPaise
 */
export const formatCurrency = (amountInPaise) => {
  if (amountInPaise == null) return "—";
  const rupees = amountInPaise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
};

/**
 * Format large numbers with commas (Indian format)
 */
export const formatNumber = (num) => {
  if (num == null) return "—";
  return new Intl.NumberFormat("en-IN").format(num);
};

/**
 * Short format for large numbers (1.2K, 3.4M)
 */
export const formatCompact = (num) => {
  if (num == null) return "—";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

// ── Phone ─────────────────────────────────────────────────────────────────────

/**
 * Format Indian phone number for display
 * "+919876543210" → "+91 98765 43210"
 */
export const formatPhone = (phone) => {
  if (!phone) return "—";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    const local = cleaned.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// ── File Size ─────────────────────────────────────────────────────────────────

export const formatFileSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ── Misc ──────────────────────────────────────────────────────────────────────

/**
 * Convert snake_case / SCREAMING_SNAKE to human-readable
 * "SCAN_ANOMALY" → "Scan Anomaly"
 */
export const humanizeEnum = (value) => {
  if (!value) return "—";
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Pluralize a word based on count
 * pluralize('student', 1) → "student"
 * pluralize('student', 3) → "students"
 */
export const pluralize = (word, count, plural) => {
  if (count === 1) return word;
  return plural || `${word}s`;
};
