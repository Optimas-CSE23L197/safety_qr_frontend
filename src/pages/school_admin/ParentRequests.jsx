import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, ChevronDown, Search, ClipboardList } from 'lucide-react';
import { getFullName, getInitials, formatRelativeTime, formatDateTime, humanizeEnum } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';

const MOCK_REQUESTS = [
    { id: 'r1', student_name: 'Aarav Sharma', student_class: 'Class 9 – A', parent_name: 'Suresh Sharma', parent_phone: '+91 98765 43210', relationship: 'Father', changes: { photo_url: 'Updated photo' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'r2', student_name: 'Priya Patel', student_class: 'Class 8 – B', parent_name: 'Meena Patel', parent_phone: '+91 99887 76655', relationship: 'Mother', changes: { first_name: 'Priyanka', last_name: 'Patel' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 'r3', student_name: 'Rohit Singh', student_class: 'Class 10 – C', parent_name: 'Ramesh Singh', parent_phone: '+91 91234 56789', relationship: 'Father', changes: { class: 'Class 11', section: 'A' }, status: 'APPROVED', created_at: new Date(Date.now() - 86400000 * 1).toISOString(), reviewed_at: new Date(Date.now() - 3600000 * 20).toISOString() },
    { id: 'r4', student_name: 'Sneha Gupta', student_class: 'Class 7 – D', parent_name: 'Kavita Gupta', parent_phone: '+91 98123 45678', relationship: 'Mother', changes: { dob: '2011-03-15' }, status: 'REJECTED', reject_reason: 'Date of birth does not match school records.', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), reviewed_at: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'r5', student_name: 'Karan Kumar', student_class: 'Class 11 – A', parent_name: 'Anil Kumar', parent_phone: '+91 87654 32109', relationship: 'Father', changes: { photo_url: 'New photo', section: 'B' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
    { id: 'r6', student_name: 'Divya Joshi', student_class: 'Class 6 – B', parent_name: 'Sunita Joshi', parent_phone: '+91 76543 21098', relationship: 'Mother', changes: { first_name: 'Divyanka' }, status: 'PENDING', created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
];

const STATUS_STYLE = {
    PENDING: { bg: '#FFFBEB', color: '#B45309', label: 'Pending', Icon: Clock },
    APPROVED: { bg: '#ECFDF5', color: '#047857', label: 'Approved', Icon: CheckCircle },
    REJECTED: { bg: '#FEF2F2', color: '#B91C1C', label: 'Rejected', Icon: XCircle },
};

const RejectModal = ({ request, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 8px' }}>Reject Request</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>Provide a reason for rejecting <strong>{request.parent_name}</strong>'s update request.</p>
                <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Information does not match school records..." rows={3}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={() => onConfirm(reason)} disabled={!reason.trim()} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: reason.trim() ? '#DC2626' : '#FCA5A5', color: 'white', cursor: reason.trim() ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Reject Request</button>
                </div>
            </div>
        </div>
    );
};

export default function ParentRequests() {
    const { can } = useAuth();
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [rejectingId, setRejectingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = requests.filter(r => {
        const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
        const matchSearch = !debouncedSearch || r.student_name.toLowerCase().includes(debouncedSearch.toLowerCase()) || r.parent_name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = { ALL: requests.length, PENDING: requests.filter(r => r.status === 'PENDING').length, APPROVED: requests.filter(r => r.status === 'APPROVED').length, REJECTED: requests.filter(r => r.status === 'REJECTED').length };

    const approve = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', reviewed_at: new Date().toISOString() } : r));
    const reject = (id, reason) => { setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', reject_reason: reason, reviewed_at: new Date().toISOString() } : r)); setRejectingId(null); };

    const rejectingReq = requests.find(r => r.id === rejectingId);

    return (
        <div style={{ maxWidth: '960px' }}>
            {rejectingReq && <RejectModal request={rejectingReq} onClose={() => setRejectingId(null)} onConfirm={(reason) => reject(rejectingId, reason)} />}

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Parent Requests</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Review and action student update requests from parents</p>
            </div>

            {/* Tab filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {Object.entries(counts).map(([key, count]) => (
                    <button key={key} onClick={() => setStatusFilter(key)} style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid', borderColor: statusFilter === key ? 'var(--color-brand-500)' : 'var(--border-default)', background: statusFilter === key ? 'var(--color-brand-600)' : 'white', color: statusFilter === key ? 'white' : 'var(--text-secondary)', fontWeight: statusFilter === key ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {key === 'ALL' ? 'All' : humanizeEnum(key)}
                        <span style={{ background: statusFilter === key ? 'rgba(255,255,255,0.25)' : 'var(--color-slate-100)', color: statusFilter === key ? 'white' : 'var(--text-muted)', borderRadius: '9999px', padding: '0 7px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or parent..." style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '220px', fontFamily: 'var(--font-body)' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                </div>
            </div>

            {/* Request Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <ClipboardList size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <div style={{ fontWeight: 500 }}>No requests found</div>
                    </div>
                ) : filtered.map(req => {
                    const s = STATUS_STYLE[req.status];
                    const isExpanded = expandedId === req.id;
                    const changeEntries = Object.entries(req.changes);
                    return (
                        <div key={req.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                            <div style={{ padding: '18px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    {/* Avatar */}
                                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-brand-700)', flexShrink: 0 }}>
                                        {getInitials(req.student_name)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{req.student_name}</span>
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{req.student_class}</span>
                                            <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <s.Icon size={11} /> {s.label}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: '4px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                            Requested by <strong style={{ color: 'var(--text-secondary)' }}>{req.parent_name}</strong> ({req.relationship}) · {req.parent_phone} · {formatRelativeTime(req.created_at)}
                                        </div>
                                        {/* Changes summary */}
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {changeEntries.map(([key, val]) => (
                                                <span key={key} style={{ padding: '3px 10px', background: 'var(--color-slate-100)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                                                    {humanizeEnum(key)}: <strong>{String(val)}</strong>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        {req.status === 'PENDING' && can('parentRequests.approve') && <>
                                            <button onClick={() => approve(req.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', border: '1px solid #10B981', background: '#ECFDF5', color: '#047857', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#D1FAE5'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#ECFDF5'}>
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button onClick={() => setRejectingId(req.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', border: '1px solid #EF4444', background: '#FEF2F2', color: '#B91C1C', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}>
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </>}
                                        {req.status !== 'PENDING' && req.reviewed_at && (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Reviewed {formatRelativeTime(req.reviewed_at)}</span>
                                        )}
                                        <button onClick={() => setExpandedId(isExpanded ? null : req.id)} style={{ width: '32px', height: '32px', borderRadius: '7px', border: '1px solid var(--border-default)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <ChevronDown size={15} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                                        </button>
                                    </div>
                                </div>
                                {/* Rejection reason */}
                                {req.status === 'REJECTED' && req.reject_reason && (
                                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FEF2F2', borderRadius: '8px', fontSize: '0.8125rem', color: '#991B1B', borderLeft: '3px solid #EF4444' }}>
                                        <strong>Rejection reason:</strong> {req.reject_reason}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}