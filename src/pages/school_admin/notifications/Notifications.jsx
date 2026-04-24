<<<<<<< HEAD
import { useState } from 'react';
import { Bell, CheckCheck, ScanLine, CreditCard, ShieldAlert, Settings, Check } from 'lucide-react';
import { formatRelativeTime } from '../../../utils/formatters.js';
=======
import { useState, useRef, useEffect } from 'react';
import {
    Bell, CheckCheck, ScanLine, AlertTriangle, CreditCard,
    ShieldAlert, Settings, Info, Check, Megaphone, X,
    Send, Users, Smartphone, Mail, MessageCircle, Loader2,
    Calendar, Filter, Eye, EyeOff, Clock, ChevronDown
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum } from '../../../utils/formatters.js';
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901

// ── Notification type config ──────────────────────────────────────────────────
const TYPE_META = {
<<<<<<< HEAD
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
=======
    SCAN_ALERT: { Icon: ScanLine, color: '#2563EB', bg: '#EFF6FF', label: 'Scan Alert' },
    SCAN_ANOMALY: { Icon: ShieldAlert, color: '#B91C1C', bg: '#FEF2F2', label: 'Anomaly' },
    CARD_EXPIRING: { Icon: CreditCard, color: '#B45309', bg: '#FFFBEB', label: 'Card Expiring' },
    CARD_REVOKED: { Icon: CreditCard, color: '#B91C1C', bg: '#FEF2F2', label: 'Card Revoked' },
    BILLING_ALERT: { Icon: CreditCard, color: '#92400E', bg: '#FEF3C7', label: 'Billing' },
    ANNOUNCEMENT: { Icon: Megaphone, color: '#7C3AED', bg: '#F5F3FF', label: 'Announcement' },
    SYSTEM: { Icon: Settings, color: '#475569', bg: '#F1F5F9', label: 'System' },
};

const CHANNELS = [
    { id: 'PUSH', label: 'Push Notification', icon: Smartphone, color: '#2563EB', bg: '#EFF6FF' },
    { id: 'EMAIL', label: 'Email', icon: Mail, color: '#7C3AED', bg: '#F5F3FF' },
    { id: 'SMS', label: 'SMS', icon: MessageCircle, color: '#059669', bg: '#ECFDF5' },
];

const MOCK_NOTIFS = [
    { id: 'n1', type: 'SCAN_ANOMALY', status: 'UNREAD', title: 'Suspicious scan detected', body: 'Foreign location scan for Aarav Sharma from Jaipur IP.', student_name: 'Aarav Sharma', created_at: new Date(Date.now() - 1800000).toISOString(), channel: 'PUSH' },
    { id: 'n2', type: 'CARD_EXPIRING', status: 'UNREAD', title: '3 tokens expiring this week', body: 'Tokens for Priya Patel, Rohit Singh, Karan Kumar expire within 7 days.', student_name: null, created_at: new Date(Date.now() - 3600000).toISOString(), channel: 'EMAIL' },
    { id: 'n3', type: 'SCAN_ALERT', status: 'READ', title: 'Scan alert: Sneha Gupta', body: 'Student scanned at 11:43 PM outside school premises.', student_name: 'Sneha Gupta', created_at: new Date(Date.now() - 7200000).toISOString(), channel: 'PUSH' },
    { id: 'n4', type: 'SCAN_ANOMALY', status: 'READ', title: 'Multi-device anomaly flagged', body: 'Divya Joshi\'s token scanned from 2 devices within 10 minutes.', student_name: 'Divya Joshi', created_at: new Date(Date.now() - 14400000).toISOString(), channel: 'PUSH' },
    { id: 'n5', type: 'CARD_REVOKED', status: 'READ', title: 'Card revoked: Vikram Mehta', body: 'ID card was manually revoked by admin. New token issued.', student_name: 'Vikram Mehta', created_at: new Date(Date.now() - 86400000).toISOString(), channel: 'EMAIL' },
    { id: 'n6', type: 'BILLING_ALERT', status: 'READ', title: 'Subscription renewal due', body: 'Your school subscription renews in 14 days. Ensure payment is updated.', student_name: null, created_at: new Date(Date.now() - 86400000 * 2).toISOString(), channel: 'EMAIL' },
    { id: 'n7', type: 'ANNOUNCEMENT', status: 'READ', title: 'Parent-Teacher Meeting', body: 'Annual parent-teacher meeting scheduled for March 25, 2026.', student_name: null, created_at: new Date(Date.now() - 86400000 * 3).toISOString(), channel: 'PUSH' },
    { id: 'n8', type: 'SCAN_ALERT', status: 'READ', title: 'Scan alert: Arjun Verma', body: 'Multiple failed scans detected in short period.', student_name: 'Arjun Verma', created_at: new Date(Date.now() - 86400000 * 4).toISOString(), channel: 'SMS' },
    { id: 'n9', type: 'SYSTEM', status: 'READ', title: 'System update completed', body: 'Platform updated to version 2.4.0 with new features.', student_name: null, created_at: new Date(Date.now() - 86400000 * 5).toISOString(), channel: 'EMAIL' },
];

