/**
 * SUPER ADMIN — SUBSCRIPTIONS
 * Manage school subscriptions with per-card per-year pricing.
 */

import { useState } from 'react';
import {
    Search, CreditCard, AlertTriangle, CheckCircle, Clock, XCircle,
    Building2, RefreshCw, TrendingUp, Users, Wallet, Calendar,
    Hash, Zap, AlertCircle
} from 'lucide-react';
import { formatDate, formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const MOCK_SUBS = Array.from({ length: 30 }, (_, i) => ({
    id: `sub-${i + 1}`,
    school_id: `sch-${i + 1}`,
    school_name: ['Delhi Public School, Noida', "St. Mary's Convent, Pune", 'Kendriya Vidyalaya, Bhopal', 'Ryan International, Mumbai', 'Cambridge High School, Hyderabad'][i % 5],
    school_code: ['DPS-NOIDA', 'SMC-PUNE', 'KV-BHOPAL', 'RYN-MUMBAI', 'CAM-HYD'][i % 5],
    plan: ['BASIC', 'PREMIUM', 'PREMIUM', 'CUSTOM', 'BASIC', 'PREMIUM'][i % 6],
    status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'ACTIVE', 'ACTIVE', 'EXPIRED'][i % 9],
    unit_price_snapshot: [14900, 19900, 19900, 17500, 14900, 19900][i % 6],
    renewal_price_snapshot: [14900, 19900, 19900, 16500, 14900, 19900][i % 6],
    student_count: Math.floor(Math.random() * 800) + 50,
    active_card_count: Math.floor(Math.random() * 700) + 30,
    grand_total: 0, // Will calculate
    balance_due: 0, // Will calculate
    is_custom_pricing: [false, false, false, true, false, false][i % 6],
    is_pilot: i % 7 === 3,
    current_period_start: new Date(Date.now() - 180 * 86400000).toISOString(),
    current_period_end: new Date(Date.now() + (180 - i % 180) * 86400000).toISOString(),
    created_at: new Date(Date.now() - i * 86400000 * 30).toISOString(),
}));

// Calculate grand_total and balance_due
MOCK_SUBS.forEach(sub => {
    sub.grand_total = sub.unit_price_snapshot * sub.student_count;
    sub.balance_due = sub.status === 'PAST_DUE' ? Math.floor(sub.grand_total * 0.3) : 0;
});

const STATUS_META = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857', Icon: CheckCircle, label: 'Active' },
    TRIALING: { bg: '#E0F2FE', color: '#0369A1', Icon: Clock, label: 'Trialing' },
    PAST_DUE: { bg: '#FFFBEB', color: '#B45309', Icon: AlertTriangle, label: 'Past Due' },
    CANCELED: { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle, label: 'Canceled' },
    EXPIRED: { bg: '#F1F5F9', color: '#475569', Icon: XCircle, label: 'Expired' },
};

const PLAN_META = {
    BASIC: { bg: '#EFF6FF', color: '#2563EB', label: 'Basic' },
    PREMIUM: { bg: '#ECFDF5', color: '#059669', label: 'Premium' },
    CUSTOM: { bg: '#F5F3FF', color: '#7C3AED', label: 'Custom' },
};

const STATUSES = ['ALL', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'EXPIRED'];
const PLANS = ['ALL', 'BASIC', 'PREMIUM', 'CUSTOM'];
const PAGE_SIZE = 10;

const formatCurrency = (amount) => `₹${(amount / 100).toLocaleString('en-IN')}`;

