/**
 * Plan configuration — single source of truth
 * src/config/plans.config.js
 *
 * Import PLAN_LIMITS anywhere you need to enforce or display plan restrictions.
 * Never hard-code plan numbers in components; always reference this file.
 */

export const PLAN_LIMITS = {
  basic: {
    /** Max enrolled students. null = unlimited */
    students: 200,
    /** Max active tokens. null = unlimited */
    tokens: 50,
    /** Days of scan history available in charts */
    scanHistoryDays: 7,
    /** AI-powered anomaly detection (unusual time, location mismatch, duplicate) */
    hasAIAnomalies: false,
    /** Parent pickup/leave request approval workflow */
    hasParentRequests: false,
    /** Scheduled PDF / Excel report generation */
    hasScheduledReports: false,
    /** Priority in-app chat support */
    hasPrioritySupport: false,
    /** Export format */
    exportFormats: ['csv'],
  },

  premium: {
    students: null,
    tokens: null,
    scanHistoryDays: 365,
    hasAIAnomalies: true,
    hasParentRequests: true,
    hasScheduledReports: true,
    hasPrioritySupport: true,
    exportFormats: ['csv', 'pdf', 'xlsx'],
  },
};

/**
 * Helper — returns true when the school has hit or exceeded a numeric limit.
 *
 * @param {'students'|'tokens'} resource
 * @param {number} currentCount
 * @param {'basic'|'premium'} plan
 * @returns {{ isAtLimit: boolean, pct: number|null, limit: number|null }}
 */
export function checkLimit(resource, currentCount, plan) {
  const limit = PLAN_LIMITS[plan]?.[resource] ?? null;
  if (limit === null) return { isAtLimit: false, pct: null, limit: null };
  const pct = Math.round((currentCount / limit) * 100);
  return { isAtLimit: pct >= 100, isNearLimit: pct >= 80, pct, limit };
}

/**
 * Helper — returns the plan-gating state for a feature flag.
 *
 * @param {keyof typeof PLAN_LIMITS.basic} feature
 * @param {'basic'|'premium'} plan
 * @returns {boolean}
 */
export function hasFeature(feature, plan) {
  return PLAN_LIMITS[plan]?.[feature] ?? false;
}