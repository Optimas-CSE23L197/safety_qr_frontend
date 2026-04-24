import { useState } from 'react';
import { Search, ScanLine, CheckCircle, XCircle, Clock, MapPin, Monitor } from 'lucide-react';
import { formatRelativeTime, humanizeEnum, maskTokenHash } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const RESULTS = ['ALL', 'SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];

const RESULT_STYLE = {
    SUCCESS:      { className: 'bg-emerald-50 text-emerald-700',  Icon: CheckCircle },
    INVALID:      { className: 'bg-red-50 text-red-700',          Icon: XCircle },
    REVOKED:      { className: 'bg-red-50 text-red-700',          Icon: XCircle },
    EXPIRED:      { className: 'bg-amber-50 text-amber-700',      Icon: Clock },
    RATE_LIMITED: { className: 'bg-amber-100 text-amber-900',     Icon: Clock },
    ERROR:        { className: 'bg-red-50 text-red-700',          Icon: XCircle },
};

const STATS_TODAY = {
    total: 312,
    success: 289,
    failed: 23,
    avgResponse: '142ms',
};

const STAT_CARDS = [
    { label: "Today's Scans", key: 'total',      colorClass: 'text-blue-600' },
    { label: 'Successful',    key: 'success',     colorClass: 'text-emerald-600' },
    { label: 'Failed',        key: 'failed',      colorClass: 'text-red-500' },
    { label: 'Avg Response',  key: 'avgResponse', colorClass: 'text-amber-500' },
];

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

export default function ScanLogs() {
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

    return (
        <div className="max-w-[1200px]">

            {/* ── Page heading ─────────────────────────────────────────── */}
            <div className="mb-6">
                <h2 className="font-display text-[1.375rem] font-bold text-slate-900 m-0">
                    Scan Logs
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Real-time log of all QR code scan events
                </p>
            </div>

            {/* ── Today stats ──────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-3.5 mb-6">
                {STAT_CARDS.map(({ label, key, colorClass }) => (
                    <div
                        key={label}
                        className="bg-white rounded-xl border border-slate-200 px-5 py-[18px] shadow-[var(--shadow-card)]"
                    >
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-[0.05em] mb-1.5">
                            {label}
                        </div>
                        <div className={`font-display text-[1.75rem] font-bold ${colorClass}`}>
                            {typeof STATS_TODAY[key] === 'number'
                                ? STATS_TODAY[key].toLocaleString('en-IN')
                                : STATS_TODAY[key]}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters ──────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex gap-3 items-center flex-wrap shadow-[var(--shadow-card)]">
                <div className="flex gap-1.5 flex-wrap">
                    {RESULTS.map(r => (
                        <button
                            key={r}
                            onClick={() => { setResultFilter(r); setPage(1); }}
                            className={[
                                'px-[13px] py-1.5 rounded-[7px] border text-[0.8125rem] cursor-pointer transition-colors duration-100',
                                resultFilter === r
                                    ? 'border-blue-600 bg-blue-700 text-white font-bold'
                                    : 'border-slate-200 bg-white text-slate-600 font-normal hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {r === 'ALL' ? 'All Results' : humanizeEnum(r)}
                        </button>
                    ))}
                </div>

                {/* Search input */}
                <div className="ml-auto relative">
                    <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search student, city, token..."
                        className="pl-8 pr-3 py-[7px] border border-slate-200 rounded-lg text-sm outline-none w-[220px] focus:border-blue-600 transition-colors duration-100"
                    />
                </div>
            </div>

            {/* ── Table ────────────────────────────────────────────────── */}
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
                                <td colSpan={7} className="p-[60px] text-center text-slate-400">
                                    <ScanLine size={36} className="opacity-30 mx-auto mb-3" />
                                    <div className="font-medium">No scan logs found</div>
                                </td>
                            </tr>
                        ) : paginated.map((scan, idx) => {
                            const s = RESULT_STYLE[scan.result] || RESULT_STYLE.ERROR;
                            return (
                                <tr
                                    key={scan.id}
                                    className={[
                                        'transition-colors duration-100 hover:bg-slate-50',
                                        idx < paginated.length - 1 ? 'border-b border-slate-200' : '',
                                    ].join(' ')}
                                >
                                    {/* Time */}
                                    <td className="px-4 py-3">
                                        <div className="text-[0.8125rem] font-medium text-slate-900 whitespace-nowrap">
                                            {formatRelativeTime(scan.created_at)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>

                                    {/* Result badge */}
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-[5px] px-2.5 py-[3px] rounded-full text-xs font-semibold ${s.className}`}>
                                            <s.Icon size={11} />
                                            {humanizeEnum(scan.result)}
                                        </span>
                                    </td>

                                    {/* Student */}
                                    <td className={`px-4 py-3 text-sm ${scan.student_name ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'}`}>
                                        {scan.student_name || 'Unknown'}
                                    </td>

                                    {/* Token */}
                                    <td className="px-4 py-3">
                                        <code className="font-mono text-xs bg-slate-100 px-[7px] py-0.5 rounded">
                                            {maskTokenHash(scan.token_hash)}
                                        </code>
                                    </td>

                                    {/* Location */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-[5px] text-[0.8125rem] text-slate-600">
                                            <MapPin size={12} className="text-slate-400" />
                                            {scan.ip_city}
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono">{scan.ip_address}</div>
                                    </td>

                                    {/* Device */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-[5px] text-xs text-slate-400">
                                            <Monitor size={12} />
                                            {scan.device.split('/')[0]}
                                        </div>
                                        <div className="text-xs text-slate-400">{scan.device.split('/')[1]}</div>
                                    </td>

                                    {/* Response time */}
                                    <td className="px-4 py-3">
                                        <span className={`font-mono text-[0.8125rem] font-semibold ${scan.response_time_ms > 300 ? 'text-amber-700' : 'text-emerald-600'}`}>
                                            {scan.response_time_ms}ms
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* ── Pagination ───────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="px-4 py-3.5 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[0.8125rem] text-slate-400">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={[
                                        'w-8 h-8 rounded-md border text-[0.8125rem] cursor-pointer transition-colors duration-100',
                                        p === page
                                            ? 'border-blue-600 bg-blue-700 text-white font-bold'
                                            : 'border-slate-200 bg-white text-slate-600 font-normal hover:bg-slate-50',
                                    ].join(' ')}
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