const MOCK_STUDENTS = [
    { id: 's1', name: 'Aarav Sharma', class: '10A', parent_phone: '+91-98765-43210', parent_email: 'parent@example.com' },
    { id: 's2', name: 'Sneha Gupta', class: '9B', parent_phone: '+91-98765-43211', parent_email: 'sneha.parent@example.com' },
    { id: 's3', name: 'Divya Joshi', class: '12A', parent_phone: '+91-98765-43212', parent_email: 'divya.parent@example.com' },
    { id: 's4', name: 'Arjun Verma', class: '8C', parent_phone: '+91-98765-43213', parent_email: 'arjun.parent@example.com' },
    { id: 's5', name: 'Priya Patel', class: '11B', parent_phone: '+91-98765-43214', parent_email: 'priya.parent@example.com' },
];

const STATUS_STYLE = {
    UNREAD: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Unread', border: '#BFDBFE' },
    READ: { bg: '#F8FAFC', color: '#64748B', label: 'Read', border: '#E2E8F0' },
};

// ─── Send Announcement Modal ─────────────────────────────────────────────────
const SendAnnouncementModal = ({ onClose, onSend }) => {
    const [form, setForm] = useState({
        title: '',
        message: '',
        channel: 'PUSH',
        recipientType: 'ALL_PARENTS',
        selectedStudents: [],
        scheduleDate: '',
    });
    const [search, setSearch] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const filteredStudents = MOCK_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!form.title || !form.message) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));
        onSend(form);
        setSubmitting(false);
        onClose();
    };

    const recipientOptions = [
        { value: 'ALL_PARENTS', label: 'All Parents', icon: Users, desc: 'Send to all parents in school' },
        { value: 'SPECIFIC_STUDENTS', label: 'Specific Students', icon: Users, desc: 'Select individual students' },
        { value: 'ALL_STAFF', label: 'All Staff', icon: Users, desc: 'Send to all school staff' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <Megaphone size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0">Send Announcement</h3>
                            <p className="text-xs text-[var(--text-muted)] m-0">Broadcast to parents, students, or staff</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                            Announcement Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => updateForm('title', e.target.value)}
                            placeholder="e.g., Holiday Announcement, Parent-Teacher Meeting"
                            className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                            Message <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={form.message}
                            onChange={e => updateForm('message', e.target.value)}
                            placeholder="Write your announcement here..."
                            rows={4}
                            className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-purple-500 resize-none"
                        />
                    </div>

                    {/* Channel */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Delivery Channel</label>
                        <div className="grid grid-cols-3 gap-2">
                            {CHANNELS.map(ch => {
                                const Icon = ch.icon;
                                return (
                                    <button
                                        key={ch.id}
                                        type="button"
                                        onClick={() => updateForm('channel', ch.id)}
                                        className={`flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${form.channel === ch.id
                                            ? `border-purple-500 bg-purple-50 text-purple-700`
                                            : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span className="text-xs">{ch.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recipient Type */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Send To</label>
                        <div className="space-y-2">
                            {recipientOptions.map(opt => {
                                const Icon = opt.icon;
                                const isSelected = form.recipientType === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => updateForm('recipientType', opt.value)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${isSelected
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-[var(--border-default)] bg-white hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-purple-100' : 'bg-slate-100'}`}>
                                                <Icon size={14} className={isSelected ? 'text-purple-600' : 'text-slate-500'} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{opt.label}</div>
                                                <div className="text-xs text-[var(--text-muted)]">{opt.desc}</div>
                                            </div>
                                            {isSelected && <Check size={14} className="ml-auto text-purple-600" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Specific Students Selection */}
                    {form.recipientType === 'SPECIFIC_STUDENTS' && (
                        <div>
                            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Select Students</label>
                            <div className="border border-[var(--border-default)] rounded-lg overflow-hidden">
                                <div className="p-2 border-b border-[var(--border-default)] bg-slate-50">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search students..."
                                        className="w-full py-1.5 px-2 border rounded-md text-sm"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {filteredStudents.map(student => {
                                        const isSelected = form.selectedStudents.includes(student.id);
                                        return (
                                            <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer border-b last:border-none">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            updateForm('selectedStudents', [...form.selectedStudents, student.id]);
                                                        } else {
                                                            updateForm('selectedStudents', form.selectedStudents.filter(id => id !== student.id));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{student.name}</div>
                                                    <div className="text-xs text-[var(--text-muted)]">Class {student.class}</div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                            {form.selectedStudents.length > 0 && (
                                <p className="text-xs text-[var(--text-muted)] mt-1">{form.selectedStudents.length} student(s) selected</p>
>>>>>>> 5ddbd8d6fa39e953e7625f2f9d4ae6b048291901
                            )}
                        </div>
                    )}

                    {/* Schedule */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                            Schedule (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            value={form.scheduleDate}
                            onChange={e => updateForm('scheduleDate', e.target.value)}
                            className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[var(--border-default)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !form.title || !form.message}
                        className="px-5 py-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Send Announcement
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Notifications() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFS);
    const [filter, setFilter] = useState('ALL');
    const [showSendModal, setShowSendModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [channelFilter, setChannelFilter] = useState('ALL');

    const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

    const filtered = notifications.filter(n => {
        if (filter === 'UNREAD') return n.status === 'UNREAD';
        if (filter === 'TYPE' && typeFilter !== 'ALL') return n.type === typeFilter;
        if (filter === 'CHANNEL' && channelFilter !== 'ALL') return n.channel === channelFilter;
        return true;
    }).filter(n => {
        if (typeFilter !== 'ALL' && filter !== 'TYPE') return n.type === typeFilter;
        if (channelFilter !== 'ALL' && filter !== 'CHANNEL') return n.channel === channelFilter;
        return true;
    });

    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));

    const handleSendAnnouncement = (announcement) => {
        const newNotif = {
            id: `ann-${Date.now()}`,
            type: 'ANNOUNCEMENT',
            status: 'READ',
            title: announcement.title,
            body: announcement.message,
            student_name: null,
            created_at: new Date().toISOString(),
            channel: announcement.channel,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const filterTabs = [
        { id: 'ALL', label: 'All', icon: Bell },
        { id: 'UNREAD', label: `Unread (${unreadCount})`, icon: Eye },
        { id: 'TYPE', label: 'By Type', icon: Filter },
        { id: 'CHANNEL', label: 'By Channel', icon: Smartphone },
    ];

    return (
        <div className="max-w-[900px] mx-auto">
            {showSendModal && <SendAnnouncementModal onClose={() => setShowSendModal(false)} onSend={handleSendAnnouncement} />}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <Bell size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0">
                                Notifications
                            </h2>
                            <p className="text-[var(--text-muted)] text-sm mt-0.5">
                                System alerts, scan events, and announcements
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSendModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:opacity-90 transition-all"
                    >
                        <Megaphone size={15} /> Send Announcement
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            <CheckCheck size={14} /> Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{notifications.length}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                    <div className="text-xs text-[var(--text-muted)]">Unread</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {notifications.filter(n => n.type === 'ANNOUNCEMENT').length}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Announcements</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                        {notifications.filter(n => n.status === 'READ').length}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Read</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 mb-5 flex-wrap">
                {filterTabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = filter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-white border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-slate-50'
                                }`}
                        >
                            <Icon size={13} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Advanced Filters */}
            {(filter === 'TYPE' || filter === 'CHANNEL') && (
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-5 animate-fadeIn">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                            {filter === 'TYPE' ? 'Filter by Type:' : 'Filter by Channel:'}
                        </span>
                        <div className="flex gap-2 flex-wrap">
                            {filter === 'TYPE' ? (
                                <>
                                    {['ALL', 'SCAN_ALERT', 'SCAN_ANOMALY', 'CARD_EXPIRING', 'CARD_REVOKED', 'BILLING_ALERT', 'ANNOUNCEMENT', 'SYSTEM'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTypeFilter(t)}
                                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${typeFilter === t
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-slate-100 text-[var(--text-secondary)] hover:bg-slate-200'
                                                }`}
                                        >
                                            {t === 'ALL' ? 'All' : t.replace('_', ' ')}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {['ALL', 'PUSH', 'EMAIL', 'SMS'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setChannelFilter(c)}
                                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${channelFilter === c
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-slate-100 text-[var(--text-secondary)] hover:bg-slate-200'
                                                }`}
                                        >
                                            {c === 'ALL' ? 'All' : c}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => { setTypeFilter('ALL'); setChannelFilter('ALL'); }}
                            className="text-xs text-purple-600 font-medium ml-auto"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Notification List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[var(--border-default)] py-16 text-center text-[var(--text-muted)]">
                        <Bell size={40} className="mx-auto mb-3 opacity-30" />
                        <div className="font-medium">No notifications found</div>
                        <div className="text-sm mt-1">Try changing your filters</div>
                    </div>
                ) : (
                    filtered.map(notif => {
                        const meta = TYPE_META[notif.type] || TYPE_META.SYSTEM;
                        const statusStyle = STATUS_STYLE[notif.status] || STATUS_STYLE.READ;
                        const isUnread = notif.status === 'UNREAD';
                        const channelInfo = CHANNELS.find(c => c.id === notif.channel) || CHANNELS[0];
                        const ChannelIcon = channelInfo.icon;

                        return (
                            <div
                                key={notif.id}
                                className={`bg-white rounded-xl border transition-all hover:shadow-md ${isUnread ? 'border-blue-200 shadow-sm' : 'border-[var(--border-default)]'
                                    }`}
                                style={isUnread ? { background: 'linear-gradient(to right, #fff, #F5F3FF)' } : {}}
                            >
                                <div className="p-4 flex gap-3">
                                    {/* Icon */}
                                    <div className="relative">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center`} style={{ background: meta.bg }}>
                                            <meta.Icon size={20} color={meta.color} />
                                        </div>
                                        {isUnread && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className={`font-semibold text-[var(--text-primary)] ${isUnread ? 'text-base' : 'text-sm'}`}>
                                                {notif.title}
                                            </span>
                                            <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>
                                                {meta.label}
                                            </span>
                                            <span className="flex items-center gap-1 text-[0.65rem] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                <ChannelIcon size={10} /> {channelInfo.label}
                                            </span>
                                            {isUnread && (
                                                <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-2 leading-relaxed">
                                            {notif.body}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <Clock size={11} /> {formatRelativeTime(notif.created_at)}
                                            </span>
                                            {notif.student_name && (
                                                <>
                                                    <span>•</span>
                                                    <span>Student: {notif.student_name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {isUnread && (
                                        <button
                                            onClick={() => markRead(notif.id)}
                                            className="w-8 h-8 rounded-lg border border-[var(--border-default)] bg-white flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-all"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