export default function Subscriptions() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [planFilter, setPlanFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = MOCK_SUBS.filter(s => {
        const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
        const matchPlan = planFilter === 'ALL' || s.plan === planFilter;
        const matchSearch = !debouncedSearch ||
            s.school_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.school_code.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchPlan && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const activeSubs = MOCK_SUBS.filter(s => s.status === 'ACTIVE');
    const totalMRR = activeSubs.reduce((acc, s) => acc + (s.grand_total / 100), 0);
    const totalStudents = activeSubs.reduce((acc, s) => acc + s.student_count, 0);
    const totalActiveCards = activeSubs.reduce((acc, s) => acc + s.active_card_count, 0);
    const pastDueCount = MOCK_SUBS.filter(s => s.status === 'PAST_DUE').length;

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                    Subscriptions
                </h2>
                <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                    Manage school subscriptions with per-card per-year pricing
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Annual Recurring Revenue</div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <TrendingUp size={16} className="text-emerald-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalMRR * 100)}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">from {activeSubs.length} active subscriptions</div>
                </div>

                <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Total Students</div>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Users size={16} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{totalStudents.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">across all active schools</div>
                </div>

                <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Active Cards</div>
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <CreditCard size={16} className="text-purple-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{totalActiveCards.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">issued and active</div>
                </div>

                <div className="bg-white rounded-xl border border-[var(--border-default)] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Past Due</div>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <AlertCircle size={16} className="text-amber-600" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{pastDueCount}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">subscriptions requiring attention</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-sm p-4 mb-4">
                <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by school name or code..."
                            className="w-full py-[9px] pr-3 pl-9 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {STATUSES.map(s => (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={[
                                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                                    statusFilter === s
                                        ? 'bg-brand-600 text-white shadow-sm'
                                        : 'bg-white border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-slate-50',
                                ].join(' ')}
                            >
                                {s === 'ALL' ? 'All' : humanizeEnum(s)}
                            </button>
                        ))}
                    </div>

                    {/* Plan Filter */}
                    <select
                        value={planFilter}
                        onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
                        className="py-[7px] px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white cursor-pointer outline-none"
                    >
                        {PLANS.map(p => (
                            <option key={p} value={p}>{p === 'ALL' ? 'All Plans' : p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-[var(--border-default)] bg-slate-50">
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">School</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Plan</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Students/Cards</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Pricing</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Annual Value</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Renewal Date</th>
                                <th className="py-3 px-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-[var(--text-muted)]">
                                        <CreditCard size={36} className="mx-auto mb-3 opacity-30" />
                                        <div className="font-medium">No subscriptions found</div>
                                        <div className="text-sm mt-1">Try adjusting your filters</div>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((sub, idx) => {
                                    const statusMeta = STATUS_META[sub.status];
                                    const StatusIcon = statusMeta.Icon;
                                    const planMeta = PLAN_META[sub.plan];
                                    const isOverdue = sub.status === 'PAST_DUE';
                                    const isExpiringSoon = sub.status === 'ACTIVE' && new Date(sub.current_period_end) < new Date(Date.now() + 30 * 86400000);

                                    return (
                                        <tr
                                            key={sub.id}
                                            className={[
                                                'transition-colors hover:bg-slate-50',
                                                idx < paginated.length - 1 ? 'border-b border-[var(--border-default)]' : '',
                                            ].join(' ')}
                                        >
                                            {/* School */}
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 size={14} className="text-[var(--text-muted)]" />
                                                        <span className="font-semibold text-sm text-[var(--text-primary)]">{sub.school_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Hash size={11} className="text-[var(--text-muted)]" />
                                                        <code className="text-xs text-[var(--text-muted)] font-mono">{sub.school_code}</code>
                                                        {sub.is_pilot && (
                                                            <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Pilot</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Plan */}
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold w-fit`}
                                                        style={{ background: planMeta.bg, color: planMeta.color }}>
                                                        {planMeta.label}
                                                    </span>
                                                    {sub.is_custom_pricing && (
                                                        <span className="text-[0.6rem] text-purple-600 font-medium">Custom priced</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Students & Cards */}
                                            <td className="py-3 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Users size={12} className="text-[var(--text-muted)]" />
                                                        <span>{sub.student_count.toLocaleString('en-IN')} students</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <CreditCard size={12} className="text-[var(--text-muted)]" />
                                                        <span>{sub.active_card_count.toLocaleString('en-IN')} active cards</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Pricing */}
                                            <td className="py-3 px-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm">
                                                        <span className="text-[var(--text-muted)]">Unit:</span>
                                                        <span className="font-semibold ml-1">{formatCurrency(sub.unit_price_snapshot)}/year</span>
                                                    </div>
                                                    <div className="text-xs text-[var(--text-muted)]">
                                                        Renewal: {formatCurrency(sub.renewal_price_snapshot)}/year
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Annual Value */}
                                            <td className="py-3 px-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-[var(--text-primary)]">
                                                        {formatCurrency(sub.grand_total)}
                                                    </div>
                                                    {sub.balance_due > 0 && (
                                                        <div className="text-xs text-amber-600 font-medium">
                                                            Balance due: {formatCurrency(sub.balance_due)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold w-fit`}
                                                        style={{ background: statusMeta.bg, color: statusMeta.color }}>
                                                        <StatusIcon size={10} />
                                                        {statusMeta.label}
                                                    </span>
                                                    {isExpiringSoon && sub.status === 'ACTIVE' && (
                                                        <span className="text-xs text-amber-600 flex items-center gap-1">
                                                            <Clock size={10} /> Renewal soon
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Renewal Date */}
                                            <td className="py-3 px-4">
                                                <div className="text-sm text-[var(--text-primary)]">
                                                    {formatDate(sub.current_period_end)}
                                                </div>
                                                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                                                    Period: {formatDate(sub.current_period_start)}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4">
                                                <div className="flex gap-1.5 justify-center">
                                                    <button
                                                        className="p-1.5 rounded-md border border-[var(--border-default)] bg-white text-brand-600 cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-colors"
                                                        title="Manage Subscription"
                                                    >
                                                        <RefreshCw size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="py-3.5 px-4 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-sm text-[var(--text-muted)]">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let p = page;
                                if (totalPages <= 5) p = i + 1;
                                else if (page <= 3) p = i + 1;
                                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                                else p = page - 2 + i;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={[
                                            'w-8 h-8 rounded-md border text-sm transition-colors',
                                            p === page
                                                ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                                : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                                        ].join(' ')}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}