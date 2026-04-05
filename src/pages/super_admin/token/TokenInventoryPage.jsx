/**
 * SUPER ADMIN — TOKEN INVENTORY
 * Monitor token lifecycle, batches, and assignments.
 * Aligned with Token model from schema:
 * - id, token_hash, status, batch_id, order_id, student_id, school_id
 * - activated_at, assigned_at, expires_at, revoked_at
 * - is_honeypot, replaced_by_id
 */

import { useState } from 'react';
import {
    Cpu, Search, Filter, ChevronRight, Ban, RefreshCw, CheckCircle, Clock, AlertTriangle, XCircle, X,
    Eye, Hash, Building2, User, Calendar, AlertOctagon, Shield, RotateCcw, Download, Printer
} from 'lucide-react';
import { formatDate, formatRelativeTime, humanizeEnum, maskTokenHash } from '../../../utils/formatters.js';
import useDebounce from '../../../hooks/useDebounce.js';

// ─── Mock Data (Matches Token Model) ──────────────────────────────────────────
const MOCK_TOKENS = Array.from({ length: 35 }, (_, i) => ({
    id: `tok_${i + 1}`,
    token_hash: `TOK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'UNASSIGNED', 'EXPIRED', 'REVOKED', 'ACTIVE', 'ACTIVE', 'UNASSIGNED', 'ISSUED'][i % 10],
    student_id: i % 4 !== 0 ? `stu_${(i % 6) + 1}` : null,
    student_name: i % 4 !== 0 ? ['Rahul Sharma', 'Priya Patel', 'Aarav Gupta', 'Sneha Nair', 'Karan Singh', 'Divya Mehta'][i % 6] : null,
    school_id: `sch_${(i % 5) + 1}`,
    school_name: ['Green Valley School', 'Delhi Public School', 'Ryan International', "St. Mary's Convent", 'Cambridge High'][i % 5],
    school_code: ['GVS-001', 'DPS-002', 'RYN-003', 'SMC-004', 'CAM-005'][i % 5],
    batch_id: `batch_${Math.floor(i / 5) + 1}`,
    batch_name: `Batch-${String(Math.floor(i / 5) + 1).padStart(3, '0')}`,
    order_id: i % 3 === 0 ? `ORD-2024-${String(Math.floor(i / 3) + 1).padStart(3, '0')}` : null,
    activated_at: i % 3 === 0 ? new Date(Date.now() - 86400000 * 30).toISOString() : null,
    assigned_at: i % 4 !== 0 ? new Date(Date.now() - 86400000 * 25).toISOString() : null,
    expires_at: i % 5 === 4 ? new Date(Date.now() - 86400000 * 5).toISOString() : new Date(Date.now() + 86400000 * 275).toISOString(),
    revoked_at: i % 7 === 3 ? new Date(Date.now() - 86400000 * 10).toISOString() : null,
    revoked_reason: i % 7 === 3 ? 'Token lost reported by parent' : null,
    is_honeypot: i % 15 === 0,
    replaced_by_id: i % 8 === 2 ? `tok_${i + 100}` : null,
    created_at: new Date(Date.now() - i * 86400000 * 8).toISOString(),
    updated_at: new Date(Date.now() - i * 86400000 * 5).toISOString(),
}));

// ─── Token Status Config (Matches TokenStatus Enum) ────────────────────────────
const STATUS_CONFIG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle, order: 1 },
    UNASSIGNED: { label: 'Unassigned', color: '#6B7280', bg: '#F3F4F6', Icon: Clock, order: 2 },
    ISSUED: { label: 'Issued', color: '#3B82F6', bg: '#EFF6FF', Icon: Eye, order: 3 },
    INACTIVE: { label: 'Inactive', color: '#9CA3AF', bg: '#F9FAFB', Icon: AlertTriangle, order: 4 },
    REVOKED: { label: 'Revoked', color: '#EF4444', bg: '#FEF2F2', Icon: XCircle, order: 5 },
    EXPIRED: { label: 'Expired', color: '#F59E0B', bg: '#FFFBEB', Icon: AlertOctagon, order: 6 },
};

const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'UNASSIGNED', 'ISSUED', 'INACTIVE', 'REVOKED', 'EXPIRED'];

// ─── Stats Calculation ─────────────────────────────────────────────────────────
const calculateStats = (tokens) => {
    const total = tokens.length;
    const active = tokens.filter(t => t.status === 'ACTIVE').length;
    const unassigned = tokens.filter(t => t.status === 'UNASSIGNED').length;
    const expiringSoon = tokens.filter(t => {
        if (t.status !== 'ACTIVE') return false;
        const daysUntilExpiry = (new Date(t.expires_at) - new Date()) / (1000 * 60 * 60 * 24);
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;
    const revoked = tokens.filter(t => t.status === 'REVOKED').length;
    const honeypot = tokens.filter(t => t.is_honeypot).length;
    return { total, active, unassigned, expiringSoon, revoked, honeypot };
};

// ─── Token Detail Panel ────────────────────────────────────────────────────────
const TokenDetailPanel = ({ token, onClose, onRevoke, onReplace }) => {
    const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
    const StatusIcon = statusCfg.Icon;
    const isExpiring = token.status === 'ACTIVE' && new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000);
    const isExpired = token.status === 'EXPIRED' || new Date(token.expires_at) < new Date();

    return (
        <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-lg overflow-hidden mt-4">
            <div className="h-1" style={{ background: statusCfg.color }} />
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <code className="font-mono text-sm font-bold bg-slate-100 px-3 py-1.5 rounded-lg">
                                {maskTokenHash(token.token_hash)}
                            </code>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                                <StatusIcon size={11} /> {statusCfg.label}
                            </span>
                            {token.is_honeypot && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                    <Shield size={11} /> Honeypot
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-[var(--text-muted)]">
                            Batch: {token.batch_name} · {token.school_name} ({token.school_code})
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {token.status === 'ACTIVE' && (
                            <>
                                <button
                                    onClick={() => onReplace?.(token.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50"
                                >
                                    <RefreshCw size={13} /> Replace
                                </button>
                                <button
                                    onClick={() => onRevoke?.(token.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                                >
                                    <Ban size={13} /> Revoke
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div className="p-3 rounded-lg bg-slate-50">
                        <div className="text-xs text-[var(--text-muted)] font-semibold mb-1">Student</div>
                        <div className="font-medium text-[var(--text-primary)]">{token.student_name || '—'}</div>
                        {token.student_id && <div className="text-xs text-[var(--text-muted)]">ID: {token.student_id}</div>}
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50">
                        <div className="text-xs text-[var(--text-muted)] font-semibold mb-1">School</div>
                        <div className="font-medium text-[var(--text-primary)]">{token.school_name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{token.school_code}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50">
                        <div className="text-xs text-[var(--text-muted)] font-semibold mb-1">Created / Assigned</div>
                        <div className="text-sm">{formatDate(token.created_at)}</div>
                        {token.assigned_at && <div className="text-xs text-[var(--text-muted)]">Assigned: {formatDate(token.assigned_at)}</div>}
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50">
                        <div className="text-xs text-[var(--text-muted)] font-semibold mb-1">Expiry</div>
                        <div className={`font-medium ${isExpired ? 'text-red-600' : isExpiring ? 'text-amber-600' : 'text-[var(--text-primary)]'}`}>
                            {formatDate(token.expires_at)}
                            {isExpiring && !isExpired && <span className="ml-1 text-xs">(30 days)</span>}
                            {isExpired && <span className="ml-1 text-xs">(Expired)</span>}
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border-default)]">
                    {token.batch_id && (
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-semibold">Batch ID</div>
                            <div className="text-sm font-mono">{token.batch_id}</div>
                        </div>
                    )}
                    {token.order_id && (
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-semibold">Order ID</div>
                            <div className="text-sm font-mono">{token.order_id}</div>
                        </div>
                    )}
                    {token.revoked_at && (
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-semibold">Revoked At</div>
                            <div className="text-sm">{formatDate(token.revoked_at)}</div>
                        </div>
                    )}
                    {token.revoked_reason && (
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-semibold">Revoke Reason</div>
                            <div className="text-sm text-red-600">{token.revoked_reason}</div>
                        </div>
                    )}
                    {token.replaced_by_id && (
                        <div>
                            <div className="text-xs text-[var(--text-muted)] font-semibold">Replaced By</div>
                            <div className="text-sm font-mono">{maskTokenHash(token.replaced_by_id)}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TokenInventoryPage() {
    const [tokens, setTokens] = useState(MOCK_TOKENS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [schoolFilter, setSchoolFilter] = useState('ALL');
    const [selectedToken, setSelectedToken] = useState(null);
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);
    const PAGE_SIZE = 10;

    const stats = calculateStats(tokens);
    const schools = ['ALL', ...new Set(tokens.map(t => t.school_name))];

    const filtered = tokens.filter(t => {
        const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchSchool = schoolFilter === 'ALL' || t.school_name === schoolFilter;
        const matchSearch = !debouncedSearch ||
            t.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (t.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            t.school_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            t.school_code.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSchool && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleRevoke = (id) => {
        setTokens(prev => prev.map(t =>
            t.id === id ? { ...t, status: 'REVOKED', revoked_at: new Date().toISOString(), revoked_reason: 'Revoked by admin' } : t
        ));
        setSelectedToken(null);
    };

    const handleReplace = (id) => {
        // In real implementation, create new token and link via replaced_by_id
        console.log('Replace token:', id);
    };

    const handleExport = () => {
        const csv = [
            ['Token Hash', 'Status', 'Student', 'School', 'Batch', 'Created', 'Expires', 'Activated', 'Assigned', 'Revoked', 'Honeypot'],
            ...filtered.map(t => [
                t.token_hash, t.status, t.student_name || '', t.school_name, t.batch_name,
                formatDate(t.created_at), formatDate(t.expires_at),
                t.activated_at ? formatDate(t.activated_at) : '',
                t.assigned_at ? formatDate(t.assigned_at) : '',
                t.revoked_at ? formatDate(t.revoked_at) : '',
                t.is_honeypot ? 'Yes' : 'No'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `token_inventory_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-[1300px] mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                                <Cpu size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0">Token Inventory</h1>
                                <p className="text-sm text-[var(--text-muted)] mt-0.5">Monitor token lifecycle, batches, and assignments across all schools</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Tokens</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-emerald-600">{stats.active.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)]">Active</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-slate-500">{stats.unassigned.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)]">Unassigned</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
                    <div className="text-xs text-[var(--text-muted)]">Expiring (30d)</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-red-600">{stats.revoked}</div>
                    <div className="text-xs text-[var(--text-muted)]">Revoked</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-purple-600">{stats.honeypot}</div>
                    <div className="text-xs text-[var(--text-muted)]">Honeypot</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by token hash, student, school, or code..."
                            className="w-full py-2 pl-9 pr-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white"
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All Status' : STATUS_CONFIG[s]?.label || s}</option>
                        ))}
                    </select>

                    {/* School Filter */}
                    <select
                        value={schoolFilter}
                        onChange={e => { setSchoolFilter(e.target.value); setPage(1); }}
                        className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white min-w-[160px]"
                    >
                        {schools.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Schools' : s}</option>)}
                    </select>

                    {/* Clear Filters */}
                    {(statusFilter !== 'ALL' || schoolFilter !== 'ALL') && (
                        <button
                            onClick={() => { setStatusFilter('ALL'); setSchoolFilter('ALL'); setPage(1); }}
                            className="text-xs text-red-600 font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-[var(--border-default)]">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Token Hash</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Student</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">School</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Batch</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Created</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Expires</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-[var(--text-muted)]">
                                        <Cpu size={36} className="mx-auto mb-3 opacity-30" />
                                        <div className="font-medium">No tokens found</div>
                                        <div className="text-sm mt-1">Try adjusting your filters</div>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((token, idx) => {
                                    const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
                                    const StatusIcon = statusCfg.Icon;
                                    const isExpiring = token.status === 'ACTIVE' && new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000);
                                    const isSelected = selectedToken?.id === token.id;

                                    return (
                                        <tr
                                            key={token.id}
                                            className={`border-b border-[var(--border-default)] cursor-pointer transition-colors hover:bg-slate-50 ${isSelected ? 'bg-brand-50' : ''}`}
                                            onClick={() => setSelectedToken(isSelected ? null : token)}
                                        >
                                            <td className="px-4 py-3">
                                                <code className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">{maskTokenHash(token.token_hash)}</code>
                                                {token.is_honeypot && (
                                                    <span className="ml-2 text-[0.6rem] px-1.5 py-0.5 rounded bg-red-100 text-red-700">Honeypot</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={token.student_name ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
                                                    {token.student_name || '—'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-sm">{token.school_name}</div>
                                                <div className="text-xs text-[var(--text-muted)]">{token.school_code}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{token.batch_name}</td>
                                            <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{formatDate(token.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-sm ${isExpiring ? 'text-amber-600 font-medium' : 'text-[var(--text-muted)]'}`}>
                                                    {formatDate(token.expires_at)}
                                                    {isExpiring && <span className="ml-1 text-xs">⚠️</span>}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                                                    <StatusIcon size={10} /> {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedToken(token); }}
                                                    className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                                                >
                                                    <Eye size={14} className="text-brand-600" />
                                                </button>
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

            {/* Detail Panel */}
            {selectedToken && (
                <TokenDetailPanel
                    token={selectedToken}
                    onClose={() => setSelectedToken(null)}
                    onRevoke={handleRevoke}
                    onReplace={handleReplace}
                />
            )}
        </div>
    );
}