/**
 * SCHOOL ADMIN — TOKEN INVENTORY
 * Monitor token lifecycle, batches, and assignments.
 * Aligned with Token model from schema:
 * - id, token_hash, status, student_id, school_id, batch_id, order_id
 * - activated_at, assigned_at, expires_at, revoked_at, revoked_reason
 * - is_honeypot, replaced_by_id
 */

import { useState } from 'react';
import {
    Search, Plus, RefreshCw, XCircle, Cpu, Filter, Download,
    Eye, Ban, RotateCcw, Shield, AlertTriangle, CheckCircle,
    Clock, X, ChevronDown, Loader2, Hash, User, Calendar,
    Package, Link2, FileText
} from 'lucide-react';
import { maskTokenHash, formatDate, formatRelativeTime, humanizeEnum, formatCompact } from '../../../utils/formatters.js';
import useDebounce from '../../../hooks/useDebounce.js';
import useAuth from '../../../hooks/useAuth.js';
import { toast } from '#utils/toast.js';

// ─── Token Status Config (Matches TokenStatus Enum) ───────────────────────────
const STATUS_CONFIG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle, order: 1 },
    UNASSIGNED: { label: 'Unassigned', color: '#6B7280', bg: '#F3F4F6', Icon: Clock, order: 2 },
    ISSUED: { label: 'Issued', color: '#3B82F6', bg: '#EFF6FF', Icon: Eye, order: 3 },
    INACTIVE: { label: 'Inactive', color: '#9CA3AF', bg: '#F9FAFB', Icon: XCircle, order: 4 },
    REVOKED: { label: 'Revoked', color: '#EF4444', bg: '#FEF2F2', Icon: Ban, order: 5 },
    EXPIRED: { label: 'Expired', color: '#F59E0B', bg: '#FFFBEB', Icon: AlertTriangle, order: 6 },
};

const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'UNASSIGNED', 'ISSUED', 'INACTIVE', 'REVOKED', 'EXPIRED'];

// ─── Mock Data (Matches Schema with School Admin Context) ─────────────────────
const MOCK_TOKENS = Array.from({ length: 32 }, (_, i) => ({
    id: `tok_${i + 1}`,
    token_hash: `TOK-${Math.random().toString(36).slice(2, 18).toUpperCase()}`,
    status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'UNASSIGNED', 'ISSUED', 'EXPIRED', 'REVOKED', 'ACTIVE', 'UNASSIGNED', 'ACTIVE'][i % 10],
    student_id: i % 5 !== 0 ? `stu_${(i % 12) + 1}` : null,
    student_name: i % 5 !== 0 ? ['Aarav Sharma', 'Priya Patel', 'Rohit Singh', 'Sneha Gupta', 'Karan Kumar', 'Divya Joshi', 'Arjun Verma', 'Meera Shah', 'Vikram Mehta', 'Ananya Reddy', 'Rahul Nair', 'Kavya Singh'][i % 12] : null,
    student_class: i % 5 !== 0 ? `${Math.floor(Math.random() * 12) + 1}${['A', 'B', 'C'][i % 3]}` : null,
    school_id: 'sch_001',
    batch_id: `batch_${Math.floor(i / 8) + 1}`,
    batch_name: `Batch-${String(Math.floor(i / 8) + 1).padStart(3, '0')}`,
    order_id: i % 3 === 0 ? `ORD-2024-${String(Math.floor(i / 3) + 1).padStart(3, '0')}` : null,
    activated_at: i % 4 === 0 ? new Date(Date.now() - 86400000 * 15).toISOString() : null,
    assigned_at: i % 5 !== 0 ? new Date(Date.now() - 86400000 * (i % 20 + 5)).toISOString() : null,
    expires_at: i % 3 === 0 ? new Date(Date.now() - 86400000 * 5).toISOString() : new Date(Date.now() + 86400000 * (Math.random() * 300 + 30)).toISOString(),
    revoked_at: i % 7 === 3 ? new Date(Date.now() - 86400000 * 10).toISOString() : null,
    revoked_reason: i % 7 === 3 ? 'Token lost reported by parent' : null,
    replaced_by_id: i % 8 === 2 ? `tok_${i + 100}` : null,
    is_honeypot: i % 15 === 0,
    created_at: new Date(Date.now() - 86400000 * (i % 30 + 10)).toISOString(),
}));

