// src/constants/dashboard.constants.js
/**
 * Shared dashboard constants for SchoolAdminDashboard and related pages.
 * Centralised here so token/anomaly pages can reuse without duplication.
 */

// ─── Token donut chart colours ────────────────────────────────────────────────
export const TOKEN_DONUT_COLORS = {
    ACTIVE:      '#10B981',
    UNASSIGNED:  '#94A3B8',
    ISSUED:      '#0EA5E9',
    EXPIRED:     '#F59E0B',
    REVOKED:     '#EF4444',
    INACTIVE:    '#CBD5E1',
};

// ─── Anomaly severity badge colours ──────────────────────────────────────────
export const SEVERITY_COLORS = {
    CRITICAL: { bg: '#FDF2F8',                        text: '#9D174D'                        },
    HIGH:     { bg: 'var(--color-danger-50)',          text: 'var(--color-danger-700)'        },
    MEDIUM:   { bg: 'var(--color-warning-50)',         text: 'var(--color-warning-700)'       },
    LOW:      { bg: 'var(--color-info-50)',            text: 'var(--color-info-700)'          },
};

// ─── List preview limits ──────────────────────────────────────────────────────
/** Max rows shown in dashboard preview lists (anomalies, parent requests). */
export const MAX_PREVIEW_ROWS = 5;

// ─── Chart period options ─────────────────────────────────────────────────────
/**
 * Each entry: { label, value, premiumOnly }
 * Render all periods; gate onClick for premiumOnly ones.
 */
export const CHART_PERIODS = [
    { label: '7d',  value: 7,  premiumOnly: false },
    { label: '30d', value: 30, premiumOnly: true  },
];