import { useState } from 'react';
import { AlertTriangle, CheckCircle, MapPin, Monitor, Shield, ShieldAlert } from 'lucide-react';
import { formatRelativeTime, formatDateTime, maskTokenHash } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';

// ── Anomaly type config ───────────────────────────────────────────────────────
const ANOMALY_TYPES = {
    FOREIGN_LOCATION: {
        label: 'Foreign Location',
        badgeClass:  'bg-red-50 text-red-700',
        iconBg:      'bg-red-50',
        borderColor: 'border-red-700/20',
        stripClass:  'bg-red-700',
        icon: '🌍',
    },
    MULTI_TOKEN_SINGLE_DEVICE: {
        label: 'Multi-Token Device',
        badgeClass:  'bg-amber-50 text-amber-900',
        iconBg:      'bg-amber-50',
        borderColor: 'border-amber-900/20',
        stripClass:  'bg-amber-800',
        icon: '📱',
    },
    HIGH_FREQUENCY: {
        label: 'High Frequency',
        badgeClass:  'bg-blue-50 text-blue-700',
        iconBg:      'bg-blue-50',
        borderColor: 'border-blue-700/20',
        stripClass:  'bg-blue-700',
        icon: '⚡',
    },
    AFTER_HOURS: {
        label: 'After Hours',
        badgeClass:  'bg-violet-50 text-violet-700',
        iconBg:      'bg-violet-50',
        borderColor: 'border-violet-700/20',
        stripClass:  'bg-violet-700',
        icon: '🌙',
    },
};

