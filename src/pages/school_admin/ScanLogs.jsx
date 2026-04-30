import { useState } from 'react';
import {
    Search, ScanLine, CheckCircle, XCircle, Clock, MapPin, Monitor, Lock,
    Activity, Hash, Cpu
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum, maskTokenHash } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';
import usePremiumStatus from '../../hooks/usePremiumStatus.js';

// ─── Design Tokens (same system as other pages) ───────────────────────────────
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
};

// ─── Constants (unchanged) ────────────────────────────────────────────────────
const RESULTS = ['ALL', 'SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];

const RESULT_STYLE = {
    SUCCESS:      { className: 'bg-emerald-50 text-emerald-700',  Icon: CheckCircle },
    INVALID:      { className: 'bg-red-50 text-red-700',          Icon: XCircle },
    REVOKED:      { className: 'bg-red-50 text-red-700',          Icon: XCircle },
    EXPIRED:      { className: 'bg-amber-50 text-amber-700',      Icon: Clock },
    RATE_LIMITED: { className: 'bg-amber-100 text-amber-900',     Icon: Clock },
    ERROR:        { className: 'bg-red-50 text-red-700',          Icon: XCircle },
};

// ─── Mock Data (unchanged) ────────────────────────────────────────────────────
const STATS_TODAY = {
    total: 312,
    success: 289,
    failed: 23,
    avgResponse: '142ms',
};

const MOCK_SCANS = Array.from({ length: 40 }, (_, i) => ({
    id: `scan-${i + 1}`,
    token_hash: `B${Math.random().toString(36).slice(2, 16).toUpperCase()}`,
    result: RESULTS.slice(1)[i % 6],
    student_name: i % 8 !== 0 ? ['Aarav Sharma', 'Priya Patel', 'Rohit Singh', 'Sneha Gupta', 'Karan Kumar', 'Divya Joshi', 'Arjun Verma', 'Meera Shah', 'Vikram Mehta', 'Ananya Reddy'][i % 10] : null,
    ip_address: `103.${21 + (i % 5)}.${58 + (i % 3)}.${i + 1}`,
    ip_city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'][i % 6],
    device: ['Chrome/Android', 'Safari/iOS', 'Chrome/Windows', 'Firefox/Linux'][i % 4],
    scan_purpose: ['EMERGENCY', 'REGISTRATION', 'UNKNOWN'][i % 3],
    response_time_ms: 80 + (i * 13) % 400,
    created_at: new Date(Date.now() - i * 1800000).toISOString(),
}));

const TABLE_HEADERS = ['Time', 'Result', 'Student', 'Token', 'Location', 'Device', 'Response'];
const PAGE_SIZE = 15;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ScanLogs() {
    const isPremium = usePremiumStatus();

    const [resultFilter, setResultFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = MOCK_SCANS.filter(s => {
        const matchResult = resultFilter === 'ALL' || s.result === resultFilter;
        const matchSearch = !debouncedSearch ||
            (s.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.ip_city.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchResult && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── Basic plan locked placeholder ────────────────────────────────────────
    if (!isPremium) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div
                    className="bg-white rounded-xl border border-dashed border-slate-300 p-10 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
                    style={{ minHeight: '320px' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-60" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Lock size={28} className="text-slate-400" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Scan Logs Locked</h2>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                            Real‑time log of all QR code scan events is available on the Premium plan.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Premium full view ────────────────────────────────────────────────────
    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scan Logs</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Real‑time log of all QR code scan events for your school
                </p>
            </div>

            {/* ── Today Stats ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: "Today's Scans", value: STATS_TODAY.total.toLocaleString('en-IN'), Icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Successful',    value: STATS_TODAY.success.toLocaleString('en-IN'), Icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: 'Failed',        value: STATS_TODAY.failed.toLocaleString('en-IN'),  Icon: XCircle,     color: 'text-red-600', bg: 'bg-red-100' },
                    { label: 'Avg Response',  value: STATS_TODAY.avgResponse,                   Icon: Cpu,         color: 'text-amber-600', bg: 'bg-amber-100' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow gap-1">
                        <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-1`}>
                            <stat.Icon size={18} className={stat.color} />
                        </div>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Filters & Search ─────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Result filter buttons */}
                    <div className="flex flex-wrap gap-1.5">
                        {RESULTS.map(r => (
                            <button
                                key={r}
                                onClick={() => { setResultFilter(r); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                                    resultFilter === r
                                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {r === 'ALL' ? 'All Results' : humanizeEnum(r)}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative ml-auto min-w-[200px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search student, city, token..."
                            className="w-full py-2 pl-10 pr-4 border border-slate-200 rounded-xl text-sm outline-none bg-slate-50 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
                        />
                        {search && (
                            <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <XCircle size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Table ──────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {TABLE_HEADERS.map(h => (
                                <th
                                    key={h}
                                    className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center">
                                    <ScanLine size={48} className="text-slate-300 mx-auto mb-4" />
                                    <h3 className="font-semibold text-slate-700 mb-1">No scan logs found</h3>
                                    <p className="text-sm text-slate-500">Try adjusting your filters</p>
                                </td>
                            </tr>
                        ) : paginated.map((scan, idx) => {
                            const s = RESULT_STYLE[scan.result] || RESULT_STYLE.ERROR;
                            return (
                                <tr
                                    key={scan.id}
                                    className={`transition-colors hover:bg-slate-50 ${
                                        idx < paginated.length - 1 ? 'border-b border-slate-100' : ''
                                    }`}
                                >
                                    {/* Time */}
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-slate-800 whitespace-nowrap">
                                            {formatRelativeTime(scan.created_at)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>

                                    {/* Result badge */}
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.className}`}>
                                            <s.Icon size={11} />
                                            {humanizeEnum(scan.result)}
                                        </span>
                                    </td>

                                    {/* Student */}
                                    <td className={`px-4 py-3 text-sm ${scan.student_name ? 'text-slate-800 font-medium' : 'text-slate-400 italic'}`}>
                                        {scan.student_name || 'Unknown'}
                                    </td>

                                    {/* Token */}
                                    <td className="px-4 py-3">
                                        <code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700">
                                            {maskTokenHash(scan.token_hash)}
                                        </code>
                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                                            <MapPin size={12} className="text-slate-400" />
                                            {scan.ip_city}
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">{scan.ip_address}</div>
                                    </td>

                                    {/* Device */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Monitor size={12} />
                                            <span>{scan.device.split('/')[0]}</span>
                                        </div>
                                        <div className="text-xs text-slate-400">{scan.device.split('/')[1]}</div>
                                    </td>

                                    {/* Response time */}
                                    <td className="px-4 py-3">
                                        <span className={`font-mono text-sm font-semibold ${
                                            scan.response_time_ms > 300 ? 'text-amber-600' : 'text-emerald-600'
                                        }`}>
                                            {scan.response_time_ms}ms
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3.5 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                        p === page
                                            ? 'bg-brand-600 text-white shadow-md'
                                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}