import { useState } from 'react';
import { AlertTriangle, CheckCircle, Eye, MapPin, Monitor, Shield, ShieldAlert } from 'lucide-react';
import { formatRelativeTime, formatDateTime, humanizeEnum, maskTokenHash } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';

const ANOMALY_TYPES = {
    FOREIGN_LOCATION: { label: 'Foreign Location', color: '#B91C1C', bg: '#FEF2F2', icon: '🌍' },
    MULTI_TOKEN_SINGLE_DEVICE: { label: 'Multi-Token Device', color: '#92400E', bg: '#FFFBEB', icon: '📱' },
    HIGH_FREQUENCY: { label: 'High Frequency', color: '#1D4ED8', bg: '#EFF6FF', icon: '⚡' },
    AFTER_HOURS: { label: 'After Hours', color: '#6D28D9', bg: '#F5F3FF', icon: '🌙' },
};

const MOCK_ANOMALIES = [
    { id: 'an1', type: 'FOREIGN_LOCATION', student_name: 'Aarav Sharma', token_hash: 'A1B2C3D4E5F6', ip_city: 'Jaipur', ip_address: '182.74.1.22', device: 'Chrome/Android', created_at: new Date(Date.now() - 3600000 * 1).toISOString(), resolved: false, notes: null },
    { id: 'an2', type: 'MULTI_TOKEN_SINGLE_DEVICE', student_name: 'Priya Patel', token_hash: 'G7H8I9J0K1L2', ip_city: 'Mumbai', ip_address: '103.21.58.14', device: 'Safari/iOS', created_at: new Date(Date.now() - 3600000 * 3).toISOString(), resolved: false, notes: null },
    { id: 'an3', type: 'HIGH_FREQUENCY', student_name: 'Rohit Singh', token_hash: 'M3N4O5P6Q7R8', ip_city: 'Delhi', ip_address: '49.36.89.100', device: 'Chrome/Windows', created_at: new Date(Date.now() - 3600000 * 6).toISOString(), resolved: false, notes: null },
    { id: 'an4', type: 'AFTER_HOURS', student_name: 'Sneha Gupta', token_hash: 'S9T0U1V2W3X4', ip_city: 'Pune', ip_address: '117.96.44.201', device: 'Firefox/Linux', created_at: new Date(Date.now() - 86400000 * 1).toISOString(), resolved: true, notes: 'Confirmed school event after hours.' },
    { id: 'an5', type: 'FOREIGN_LOCATION', student_name: 'Karan Kumar', token_hash: 'Y5Z6A7B8C9D0', ip_city: 'Kolkata', ip_address: '59.160.31.7', device: 'Chrome/Android', created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(), resolved: true, notes: 'Student on school trip.' },
    { id: 'an6', type: 'MULTI_TOKEN_SINGLE_DEVICE', student_name: 'Divya Joshi', token_hash: 'E1F2G3H4I5J6', ip_city: 'Chennai', ip_address: '14.139.123.45', device: 'Chrome/iOS', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), resolved: false, notes: null },
];

const ResolveModal = ({ anomaly, onClose, onConfirm }) => {
    const [notes, setNotes] = useState('');
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={20} color="#10B981" /></div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Mark as Resolved</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                    Resolving anomaly for <strong>{anomaly.student_name}</strong>. Add a note explaining why this is not a concern.
                </p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Student confirmed to be on school trip..." rows={3}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={() => onConfirm(notes)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Mark Resolved</button>
                </div>
            </div>
        </div>
    );
};

