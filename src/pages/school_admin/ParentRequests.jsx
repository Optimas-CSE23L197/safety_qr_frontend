import { useState } from 'react';
import { CheckCircle, XCircle, Clock, ChevronDown, Search, ClipboardList } from 'lucide-react';
import { getInitials, formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_REQUESTS = [
    { id: 'r1', student_name: 'Aarav Sharma',  student_class: 'Class 9 – A',  parent_name: 'Suresh Sharma', parent_phone: '+91 98765 43210', relationship: 'Father', changes: { photo_url: 'Updated photo' },                  status: 'PENDING',  created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'r2', student_name: 'Priya Patel',   student_class: 'Class 8 – B',  parent_name: 'Meena Patel',   parent_phone: '+91 99887 76655', relationship: 'Mother', changes: { first_name: 'Priyanka', last_name: 'Patel' },   status: 'PENDING',  created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
    { id: 'r3', student_name: 'Rohit Singh',   student_class: 'Class 10 – C', parent_name: 'Ramesh Singh',  parent_phone: '+91 91234 56789', relationship: 'Father', changes: { class: 'Class 11', section: 'A' },             status: 'APPROVED', created_at: new Date(Date.now() - 86400000 * 1).toISOString(),   reviewed_at: new Date(Date.now() - 3600000 * 20).toISOString() },
    { id: 'r4', student_name: 'Sneha Gupta',   student_class: 'Class 7 – D',  parent_name: 'Kavita Gupta',  parent_phone: '+91 98123 45678', relationship: 'Mother', changes: { dob: '2011-03-15' },                           status: 'REJECTED', reject_reason: 'Date of birth does not match school records.', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), reviewed_at: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'r5', student_name: 'Karan Kumar',   student_class: 'Class 11 – A', parent_name: 'Anil Kumar',    parent_phone: '+91 87654 32109', relationship: 'Father', changes: { photo_url: 'New photo', section: 'B' },         status: 'PENDING',  created_at: new Date(Date.now() - 3600000 * 8).toISOString() },
    { id: 'r6', student_name: 'Divya Joshi',   student_class: 'Class 6 – B',  parent_name: 'Sunita Joshi',  parent_phone: '+91 76543 21098', relationship: 'Mother', changes: { first_name: 'Divyanka' },                      status: 'PENDING',  created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
];

// ── Status style map ──────────────────────────────────────────────────────────
const STATUS_STYLE = {
    PENDING:  { badgeClass: 'bg-amber-50 text-amber-700',   label: 'Pending',  Icon: Clock },
    APPROVED: { badgeClass: 'bg-emerald-50 text-emerald-700', label: 'Approved', Icon: CheckCircle },
    REJECTED: { badgeClass: 'bg-red-50 text-red-700',       label: 'Rejected', Icon: XCircle },
};

// ── Reject Modal ──────────────────────────────────────────────────────────────
const RejectModal = ({ request, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const canSubmit = reason.trim().length > 0;
    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl p-7 max-w-[440px] w-full shadow-[0_25px_50px_rgba(0,0,0,0.2)]">
                <h3 className="font-display text-lg font-bold text-slate-900 m-0 mb-2">
                    Reject Request
                </h3>
                <p className="text-slate-400 text-sm mb-5">
                    Provide a reason for rejecting{' '}
                    <strong className="text-slate-700">{request.parent_name}</strong>'s update request.
                </p>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="e.g. Information does not match school records..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-y outline-none font-body focus:border-blue-500 transition-colors duration-100"
                />
                <div className="flex gap-2.5 mt-5 justify-end">
                    <button
                        onClick={onClose}
                        className="px-[18px] py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors duration-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={!canSubmit}
                        className={[
                            'px-[18px] py-2 rounded-lg border-0 text-white text-sm font-semibold transition-colors duration-100',
                            canSubmit ? 'bg-red-600 cursor-pointer hover:bg-red-700' : 'bg-red-300 cursor-not-allowed',
                        ].join(' ')}
                    >
                        Reject Request
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function ParentRequests() {
    const { can } = useAuth();
    const [requests, setRequests]       = useState(MOCK_REQUESTS);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch]           = useState('');
    const [rejectingId, setRejectingId] = useState(null);
    const [expandedId, setExpandedId]   = useState(null);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = requests.filter(r => {
        const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
        const matchSearch = !debouncedSearch ||
            r.student_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            r.parent_name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchStatus && matchSearch;
    });

    const counts = {
        ALL:      requests.length,
        PENDING:  requests.filter(r => r.status === 'PENDING').length,
        APPROVED: requests.filter(r => r.status === 'APPROVED').length,
        REJECTED: requests.filter(r => r.status === 'REJECTED').length,
    };

    const approve = (id) =>
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED', reviewed_at: new Date().toISOString() } : r));

    const reject = (id, reason) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', reject_reason: reason, reviewed_at: new Date().toISOString() } : r));
        setRejectingId(null);
    };

    const rejectingReq = requests.find(r => r.id === rejectingId);

    return (
        <div className="max-w-[960px]">
            {rejectingReq && (
                <RejectModal
                    request={rejectingReq}
                    onClose={() => setRejectingId(null)}
                    onConfirm={(reason) => reject(rejectingId, reason)}
                />
            )}

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="mb-6">
                <h2 className="font-display text-[1.375rem] font-bold text-slate-900 m-0">
                    Parent Requests
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    Review and action student update requests from parents
                </p>
            </div>

            {/* ── Tab filters + search ──────────────────────────────────────── */}
            <div className="flex gap-2 mb-5 flex-wrap items-center">
                {Object.entries(counts).map(([key, count]) => {
                    const active = statusFilter === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key)}
                            className={[
                                'flex items-center gap-1.5 px-4 py-[7px] rounded-lg border text-sm cursor-pointer transition-colors duration-100',
                                active
                                    ? 'border-blue-500 bg-blue-700 text-white font-bold'
                                    : 'border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {key === 'ALL' ? 'All' : humanizeEnum(key)}
                            <span className={`rounded-full px-[7px] text-xs font-bold ${active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}

                {/* Search */}
                <div className="ml-auto relative">
                    <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search student or parent..."
                        className="pl-8 pr-3 py-[7px] border border-slate-200 rounded-lg text-sm outline-none w-[220px] font-body focus:border-blue-500 transition-colors duration-100"
                    />
                </div>
            </div>

            {/* ── Request cards ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-[60px] text-center text-slate-400">
                        <ClipboardList size={36} className="opacity-30 mx-auto mb-3" />
                        <div className="font-medium">No requests found</div>
                    </div>
                ) : filtered.map(req => {
                    const s          = STATUS_STYLE[req.status];
                    const isExpanded = expandedId === req.id;
                    return (
                        <div
                            key={req.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-[var(--shadow-card)] overflow-hidden"
                        >
                            <div className="px-5 py-[18px]">
                                <div className="flex items-start gap-3.5">

                                    {/* Avatar */}
                                    <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center font-display font-bold text-sm text-blue-800 shrink-0">
                                        {getInitials(req.student_name)}
                                    </div>

                                    {/* Body */}
                                    <div className="flex-1 min-w-0">
                                        {/* Name + class + status */}
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="font-bold text-[0.9375rem] text-slate-900">
                                                {req.student_name}
                                            </span>
                                            <span className="text-[0.8125rem] text-slate-400">
                                                {req.student_class}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-xs font-semibold ${s.badgeClass}`}>
                                                <s.Icon size={11} /> {s.label}
                                            </span>
                                        </div>

                                        {/* Parent info */}
                                        <div className="mt-1 text-[0.8125rem] text-slate-400">
                                            Requested by{' '}
                                            <strong className="text-slate-600">{req.parent_name}</strong>{' '}
                                            ({req.relationship}) · {req.parent_phone} · {formatRelativeTime(req.created_at)}
                                        </div>

                                        {/* Changes chips */}
                                        <div className="mt-2.5 flex gap-1.5 flex-wrap">
                                            {Object.entries(req.changes).map(([key, val]) => (
                                                <span
                                                    key={key}
                                                    className="px-2.5 py-[3px] bg-slate-100 rounded-md text-xs text-slate-600 font-mono"
                                                >
                                                    {humanizeEnum(key)}: <strong>{String(val)}</strong>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {req.status === 'PENDING' && can('parentRequests.approve') && (
                                            <>
                                                <button
                                                    onClick={() => approve(req.id)}
                                                    className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[7px] border border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold text-[0.8125rem] cursor-pointer hover:bg-emerald-100 transition-colors duration-100"
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => setRejectingId(req.id)}
                                                    className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[7px] border border-red-400 bg-red-50 text-red-700 font-semibold text-[0.8125rem] cursor-pointer hover:bg-red-100 transition-colors duration-100"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </>
                                        )}

                                        {req.status !== 'PENDING' && req.reviewed_at && (
                                            <span className="text-xs text-slate-400 self-center">
                                                Reviewed {formatRelativeTime(req.reviewed_at)}
                                            </span>
                                        )}

                                        {/* Expand toggle */}
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                            className="w-8 h-8 rounded-[7px] border border-slate-200 bg-white flex items-center justify-center cursor-pointer text-slate-400 hover:bg-slate-50 transition-colors duration-100"
                                        >
                                            <ChevronDown
                                                size={15}
                                                className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Rejection reason */}
                                {req.status === 'REJECTED' && req.reject_reason && (
                                    <div className="mt-3 px-3.5 py-2.5 bg-red-50 rounded-lg text-[0.8125rem] text-red-800 border-l-[3px] border-red-500">
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