/**
 * DESIGN SYSTEM — Single source of truth for all colors, spacing, typography
 * Every component must reference these tokens. Never hardcode colors.
 *
 * Palette Direction: "Institutional Authority"
 * — Deep navy authority + warm slate neutrals + precise amber accents
 * — Feels like Bloomberg Terminal meets modern SaaS, not a school toy
 */

export const COLORS = {
  // ── Brand Core ─────────────────────────────────────────────────────────────
  brand: {
    900: "#0A1628", // Deepest navy — sidebar bg
    800: "#0F2044", // Dark navy — sidebar hover, header
    700: "#1A3260", // Mid navy — active states
    600: "#1E40AF", // Primary blue — primary buttons, links
    500: "#2563EB", // Bright blue — hover states
    400: "#3B82F6", // Light blue — icons, accents
    300: "#93C5FD", // Pale blue — subtle highlights
    100: "#DBEAFE", // Lightest blue — bg tints
    50: "#EFF6FF", // Near white blue — page bg tint
  },

  // ── Neutral Slate ───────────────────────────────────────────────────────────
  slate: {
    950: "#0C1322", // Near black
    900: "#0F172A", // Text primary
    800: "#1E293B", // Text secondary
    700: "#334155", // Muted text
    600: "#475569", // Placeholder
    500: "#64748B", // Disabled text
    400: "#94A3B8", // Border dark
    300: "#CBD5E1", // Border light
    200: "#E2E8F0", // Divider
    100: "#F1F5F9", // Input bg
    50: "#F8FAFC", // Page background
  },

  // ── Semantic Colors ─────────────────────────────────────────────────────────
  success: {
    700: "#047857",
    600: "#059669",
    500: "#10B981",
    100: "#D1FAE5",
    50: "#ECFDF5",
  },
  warning: {
    700: "#B45309",
    600: "#D97706",
    500: "#F59E0B",
    100: "#FEF3C7",
    50: "#FFFBEB",
  },
  danger: {
    700: "#B91C1C",
    600: "#DC2626",
    500: "#EF4444",
    100: "#FEE2E2",
    50: "#FEF2F2",
  },
  info: {
    700: "#0369A1",
    600: "#0284C7",
    500: "#0EA5E9",
    100: "#E0F2FE",
    50: "#F0F9FF",
  },

  // ── Accent ──────────────────────────────────────────────────────────────────
  amber: {
    600: "#D97706",
    500: "#F59E0B",
    400: "#FBBF24",
    100: "#FEF3C7",
  },

  // ── Pure ────────────────────────────────────────────────────────────────────
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

export const TYPOGRAPHY = {
  // Display font: sharp, authoritative
  fontDisplay:
    '"DM Sans", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
  // Body font: readable, professional
  fontBody: '"Inter", ui-sans-serif, system-ui, sans-serif',
  // Mono: data tables, token hashes, codes
  fontMono: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',

  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
};

export const SPACING = {
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
};

export const RADIUS = {
  none: "0",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
};

export const SHADOWS = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  // Brand shadows
  brand: "0 4px 14px 0 rgb(37 99 235 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
};

export const TRANSITIONS = {
  fast: "all 0.1s ease",
  normal: "all 0.2s ease",
  slow: "all 0.3s ease",
  spring: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ── Status token colors (maps directly to Prisma enums) ──────────────────────
export const TOKEN_STATUS_COLORS = {
  ACTIVE: {
    bg: COLORS.success[50],
    text: COLORS.success[700],
    border: COLORS.success[500],
  },
  UNASSIGNED: {
    bg: COLORS.slate[100],
    text: COLORS.slate[700],
    border: COLORS.slate[400],
  },
  ISSUED: {
    bg: COLORS.info[50],
    text: COLORS.info[700],
    border: COLORS.info[500],
  },
  INACTIVE: {
    bg: COLORS.slate[100],
    text: COLORS.slate[500],
    border: COLORS.slate[300],
  },
  REVOKED: {
    bg: COLORS.danger[50],
    text: COLORS.danger[700],
    border: COLORS.danger[500],
  },
  EXPIRED: {
    bg: COLORS.warning[50],
    text: COLORS.warning[700],
    border: COLORS.warning[500],
  },
};

export const SCAN_RESULT_COLORS = {
  SUCCESS: { bg: COLORS.success[50], text: COLORS.success[700] },
  INVALID: { bg: COLORS.danger[50], text: COLORS.danger[700] },
  REVOKED: { bg: COLORS.danger[50], text: COLORS.danger[700] },
  EXPIRED: { bg: COLORS.warning[50], text: COLORS.warning[700] },
  INACTIVE: { bg: COLORS.slate[100], text: COLORS.slate[600] },
  RATE_LIMITED: { bg: COLORS.amber[100], text: COLORS.amber[600] },
  ERROR: { bg: COLORS.danger[50], text: COLORS.danger[700] },
};

export const SUBSCRIPTION_STATUS_COLORS = {
  ACTIVE: { bg: COLORS.success[50], text: COLORS.success[700] },
  TRIALING: { bg: COLORS.info[50], text: COLORS.info[700] },
  PAST_DUE: { bg: COLORS.warning[50], text: COLORS.warning[700] },
  CANCELED: { bg: COLORS.danger[50], text: COLORS.danger[700] },
  EXPIRED: { bg: COLORS.slate[100], text: COLORS.slate[600] },
};

export const REQUEST_STATUS_COLORS = {
  PENDING: { bg: COLORS.warning[50], text: COLORS.warning[700] },
  APPROVED: { bg: COLORS.success[50], text: COLORS.success[700] },
  REJECTED: { bg: COLORS.danger[50], text: COLORS.danger[700] },
};
