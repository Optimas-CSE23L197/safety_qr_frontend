/**
 * SUPER ADMIN — TOKEN INVENTORY
 * Monitor token lifecycle, batches, and assignments. Matches design system.
 */

import { useState } from 'react';
import {
    Cpu, Search, Filter, ChevronRight, Ban, RefreshCw, CheckCircle, Clock, AlertTriangle, XCircle, X,
} from 'lucide-react';
import { formatDate, formatRelativeTime, humanizeEnum, maskTokenHash } from '../../../utils/formatters.js';
import useDebounce from '../../../hooks/useDebounce.js';

const MOCK_TOKENS = Array.from({ length: 25 }, (_, i) => ({
    id: `tok_${i + 1}`,
    hash: `QR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'UNASSIGNED', 'EXPIRED', 'REVOKED', 'ACTIVE', 'ACTIVE', 'UNASSIGNED'][i % 9],
    student: i % 4 !== 0 ? ['Rahul Sharma', 'Priya Patel', 'Aarav Gupta', 'Sneha Nair', 'Karan Singh', 'Divya Mehta'][i % 6] : null,
    school: ['Green Valley School', 'Delhi Public School', 'Ryan International', 'St. Mary\'s Convent', 'Cambridge High'][i % 5],
    batch: `Batch-${String(Math.floor(i / 5) + 1).padStart(3, '0')}`,
    expires: i % 5 === 4 ? new Date(Date.now() - 86400000 * 5).toISOString() : new Date(Date.now() + 86400000 * 275).toISOString(),
    created: new Date(Date.now() - i * 86400000 * 10).toISOString(),
}));

const STATS = [
    { label: 'Total Tokens', value: '12,000', color: '#2563EB', bg: '#EFF6FF', icon: Cpu },
    { label: 'Active', value: '9,400', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle },
    { label: 'Expiring (30d)', value: '320', color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
    { label: 'Unassigned', value: '1,100', color: '#8B5CF6', bg: '#F5F3FF', icon: AlertTriangle },
];

const STATUS_STYLE = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857', Icon: CheckCircle },
    UNASSIGNED: { bg: '#F1F5F9', color: '#475569', Icon: Clock },
    EXPIRED: { bg: '#FFFBEB', color: '#B45309', Icon: AlertTriangle },
    REVOKED: { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
};

const STATUSES = ['ALL', 'ACTIVE', 'UNASSIGNED', 'EXPIRED', 'REVOKED'];

const DetailPanel = ({ token, onClose }) => {
    if (!token) return null;
    const s = STATUS_STYLE[token.status] || STATUS_STYLE.UNASSIGNED;
    return (
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', marginTop: '14px' }}>
            <div style={{ height: '4px', background: s.color }} />
            <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9375rem', background: 'var(--color-slate-100)', padding: '4px 10px', borderRadius: '6px' }}>{token.hash}</code>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: s.bg, color: s.color }}>
                                <s.Icon size={11} /> {token.status}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Batch: {token.batch} · {token.school}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer' }}>
                            <RefreshCw size={13} /> Replace
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#EF4444', color: 'white', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
                            <Ban size={13} /> Revoke
                        </button>
                        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[['Student', token.student || 'Unassigned'], ['School', token.school], ['Created', formatDate(token.created)], ['Expires', formatDate(token.expires)]].map(([label, val]) => (
                        <div key={label} style={{ border: '1px solid var(--border-default)', borderRadius: '8px', padding: '12px', background: 'var(--color-slate-50)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{val}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function TokenInventoryPage() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const debouncedQuery = useDebounce(query, 300);
    const PAGE_SIZE = 10;

    const filtered = MOCK_TOKENS.filter(t => {
        const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchSearch = !debouncedQuery ||
            t.hash.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            (t.student || '').toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            t.school.toLowerCase().includes(debouncedQuery.toLowerCase());
        return matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Token Inventory</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Monitor token lifecycle, batches, and assignments across all schools</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
                {STATS.map(s => (
                    <div key={s.label} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '18px 20px', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <s.icon size={18} color={s.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '16px', marginBottom: '14px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                            style={{ padding: '6px 13px', borderRadius: '7px', border: '1px solid', borderColor: statusFilter === s ? 'var(--color-brand-500)' : 'var(--border-default)', background: statusFilter === s ? 'var(--color-brand-600)' : 'white', color: statusFilter === s ? 'white' : 'var(--text-secondary)', fontWeight: statusFilter === s ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>
                            {s === 'ALL' ? 'All Tokens' : humanizeEnum(s)}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        value={query}
                        onChange={e => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Search token, student, school..."
                        style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '240px' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                    />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                            {['Token Hash', 'Student', 'School', 'Batch', 'Created', 'Expires', 'Status', ''].map(h => (
                                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Cpu size={32} style={{ marginBottom: '10px', opacity: 0.25, display: 'block', margin: '0 auto 10px' }} />
                                <div style={{ fontWeight: 500 }}>No tokens found</div>
                            </td></tr>
                        ) : paginated.map((t, idx) => {
                            const s = STATUS_STYLE[t.status] || STATUS_STYLE.UNASSIGNED;
                            const isSelected = selected?.id === t.id;
                            return (
                                <tr key={t.id}
                                    style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none', cursor: 'pointer', background: isSelected ? 'var(--color-brand-50)' : 'transparent' }}
                                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-slate-50)'; }}
                                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                                    onClick={() => setSelected(isSelected ? null : t)}
                                >
                                    <td style={{ padding: '12px 14px' }}>
                                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', background: 'var(--color-slate-100)', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>{t.hash}</code>
                                    </td>
                                    <td style={{ padding: '12px 14px', fontSize: '0.875rem', color: t.student ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: t.student ? 500 : 400 }}>{t.student || '—'}</td>
                                    <td style={{ padding: '12px 14px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.school}</td>
                                    <td style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{t.batch}</td>
                                    <td style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{formatDate(t.created)}</td>
                                    <td style={{ padding: '12px 14px', fontSize: '0.8125rem', color: t.status === 'EXPIRED' ? '#B45309' : 'var(--text-muted)', fontWeight: t.status === 'EXPIRED' ? 600 : 400 }}>{formatDate(t.expires)}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color }}>
                                            <s.Icon size={11} /> {humanizeEnum(t.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                        <ChevronRight size={16} color={isSelected ? 'var(--color-brand-600)' : 'var(--text-muted)'} style={{ transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
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

            {/* Detail panel */}
            {selected && <DetailPanel token={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}