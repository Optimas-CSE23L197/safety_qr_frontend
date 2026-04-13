import { useState } from 'react';
import { Search, ScanLine, CheckCircle, XCircle, Clock, MapPin, Monitor } from 'lucide-react';
import { formatDateTime, formatRelativeTime, humanizeEnum, maskTokenHash } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const RESULTS = ['ALL', 'SUCCESS', 'INVALID', 'REVOKED', 'EXPIRED', 'RATE_LIMITED', 'ERROR'];
const RESULT_STYLE = {
    SUCCESS: { bg: '#ECFDF5', color: '#047857', Icon: CheckCircle },
    INVALID: { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
    REVOKED: { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
    EXPIRED: { bg: '#FFFBEB', color: '#B45309', Icon: Clock },
    RATE_LIMITED: { bg: '#FEF3C7', color: '#92400E', Icon: Clock },
    ERROR: { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle },
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

const STATS_TODAY = {
    total: 312,
    success: 289,
    failed: 23,
    avgResponse: '142ms',
};

export default function ScanLogs() {
    const [resultFilter, setResultFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);
    const PAGE_SIZE = 15;

    const filtered = MOCK_SCANS.filter(s => {
        const matchResult = resultFilter === 'ALL' || s.result === resultFilter;
        const matchSearch = !debouncedSearch ||
            (s.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.ip_city.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchResult && matchSearch;
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Scan Logs</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Real-time log of all QR code scan events</p>
            </div>

            {/* Today stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
                {[['Today\'s Scans', STATS_TODAY.total, '#2563EB', '#EFF6FF'], ['Successful', STATS_TODAY.success, '#10B981', '#ECFDF5'], ['Failed', STATS_TODAY.failed, '#EF4444', '#FEF2F2'], ['Avg Response', STATS_TODAY.avgResponse, '#F59E0B', '#FFFBEB']].map(([label, val, color, bg]) => (
                    <div key={label} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '18px 20px', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color }}>
                            {typeof val === 'number' ? val.toLocaleString('en-IN') : val}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {RESULTS.map(r => (
                        <button key={r} onClick={() => { setResultFilter(r); setPage(1); }} style={{ padding: '6px 13px', borderRadius: '7px', border: '1px solid', borderColor: resultFilter === r ? 'var(--color-brand-500)' : 'var(--border-default)', background: resultFilter === r ? 'var(--color-brand-600)' : 'white', color: resultFilter === r ? 'white' : 'var(--text-secondary)', fontWeight: resultFilter === r ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>
                            {r === 'ALL' ? 'All Results' : humanizeEnum(r)}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search student, city, token..." style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '220px' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                            {['Time', 'Result', 'Student', 'Token', 'Location', 'Device', 'Response'].map(h => (
                                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <ScanLine size={36} style={{ marginBottom: '12px', opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                                <div style={{ fontWeight: 500 }}>No scan logs found</div>
                            </td></tr>
                        ) : paginated.map((scan, idx) => {
                            const s = RESULT_STYLE[scan.result] || RESULT_STYLE.ERROR;
                            return (
                                <tr key={scan.id} style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{formatRelativeTime(scan.created_at)}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(scan.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color }}>
                                            <s.Icon size={11} />{humanizeEnum(scan.result)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: scan.student_name ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: scan.student_name ? 500 : 400 }}>
                                        {scan.student_name || 'Unknown'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', background: 'var(--color-slate-100)', padding: '2px 7px', borderRadius: '4px' }}>
                                            {maskTokenHash(scan.token_hash)}
                                        </code>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={12} color="var(--text-muted)" />{scan.ip_city}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{scan.ip_address}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <Monitor size={12} />{scan.device.split('/')[0]}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{scan.device.split('/')[1]}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: scan.response_time_ms > 300 ? '#B45309' : 'var(--color-success-600)', fontWeight: 600 }}>
                                            {scan.response_time_ms}ms
                                        </span>
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