export default function Anomalies() {
    const { can } = useAuth();
    const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
    const [filter, setFilter] = useState('UNRESOLVED');
    const [resolvingId, setResolvingId] = useState(null);

    const filtered = anomalies.filter(a => filter === 'ALL' ? true : filter === 'UNRESOLVED' ? !a.resolved : a.resolved);
    const unresolved = anomalies.filter(a => !a.resolved).length;
    const resolvingAnomaly = anomalies.find(a => a.id === resolvingId);

    const resolve = (id, notes) => {
        setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: true, notes } : a));
        setResolvingId(null);
    };

    return (
        <div style={{ maxWidth: '1000px' }}>
            {resolvingAnomaly && <ResolveModal anomaly={resolvingAnomaly} onClose={() => setResolvingId(null)} onConfirm={(notes) => resolve(resolvingId, notes)} />}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Scan Anomalies</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Flagged suspicious scan patterns requiring review</p>
                </div>
                {unresolved > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #EF4444' }}>
                        <ShieldAlert size={16} color="#B91C1C" />
                        <span style={{ fontWeight: 700, color: '#B91C1C', fontSize: '0.875rem' }}>{unresolved} unresolved</span>
                    </div>
                )}
            </div>

            {/* Type legend */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {Object.entries(ANOMALY_TYPES).map(([key, { label, color, bg, icon }]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', background: bg, border: `1px solid ${color}30` }}>
                        <span style={{ fontSize: '13px' }}>{icon}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {[['UNRESOLVED', `Unresolved (${unresolved})`], ['RESOLVED', 'Resolved'], ['ALL', 'All']].map(([key, label]) => (
                    <button key={key} onClick={() => setFilter(key)} style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid', borderColor: filter === key ? 'var(--color-brand-500)' : 'var(--border-default)', background: filter === key ? 'var(--color-brand-600)' : 'white', color: filter === key ? 'white' : 'var(--text-secondary)', fontWeight: filter === key ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer' }}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Anomaly cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '60px', textAlign: 'center', color: 'var(--text-muted)', boxShadow: 'var(--shadow-card)' }}>
                        <Shield size={36} style={{ marginBottom: '12px', opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>All clear</div>
                        <div style={{ fontSize: '0.875rem' }}>No anomalies to review</div>
                    </div>
                ) : filtered.map(anomaly => {
                    const type = ANOMALY_TYPES[anomaly.type] || { label: anomaly.type, color: '#475569', bg: '#F1F5F9', icon: '⚠' };
                    return (
                        <div key={anomaly.id} style={{ background: 'white', borderRadius: '12px', border: `1px solid ${anomaly.resolved ? 'var(--border-default)' : '#FECACA'}`, boxShadow: 'var(--shadow-card)', overflow: 'hidden', opacity: anomaly.resolved ? 0.75 : 1 }}>
                            {/* Top strip */}
                            <div style={{ height: '4px', background: anomaly.resolved ? 'var(--color-slate-200)' : type.color }} />
                            <div style={{ padding: '18px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: type.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                        {type.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{anomaly.student_name}</span>
                                            <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: type.bg, color: type.color }}>{type.label}</span>
                                            {anomaly.resolved && <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: '#ECFDF5', color: '#047857' }}>✓ Resolved</span>}
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{formatRelativeTime(anomaly.created_at)} · {formatDateTime(anomaly.created_at)}</div>
                                        {/* Details row */}
                                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                <MapPin size={13} color="var(--text-muted)" />
                                                <span>{anomaly.ip_city}</span>
                                                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--color-slate-100)', padding: '1px 6px', borderRadius: '4px' }}>{anomaly.ip_address}</code>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                <Monitor size={13} color="var(--text-muted)" />
                                                <span>{anomaly.device}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                <AlertTriangle size={13} color="var(--text-muted)" />
                                                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--color-slate-100)', padding: '1px 6px', borderRadius: '4px' }}>{maskTokenHash(anomaly.token_hash)}</code>
                                            </div>
                                        </div>
                                        {anomaly.notes && (
                                            <div style={{ marginTop: '10px', padding: '8px 12px', background: '#ECFDF5', borderRadius: '7px', fontSize: '0.8125rem', color: '#047857', borderLeft: '3px solid #10B981' }}>
                                                <strong>Resolution note:</strong> {anomaly.notes}
                                            </div>
                                        )}
                                    </div>
                                    {/* Action */}
                                    {!anomaly.resolved && can('anomalies.resolve') && (
                                        <button onClick={() => setResolvingId(anomaly.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #10B981', background: '#ECFDF5', color: '#047857', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', flexShrink: 0 }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#D1FAE5'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#ECFDF5'}>
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