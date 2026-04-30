/**
 * SCHOOL ADMIN — TOKEN INVENTORY
 * Premium‑grade design with refined typography, subtle interactions,
 * and elegant premium‑gated placeholders (no upgrade buttons).
 */

import { useState } from 'react';
import {
    Search, Plus, RefreshCw, XCircle, Cpu, Filter, Download,
    Eye, Ban, RotateCcw, Shield, AlertTriangle, CheckCircle,
    Clock, X, ChevronDown, Loader2, Hash, User, Calendar,
    Package, Link2, FileText, Lock, Star, ChevronLeft, ChevronRight,
    Circle, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { maskTokenHash, formatDate, formatRelativeTime, humanizeEnum, formatCompact } from '../../../utils/formatters.js';
import useDebounce from '../../../hooks/useDebounce.js';
import useAuth from '../../../hooks/useAuth.js';
import usePremiumStatus from '../../../hooks/usePremiumStatus.js';
import { ROUTES } from '../../../config/routes.config.js';
import { toast } from '#utils/Toast.js';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
    brand: {
        50: 'var(--color-brand-50, #EEF2FF)',
        100: 'var(--color-brand-100, #E0E7FF)',
        500: 'var(--color-brand-500, #6366F1)',
        600: 'var(--color-brand-600, #4F46E5)',
        700: 'var(--color-brand-700, #4338CA)',
    },
    slate: {
        50: 'var(--color-slate-50, #F8FAFC)',
        100: 'var(--color-slate-100, #F1F5F9)',
        200: 'var(--color-slate-200, #E2E8F0)',
        300: 'var(--color-slate-300, #CBD5E1)',
        400: 'var(--color-slate-400, #94A3B8)',
        500: 'var(--color-slate-500, #64748B)',
        600: 'var(--color-slate-600, #475569)',
        700: 'var(--color-slate-700, #334155)',
        800: 'var(--color-slate-800, #1E293B)',
    },
    border: 'var(--border-default, #E2E8F0)',
    text: {
        primary: 'var(--text-primary, #0F172A)',
        secondary: 'var(--text-secondary, #475569)',
        muted: 'var(--text-muted, #94A3B8)',
    },
    success: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', icon: '#10B981' },
    warning: { bg: '#FFFBEB', text: '#92400E', border: '#FCD34D', icon: '#F59E0B' },
    danger:  { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', icon: '#EF4444' },
    info:    { bg: '#F0F9FF', text: '#075985', border: '#BAE6FD', icon: '#0EA5E9' },
    accent: {
        purple: { bg: '#FAF5FF', text: '#6B21A8', border: '#E9D5FF' },
        pink:   { bg: '#FDF2F8', text: '#9D174D', border: '#FBCFE8' },
    },
};

// ─── Constants ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 12;
const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'UNASSIGNED', 'ISSUED', 'INACTIVE', 'REVOKED', 'EXPIRED'];

