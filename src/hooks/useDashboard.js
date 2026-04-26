/**
 * useDashboard — plan-aware TanStack Query hook
 * src/hooks/useDashboard.js
 *
 * Automatically adjusts the data it fetches based on the school's plan:
 *  - Basic:   7-day scan history, truncated token list
 *  - Premium: 12-month scan history, full token breakdown + AI anomalies
 */

import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth.js';
import axiosClient from '../api/axiosClient.js';

/** How long dashboard data is considered fresh (ms) */
const STALE_TIME = 60_000; // 1 minute

/**
 * @param {string} schoolId
 * @returns TanStack Query result with typed dashboard payload
 */
export function useDashboard(schoolId) {
  const { subscription } = useAuth();
  const plan = subscription?.plan ?? 'basic';

  return useQuery({
    queryKey: ['dashboard', schoolId, plan],
    queryFn: () => fetchDashboard({ schoolId, plan }),
    enabled: !!schoolId,
    staleTime: STALE_TIME,
    select: (raw) => normalizeDashboard(raw, plan),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// API call
// ─────────────────────────────────────────────────────────────────────────────

async function fetchDashboard({ schoolId, plan }) {
  const params = {
    scanHistoryDays:       plan === 'premium' ? 365 : 7,
    includeAIAnomalies:    plan === 'premium',
    includeParentRequests: plan === 'premium',
  };
  const { data } = await axiosClient.get(`/schools/${schoolId}/dashboard`, { params });
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalizer — maps raw API response to stable dashboard shape
// The component only ever touches the normalized shape, not raw API fields.
// ─────────────────────────────────────────────────────────────────────────────

function normalizeDashboard(raw, plan) {
  return {
    stats: {
      totalStudents:        raw?.stats?.totalStudents        ?? 0,
      newStudentsThisMonth: raw?.stats?.newStudentsThisMonth ?? 0,
      activeTokens:         raw?.stats?.activeTokens         ?? 0,
      totalTokens:          raw?.stats?.totalTokens          ?? 0,
      expiringTokens:       raw?.stats?.expiringTokens       ?? 0,
      todayScans:           raw?.stats?.todayScans           ?? 0,
      scanTrendUp:          raw?.stats?.scanTrendUp          ?? null,
      scanChangePercent:    raw?.stats?.scanChangePercent    ?? null,
    },

    // Scan trend — shape: [{ date: 'Mon', success: 40, failed: 3 }, ...]
    scanTrend: Array.isArray(raw?.scanTrend) ? raw.scanTrend : [],

    // Token breakdown — shape: [{ status: 'ACTIVE', count: 42 }, ...]
    // Basic plan only receives ACTIVE + UNASSIGNED from the API
    tokenBreakdown: Array.isArray(raw?.tokenBreakdown) ? raw.tokenBreakdown : [],

    // Anomalies — Premium includes source: 'AI' on AI-detected entries
    recentAnomalies: Array.isArray(raw?.recentAnomalies)
      ? raw.recentAnomalies.map(a => ({
          id:           a.id,
          type:         a.type,
          severity:     a.severity ?? 'HIGH',
          student_name: a.student_name ?? 'Unknown student',
          created_at:   a.created_at,
          source:       a.source ?? 'RULE', // 'AI' | 'RULE'
        }))
      : [],

    // Parent requests — only populated on Premium (API returns [] for Basic)
    pendingRequests: plan === 'premium' && Array.isArray(raw?.pendingRequests)
      ? raw.pendingRequests.map(r => ({
          id:           r.id,
          student_name: r.student_name,
          parent_name:  r.parent_name,
          type:         r.type,
          created_at:   r.created_at,
        }))
      : [],

    // Pass subscription through for plan-limit warnings
    subscription: raw?.subscription ?? null,
  };
}