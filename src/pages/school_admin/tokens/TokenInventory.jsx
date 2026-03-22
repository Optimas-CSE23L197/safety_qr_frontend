import { useState } from 'react';
import { Search, Plus, Cpu } from 'lucide-react';
import { maskTokenHash, formatDate, formatRelativeTime, humanizeEnum } from '../../../utils/formatters.js';
import useDebounce from '../../../hooks/useDebounce.js';
import useAuth from '../../../hooks/useAuth.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUSES = ['ALL', 'ACTIVE', 'UNASSIGNED', 'ISSUED', 'EXPIRED', 'REVOKED', 'INACTIVE'];

const STATUS_STYLE = {
    ACTIVE:     { badgeClass: 'bg-emerald-50 text-emerald-700',  iconBg: 'bg-emerald-50',  iconColor: 'text-emerald-500' },
    UNASSIGNED: { badgeClass: 'bg-slate-100 text-slate-600',     iconBg: 'bg-slate-100',   iconColor: 'text-slate-500' },
    ISSUED:     { badgeClass: 'bg-sky-100 text-sky-700',         iconBg: 'bg-sky-100',     iconColor: 'text-sky-700' },
    EXPIRED:    { badgeClass: 'bg-amber-50 text-amber-700',      iconBg: 'bg-amber-50',    iconColor: 'text-amber-500' },
    REVOKED:    { badgeClass: 'bg-red-50 text-red-700',          iconBg: 'bg-red-50',      iconColor: 'text-red-500' },
    INACTIVE:   { badgeClass: 'bg-slate-50 text-slate-400',      iconBg: 'bg-slate-50',    iconColor: 'text-slate-400' },
};

