import { useState } from 'react';
import { Building2, Users, CreditCard, Activity } from 'lucide-react';
import { formatCompact } from '#utils/formatters.js';
import { useDashboard } from '#hooks/super-admin/useDashboard.js';
import useDashboardStore from '#store/super-admin/dashboardStore.js';
import StatCard from '#components/dashboard/StatCard.jsx';
import AlertBanner from '#components/dashboard/AlertBanner.jsx';
import GrowthChart from '#components/dashboard/GrowthChart.jsx';
import SubscriptionDonut from '#components/dashboard/SubscriptionDonut.jsx';
import RecentSchools from '#components/dashboard/RecentSchools.jsx';
import RecentAudit from '#components/dashboard/RecentAudit.jsx';

const buildStatCards = (stats, loading) => [
    {
        label: 'Total Schools',
        value: formatCompact(stats?.totalSchools || 0),
        icon: Building2,
        color: '#6366F1',
        bg: '#EEF2FF',
        trend: 'up',
        trendLabel: `+${stats?.schoolsThisMonth || 0} this month`,
        loading,
    },
    {
        label: 'Total Students',
        value: formatCompact(stats?.totalStudents || 0),
        icon: Users,
        color: '#10B981',
        bg: '#ECFDF5',
        trend: 'up',
        trendLabel: `+${formatCompact(stats?.studentsThisMonth || 0)} this month`,
        loading,
    },
    {
        label: 'Active Subscriptions',
        value: stats?.activeSubscriptions || 0,
        icon: CreditCard,
        color: '#0EA5E9',
        bg: '#E0F2FE',
        trend: null,
        trendLabel: `${stats?.trialingSchools || 0} trialing`,
        loading,
    },
    {
        label: 'Monthly Revenue',
        value: `$${formatCompact(stats?.mrrUsd || 0)}`,
        icon: Activity,
        color: '#F59E0B',
        bg: '#FFFBEB',
        trend: 'up',
        trendLabel: 'MRR',
        loading,
    },
];

export default function SuperAdminDashboard() {
    const [filters] = useState({
        months: 12,
        recentSchoolsLimit: 10,
        auditLimit: 20,
    });

    useDashboard(filters);

    const {
        stats,
        growth,
        subscriptionBreakdown,
        recentSchools,
        recentAudit,
        systemHealth,
        loading,
    } = useDashboardStore();

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const statCards = buildStatCards(stats, loading);
    const pastDueCount = stats?.pastDueSchools || 0;

    return (
        <div className="px-8 py-7 max-w-[1400px] mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] m-0 leading-tight">
                    Platform Overview 🛡️
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1 m-0">{today}</p>
            </div>

            <AlertBanner pastDueCount={pastDueCount} />

            <div className="grid grid-cols-4 gap-4 mb-6">
                {statCards.map(card => <StatCard key={card.label} {...card} />)}
            </div>

            <div className="flex gap-4 mb-6 items-stretch">
                <GrowthChart data={growth} loading={loading} />
                <SubscriptionDonut data={subscriptionBreakdown || []} loading={loading} />
            </div>

            <div className="flex gap-4 items-stretch">
                <RecentSchools schools={recentSchools} loading={loading} />
                <RecentAudit logs={recentAudit} loading={loading} />
            </div>
        </div>
    );
}