// ─── Stats Calculation ────────────────────────────────────────────────────────
const calculateStats = (tokens) => {
    return {
        total: tokens.length,
        active: tokens.filter(t => t.status === 'ACTIVE').length,
        unassigned: tokens.filter(t => t.status === 'UNASSIGNED').length,
        issued: tokens.filter(t => t.status === 'ISSUED').length,
        expired: tokens.filter(t => t.status === 'EXPIRED').length,
        revoked: tokens.filter(t => t.status === 'REVOKED').length,
        expiringSoon: tokens.filter(t => {
            if (t.status !== 'ACTIVE') return false;
            const daysUntilExpiry = (new Date(t.expires_at) - new Date()) / (1000 * 60 * 60 * 24);
            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length,
        honeypot: tokens.filter(t => t.is_honeypot).length,
    };
};

// ─── Token Detail Modal ───────────────────────────────────────────────────────
const TokenDetailModal = ({ token, onClose, onRevoke, onReplace }) => {
    const [actionLoading, setActionLoading] = useState(null);
    const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
    const StatusIcon = statusCfg.Icon;
    const isExpiring = token.status === 'ACTIVE' && new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000);
    const isExpired = token.status === 'EXPIRED' || new Date(token.expires_at) < new Date();

    const handleAction = async (action) => {
        setActionLoading(action);
        await new Promise(r => setTimeout(r, 800));
        if (action === 'revoke') onRevoke(token.id);
        if (action === 'replace') onReplace(token.id);
        setActionLoading(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display text-xl font-bold text-[var(--text-primary)] m-0">Token Details</h3>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">{maskTokenHash(token.token_hash)}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Status & Honeypot */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                            <StatusIcon size={14} /> {statusCfg.label}
                        </span>
                        {token.is_honeypot && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                <Shield size={11} /> Honeypot Token
                            </span>
                        )}
                        {isExpiring && !isExpired && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                <AlertTriangle size={11} /> Expiring Soon
                            </span>
                        )}
                    </div>

                    {/* Student Info */}
                    <div className="p-4 rounded-xl bg-slate-50">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Student Information</p>
                        {token.student_name ? (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Name:</span>
                                    <span className="font-medium">{token.student_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Class:</span>
                                    <span>{token.student_class || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Student ID:</span>
                                    <code className="text-sm">{token.student_id || '—'}</code>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-[var(--text-muted)]">Not assigned to any student</p>
                        )}
                    </div>

                    {/* Token Info */}
                    <div className="p-4 rounded-xl bg-slate-50">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Token Information</p>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Batch:</span>
                                <span className="font-mono">{token.batch_name}</span>
                            </div>
                            {token.order_id && (
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Order ID:</span>
                                    <code className="text-sm">{token.order_id}</code>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Created:</span>
                                <span>{formatDate(token.created_at)}</span>
                            </div>
                            {token.assigned_at && (
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Assigned:</span>
                                    <span>{formatRelativeTime(token.assigned_at)}</span>
                                </div>
                            )}
                            {token.activated_at && (
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Activated:</span>
                                    <span>{formatDate(token.activated_at)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Expires:</span>
                                <span className={isExpiring ? 'text-amber-600 font-semibold' : isExpired ? 'text-red-600' : ''}>
                                    {formatDate(token.expires_at)}
                                    {isExpiring && !isExpired && ' (30 days)'}
                                    {isExpired && ' (Expired)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Revoke Info */}
                    {token.revoked_at && (
                        <div className="p-4 rounded-xl bg-red-50">
                            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Revocation Details</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-red-600">Revoked:</span>
                                    <span>{formatDate(token.revoked_at)}</span>
                                </div>
                                {token.revoked_reason && (
                                    <div className="flex justify-between">
                                        <span className="text-red-600">Reason:</span>
                                        <span>{token.revoked_reason}</span>
                                    </div>
                                )}
                                {token.replaced_by_id && (
                                    <div className="flex justify-between">
                                        <span className="text-red-600">Replaced By:</span>
                                        <code className="text-sm">{maskTokenHash(token.replaced_by_id)}</code>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {(token.status === 'ACTIVE' || token.status === 'ISSUED') && (
                        <div className="flex gap-3 pt-3">
                            <button
                                onClick={() => handleAction('revoke')}
                                disabled={actionLoading === 'revoke'}
                                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-50"
                            >
                                {actionLoading === 'revoke' ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                                Revoke Token
                            </button>
                            <button
                                onClick={() => handleAction('replace')}
                                disabled={actionLoading === 'replace'}
                                className="flex-1 py-2.5 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-50"
                            >
                                {actionLoading === 'replace' ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                                Replace Token
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Generate Batch Modal ─────────────────────────────────────────────────────
const GenerateBatchModal = ({ onClose, onGenerate }) => {
    const [count, setCount] = useState(50);
    const [notes, setNotes] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 1000));
        onGenerate(count, notes);
        setGenerating(false);
        onClose();
        toast.success(`${count} tokens generated successfully`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[450px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-[var(--border-default)]">
                    <h3 className="font-display text-xl font-bold text-[var(--text-primary)] m-0">Generate Token Batch</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">Create new unassigned tokens for your school</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Number of Tokens (1-500)</label>
                        <input
                            type="number"
                            min={1}
                            max={500}
                            value={count}
                            onChange={e => setCount(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Notes (Optional)</label>
                        <input
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="e.g., Batch for Class 10 students"
                            className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
                        />
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 text-sm text-blue-800">
                        <p className="font-semibold mb-1">Batch Summary</p>
                        <p>• {count} tokens will be created</p>
                        <p>• Status: UNASSIGNED</p>
                        <p>• Expiry: 1 year from creation</p>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-[var(--border-default)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">Cancel</button>
                    <button onClick={handleGenerate} disabled={generating} className="px-5 py-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50">
                        {generating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Generate {count} Tokens
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Export CSV Function ──────────────────────────────────────────────────────
const exportToCSV = (tokens) => {
    const headers = ['Token Hash', 'Status', 'Student Name', 'Student Class', 'Batch', 'Order ID', 'Assigned At', 'Expires At', 'Revoked At', 'Revoked Reason', 'Honeypot'];
    const rows = tokens.map(t => [
        t.token_hash,
        t.status,
        t.student_name || '',
        t.student_class || '',
        t.batch_name,
        t.order_id || '',
        t.assigned_at ? formatDate(t.assigned_at) : '',
        formatDate(t.expires_at),
        t.revoked_at ? formatDate(t.revoked_at) : '',
        t.revoked_reason || '',
        t.is_honeypot ? 'Yes' : 'No'
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `token_inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export completed');
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TokenInventory() {
    const { user, can } = useAuth();
    const [tokens, setTokens] = useState(MOCK_TOKENS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);
    const PAGE_SIZE = 12;

    // Filter tokens (only current school's tokens)
    const myTokens = tokens.filter(t => t.school_id === (user?.school_id || 'sch_001'));
    const stats = calculateStats(myTokens);

    const filtered = myTokens.filter(t => {
        const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchSearch = !debouncedSearch ||
            t.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (t.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleRevoke = (id) => {
        setTokens(prev => prev.map(t =>
            t.id === id ? {
                ...t,
                status: 'REVOKED',
                revoked_at: new Date().toISOString(),
                revoked_reason: 'Revoked by school admin'
            } : t
        ));
        toast.success('Token revoked successfully');
    };

    const handleReplace = (id) => {
        // In real implementation, create new token and link via replaced_by_id
        toast.info('Replace token feature - creates new token');
    };

    const handleGenerateBatch = (count, notes) => {
        const newTokens = Array.from({ length: count }, (_, i) => ({
            id: `tok_new_${Date.now()}_${i}`,
            token_hash: `TOK-NEW-${Math.random().toString(36).slice(2, 14).toUpperCase()}`,
            status: 'UNASSIGNED',
            student_id: null,
            student_name: null,
            student_class: null,
            school_id: user?.school_id || 'sch_001',
            batch_id: `batch_${Date.now()}`,
            batch_name: `Batch-${new Date().toISOString().slice(0, 10)}`,
            order_id: null,
            activated_at: null,
            assigned_at: null,
            expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
            revoked_at: null,
            revoked_reason: null,
            replaced_by_id: null,
            is_honeypot: false,
            created_at: new Date().toISOString(),
        }));
        setTokens(prev => [...newTokens, ...prev]);
    };

    return (
        <div className="max-w-[1300px] mx-auto px-4 py-6">
            {showBatchModal && <GenerateBatchModal onClose={() => setShowBatchModal(false)} onGenerate={handleGenerateBatch} />}
            {selectedToken && <TokenDetailModal token={selectedToken} onClose={() => setSelectedToken(null)} onRevoke={handleRevoke} onReplace={handleReplace} />}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                            <Cpu size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0">Token Inventory</h1>
                            <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage and track all student ID tokens for your school</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => exportToCSV(filtered)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50">
                        <Download size={14} /> Export
                    </button>
                    {can('tokens.createBatch') && (
                        <button onClick={() => setShowBatchModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-lg hover:opacity-90">
                            <Plus size={16} /> Generate Batch
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
                    <div className="text-xs text-[var(--text-muted)]">Active</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-slate-500">{stats.unassigned}</div>
                    <div className="text-xs text-[var(--text-muted)]">Unassigned</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.issued}</div>
                    <div className="text-xs text-[var(--text-muted)]">Issued</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</div>
                    <div className="text-xs text-[var(--text-muted)]">Expiring Soon</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.revoked}</div>
                    <div className="text-xs text-[var(--text-muted)]">Revoked</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.honeypot}</div>
                    <div className="text-xs text-[var(--text-muted)]">Honeypot</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex-1 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by token hash or student name..."
                            className="w-full py-2 pl-9 pr-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white"
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All Status' : STATUS_CONFIG[s]?.label || s}</option>
                        ))}
                    </select>
                    {(statusFilter !== 'ALL' || search) && (
                        <button
                            onClick={() => { setStatusFilter('ALL'); setSearch(''); setPage(1); }}
                            className="text-xs text-red-600 font-medium"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Token Grid */}
            {paginated.length === 0 ? (
                <div className="bg-white rounded-xl border border-[var(--border-default)] py-16 text-center">
                    <Cpu size={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30" />
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">No tokens found</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                        {statusFilter !== 'ALL' ? 'Try changing the filter' : 'Generate your first token batch to get started'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginated.map(token => {
                        const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
                        const StatusIcon = statusCfg.Icon;
                        const isExpiring = token.status === 'ACTIVE' && new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000);
                        const isExpired = token.status === 'EXPIRED' || new Date(token.expires_at) < new Date();

                        return (
                            <div
                                key={token.id}
                                className="bg-white rounded-xl border border-[var(--border-default)] p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedToken(token)}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <code className="font-mono text-sm font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                                        {maskTokenHash(token.token_hash)}
                                    </code>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                                        <StatusIcon size={10} /> {statusCfg.label}
                                    </span>
                                </div>

                                {/* Student Info */}
                                <div className="mb-3">
                                    {token.student_name ? (
                                        <>
                                            <p className="font-semibold text-[var(--text-primary)]">{token.student_name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">Class {token.student_class}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-[var(--text-muted)]">Not assigned</p>
                                    )}
                                </div>

                                {/* Token Details */}
                                <div className="space-y-1 text-xs text-[var(--text-muted)]">
                                    <div className="flex justify-between">
                                        <span>Batch:</span>
                                        <span className="font-mono">{token.batch_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Expires:</span>
                                        <span className={isExpiring ? 'text-amber-600 font-semibold' : isExpired ? 'text-red-600' : ''}>
                                            {formatDate(token.expires_at)}
                                            {isExpiring && !isExpired && ' ⚠️'}
                                        </span>
                                    </div>
                                    {token.assigned_at && (
                                        <div className="flex justify-between">
                                            <span>Assigned:</span>
                                            <span>{formatRelativeTime(token.assigned_at)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Honeypot Badge */}
                                {token.is_honeypot && (
                                    <div className="mt-2 pt-2 border-t border-[var(--border-default)]">
                                        <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                            <Shield size={10} /> Honeypot Token
                                        </span>
                                    </div>
                                )}

                                {/* Revoked Indicator */}
                                {token.revoked_at && (
                                    <div className="mt-2 pt-2 border-t border-[var(--border-default)]">
                                        <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                            <Ban size={10} /> Revoked {formatRelativeTime(token.revoked_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white disabled:opacity-40 hover:bg-slate-50"
                    >
                        &lt;
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let p = page;
                        if (totalPages <= 7) p = i + 1;
                        else if (page <= 4) p = i + 1;
                        else if (page >= totalPages - 3) p = totalPages - 6 + i;
                        else p = page - 3 + i;
                        return (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-8 h-8 rounded-md border text-sm transition-colors ${p === page
                                    ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                    : 'border-[var(--border-default)] bg-white hover:bg-slate-50'
                                    }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white disabled:opacity-40 hover:bg-slate-50"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}
