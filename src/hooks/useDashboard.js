// src/hooks/useDashboard.js
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useDashboardStore from '../store/dashboardStore.js';

export const useDashboard = (schoolId, period = 7) => {
    const hydratePlan = useDashboardStore((s) => s.hydratePlan);

    const query = useQuery({
        queryKey: ['school-dashboard', schoolId, period],
        queryFn: async () => {
            const res = await fetch(
                `/api/school/${schoolId}/dashboard?period=${period}`,
                { credentials: 'include' },
            );
            if (!res.ok) throw new Error('Dashboard fetch failed');
            return res.json();
        },
        enabled: !!schoolId,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

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