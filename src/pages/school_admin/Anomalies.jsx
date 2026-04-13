import React, { useState, useEffect } from 'react';
import {
    AlertTriangle, CheckCircle, Eye, MapPin, Monitor, Shield,
    ShieldAlert, Phone, Mail, MessageCircle, Flag, X, Bell,
    Send, Clock, User, Activity, Lock, Unlock, FileText,
    ChevronDown, ChevronUp, ExternalLink, ThumbsUp, ThumbsDown,
    Info, Filter, Download, RefreshCw, Search, Globe, Wifi,
    Moon, Server, Database, Hash, Zap, Loader2, Check
} from 'lucide-react';
import { formatRelativeTime, formatDateTime, humanizeEnum, maskTokenHash } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import useDebounce from '../../hooks/useDebounce.js'

// ─── ANOMALY TYPES (Matches Prisma Schema) ────────────────────────────────────
const ANOMALY_TYPES = {
    HIGH_FREQUENCY: {
        label: 'High Frequency',
        color: '#1D4ED8',
        bg: '#EFF6FF',
        icon: Zap,
        severity: 'MEDIUM',
        description: 'Unusually high number of scans in short time'
    },
    MULTIPLE_LOCATIONS: {
        label: 'Multiple Locations',
        color: '#B91C1C',
        bg: '#FEF2F2',
        icon: Globe,
        severity: 'HIGH',
        description: 'Token scanned from multiple locations simultaneously'
    },
    SUSPICIOUS_IP: {
        label: 'Suspicious IP',
        color: '#DC2626',
        bg: '#FEF2F2',
        icon: Wifi,
        severity: 'HIGH',
        description: 'Scan from known suspicious IP address'
    },
    AFTER_HOURS: {
        label: 'After Hours',
        color: '#6D28D9',
        bg: '#F5F3FF',
        icon: Moon,
        severity: 'LOW',
        description: 'Scan occurred outside school operating hours'
    },
    BULK_SCRAPING: {
        label: 'Bulk Scraping',
        color: '#7C3AED',
        bg: '#EDE9FE',
        icon: Server,
        severity: 'CRITICAL',
        description: 'Multiple tokens scanned in rapid succession'
    },
    HONEYPOT_TRIGGERED: {
        label: 'Honeypot Triggered',
        color: '#991B1B',
        bg: '#FEF2F2',
        icon: ShieldAlert,
        severity: 'CRITICAL',
        description: 'Suspicious activity detected on honeypot token'
    },
    REPEATED_FAILURE: {
        label: 'Repeated Failure',
        color: '#B45309',
        bg: '#FFFBEB',
        icon: AlertTriangle,
        severity: 'MEDIUM',
        description: 'Multiple failed scan attempts'
    }
};

const SEVERITY_COLORS = {
    CRITICAL: { bg: '#7F1A1A', color: '#FEF2F2', label: 'Critical', order: 0 },
    HIGH: { bg: '#991B1B', color: '#FEF2F2', label: 'High', order: 1 },
    MEDIUM: { bg: '#B45309', color: '#FEF2F2', label: 'Medium', order: 2 },
    LOW: { bg: '#065F46', color: '#FEF2F2', label: 'Low', order: 3 }
};

// ─── Resolution Actions ───────────────────────────────────────────────────────
const RESOLUTION_ACTIONS = [
    { id: 'VERIFIED_SAFE', label: 'Mark as Safe', icon: CheckCircle, color: '#10B981', description: 'False positive, no action needed' },
    { id: 'CONTACT_PARENT', label: 'Contact Parent', icon: Phone, color: '#3B82F6', description: 'Notify parent via SMS/Email' },
    { id: 'REVOKE_TOKEN', label: 'Revoke Token', icon: Lock, color: '#EF4444', description: 'Immediately disable the token' },
    { id: 'ESCALATE', label: 'Escalate', icon: AlertTriangle, color: '#F59E0B', description: 'Flag for super admin review' }
];

