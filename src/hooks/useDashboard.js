// src/hooks/useDashboard.js
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useDashboardStore from '../store/dashboardStore.js';

/**
 * Fetches dashboard data for a given schoolId + chartPeriod.
 * Also hydrates plan info into dashboardStore so any component
 * can read isPremium without prop drilling.
 *
 * @param {string|number} schoolId
 * @param {7|30} period - chart period in days (default 7)
 */
export const useDashboard = (schoolId, period = 7) => {
    const hydratePlan = useDashboardStore((s) => s.hydratePlan);

    const query = useQuery({
        queryKey: ['school-dashboard', schoolId, period],
        queryFn: async () => {
            // ── Replace with your real API call, e.g.:
            // return getDashboardData(schoolId, { period });
            //
            // Shape expected from server:
            // {
            //   stats: { totalStudents, activeTokens, expiringTokens,
            //             todayScans, scanTrendUp, scanChangePercent,
            //             newStudentsThisMonth, totalTokens,
            //             avgScanTimeMs, uniqueScanners },          // premium extras
            //   scanTrend: [{ date, success, failed }],
            //   tokenBreakdown: [{ status, count }],
            //   recentAnomalies: [...],
            //   pendingRequests: [...],
            //   subscription: {
            //     status, plan, endDate,
            //     featureUsage: { used, total }
            //   }
            // }
            const res = await fetch(
                `/api/school/${schoolId}/dashboard?period=${period}`,
                { credentials: 'include' },
            );
            if (!res.ok) throw new Error('Dashboard fetch failed');
            return res.json();
        },
        enabled: !!schoolId,
        staleTime: 1000 * 60 * 5,   // 5 min
        retry: 2,
    });

    // ── Hydrate plan store whenever data arrives ────────────────────
    useEffect(() => {
        if (query.data?.subscription) {
            const sub = query.data.subscription;
            hydratePlan({
                plan: sub.plan,
                subscriptionEnd: sub.endDate,
                featureUsage: sub.featureUsage,
            });
        }
    }, [query.data, hydratePlan]);

    return query;
};