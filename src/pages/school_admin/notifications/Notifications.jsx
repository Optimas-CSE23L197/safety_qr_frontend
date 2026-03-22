import { useState } from 'react';
import { Bell, CheckCheck, ScanLine, CreditCard, ShieldAlert, Settings, Check } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/formatters.js';

// ── Notification type config ──────────────────────────────────────────────────
const TYPE_META = {
    SCAN_ALERT:    { Icon: ScanLine,    badgeClass: 'bg-blue-50 text-blue-600',    iconBg: 'bg-blue-50',    label: 'Scan Alert' },
    SCAN_ANOMALY:  { Icon: ShieldAlert, badgeClass: 'bg-red-50 text-red-700',      iconBg: 'bg-red-50',     label: 'Anomaly' },
    CARD_EXPIRING: { Icon: CreditCard,  badgeClass: 'bg-amber-50 text-amber-700',  iconBg: 'bg-amber-50',   label: 'Card Expiring' },
    CARD_REVOKED:  { Icon: CreditCard,  badgeClass: 'bg-red-50 text-red-700',      iconBg: 'bg-red-50',     label: 'Card Revoked' },
    BILLING_ALERT: { Icon: CreditCard,  badgeClass: 'bg-amber-100 text-amber-900', iconBg: 'bg-amber-100',  label: 'Billing' },
    SYSTEM:        { Icon: Settings,    badgeClass: 'bg-slate-100 text-slate-600', iconBg: 'bg-slate-100',  label: 'System' },
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_NOTIFS = [
    { id: 'n1', type: 'SCAN_ANOMALY',  status: 'QUEUED', title: 'Suspicious scan detected',       body: 'Foreign location scan for Aarav Sharma from Jaipur IP.',                          student_name: 'Aarav Sharma', created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'n2', type: 'CARD_EXPIRING', status: 'QUEUED', title: '3 tokens expiring this week',    body: 'Tokens for Priya Patel, Rohit Singh, Karan Kumar expire within 7 days.',         student_name: null,           created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'n3', type: 'SCAN_ALERT',    status: 'SENT',   title: 'Scan alert: Sneha Gupta',        body: 'Student scanned at 11:43 PM outside school premises.',                          student_name: 'Sneha Gupta',  created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'n4', type: 'SCAN_ANOMALY',  status: 'SENT',   title: 'Multi-device anomaly flagged',   body: "Divya Joshi's token scanned from 2 devices within 10 minutes.",                  student_name: 'Divya Joshi',  created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 'n5', type: 'CARD_REVOKED',  status: 'SENT',   title: 'Card revoked: Vikram Mehta',     body: 'ID card was manually revoked by admin. New token issued.',                       student_name: 'Vikram Mehta', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'n6', type: 'BILLING_ALERT', status: 'SENT',   title: 'Subscription renewal due',       body: 'Your school subscription renews in 14 days. Ensure payment is updated.',         student_name: null,           created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'n7', type: 'SYSTEM',        status: 'SENT',   title: 'System maintenance completed',   body: 'Scheduled maintenance completed. All services are operating normally.',          student_name: null,           created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'n8', type: 'SCAN_ALERT',    status: 'SENT',   title: 'Scan alert: Arjun Verma',        body: 'Multiple failed scans detected in short period.',                               student_name: 'Arjun Verma',  created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
];

const FILTER_TABS = [
    ['ALL',          'All'],
    ['UNREAD',       ''],          // label built dynamically
    ['SCAN_ANOMALY', 'Anomalies'],
    ['SCAN_ALERT',   'Scan Alerts'],
    ['CARD_EXPIRING','Expiring'],
    ['SYSTEM',       'System'],
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Notifications() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFS);
    const [filter, setFilter] = useState('ALL');

    const unread   = notifications.filter(n => n.status === 'QUEUED').length;
    const filtered = notifications.filter(n =>
        filter === 'ALL'    ? true :
        filter === 'UNREAD' ? n.status === 'QUEUED' :
                              n.type === filter
    );

    const markRead    = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'SENT' } : n));
    const markAllRead = ()   => setNotifications(prev => prev.map(n => ({ ...n, status: 'SENT' })));

    return (
        <div className="max-w-[800px]">

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-slate-900 m-0 flex items-center gap-2.5">
                        Notifications
                        {unread > 0 && (
                            <span className="bg-red-500 text-white rounded-full px-2.5 py-[2px] text-[0.8125rem] font-bold">
                                {unread}
                            </span>
                        )}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        System alerts, scan events and billing updates
                    </p>
                </div>

                {unread > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-sm cursor-pointer hover:bg-slate-50 transition-colors duration-100"
                    >
                        <CheckCheck size={15} /> Mark all as read
                    </button>
                )}
            </div>

            {/* ── Filter tabs ───────────────────────────────────────────────── */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {FILTER_TABS.map(([key, label]) => {
                    const displayLabel = key === 'UNREAD' ? `Unread (${unread})` : label;
                    const active = filter === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={[
                                'px-3.5 py-1.5 rounded-lg border text-[0.8125rem] cursor-pointer transition-colors duration-100',
                                active
                                    ? 'border-blue-500 bg-blue-700 text-white font-bold'
                                    : 'border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {displayLabel}
                        </button>
                    );
                })}
            </div>

            {/* ── Notification list ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-[60px] text-center text-slate-400 shadow-[var(--shadow-card)]">
                        <Bell size={36} className="opacity-30 mx-auto mb-3" />
                        <div className="font-semibold mb-1">No notifications</div>
                        <div className="text-sm">You're all caught up</div>
                    </div>
                ) : filtered.map(notif => {
                    const meta     = TYPE_META[notif.type] || TYPE_META.SYSTEM;
                    const isUnread = notif.status === 'QUEUED';
                    return (
                        <div
                            key={notif.id}
                            className={[
                                'bg-white rounded-xl shadow-[var(--shadow-card)] px-[18px] py-4 flex gap-3.5 items-start transition-all duration-150 relative overflow-hidden',
                                isUnread ? 'border border-blue-200' : 'border border-slate-200',
                            ].join(' ')}
                        >
                            {/* Unread left accent strip */}
                            {isUnread && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />
                            )}

                            {/* Type icon */}
                            <div className={[
                                'w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0',
                                meta.iconBg,
                                isUnread ? 'ml-1' : '',
                            ].join(' ')}>
                                <meta.Icon size={18} className={meta.badgeClass.split(' ')[1]} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {/* Title + badges */}
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className={`text-[0.9rem] text-slate-900 ${isUnread ? 'font-bold' : 'font-semibold'}`}>
                                        {notif.title}
                                    </span>
                                    <span className={`px-2 py-[2px] rounded-full text-[0.7rem] font-semibold ${meta.badgeClass}`}>
                                        {meta.label}
                                    </span>
                                    {isUnread && (
                                        <span className="px-2 py-[2px] rounded-full text-[0.7rem] font-bold bg-blue-50 text-blue-700">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <p className="text-[0.8375rem] text-slate-600 m-0 mb-1.5 leading-[1.5]">
                                    {notif.body}
                                </p>

                                {/* Meta row */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400">{formatRelativeTime(notif.created_at)}</span>
                                    {notif.student_name && (
                                        <span className="text-xs text-slate-400">· {notif.student_name}</span>
                                    )}
                                </div>
                            </div>

                            {/* Mark as read button */}
                            {isUnread && (
                                <button
                                    onClick={() => markRead(notif.id)}
                                    title="Mark as read"
                                    className="w-[30px] h-[30px] rounded-lg border border-slate-200 bg-white flex items-center justify-center cursor-pointer text-slate-400 shrink-0 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-500 transition-all duration-100"
                                >
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