const STATUS_CONFIG = {
    ACTIVE:     { label: 'Active',     color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle, gradient: 'from-emerald-400 to-emerald-500' },
    UNASSIGNED: { label: 'Unassigned', color: '#6B7280', bg: '#F9FAFB', Icon: Clock,      gradient: 'from-slate-400 to-slate-500' },
    ISSUED:     { label: 'Issued',     color: '#3B82F6', bg: '#EFF6FF', Icon: Package,    gradient: 'from-blue-400 to-blue-500' },
    INACTIVE:   { label: 'Inactive',   color: '#9CA3AF', bg: '#F9FAFB', Icon: XCircle,    gradient: 'from-gray-400 to-gray-500' },
    REVOKED:    { label: 'Revoked',    color: '#EF4444', bg: '#FEF2F2', Icon: Ban,        gradient: 'from-red-400 to-red-500' },
    EXPIRED:    { label: 'Expired',    color: '#F59E0B', bg: '#FFFBEB', Icon: AlertTriangle, gradient: 'from-amber-400 to-amber-500' },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const calculateStats = (tokens) => ({
    total:        tokens.length,
    active:       tokens.filter(t => t.status === 'ACTIVE').length,
    unassigned:   tokens.filter(t => t.status === 'UNASSIGNED').length,
    issued:       tokens.filter(t => t.status === 'ISSUED').length,
    revoked:      tokens.filter(t => t.status === 'REVOKED').length,
    honeypot:     tokens.filter(t => t.is_honeypot).length,
    expiringSoon: tokens.filter(t =>
        t.status === 'ACTIVE' &&
        new Date(t.expires_at) < new Date(Date.now() + 30 * 86400000)
    ).length,
});

// ─── Mock Data (identical to original) ─────────────────────────────────────────
const MOCK_TOKENS = Array.from({ length: 32 }, (_, i) => ({
    id: `tok_${i + 1}`,
    token_hash: `TOK-${Math.random().toString(36).slice(2, 18).toUpperCase()}`,
    status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'UNASSIGNED', 'ISSUED', 'EXPIRED', 'REVOKED', 'ACTIVE', 'UNASSIGNED', 'ACTIVE'][i % 10],
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

// ─── Subcomponents ─────────────────────────────────────────────────────────────

/** Premium locked action pill */
const LockedAction = ({ label, icon: Icon, description }) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-sm cursor-not-allowed select-none">
        <Lock size={14} className="flex-shrink-0" />
        <span className="font-medium">{label}</span>
        {description && <span className="hidden sm:inline text-xs opacity-70 ml-2">{description}</span>}
    </div>
);

/** Status badge with left accent */
const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.UNASSIGNED;
    const Icon = cfg.Icon;
    return (
        <span
            className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full text-xs font-semibold border-l-2"
            style={{
                background: cfg.bg,
                color: cfg.color,
                borderColor: cfg.color,
                borderLeftWidth: '3px',
            }}
        >
            <Icon size={11} />
            {cfg.label}
        </span>
    );
};

// ─── Token Detail Modal ────────────────────────────────────────────────────────
const TokenDetailModal = ({ token, onClose, onRevoke, onReplace, isPremium }) => {
    const [actionLoading, setActionLoading] = useState(null);
    const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
    const StatusIcon = statusCfg.Icon;
    const isExpiring = token.status === 'ACTIVE' && new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000);
    const isExpired  = token.status === 'EXPIRED' || new Date(token.expires_at) < new Date();

    const handleAction = async (type) => {
        setActionLoading(type);
        await new Promise(r => setTimeout(r, 800));
        if (type === 'revoke')  onRevoke(token.id);
        if (type === 'replace') onReplace(token.id);
        setActionLoading(null);
        onClose();
    };

    // Simple lifecycle timeline
    const timeline = [
        { label: 'Created', date: token.created_at, icon: Clock, active: true },
        { label: 'Assigned', date: token.assigned_at, icon: User, active: !!token.assigned_at },
        { label: 'Activated', date: token.activated_at, icon: CheckCircle, active: !!token.activated_at },
        { label: 'Expires', date: token.expires_at, icon: Calendar, active: true, warning: isExpiring },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-5 border-b border-slate-200 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Token Details</h3>
                            <p className="text-sm text-slate-500 mt-0.5 font-mono">{maskTokenHash(token.token_hash)}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={token.status} />
                        {token.is_honeypot && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                <Shield size={11} /> Honeypot
                            </span>
                        )}
                        {isExpiring && !isExpired && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                                <AlertTriangle size={11} /> Expiring in 30 days
                            </span>
                        )}
                    </div>

                    {/* Student card */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Student Information</p>
                        {token.student_name ? (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-slate-500">Name</span><p className="font-medium">{token.student_name}</p></div>
                                <div><span className="text-slate-500">Class</span><p>{token.student_class || '—'}</p></div>
                                <div className="col-span-2"><span className="text-slate-500">Student ID</span><p className="font-mono">{token.student_id || '—'}</p></div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Not assigned to any student</p>
                        )}
                    </div>

                    {/* Token metadata grid */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Token Information</div>
                        <div><span className="text-slate-500 text-xs">Batch</span><p className="font-mono text-sm">{token.batch_name}</p></div>
                        {token.order_id && <div><span className="text-slate-500 text-xs">Order ID</span><p className="font-mono text-sm">{token.order_id}</p></div>}
                        <div><span className="text-slate-500 text-xs">Created</span><p className="text-sm">{formatDate(token.created_at)}</p></div>
                        <div>
                            <span className="text-slate-500 text-xs">Expires</span>
                            <p className={`text-sm font-medium ${isExpired ? 'text-red-600' : isExpiring ? 'text-amber-600' : ''}`}>
                                {formatDate(token.expires_at)}
                                {isExpiring && !isExpired && ' ⚠️'}
                            </p>
                        </div>
                    </div>

                    {/* Timeline (visual) */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Token Lifecycle</p>
                        <div className="flex items-center justify-between">
                            {timeline.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${step.active ? 'bg-brand-600' : 'bg-slate-300'}`}>
                                        {step.active ? <step.icon size={14} /> : <Circle size={10} />}
                                    </div>
                                    <span className="text-xs mt-1 font-medium text-slate-600">{step.label}</span>
                                    <span className="text-[10px] text-slate-400">{step.date ? formatDate(step.date) : '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revocation details */}
                    {token.revoked_at && (
                        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                            <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Revocation Details</p>
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between"><span className="text-red-600">Date</span><span>{formatDate(token.revoked_at)}</span></div>
                                <div className="flex justify-between"><span className="text-red-600">Reason</span><span>{token.revoked_reason || 'N/A'}</span></div>
                                {token.replaced_by_id && <div className="flex justify-between"><span className="text-red-600">Replaced By</span><code>{maskTokenHash(token.replaced_by_id)}</code></div>}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {(token.status === 'ACTIVE' || token.status === 'ISSUED') && (
                        <div className="flex gap-3 pt-1">
                            <button onClick={() => handleAction('revoke')} disabled={actionLoading === 'revoke'} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-50 transition-colors shadow-sm">
                                {actionLoading === 'revoke' ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />} Revoke Token
                            </button>
                            {isPremium && (
                                <button onClick={() => handleAction('replace')} disabled={actionLoading === 'replace'} className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm">
                                    {actionLoading === 'replace' ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />} Replace Token
                                </button>
                            )}
                        </div>
                    )}

                    {isPremium && (
                        <button onClick={() => toast.info('Scan history coming soon')} className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                            <Eye size={16} /> View Scan History
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Generate Batch Modal ──────────────────────────────────────────────────────
const GenerateBatchModal = ({ onClose, onGenerate }) => {
    const [count, setCount] = useState(50);
    const [notes, setNotes] = useState('');
    const [generating, setGenerating] = useState(false);

    const presets = [25, 50, 100, 200, 500];

    const handleGenerate = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 1000));
        onGenerate(count, notes);
        setGenerating(false);
        onClose();
        toast.success(`${count} tokens generated successfully`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900">Generate Token Batch</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Create new unassigned tokens for your school</p>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Number of Tokens</label>
                        <div className="flex gap-2 mb-2">
                            {presets.map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setCount(p)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${count === p ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            min={1}
                            max={500}
                            value={count}
                            onChange={e => setCount(Math.min(500, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                            placeholder="Custom"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Notes (Optional)</label>
                        <input
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="e.g., Batch for Class 10 students"
                            className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500"
                        />
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 text-sm text-blue-800 border border-blue-200">
                        <p className="font-semibold mb-1">Batch Summary</p>
                        <p>• {count} tokens will be created</p>
                        <p>• Status: UNASSIGNED</p>
                        <p>• Expiry: 1 year from creation</p>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                    <button onClick={handleGenerate} disabled={generating} className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold shadow-md hover:bg-brand-700 disabled:opacity-50 transition-colors flex items-center gap-2">
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
    const isPremium = usePremiumStatus();
    const navigate = useNavigate();

    const [tokens, setTokens] = useState(MOCK_TOKENS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch]             = useState('');
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);

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
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleRevoke = (id) => {
        setTokens(prev => prev.map(t =>
            t.id === id ? { ...t, status: 'REVOKED', revoked_at: new Date().toISOString(), revoked_reason: 'Revoked by school admin' } : t
        ));
        toast.success('Token revoked successfully');
    };

    const handleReplace = (id) => {
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {showBatchModal && <GenerateBatchModal onClose={() => setShowBatchModal(false)} onGenerate={handleGenerateBatch} />}
            {selectedToken && (
                <TokenDetailModal
                    token={selectedToken}
                    onClose={() => setSelectedToken(null)}
                    onRevoke={handleRevoke}
                    onReplace={handleReplace}
                    isPremium={isPremium}
                />
            )}

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <Cpu size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Token Inventory</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage and track all student ID tokens for your school</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isPremium ? (
                        <button onClick={() => exportToCSV(filtered)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <Download size={14} /> Export
                        </button>
                    ) : (
                        <LockedAction label="Export" icon={Download} description="Premium feature" />
                    )}

                    {isPremium && (
                        <button onClick={() => toast.info('Bulk assign coming soon')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <FileText size={16} /> Bulk Assign
                        </button>
                    )}

                    {can('tokens.createBatch') && (
                        <button onClick={() => setShowBatchModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-lg shadow-brand-500/25 hover:scale-105 transition-all duration-200">
                            <Plus size={16} /> Generate Batch
                        </button>
                    )}
                </div>
            </div>

            {/* ── Stats Cards ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {[
                    { label: 'Total', value: stats.total, Icon: Hash, color: 'text-slate-700', bg: 'bg-slate-100' },
                    { label: 'Active', value: stats.active, Icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: 'Unassigned', value: stats.unassigned, Icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: 'Issued', value: stats.issued, Icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Expiring', value: stats.expiringSoon, Icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
                    { label: 'Revoked', value: stats.revoked, Icon: Ban, color: 'text-red-600', bg: 'bg-red-100' },
                    { label: 'Honeypot', value: stats.honeypot, Icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow gap-1">
                        <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-1`}>
                            <stat.Icon size={18} className={stat.color} />
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                        <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Token Status Breakdown ───────────────────────────────────── */}
            {isPremium ? (
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Status Distribution</h3>
                        <span className="text-xs text-slate-400">{stats.total} tokens total</span>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Active', value: stats.active, color: '#10B981', Icon: CheckCircle },
                            { name: 'Unassigned', value: stats.unassigned, color: '#6B7280', Icon: Clock },
                            { name: 'Issued', value: stats.issued, color: '#3B82F6', Icon: Package },
                            { name: 'Revoked', value: stats.revoked, color: '#EF4444', Icon: Ban },
                            { name: 'Expiring Soon', value: stats.expiringSoon, color: '#F59E0B', Icon: AlertTriangle },
                        ].map(item => (
                            <div key={item.name} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <item.Icon size={16} style={{ color: item.color }} />
                                </div>
                                <div className="w-20 text-sm font-medium text-slate-600">{item.name}</div>
                                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${stats.total ? (item.value / stats.total) * 100 : 0}%`,
                                            backgroundColor: item.color,
                                            minWidth: item.value > 0 ? '8px' : '0',
                                        }}
                                    />
                                </div>
                                <div className="w-12 text-sm font-semibold text-right text-slate-700">{item.value}</div>
                                <div className="w-12 text-xs text-slate-400 text-right">
                                    {stats.total ? Math.round((item.value / stats.total) * 100) : 0}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 mb-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Lock size={28} className="text-slate-400" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Status Breakdown Locked</h3>
                        <p className="text-sm text-slate-500 max-w-sm">
                            Visual analytics for token status distribution are available on the Premium plan.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Filters & Search ─────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search token hash or student name..."
                            className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-sm outline-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                        />
                        {search && (
                            <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="py-2.5 px-4 border border-slate-200 rounded-xl text-sm bg-slate-50 outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500"
                    >
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All Status' : STATUS_CONFIG[s]?.label || s}</option>
                        ))}
                    </select>
                    {(statusFilter !== 'ALL' || search) && (
                        <button onClick={() => { setStatusFilter('ALL'); setSearch(''); setPage(1); }} className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* ── Token Grid ───────────────────────────────────────────────── */}
            {paginated.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 py-16 text-center shadow-sm">
                    <Cpu size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="font-semibold text-slate-700 mb-1">No tokens found</h3>
                    <p className="text-sm text-slate-500">{statusFilter !== 'ALL' ? 'Try adjusting filters' : 'Create your first batch to get started'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginated.map(token => {
                        const statusCfg = STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED;
                        const StatusIcon = statusCfg.Icon;
                        const isExpiring = token.status === 'ACTIVE' && new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000);
                        const isExpired  = token.status === 'EXPIRED' || new Date(token.expires_at) < new Date();

                        return (
                            <div
                                key={token.id}
                                className="bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => setSelectedToken(token)}
                            >
                                {/* Card header with left accent based on status */}
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <code className="font-mono text-sm font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                                        {maskTokenHash(token.token_hash)}
                                    </code>
                                    <div className="flex items-center gap-1.5">
                                        <StatusBadge status={token.status} />
                                        {isPremium && token.order_id && (
                                            <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200" title="Priority Order">
                                                <Star size={10} />
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className={`p-4 bg-gradient-to-br ${isExpired ? 'from-red-50 to-white' : isExpiring ? 'from-amber-50 to-white' : 'from-white to-white'}`}>
                                    {token.student_name ? (
                                        <div className="mb-3">
                                            <p className="font-semibold text-slate-800">{token.student_name}</p>
                                            <p className="text-xs text-slate-500">Class {token.student_class}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 mb-3 italic">Unassigned</p>
                                    )}

                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-500">
                                        <div><span>Batch</span><p className="font-mono font-medium text-slate-700">{token.batch_name}</p></div>
                                        <div>
                                            <span>Expires</span>
                                            <p className={`font-medium ${isExpired ? 'text-red-600' : isExpiring ? 'text-amber-600' : 'text-slate-700'}`}>
                                                {formatDate(token.expires_at)}
                                                {isExpiring && !isExpired && ' ⚠️'}
                                            </p>
                                        </div>
                                        <div>
                                            <span>Assigned</span>
                                            <p className="text-slate-700">{token.assigned_at ? formatRelativeTime(token.assigned_at) : '—'}</p>
                                        </div>
                                        <div>
                                            <span>Order</span>
                                            <p className="text-slate-700">{token.order_id || '—'}</p>
                                        </div>
                                    </div>

                                    {(token.is_honeypot || token.revoked_at) && (
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                                            {token.is_honeypot && (
                                                <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                                    <Shield size={10} /> Honeypot
                                                </span>
                                            )}
                                            {token.revoked_at && (
                                                <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                                    <Ban size={10} /> Revoked {formatRelativeTime(token.revoked_at)}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Pagination ───────────────────────────────────────────────── */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={18} />
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
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                                    p === page
                                        ? 'bg-brand-600 text-white shadow-md scale-105'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Animations ───────────────────────────────────────────────────────────────
<style>{`
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.2s ease; }
    .animate-slide-up { animation: slideUp 0.25s ease; }
`}</style>