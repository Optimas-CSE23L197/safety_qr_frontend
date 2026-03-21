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

import StatCard         from '../../components/dashboard/StatCard.jsx';
import AlertBanner      from '../../components/dashboard/AlertBanner.jsx';
import GrowthChart      from '../../components/dashboard/GrowthChart.jsx';
import SubscriptionDonut from '../../components/dashboard/SubscriptionDonut.jsx';
import RecentSchools    from '../../components/dashboard/RecentSchools.jsx';
import RecentAudit      from '../../components/dashboard/RecentAudit.jsx';

// ── KPI card definitions ───────────────────────────────────────────────────────
const buildStatCards = (stats, loading) => [
    {
        label:      'Total Schools',
        value:      formatCompact(stats.totalSchools),
        icon:       Building2,
        color:      '#6366F1',
        bg:         '#EEF2FF',
        trend:      'up',
        trendLabel: `+${stats.schoolsThisMonth} this month`,
        loading,
    },
    {
        label:      'Total Students',
        value:      formatCompact(stats.totalStudents),
        icon:       Users,
        color:      '#10B981',
        bg:         '#ECFDF5',
        trend:      'up',
        trendLabel: `+${formatCompact(stats.studentsThisMonth)} this month`,
        loading,
    },
    {
        label:      'Active Subscriptions',
        value:      stats.activeSubscriptions,
        icon:       CreditCard,
        color:      '#0EA5E9',
        bg:         '#E0F2FE',
        trend:      null,
        trendLabel: `${stats.trialingSchools} trialing`,
        loading,
    },
    {
        label:      'Monthly Revenue',
        value:      `$${formatCompact(stats.mrrUsd)}`,
        icon:       Activity,
        color:      '#F59E0B',
        bg:         '#FFFBEB',
        trend:      'up',
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
        <div className="px-8 py-7 max-w-[1400px] mx-auto">

            {/* ── Greeting ─────────────────────────────────────────────── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] m-0 leading-tight">
                    Platform Overview 🛡️
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1 m-0">
                    {today}
                </p>
            </div>

            {/* ── Past-due alert ────────────────────────────────────────── */}
            <AlertBanner pastDueCount={MOCK_STATS.pastDueSchools} />

            {/* ── KPI cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {statCards.map(card => <StatCard key={card.label} {...card} />)}
            </div>

            {/* ── Charts row ────────────────────────────────────────────── */}
            <div className="flex gap-4 mb-6 items-stretch">
                <GrowthChart      data={MOCK_GROWTH}         loading={loading} />
                <SubscriptionDonut data={MOCK_SUB_BREAKDOWN} loading={loading} />
            </div>

            {/* ── Bottom row ────────────────────────────────────────────── */}
            <div className="flex gap-4 items-stretch">
                <RecentSchools schools={MOCK_RECENT_SCHOOLS} />
                <RecentAudit   logs={MOCK_RECENT_AUDIT}      />
            </div>

        </div>
    );
}