// ─── Mock Data (Matches Schema) ───────────────────────────────────────────────
const MOCK_ANOMALIES = [
    {
        id: 'an1',
        token_id: 'tok-001',
        token_hash: 'A1B2C3D4E5F6G7H8',
        anomaly_type: 'MULTIPLE_LOCATIONS',
        severity: 'HIGH',
        reason: 'Token scanned in Jaipur and Delhi within 30 minutes',
        metadata: {
            expected_location: { lat: 28.6139, lng: 77.2090, city: 'Delhi' },
            actual_location: { lat: 26.9124, lng: 75.7873, city: 'Jaipur' },
            time_diff_minutes: 28,
            scan_ids: ['scan-001', 'scan-002']
        },
        student_name: 'Aarav Sharma',
        student_id: 'stu-001',
        school_id: 'sch-001',
        school_name: 'Green Valley School',
        ip_address: '182.74.1.22',
        ip_city: 'Jaipur',
        device: 'Chrome/Android',
        parent_phone: '+919876543210',
        parent_email: 'aarav.parent@example.com',
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        resolved: false,
        resolved_at: null,
        resolved_by: null,
        resolved_by_name: null,
        resolution_note: null,
        resolution_action: null
    },
    {
        id: 'an2',
        token_id: 'tok-002',
        token_hash: 'G7H8I9J0K1L2M3N4',
        anomaly_type: 'HIGH_FREQUENCY',
        severity: 'MEDIUM',
        reason: '12 scans in 5 minutes from same device',
        metadata: {
            scan_count: 12,
            time_window_minutes: 5,
            device_id: 'dev-456',
            average_interval_seconds: 25
        },
        student_name: 'Priya Patel',
        student_id: 'stu-002',
        school_id: 'sch-001',
        school_name: 'Green Valley School',
        ip_address: '103.21.58.14',
        ip_city: 'Mumbai',
        device: 'Safari/iOS',
        parent_phone: '+919876543211',
        parent_email: 'priya.parent@example.com',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        resolved: false,
        resolved_at: null,
        resolved_by: null,
        resolved_by_name: null,
        resolution_note: null,
        resolution_action: null
    },
    {
        id: 'an3',
        token_id: 'tok-003',
        token_hash: 'M3N4O5P6Q7R8S9T0',
        anomaly_type: 'REPEATED_FAILURE',
        severity: 'MEDIUM',
        reason: '5 consecutive failed scan attempts',
        metadata: {
            failure_count: 5,
            failure_reasons: ['Invalid token', 'Token expired'],
            first_failure: '2026-03-07T08:00:00Z',
            last_failure: '2026-03-07T08:15:00Z'
        },
        student_name: 'Rohit Singh',
        student_id: 'stu-003',
        school_id: 'sch-001',
        school_name: 'Green Valley School',
        ip_address: '49.36.89.100',
        ip_city: 'Delhi',
        device: 'Chrome/Windows',
        parent_phone: '+919876543212',
        parent_email: 'rohit.parent@example.com',
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        resolved: false,
        resolved_at: null,
        resolved_by: null,
        resolved_by_name: null,
        resolution_note: null,
        resolution_action: null
    },
    {
        id: 'an4',
        token_id: 'tok-004',
        token_hash: 'S9T0U1V2W3X4Y5Z6',
        anomaly_type: 'AFTER_HOURS',
        severity: 'LOW',
        reason: 'Scan at 11:45 PM, outside school hours (8 AM - 5 PM)',
        metadata: {
            scan_time: '23:45:00',
            school_hours_start: '08:00',
            school_hours_end: '17:00',
            is_holiday: false
        },
        student_name: 'Sneha Gupta',
        student_id: 'stu-004',
        school_id: 'sch-001',
        school_name: 'Green Valley School',
        ip_address: '117.96.44.201',
        ip_city: 'Pune',
        device: 'Firefox/Linux',
        parent_phone: '+919876543213',
        parent_email: 'sneha.parent@example.com',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        resolved: true,
        resolved_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        resolved_by: 'admin-001',
        resolved_by_name: 'Rajesh Kumar (School Admin)',
        resolution_note: 'Confirmed school event after hours - debate competition',
        resolution_action: 'VERIFIED_SAFE'
    },
    {
        id: 'an5',
        token_id: 'tok-005',
        token_hash: 'Y5Z6A7B8C9D0E1F2',
        anomaly_type: 'SUSPICIOUS_IP',
        severity: 'HIGH',
        reason: 'Scan from IP associated with known malicious activity',
        metadata: {
            ip_reputation_score: 15,
            known_threats: ['Brute force', 'Scraping'],
            country: 'RU',
            isp: 'Unknown'
        },
        student_name: 'Karan Kumar',
        student_id: 'stu-005',
        school_id: 'sch-001',
        school_name: 'Green Valley School',
        ip_address: '59.160.31.7',
        ip_city: 'Kolkata',
        device: 'Chrome/Android',
        parent_phone: '+919876543214',
        parent_email: 'karan.parent@example.com',
        created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        resolved: true,
        resolved_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        resolved_by: 'admin-002',
        resolved_by_name: 'Priya Sharma (School Admin)',
        resolution_note: 'Student on school trip. IP belongs to school bus WiFi.',
        resolution_action: 'VERIFIED_SAFE'
    }
];

