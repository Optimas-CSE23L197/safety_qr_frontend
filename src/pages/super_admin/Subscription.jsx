/**
 * SUPER ADMIN — SUBSCRIPTIONS
 */

import { useState } from 'react';
import { Search, CreditCard, AlertTriangle, CheckCircle, Clock, XCircle, Building2, RefreshCw } from 'lucide-react';
import { formatDate, formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const MOCK_SUBS = Array.from({ length: 30 }, (_, i) => ({
    id: `sub-${i + 1}`,
    school_name: ['Delhi Public School', 'St. Mary\'s Convent', 'Kendriya Vidyalaya', 'Ryan International', 'Cambridge High'][i % 5],
    plan: ['Starter', 'Growth', 'Growth', 'Enterprise', 'Starter', 'Growth'][i % 6],
    status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'ACTIVE', 'ACTIVE', 'EXPIRED'][i % 9],
    amount: [2499, 5999, 5999, 12999, 2499][i % 5],
    students: Math.floor(Math.random() * 800) + 50,
    next_billing: new Date(Date.now() + (30 - i) * 86400000).toISOString(),
    created_at: new Date(Date.now() - i * 86400000 * 30).toISOString(),
}));

const STATUS_META = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857', Icon: CheckCircle },
    TRIALING: { bg: '#E0F2FE', color: '#0369A1', Icon: Clock },
    PAST_DUE: { bg: '#FFFBEB', color: '#B45309', Icon: AlertTriangle },
    CANCELED: { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
    EXPIRED: { bg: '#F1F5F9', color: '#475569', Icon: XCircle },
};

const STATUSES = ['ALL', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'EXPIRED'];

export default function Subscriptions() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);
    const PAGE_SIZE = 10;

    const filtered = MOCK_SUBS.filter(s => {
        const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
        const matchSearch = !debouncedSearch || s.school_name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const stats = STATUSES.slice(1).map(s => ({ status: s, count: MOCK_SUBS.filter(x => x.status === s).length }));
    const mrr = MOCK_SUBS.filter(x => x.status === 'ACTIVE').reduce((acc, s) => acc + s.amount, 0);

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Subscriptions</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Manage and monitor all school subscriptions and billing</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
                {[
                    ['Monthly Revenue', `₹${mrr.toLocaleString('en-IN')}`, '#10B981', '#ECFDF5'],
                    ['Active', MOCK_SUBS.filter(s => s.status === 'ACTIVE').length, '#2563EB', '#EFF6FF'],
                    ['Trialing', MOCK_SUBS.filter(s => s.status === 'TRIALING').length, '#0EA5E9', '#E0F2FE'],
                    ['Past Due', MOCK_SUBS.filter(s => s.status === 'PAST_DUE').length, '#F59E0B', '#FFFBEB'],
                ].map(([label, val, color, bg]) => (
                    <div key={label} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '18px 20px', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color }}>{val}</div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                            style={{ padding: '6px 13px', borderRadius: '7px', border: '1px solid', borderColor: statusFilter === s ? 'var(--color-brand-500)' : 'var(--border-default)', background: statusFilter === s ? 'var(--color-brand-600)' : 'white', color: statusFilter === s ? 'white' : 'var(--text-secondary)', fontWeight: statusFilter === s ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>
                            {s === 'ALL' ? 'All' : humanizeEnum(s)}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search school..."
                        style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '220px' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                            {['School', 'Plan', 'Students', 'Status', 'Amount', 'Next Billing', ''].map(h => (
                                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((sub, idx) => {
                            const meta = STATUS_META[sub.status] || STATUS_META.ACTIVE;
                            const isOverdue = sub.status === 'PAST_DUE';
                            return (
                                <tr key={sub.id}
                                    style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Building2 size={15} color="var(--text-muted)" />
                                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{sub.school_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{sub.plan}</span>
                                    </td>
                                    <td style={{ padding: '13px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {sub.students.toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: meta.bg, color: meta.color }}>
                                            <meta.Icon size={11} /> {humanizeEnum(sub.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: isOverdue ? '#B45309' : 'var(--text-primary)' }}>
                                            ₹{sub.amount.toLocaleString('en-IN')}/mo
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ fontSize: '0.8125rem', color: isOverdue ? '#B45309' : 'var(--text-muted)', fontWeight: isOverdue ? 600 : 400 }}>
                                            {isOverdue && '⚠ '}{formatDate(sub.next_billing)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <button
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--color-brand-600)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand-50)'; e.currentTarget.style.borderColor = 'var(--color-brand-300)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
                                            <RefreshCw size={13} /> Manage
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid', borderColor: p === page ? 'var(--color-brand-500)' : 'var(--border-default)', background: p === page ? 'var(--color-brand-600)' : 'white', color: p === page ? 'white' : 'var(--text-secondary)', fontWeight: p === page ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>{p}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}