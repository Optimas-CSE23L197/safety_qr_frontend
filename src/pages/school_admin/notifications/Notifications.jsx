import { useState } from 'react';
import { Bell, CheckCheck, ScanLine, AlertTriangle, CreditCard, ShieldAlert, Settings, Info, Check } from 'lucide-react';
import { formatRelativeTime, humanizeEnum } from '../../../utils/formatters.js';

const TYPE_META = {
    SCAN_ALERT: { Icon: ScanLine, color: '#2563EB', bg: '#EFF6FF', label: 'Scan Alert' },
    SCAN_ANOMALY: { Icon: ShieldAlert, color: '#B91C1C', bg: '#FEF2F2', label: 'Anomaly' },
    CARD_EXPIRING: { Icon: CreditCard, color: '#B45309', bg: '#FFFBEB', label: 'Card Expiring' },
    CARD_REVOKED: { Icon: CreditCard, color: '#B91C1C', bg: '#FEF2F2', label: 'Card Revoked' },
    BILLING_ALERT: { Icon: CreditCard, color: '#92400E', bg: '#FEF3C7', label: 'Billing' },
    SYSTEM: { Icon: Settings, color: '#475569', bg: '#F1F5F9', label: 'System' },
};

const MOCK_NOTIFS = [
    { id: 'n1', type: 'SCAN_ANOMALY', status: 'QUEUED', title: 'Suspicious scan detected', body: 'Foreign location scan for Aarav Sharma from Jaipur IP.', student_name: 'Aarav Sharma', created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'n2', type: 'CARD_EXPIRING', status: 'QUEUED', title: '3 tokens expiring this week', body: 'Tokens for Priya Patel, Rohit Singh, Karan Kumar expire within 7 days.', student_name: null, created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'n3', type: 'SCAN_ALERT', status: 'SENT', title: 'Scan alert: Sneha Gupta', body: 'Student scanned at 11:43 PM outside school premises.', student_name: 'Sneha Gupta', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'n4', type: 'SCAN_ANOMALY', status: 'SENT', title: 'Multi-device anomaly flagged', body: 'Divya Joshi\'s token scanned from 2 devices within 10 minutes.', student_name: 'Divya Joshi', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'n5', type: 'CARD_REVOKED', status: 'SENT', title: 'Card revoked: Vikram Mehta', body: 'ID card was manually revoked by admin. New token issued.', student_name: 'Vikram Mehta', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'n6', type: 'BILLING_ALERT', status: 'SENT', title: 'Subscription renewal due', body: 'Your school subscription renews in 14 days. Ensure payment is updated.', student_name: null, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'n7', type: 'SYSTEM', status: 'SENT', title: 'System maintenance completed', body: 'Scheduled maintenance completed. All services are operating normally.', student_name: null, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'n8', type: 'SCAN_ALERT', status: 'SENT', title: 'Scan alert: Arjun Verma', body: 'Multiple failed scans detected in short period.', student_name: 'Arjun Verma', created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
];

const STATUS_STYLE = {
    QUEUED: { bg: '#FFFBEB', color: '#B45309', label: 'Unread' },
    SENT: { bg: '#F1F5F9', color: '#64748B', label: 'Read' },
    FAILED: { bg: '#FEF2F2', color: '#B91C1C', label: 'Failed' },
};

export default function Notifications() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFS);
    const [filter, setFilter] = useState('ALL');

    const unread = notifications.filter(n => n.status === 'QUEUED').length;
    const filtered = notifications.filter(n => filter === 'ALL' ? true : filter === 'UNREAD' ? n.status === 'QUEUED' : n.type === filter);

    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'SENT' } : n));
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, status: 'SENT' })));

    return (
        <div style={{ maxWidth: '800px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Notifications
                        {unread > 0 && <span style={{ background: '#EF4444', color: 'white', borderRadius: '9999px', padding: '2px 10px', fontSize: '0.8125rem', fontWeight: 700 }}>{unread}</span>}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>System alerts, scan events and billing updates</p>
                </div>
                {unread > 0 && (
                    <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-slate-50)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}>
                        <CheckCheck size={15} /> Mark all as read
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[['ALL', 'All'], ['UNREAD', `Unread (${unread})`], ['SCAN_ANOMALY', 'Anomalies'], ['SCAN_ALERT', 'Scan Alerts'], ['CARD_EXPIRING', 'Expiring'], ['SYSTEM', 'System']].map(([key, label]) => (
                    <button key={key} onClick={() => setFilter(key)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid', borderColor: filter === key ? 'var(--color-brand-500)' : 'var(--border-default)', background: filter === key ? 'var(--color-brand-600)' : 'white', color: filter === key ? 'white' : 'var(--text-secondary)', fontWeight: filter === key ? 700 : 500, fontSize: '0.8125rem', cursor: 'pointer' }}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Notification list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filtered.length === 0 ? (
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '60px', textAlign: 'center', color: 'var(--text-muted)', boxShadow: 'var(--shadow-card)' }}>
                        <Bell size={36} style={{ marginBottom: '12px', opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>No notifications</div>
                        <div style={{ fontSize: '0.875rem' }}>You're all caught up</div>
                    </div>
                ) : filtered.map(notif => {
                    const meta = TYPE_META[notif.type] || TYPE_META.SYSTEM;
                    const isUnread = notif.status === 'QUEUED';
                    return (
                        <div key={notif.id} style={{ background: 'white', borderRadius: '12px', border: `1px solid ${isUnread ? '#BFDBFE' : 'var(--border-default)'}`, boxShadow: 'var(--shadow-card)', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start', transition: 'all 0.15s', position: 'relative', overflow: 'hidden' }}>
                            {isUnread && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--color-brand-500)' }} />}
                            {/* Icon */}
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: isUnread ? '4px' : '0' }}>
                                <meta.Icon size={18} color={meta.color} />
                            </div>
                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: isUnread ? 700 : 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notif.title}</span>
                                    <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label}</span>
                                    {isUnread && <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8' }}>NEW</span>}
                                </div>
                                <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', margin: '0 0 6px', lineHeight: 1.5 }}>{notif.body}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatRelativeTime(notif.created_at)}</span>
                                    {notif.student_name && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· {notif.student_name}</span>}
                                </div>
                            </div>
                            {/* Mark read */}
                            {isUnread && (
                                <button onClick={() => markRead(notif.id)} title="Mark as read" style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#ECFDF5'; e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.color = '#10B981'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                    <Check size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}