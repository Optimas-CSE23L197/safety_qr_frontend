/**
 * SUPER ADMIN DASHBOARD
 * Platform-wide KPIs, school growth chart, subscription breakdown,
 * recent audit activity, system health snapshot.
 */

import { useState, useEffect } from 'react';
import { Building2, Users, CreditCard, Activity } from 'lucide-react';

import { formatCompact } from '../../utils/formatters.js';
import {
    MOCK_STATS,
    MOCK_GROWTH,
    MOCK_SUB_BREAKDOWN,
    MOCK_RECENT_SCHOOLS,
    MOCK_RECENT_AUDIT,
} from '../../data/dashboard.mock.js';

import StatCard from '../../components/dashboard/StatCard.jsx';
import AlertBanner from '../../components/dashboard/AlertBanner.jsx';
import GrowthChart from '../../components/dashboard/GrowthChart.jsx';
import SubscriptionDonut from '../../components/dashboard/SubscriptionDonut.jsx';
import RecentSchools from '../../components/dashboard/RecentSchools.jsx';
import RecentAudit from '../../components/dashboard/RecentAudit.jsx';

// ── KPI card definitions ───────────────────────────────────────────────────────
const buildStatCards = (stats, loading) => [
    {
        label: 'Total Schools',
        value: formatCompact(stats.totalSchools),
        icon: Building2,
        color: '#6366F1',
        bg: '#EEF2FF',
        trend: 'up',
        trendLabel: `+${stats.schoolsThisMonth} this month`,
        loading,
    },
    {
        label: 'Total Students',
        value: formatCompact(stats.totalStudents),
        icon: Users,
        color: '#10B981',
        bg: '#ECFDF5',
        trend: 'up',
        trendLabel: `+${formatCompact(stats.studentsThisMonth)} this month`,
        loading,
    },
    {
        label: 'Active Subscriptions',
        value: stats.activeSubscriptions,
        icon: CreditCard,
        color: '#0EA5E9',
        bg: '#E0F2FE',
        trend: null,
        trendLabel: `${stats.trialingSchools} trialing`,
        loading,
    },
    {
        label: 'Monthly Revenue',
        value: `$${formatCompact(stats.mrrUsd)}`,
        icon: Activity,
        color: '#F59E0B',
        bg: '#FFFBEB',
        trend: 'up',
        trendLabel: 'MRR',
        loading,
    },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const statCards = buildStatCards(MOCK_STATS, loading);

    return (
        <div style={{ padding: '28px 32px', maxWidth: '1400px', margin: '0 auto' }}>

            {/* Greeting */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                    Platform Overview 🛡️
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', margin: '4px 0 0' }}>{today}</p>
            </div>

            {/* Past-due alert */}
            <AlertBanner pastDueCount={MOCK_STATS.pastDueSchools} />

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {statCards.map(card => <StatCard key={card.label} {...card} />)}
            </div>

            {/* Charts row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'stretch' }}>
                <GrowthChart data={MOCK_GROWTH} loading={loading} />
                <SubscriptionDonut data={MOCK_SUB_BREAKDOWN} loading={loading} />
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
                <RecentSchools schools={MOCK_RECENT_SCHOOLS} />
                <RecentAudit logs={MOCK_RECENT_AUDIT} />
            </div>

        </div>
    );
}