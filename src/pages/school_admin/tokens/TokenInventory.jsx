import { useState } from 'react';
import { Search, Plus, RefreshCw, XCircle, Cpu, Filter, Download } from 'lucide-react';
import { maskTokenHash, formatDate, formatRelativeTime, humanizeEnum, formatCompact } from '../../../utils/formatters.js';
import useDebounce from '../../../hooks/useDebounce.js';
import useAuth from '../../../hooks/useAuth.js';

const STATUSES = ['ALL', 'ACTIVE', 'UNASSIGNED', 'ISSUED', 'EXPIRED', 'REVOKED', 'INACTIVE'];
const STATUS_STYLE = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857' },
    UNASSIGNED: { bg: '#F1F5F9', color: '#475569' },
    ISSUED: { bg: '#E0F2FE', color: '#0369A1' },
    EXPIRED: { bg: '#FFFBEB', color: '#B45309' },
    REVOKED: { bg: '#FEF2F2', color: '#B91C1C' },
    INACTIVE: { bg: '#F8FAFC', color: '#94A3B8' },
};

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
    ACTIVE: MOCK_TOKENS.filter(t => t.status === 'ACTIVE').length,
    UNASSIGNED: MOCK_TOKENS.filter(t => t.status === 'UNASSIGNED').length,
    EXPIRED: MOCK_TOKENS.filter(t => t.status === 'EXPIRED').length,
    REVOKED: MOCK_TOKENS.filter(t => t.status === 'REVOKED').length,
};

const CreateBatchModal = ({ onClose }) => {
    const [count, setCount] = useState(10);
    const [notes, setNotes] = useState('');
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '420px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 20px' }}>Generate Token Batch</h3>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Number of Tokens (1–500)</label>
                <input type="number" value={count} onChange={e => setCount(Math.min(500, Math.max(1, +e.target.value)))} min={1} max={500} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Notes (optional)</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Batch for Class 10 students" style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', marginBottom: '24px', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Generate {count} Tokens</button>
                </div>
            </div>
        </div>
    );
};

export default function TokenInventory() {
    const { can } = useAuth();
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);
    const PAGE_SIZE = 12;

    const filtered = MOCK_TOKENS.filter(t => {
        const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchSearch = !debouncedSearch || t.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase()) || (t.student_name || '').toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div style={{ maxWidth: '1200px' }}>
            {showBatchModal && <CreateBatchModal onClose={() => setShowBatchModal(false)} />}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Token Inventory</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Manage and track all student ID tokens</p>
                </div>
                {can('tokens.createBatch') && (
                    <button onClick={() => setShowBatchModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '8px', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                        <Plus size={16} /> Generate Batch
                    </button>
                )}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
                {[['Active', STATS.ACTIVE, '#10B981', '#ECFDF5'], ['Unassigned', STATS.UNASSIGNED, '#64748B', '#F1F5F9'], ['Expired', STATS.EXPIRED, '#F59E0B', '#FFFBEB'], ['Revoked', STATS.REVOKED, '#EF4444', '#FEF2F2']].map(([label, val, color, bg]) => (
                    <div key={label} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '18px 20px', boxShadow: 'var(--shadow-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{val}</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Cpu size={20} color={color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter + Search */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{ padding: '6px 13px', borderRadius: '7px', border: '1px solid', borderColor: statusFilter === s ? 'var(--color-brand-500)' : 'var(--border-default)', background: statusFilter === s ? 'var(--color-brand-600)' : 'white', color: statusFilter === s ? 'white' : 'var(--text-secondary)', fontWeight: statusFilter === s ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>
                            {s === 'ALL' ? 'All' : humanizeEnum(s)}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search hash or student..." style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '220px', fontFamily: 'var(--font-body)' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                            {['Token Hash', 'Status', 'Assigned To', 'Assigned', 'Expires', 'Batch'].map(h => (
                                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Cpu size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                <div style={{ fontWeight: 500 }}>No tokens found</div>
                            </td></tr>
                        ) : paginated.map((token, idx) => {
                            const s = STATUS_STYLE[token.status] || STATUS_STYLE.UNASSIGNED;
                            const isExpiringSoon = new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000) && new Date(token.expires_at) > new Date();
                            return (
                                <tr key={token.id} style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '13px 16px' }}>
                                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', background: 'var(--color-slate-100)', padding: '3px 8px', borderRadius: '5px', color: 'var(--text-primary)' }}>
                                            {maskTokenHash(token.token_hash)}
                                        </code>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color }}>{humanizeEnum(token.status)}</span>
                                    </td>
                                    <td style={{ padding: '13px 16px', fontSize: '0.875rem', color: token.student_name ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                        {token.student_name || '—'}
                                    </td>
                                    <td style={{ padding: '13px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                        {token.assigned_at ? formatRelativeTime(token.assigned_at) : '—'}
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ fontSize: '0.8125rem', color: isExpiringSoon ? '#B45309' : 'var(--text-muted)', fontWeight: isExpiringSoon ? 600 : 400 }}>
                                            {isExpiringSoon && '⚠ '}{formatDate(token.expires_at)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{token.batch_id}</code>
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
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid', borderColor: p === page ? 'var(--color-brand-500)' : 'var(--border-default)', background: p === page ? 'var(--color-brand-600)' : 'white', color: p === page ? 'white' : 'var(--text-secondary)', fontWeight: p === page ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>{p}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}