const FALLBACK_TYPE = {
    label: '',
    badgeClass:  'bg-slate-100 text-slate-600',
    iconBg:      'bg-slate-100',
    borderColor: 'border-slate-200',
    stripClass:  'bg-slate-300',
    icon: '⚠',
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_ANOMALIES = [
    { id: 'an1', type: 'FOREIGN_LOCATION',          student_name: 'Aarav Sharma', token_hash: 'A1B2C3D4E5F6', ip_city: 'Jaipur',  ip_address: '182.74.1.22',   device: 'Chrome/Android', created_at: new Date(Date.now() - 3600000 * 1).toISOString(),    resolved: false, notes: null },
    { id: 'an2', type: 'MULTI_TOKEN_SINGLE_DEVICE', student_name: 'Priya Patel',  token_hash: 'G7H8I9J0K1L2', ip_city: 'Mumbai',  ip_address: '103.21.58.14',  device: 'Safari/iOS',     created_at: new Date(Date.now() - 3600000 * 3).toISOString(),    resolved: false, notes: null },
    { id: 'an3', type: 'HIGH_FREQUENCY',            student_name: 'Rohit Singh',  token_hash: 'M3N4O5P6Q7R8', ip_city: 'Delhi',   ip_address: '49.36.89.100',  device: 'Chrome/Windows', created_at: new Date(Date.now() - 3600000 * 6).toISOString(),    resolved: false, notes: null },
    { id: 'an4', type: 'AFTER_HOURS',               student_name: 'Sneha Gupta',  token_hash: 'S9T0U1V2W3X4', ip_city: 'Pune',    ip_address: '117.96.44.201', device: 'Firefox/Linux',  created_at: new Date(Date.now() - 86400000 * 1).toISOString(),   resolved: true,  notes: 'Confirmed school event after hours.' },
    { id: 'an5', type: 'FOREIGN_LOCATION',          student_name: 'Karan Kumar',  token_hash: 'Y5Z6A7B8C9D0', ip_city: 'Kolkata', ip_address: '59.160.31.7',   device: 'Chrome/Android', created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(), resolved: true,  notes: 'Student on school trip.' },
    { id: 'an6', type: 'MULTI_TOKEN_SINGLE_DEVICE', student_name: 'Divya Joshi',  token_hash: 'E1F2G3H4I5J6', ip_city: 'Chennai', ip_address: '14.139.123.45', device: 'Chrome/iOS',     created_at: new Date(Date.now() - 86400000 * 2).toISOString(),   resolved: false, notes: null },
];

// ── Resolve Modal ─────────────────────────────────────────────────────────────
const ResolveModal = ({ anomaly, onClose, onConfirm }) => {
    const [notes, setNotes] = useState('');
    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl p-7 max-w-[440px] w-full shadow-[0_25px_50px_rgba(0,0,0,0.25)]">

                {/* Modal header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[10px] bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle size={20} className="text-emerald-500" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900 m-0">
                        Mark as Resolved
                    </h3>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                    Resolving anomaly for{' '}
                    <strong className="text-slate-700">{anomaly.student_name}</strong>.
                    Add a note explaining why this is not a concern.
                </p>

                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Student confirmed to be on school trip..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-y outline-none font-body focus:border-blue-500 transition-colors duration-100"
                />

                <div className="flex gap-2.5 mt-5 justify-end">
                    <button
                        onClick={onClose}
                        className="px-[18px] py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors duration-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(notes)}
                        className="px-[18px] py-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-semibold cursor-pointer hover:from-emerald-600 hover:to-emerald-700 transition-all duration-100 border-0"
                    >
                        Mark Resolved
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function Anomalies() {
    const { can } = useAuth();
    const [anomalies, setAnomalies]     = useState(MOCK_ANOMALIES);
    const [filter, setFilter]           = useState('UNRESOLVED');
    const [resolvingId, setResolvingId] = useState(null);

    const filtered         = anomalies.filter(a => filter === 'ALL' ? true : filter === 'UNRESOLVED' ? !a.resolved : a.resolved);
    const unresolved       = anomalies.filter(a => !a.resolved).length;
    const resolvingAnomaly = anomalies.find(a => a.id === resolvingId);

    const resolve = (id, notes) => {
        setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: true, notes } : a));
        setResolvingId(null);
    };

    const FILTER_TABS = [
        ['UNRESOLVED', `Unresolved (${unresolved})`],
        ['RESOLVED',   'Resolved'],
        ['ALL',        'All'],
    ];

    return (
        <div className="max-w-[1000px]">
            {resolvingAnomaly && (
                <ResolveModal
                    anomaly={resolvingAnomaly}
                    onClose={() => setResolvingId(null)}
                    onConfirm={(notes) => resolve(resolvingId, notes)}
                />
            )}

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-slate-900 m-0">
                        Scan Anomalies
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Flagged suspicious scan patterns requiring review
                    </p>
                </div>
                {unresolved > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-500">
                        <ShieldAlert size={16} className="text-red-700" />
                        <span className="font-bold text-red-700 text-sm">{unresolved} unresolved</span>
                    </div>
                )}
            </div>

            {/* ── Type legend ──────────────────────────────────────────────── */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {Object.entries(ANOMALY_TYPES).map(([key, { label, badgeClass, borderColor, icon }]) => (
                    <div
                        key={key}
                        className={`flex items-center gap-1.5 px-3 py-[5px] rounded-lg border ${badgeClass} ${borderColor}`}
                    >
                        <span className="text-[13px]">{icon}</span>
                        <span className="text-[0.8125rem] font-semibold">{label}</span>
                    </div>
                ))}
            </div>

            {/* ── Filter tabs ───────────────────────────────────────────────── */}
            <div className="flex gap-2 mb-5">
                {FILTER_TABS.map(([key, label]) => {
                    const active = filter === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={[
                                'px-4 py-[7px] rounded-lg border text-sm cursor-pointer transition-colors duration-100',
                                active
                                    ? 'border-blue-500 bg-blue-700 text-white font-bold'
                                    : 'border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* ── Anomaly cards ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-[60px] text-center text-slate-400 shadow-[var(--shadow-card)]">
                        <Shield size={36} className="opacity-30 mx-auto mb-3" />
                        <div className="font-semibold mb-1">All clear</div>
                        <div className="text-sm">No anomalies to review</div>
                    </div>
                ) : filtered.map(anomaly => {
                    const type = ANOMALY_TYPES[anomaly.type] || { ...FALLBACK_TYPE, label: anomaly.type };
                    return (
                        <div
                            key={anomaly.id}
                            className={[
                                'bg-white rounded-xl border shadow-[var(--shadow-card)] overflow-hidden',
                                anomaly.resolved ? 'border-slate-200 opacity-75' : 'border-red-200',
                            ].join(' ')}
                        >
                            {/* Colour strip */}
                            <div className={`h-1 ${anomaly.resolved ? 'bg-slate-200' : type.stripClass}`} />

                            <div className="px-5 py-[18px]">
                                <div className="flex items-start gap-3.5">

                                    {/* Type icon */}
                                    <div className={`w-11 h-11 rounded-xl ${type.iconBg} flex items-center justify-center text-xl shrink-0`}>
                                        {type.icon}
                                    </div>

                                    {/* Main content */}
                                    <div className="flex-1 min-w-0">

                                        {/* Name + status badges */}
                                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                                            <span className="font-bold text-[0.9375rem] text-slate-900">
                                                {anomaly.student_name}
                                            </span>
                                            <span className={`px-2.5 py-[3px] rounded-full text-xs font-semibold ${type.badgeClass}`}>
                                                {type.label}
                                            </span>
                                            {anomaly.resolved && (
                                                <span className="px-2.5 py-[3px] rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                                    ✓ Resolved
                                                </span>
                                            )}
                                        </div>

                                        {/* Timestamp */}
                                        <div className="text-[0.8125rem] text-slate-400 mb-3">
                                            {formatRelativeTime(anomaly.created_at)} · {formatDateTime(anomaly.created_at)}
                                        </div>

                                        {/* Detail row */}
                                        <div className="flex gap-5 flex-wrap">
                                            <div className="flex items-center gap-[5px] text-[0.8125rem] text-slate-600">
                                                <MapPin size={13} className="text-slate-400 shrink-0" />
                                                <span>{anomaly.ip_city}</span>
                                                <code className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-px rounded">
                                                    {anomaly.ip_address}
                                                </code>
                                            </div>
                                            <div className="flex items-center gap-[5px] text-[0.8125rem] text-slate-600">
                                                <Monitor size={13} className="text-slate-400 shrink-0" />
                                                <span>{anomaly.device}</span>
                                            </div>
                                            <div className="flex items-center gap-[5px] text-[0.8125rem] text-slate-600">
                                                <AlertTriangle size={13} className="text-slate-400 shrink-0" />
                                                <code className="font-mono text-xs text-slate-400 bg-slate-100 px-1.5 py-px rounded">
                                                    {maskTokenHash(anomaly.token_hash)}
                                                </code>
                                            </div>
                                        </div>

                                        {/* Resolution note */}
                                        {anomaly.notes && (
                                            <div className="mt-2.5 px-3 py-2 bg-emerald-50 rounded-[7px] text-[0.8125rem] text-emerald-700 border-l-[3px] border-emerald-500">
                                                <strong>Resolution note:</strong> {anomaly.notes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Resolve button */}
                                    {!anomaly.resolved && can('anomalies.resolve') && (
                                        <button
                                            onClick={() => setResolvingId(anomaly.id)}
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold text-[0.8125rem] cursor-pointer shrink-0 hover:bg-emerald-100 transition-colors duration-100"
                                        >
                                            <CheckCircle size={14} /> Resolve
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}