const STAT_CARDS = [
    { label: 'Active',     key: 'ACTIVE',     iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { label: 'Unassigned', key: 'UNASSIGNED', iconBg: 'bg-slate-100',  iconColor: 'text-slate-500' },
    { label: 'Expired',    key: 'EXPIRED',    iconBg: 'bg-amber-50',   iconColor: 'text-amber-500' },
    { label: 'Revoked',    key: 'REVOKED',    iconBg: 'bg-red-50',     iconColor: 'text-red-500' },
];

const TABLE_HEADERS = ['Token Hash', 'Status', 'Assigned To', 'Assigned', 'Expires', 'Batch'];
const PAGE_SIZE = 12;

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_TOKENS = Array.from({ length: 32 }, (_, i) => ({
    id: `tok-${i + 1}`,
    token_hash: `a${Math.random().toString(36).slice(2, 18).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: STATUSES.slice(1)[i % 6],
    student_name: i % 5 !== 0 ? ['Aarav Sharma', 'Priya Patel', 'Rohit Singh', 'Sneha Gupta', 'Karan Kumar', 'Divya Joshi', 'Arjun Verma', 'Meera Shah', 'Vikram Mehta', 'Ananya Reddy'][i % 10] : null,
    assigned_at: i % 5 !== 0 ? new Date(Date.now() - i * 86400000 * 10).toISOString() : null,
    expires_at: new Date(Date.now() + (i % 3 === 0 ? -30 : 1) * 86400000 * 60).toISOString(),
    batch_id: `batch-${Math.floor(i / 8) + 1}`,
    created_at: new Date(Date.now() - i * 86400000 * 20).toISOString(),
}));

const STATS = {
    ACTIVE:     MOCK_TOKENS.filter(t => t.status === 'ACTIVE').length,
    UNASSIGNED: MOCK_TOKENS.filter(t => t.status === 'UNASSIGNED').length,
    EXPIRED:    MOCK_TOKENS.filter(t => t.status === 'EXPIRED').length,
    REVOKED:    MOCK_TOKENS.filter(t => t.status === 'REVOKED').length,
};

// ── Create Batch Modal ────────────────────────────────────────────────────────
const CreateBatchModal = ({ onClose }) => {
    const [count, setCount] = useState(10);
    const [notes, setNotes] = useState('');
    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl p-7 max-w-[420px] w-full shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
                <h3 className="font-display text-lg font-bold text-slate-900 m-0 mb-5">
                    Generate Token Batch
                </h3>

                <label className="block text-[0.8125rem] font-semibold text-slate-400 mb-1.5">
                    Number of Tokens (1–500)
                </label>
                <input
                    type="number"
                    value={count}
                    onChange={e => setCount(Math.min(500, Math.max(1, +e.target.value)))}
                    min={1}
                    max={500}
                    className="w-full px-3 py-[9px] border border-slate-200 rounded-lg text-[0.9rem] outline-none mb-4 focus:border-blue-500 transition-colors duration-100"
                />

                <label className="block text-[0.8125rem] font-semibold text-slate-400 mb-1.5">
                    Notes (optional)
                </label>
                <input
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Batch for Class 10 students"
                    className="w-full px-3 py-[9px] border border-slate-200 rounded-lg text-[0.9rem] outline-none mb-6 focus:border-blue-500 transition-colors duration-100"
                />

                <div className="flex gap-2.5 justify-end">
                    <button
                        onClick={onClose}
                        className="px-[18px] py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors duration-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-[18px] py-2 rounded-lg border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-100"
                    >
                        Generate {count} Tokens
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function TokenInventory() {
    const { can } = useAuth();
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch]             = useState('');
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [page, setPage]                 = useState(1);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = MOCK_TOKENS.filter(t => {
        const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchSearch = !debouncedSearch ||
            t.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (t.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="max-w-[1200px]">
            {showBatchModal && <CreateBatchModal onClose={() => setShowBatchModal(false)} />}

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-slate-900 m-0">
                        Token Inventory
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Manage and track all student ID tokens
                    </p>
                </div>
                {can('tokens.createBatch') && (
                    <button
                        onClick={() => setShowBatchModal(true)}
                        className="flex items-center gap-2 px-[18px] py-[9px] rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 font-display font-semibold text-sm cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:from-blue-700 hover:to-blue-800 transition-all duration-100"
                    >
                        <Plus size={16} /> Generate Batch
                    </button>
                )}
            </div>

            {/* ── Stats ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-3.5 mb-6">
                {STAT_CARDS.map(({ label, key, iconBg, iconColor }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-[18px] shadow-[var(--shadow-card)]">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-[0.05em] mb-1.5">
                                    {label}
                                </div>
                                <div className="font-display text-[1.75rem] font-bold text-slate-900">
                                    {STATS[key]}
                                </div>
                            </div>
                            <div className={`w-10 h-10 rounded-[10px] ${iconBg} flex items-center justify-center`}>
                                <Cpu size={20} className={iconColor} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filter + Search ───────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex gap-3 items-center flex-wrap shadow-[var(--shadow-card)]">
                <div className="flex gap-1.5 flex-wrap">
                    {STATUSES.map(s => {
                        const active = statusFilter === s;
                        return (
                            <button
                                key={s}
                                onClick={() => { setStatusFilter(s); setPage(1); }}
                                className={[
                                    'px-[13px] py-1.5 rounded-[7px] border text-[0.8125rem] cursor-pointer transition-colors duration-100',
                                    active
                                        ? 'border-blue-500 bg-blue-700 text-white font-bold'
                                        : 'border-slate-200 bg-white text-slate-600 font-normal hover:bg-slate-50',
                                ].join(' ')}
                            >
                                {s === 'ALL' ? 'All' : humanizeEnum(s)}
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="ml-auto relative">
                    <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search hash or student..."
                        className="pl-8 pr-3 py-[7px] border border-slate-200 rounded-lg text-sm outline-none w-[220px] font-body focus:border-blue-500 transition-colors duration-100"
                    />
                </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[var(--shadow-card)] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {TABLE_HEADERS.map(h => (
                                <th
                                    key={h}
                                    className="px-4 py-[11px] text-left text-xs font-semibold text-slate-400 tracking-[0.05em] uppercase whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-[60px] text-center text-slate-400">
                                    <Cpu size={36} className="opacity-30 mx-auto mb-3" />
                                    <div className="font-medium">No tokens found</div>
                                </td>
                            </tr>
                        ) : paginated.map((token, idx) => {
                            const s = STATUS_STYLE[token.status] || STATUS_STYLE.UNASSIGNED;
                            const isExpiringSoon =
                                new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000) &&
                                new Date(token.expires_at) > new Date();
                            return (
                                <tr
                                    key={token.id}
                                    className={[
                                        'transition-colors duration-100 hover:bg-slate-50',
                                        idx < paginated.length - 1 ? 'border-b border-slate-200' : '',
                                    ].join(' ')}
                                >
                                    {/* Token hash */}
                                    <td className="px-4 py-[13px]">
                                        <code className="font-mono text-[0.8125rem] bg-slate-100 px-2 py-[3px] rounded-[5px] text-slate-900">
                                            {maskTokenHash(token.token_hash)}
                                        </code>
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-4 py-[13px]">
                                        <span className={`px-2.5 py-[3px] rounded-full text-xs font-semibold ${s.badgeClass}`}>
                                            {humanizeEnum(token.status)}
                                        </span>
                                    </td>

                                    {/* Assigned to */}
                                    <td className={`px-4 py-[13px] text-sm ${token.student_name ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {token.student_name || '—'}
                                    </td>

                                    {/* Assigned at */}
                                    <td className="px-4 py-[13px] text-[0.8125rem] text-slate-400">
                                        {token.assigned_at ? formatRelativeTime(token.assigned_at) : '—'}
                                    </td>

                                    {/* Expires */}
                                    <td className="px-4 py-[13px]">
                                        <span className={`text-[0.8125rem] ${isExpiringSoon ? 'text-amber-700 font-semibold' : 'text-slate-400 font-normal'}`}>
                                            {isExpiringSoon && '⚠ '}{formatDate(token.expires_at)}
                                        </span>
                                    </td>

                                    {/* Batch */}
                                    <td className="px-4 py-[13px]">
                                        <code className="font-mono text-xs text-slate-400">
                                            {token.batch_id}
                                        </code>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* ── Pagination ───────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="px-4 py-3.5 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[0.8125rem] text-slate-400">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                                const active = p === page;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={[
                                            'w-8 h-8 rounded-md border text-[0.8125rem] cursor-pointer transition-colors duration-100',
                                            active
                                                ? 'border-blue-500 bg-blue-700 text-white font-bold'
                                                : 'border-slate-200 bg-white text-slate-600 font-normal hover:bg-slate-50',
                                        ].join(' ')}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}