// ─── Resolution Modal ─────────────────────────────────────────────────────────
const ResolutionModal = ({ anomaly, onClose, onResolve }) => {
    const [notes, setNotes] = useState('');
    const [selectedAction, setSelectedAction] = useState('VERIFIED_SAFE');
    const [notifyParent, setNotifyParent] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const typeMeta = ANOMALY_TYPES[anomaly.anomaly_type] || ANOMALY_TYPES.HIGH_FREQUENCY;
    const TypeIcon = typeMeta.icon;

    const handleSubmit = async () => {
        if (!notes.trim()) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 800));
        onResolve(anomaly.id, selectedAction, notes, notifyParent);
        setSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: typeMeta.bg }}>
                            <TypeIcon size={18} color={typeMeta.color} />
                        </div>
                        <div>
                            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0">Resolve Anomaly</h3>
                            <p className="text-xs text-[var(--text-muted)]">{typeMeta.label} · {anomaly.student_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-slate-100">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Anomaly Summary */}
                    <div className="p-4 rounded-xl" style={{ background: typeMeta.bg }}>
                        <p className="text-sm font-medium mb-1" style={{ color: typeMeta.color }}>Reason</p>
                        <p className="text-sm text-[var(--text-primary)]">{anomaly.reason}</p>
                        {anomaly.metadata && Object.keys(anomaly.metadata).length > 0 && (
                            <details className="mt-3">
                                <summary className="text-xs font-medium cursor-pointer" style={{ color: typeMeta.color }}>View Metadata</summary>
                                <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-x-auto">
                                    {JSON.stringify(anomaly.metadata, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>

                    {/* Action Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Resolution Action</label>
                        <div className="space-y-2">
                            {RESOLUTION_ACTIONS.map(action => (
                                <button
                                    key={action.id}
                                    type="button"
                                    onClick={() => setSelectedAction(action.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedAction === action.id
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-[var(--border-default)] bg-white hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${action.color}20` }}>
                                            <action.icon size={14} color={action.color} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{action.label}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{action.description}</div>
                                        </div>
                                        {selectedAction === action.id && <Check size={14} color="#7C3AED" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resolution Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                            Resolution Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Describe the action taken or reason for resolution..."
                            rows={3}
                            className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-purple-500 resize-none"
                        />
                    </div>

                    {/* Notify Parent */}
                    {selectedAction !== 'REVOKE_TOKEN' && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
                            <input
                                type="checkbox"
                                checked={notifyParent}
                                onChange={e => setNotifyParent(e.target.checked)}
                                id="notifyParent"
                                className="w-4 h-4"
                            />
                            <label htmlFor="notifyParent" className="text-sm cursor-pointer">
                                Notify parent via SMS/Email about this resolution
                            </label>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[var(--border-default)] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !notes.trim()}
                        className="px-5 py-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    >
                        {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        Resolve Anomaly
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Anomaly Card Component ───────────────────────────────────────────────────
const AnomalyCard = ({ anomaly, onResolve, canAct }) => {
    const [expanded, setExpanded] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);

    const typeMeta = ANOMALY_TYPES[anomaly.anomaly_type] || ANOMALY_TYPES.HIGH_FREQUENCY;
    const severityMeta = SEVERITY_COLORS[anomaly.severity] || SEVERITY_COLORS.MEDIUM;
    const TypeIcon = typeMeta.icon;

    const getActionBadge = (action) => {
        const badges = {
            VERIFIED_SAFE: { label: '✓ Verified Safe', color: '#10B981', bg: '#ECFDF5' },
            CONTACT_PARENT: { label: '📞 Parent Notified', color: '#3B82F6', bg: '#EFF6FF' },
            REVOKE_TOKEN: { label: '🔒 Token Revoked', color: '#EF4444', bg: '#FEF2F2' },
            ESCALATE: { label: '⚠️ Escalated', color: '#F59E0B', bg: '#FFFBEB' }
        };
        return badges[action] || { label: action, color: '#64748B', bg: '#F1F5F9' };
    };

    const actionBadge = anomaly.resolution_action ? getActionBadge(anomaly.resolution_action) : null;

    return (
        <>
            <div className={`bg-white rounded-xl border transition-all hover:shadow-md ${anomaly.resolved ? 'border-[var(--border-default)] opacity-80' : 'border-l-4'
                }`} style={!anomaly.resolved ? { borderLeftColor: typeMeta.color } : {}}>
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: typeMeta.bg }}>
                            <TypeIcon size={22} color={typeMeta.color} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="font-bold text-[var(--text-primary)]">{anomaly.student_name}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: typeMeta.bg, color: typeMeta.color }}>
                                    {typeMeta.label}
                                </span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: severityMeta.bg, color: severityMeta.color }}>
                                    {severityMeta.label}
                                </span>
                                {anomaly.resolved && (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                        ✓ Resolved
                                    </span>
                                )}
                            </div>

                            {/* Reason */}
                            <p className="text-sm text-[var(--text-secondary)] mb-2">{anomaly.reason}</p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)] mb-3">
                                <span className="flex items-center gap-1"><Clock size={12} /> {formatRelativeTime(anomaly.created_at)}</span>
                                <span className="flex items-center gap-1"><MapPin size={12} /> {anomaly.ip_city}</span>
                                <span className="flex items-center gap-1"><Monitor size={12} /> {anomaly.device}</span>
                                <span className="flex items-center gap-1"><Hash size={12} /> {maskTokenHash(anomaly.token_hash)}</span>
                            </div>

                            {/* Resolution Info */}
                            {anomaly.resolved && anomaly.resolution_note && (
                                <div className="mt-3 p-3 rounded-lg bg-emerald-50 border-l-4 border-emerald-500">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="text-xs font-semibold text-emerald-700">Resolution:</span>
                                                {actionBadge && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: actionBadge.bg, color: actionBadge.color }}>
                                                        {actionBadge.label}
                                                    </span>
                                                )}
                                                <span className="text-xs text-emerald-600">by {anomaly.resolved_by_name}</span>
                                            </div>
                                            <p className="text-sm text-emerald-800">{anomaly.resolution_note}</p>
                                            <p className="text-xs text-emerald-600 mt-1">Resolved {formatRelativeTime(anomaly.resolved_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Expandable Metadata */}
                            {expanded && anomaly.metadata && Object.keys(anomaly.metadata).length > 0 && (
                                <div className="mt-3 p-3 rounded-lg bg-slate-50">
                                    <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Metadata</p>
                                    <pre className="text-xs font-mono overflow-x-auto">
                                        {JSON.stringify(anomaly.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                            {!anomaly.resolved && canAct && (
                                <button
                                    onClick={() => setShowResolveModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                                >
                                    <Flag size={14} /> Resolve
                                </button>
                            )}
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="w-8 h-8 rounded-lg border border-[var(--border-default)] bg-white flex items-center justify-center hover:bg-slate-50 transition-colors"
                            >
                                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showResolveModal && (
                <ResolutionModal
                    anomaly={anomaly}
                    onClose={() => setShowResolveModal(false)}
                    onResolve={onResolve}
                />
            )}
        </>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Anomalies() {
    const { user, can } = useAuth();
    const { showToast } = useToast();
    const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
    const [filter, setFilter] = useState('UNRESOLVED');
    const [severityFilter, setSeverityFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 300);

    const canAct = can('anomalies.manage') || user?.role === 'SCHOOL_ADMIN';

    // Filter anomalies (only current school's anomalies)
    const myAnomalies = anomalies.filter(a => a.school_id === (user?.school_id || 'sch_001'));

    const stats = {
        total: myAnomalies.length,
        unresolved: myAnomalies.filter(a => !a.resolved).length,
        resolved: myAnomalies.filter(a => a.resolved).length,
        bySeverity: {
            CRITICAL: myAnomalies.filter(a => a.severity === 'CRITICAL' && !a.resolved).length,
            HIGH: myAnomalies.filter(a => a.severity === 'HIGH' && !a.resolved).length,
            MEDIUM: myAnomalies.filter(a => a.severity === 'MEDIUM' && !a.resolved).length,
            LOW: myAnomalies.filter(a => a.severity === 'LOW' && !a.resolved).length
        }
    };

    const filteredAnomalies = myAnomalies.filter(a => {
        const matchFilter = filter === 'ALL' ? true : filter === 'UNRESOLVED' ? !a.resolved : a.resolved;
        const matchSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
        const matchType = typeFilter === 'ALL' || a.anomaly_type === typeFilter;
        const matchSearch = !debouncedSearch ||
            a.student_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            a.token_hash.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            a.ip_address.includes(debouncedSearch);
        return matchFilter && matchSeverity && matchType && matchSearch;
    });

    const handleResolve = (id, action, notes, notifyParent) => {
        setAnomalies(prev => prev.map(a => {
            if (a.id === id) {
                return {
                    ...a,
                    resolved: true,
                    resolved_at: new Date().toISOString(),
                    resolved_by: user?.id || 'admin-001',
                    resolved_by_name: user?.name || 'School Admin',
                    resolution_note: notes,
                    resolution_action: action
                };
            }
            return a;
        }));

        let message = '';
        switch (action) {
            case 'VERIFIED_SAFE':
                message = 'Anomaly marked as safe. No further action needed.';
                break;
            case 'CONTACT_PARENT':
                message = notifyParent ? 'Parent notified. Action recorded.' : 'Action recorded. Parent notification skipped.';
                break;
            case 'REVOKE_TOKEN':
                message = 'Token revoked successfully. Parent will be notified.';
                break;
            case 'ESCALATE':
                message = 'Issue escalated to super admin for review.';
                break;
            default:
                message = 'Action completed successfully.';
        }
        showToast(message, 'success');
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await new Promise(r => setTimeout(r, 1000));
        setRefreshing(false);
        showToast('Anomalies refreshed', 'info');
    };

    const handleExport = () => {
        const csv = [
            ['ID', 'Student', 'Type', 'Severity', 'Reason', 'IP', 'Device', 'Created', 'Resolved', 'Resolution Action', 'Resolution Note'],
            ...filteredAnomalies.map(a => [
                a.id, a.student_name, a.anomaly_type, a.severity, a.reason,
                a.ip_address, a.device, a.created_at, a.resolved ? 'Yes' : 'No',
                a.resolution_action || '', a.resolution_note || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anomalies_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Export started', 'success');
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <ShieldAlert size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0">Scan Anomalies</h1>
                                <p className="text-sm text-[var(--text-muted)] mt-0.5">Monitor and respond to suspicious scan activities</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50"
                        >
                            <Download size={14} /> Export
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Alerts</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-red-600">{stats.unresolved}</div>
                    <div className="text-xs text-[var(--text-muted)]">Unresolved</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div>
                    <div className="text-xs text-[var(--text-muted)]">Resolved</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-amber-600">{stats.bySeverity.CRITICAL + stats.bySeverity.HIGH}</div>
                    <div className="text-xs text-[var(--text-muted)]">Critical/High</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                        {stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Resolution Rate</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-6">
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Status Tabs */}
                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                        {[
                            ['UNRESOLVED', `Unresolved (${stats.unresolved})`],
                            ['RESOLVED', `Resolved (${stats.resolved})`],
                            ['ALL', `All (${stats.total})`]
                        ].map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === key
                                    ? 'bg-white text-purple-600 shadow-sm'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Severity Filter */}
                    <select
                        value={severityFilter}
                        onChange={e => setSeverityFilter(e.target.value)}
                        className="py-1.5 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white"
                    >
                        <option value="ALL">All Severities</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="py-1.5 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white min-w-[160px]"
                    >
                        <option value="ALL">All Types</option>
                        {Object.entries(ANOMALY_TYPES).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by student, token, IP..."
                            className="w-full py-1.5 pl-9 pr-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Anomaly List */}
            {filteredAnomalies.length === 0 ? (
                <div className="bg-white rounded-xl border border-[var(--border-default)] py-16 text-center">
                    <Shield size={48} className="mx-auto mb-3 text-[var(--text-muted)] opacity-30" />
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">No anomalies found</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                        {filter !== 'ALL' ? 'Try changing your filters' : 'All systems are operating normally'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAnomalies.map(anomaly => (
                        <AnomalyCard
                            key={anomaly.id}
                            anomaly={anomaly}
                            onResolve={handleResolve}
                            canAct={canAct && !anomaly.resolved}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}