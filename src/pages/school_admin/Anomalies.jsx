import React from 'react';
import { useState } from 'react';
import {
    AlertTriangle, CheckCircle, Eye, MapPin, Monitor, Shield,
    ShieldAlert, Phone, Mail, MessageCircle, Flag, X, Bell,
    Send, Clock, User, Activity, Lock, Unlock, FileText,
    ChevronDown, ChevronUp, ExternalLink, ThumbsUp, ThumbsDown,
    Info
} from 'lucide-react';
import { formatRelativeTime, formatDateTime, humanizeEnum, maskTokenHash } from '../../utils/formatters.js';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';

const ANOMALY_TYPES = {
    FOREIGN_LOCATION: {
        label: 'Foreign Location',
        color: '#B91C1C',
        bg: '#FEF2F2',
        icon: '🌍',
        severity: 'HIGH',
        description: 'Token scanned from an unusual geographic location'
    },
    MULTI_TOKEN_SINGLE_DEVICE: {
        label: 'Multi-Token Device',
        color: '#92400E',
        bg: '#FFFBEB',
        icon: '📱',
        severity: 'MEDIUM',
        description: 'Multiple tokens used on same device'
    },
    HIGH_FREQUENCY: {
        label: 'High Frequency',
        color: '#1D4ED8',
        bg: '#EFF6FF',
        icon: '⚡',
        severity: 'MEDIUM',
        description: 'Unusually high number of scans in short time'
    },
    AFTER_HOURS: {
        label: 'After Hours',
        color: '#6D28D9',
        bg: '#F5F3FF',
        icon: '🌙',
        severity: 'LOW',
        description: 'Scan occurred outside school operating hours'
    },
    SUSPICIOUS_IP: {
        label: 'Suspicious IP',
        color: '#DC2626',
        bg: '#FEF2F2',
        icon: '⚠️',
        severity: 'HIGH',
        description: 'Scan from known suspicious IP address'
    },
    BULK_SCRAPING: {
        label: 'Bulk Scraping',
        color: '#7C3AED',
        bg: '#EDE9FE',
        icon: '🔄',
        severity: 'CRITICAL',
        description: 'Multiple tokens scanned in rapid succession'
    }
};

const SEVERITY_COLORS = {
    CRITICAL: { bg: '#7F1A1A', color: '#FEF2F2', label: 'Critical' },
    HIGH: { bg: '#991B1B', color: '#FEF2F2', label: 'High' },
    MEDIUM: { bg: '#B45309', color: '#FEF2F2', label: 'Medium' },
    LOW: { bg: '#065F46', color: '#FEF2F2', label: 'Low' }
};

const MOCK_ANOMALIES = [
    {
        id: 'an1',
        type: 'FOREIGN_LOCATION',
        student_name: 'Aarav Sharma',
        student_id: 'stu-001',
        token_hash: 'A1B2C3D4E5F6',
        ip_city: 'Jaipur',
        ip_address: '182.74.1.22',
        device: 'Chrome/Android',
        location: { lat: 26.9124, lng: 75.7873 },
        scan_location: { lat: 28.6139, lng: 77.2090, city: 'Delhi' },
        parent_phone: '+919876543210',
        parent_email: 'aarav.parent@example.com',
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        resolved: false,
        notes: null,
        severity: 'HIGH',
        school_action_taken: null
    },
    {
        id: 'an2',
        type: 'MULTI_TOKEN_SINGLE_DEVICE',
        student_name: 'Priya Patel',
        student_id: 'stu-002',
        token_hash: 'G7H8I9J0K1L2',
        ip_city: 'Mumbai',
        ip_address: '103.21.58.14',
        device: 'Safari/iOS',
        location: { lat: 19.0760, lng: 72.8777 },
        parent_phone: '+919876543211',
        parent_email: 'priya.parent@example.com',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        resolved: false,
        notes: null,
        severity: 'MEDIUM',
        school_action_taken: null
    },
    {
        id: 'an3',
        type: 'HIGH_FREQUENCY',
        student_name: 'Rohit Singh',
        student_id: 'stu-003',
        token_hash: 'M3N4O5P6Q7R8',
        ip_city: 'Delhi',
        ip_address: '49.36.89.100',
        device: 'Chrome/Windows',
        location: { lat: 28.7041, lng: 77.1025 },
        parent_phone: '+919876543212',
        parent_email: 'rohit.parent@example.com',
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        resolved: false,
        notes: null,
        frequency_count: 12,
        time_window: '5 minutes',
        severity: 'MEDIUM',
        school_action_taken: null
    },
    {
        id: 'an4',
        type: 'AFTER_HOURS',
        student_name: 'Sneha Gupta',
        student_id: 'stu-004',
        token_hash: 'S9T0U1V2W3X4',
        ip_city: 'Pune',
        ip_address: '117.96.44.201',
        device: 'Firefox/Linux',
        location: { lat: 18.5204, lng: 73.8567 },
        parent_phone: '+919876543213',
        parent_email: 'sneha.parent@example.com',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        resolved: true,
        notes: 'Confirmed school event after hours - debate competition',
        severity: 'LOW',
        school_action_taken: 'NOTIFIED_PARENT'
    },
    {
        id: 'an5',
        type: 'SUSPICIOUS_IP',
        student_name: 'Karan Kumar',
        student_id: 'stu-005',
        token_hash: 'Y5Z6A7B8C9D0',
        ip_city: 'Kolkata',
        ip_address: '59.160.31.7',
        device: 'Chrome/Android',
        location: { lat: 22.5726, lng: 88.3639 },
        parent_phone: '+919876543214',
        parent_email: 'karan.parent@example.com',
        created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        resolved: true,
        notes: 'Student on school trip. IP belongs to school bus WiFi.',
        severity: 'HIGH',
        school_action_taken: 'VERIFIED_SAFE'
    }
];

const ActionModal = ({ anomaly, onClose, onAction, actionType }) => {
    const [notes, setNotes] = useState('');
    const [notifyParent, setNotifyParent] = useState(true);
    const [selectedAction, setSelectedAction] = useState(actionType);

    const getActionTitle = () => {
        switch (selectedAction) {
            case 'CONTACT_PARENT': return 'Contact Parent';
            case 'REVOKE_TOKEN': return 'Revoke Token';
            case 'MARK_SAFE': return 'Mark as Safe';
            case 'ESCALATE': return 'Escalate to Admin';
            default: return 'Resolve Anomaly';
        }
    };

    const getActionButtonStyle = () => {
        switch (selectedAction) {
            case 'REVOKE_TOKEN': return { background: '#DC2626', color: 'white' };
            case 'MARK_SAFE': return { background: '#10B981', color: 'white' };
            case 'ESCALATE': return { background: '#F59E0B', color: 'white' };
            default: return { background: '#2563EB', color: 'white' };
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--border-default)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: `${getActionButtonStyle().background}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {selectedAction === 'CONTACT_PARENT' && <Phone size={20} color={getActionButtonStyle().background} />}
                            {selectedAction === 'REVOKE_TOKEN' && <Lock size={20} color={getActionButtonStyle().background} />}
                            {selectedAction === 'MARK_SAFE' && <CheckCircle size={20} color={getActionButtonStyle().background} />}
                            {selectedAction === 'ESCALATE' && <AlertTriangle size={20} color={getActionButtonStyle().background} />}
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{getActionTitle()}</h3>
                    </div>
                    <button onClick={onClose} style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'white',
                        cursor: 'pointer'
                    }}>
                        <X size={16} />
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    <div style={{
                        background: 'var(--color-slate-50)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 600 }}>Student:</span>
                            <span>{anomaly.student_name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontWeight: 600 }}>Anomaly Type:</span>
                            <span>{ANOMALY_TYPES[anomaly.type]?.label}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600 }}>Time:</span>
                            <span>{formatDateTime(anomaly.created_at)}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                            Action Notes *
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Describe the action taken or reason for resolution..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid var(--border-default)',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                resize: 'vertical',
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>

                    {selectedAction !== 'REVOKE_TOKEN' && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: '#F0F9FF',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}>
                            <input
                                type="checkbox"
                                checked={notifyParent}
                                onChange={e => setNotifyParent(e.target.checked)}
                                id="notifyParent"
                                style={{ width: '18px', height: '18px' }}
                            />
                            <label htmlFor="notifyParent" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                                Notify parent via SMS/Email about this action
                            </label>
                        </div>
                    )}
                </div>

                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid var(--border-default)',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '1px solid var(--border-default)',
                            background: 'white',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onAction(selectedAction, notes, notifyParent)}
                        disabled={!notes.trim()}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '10px',
                            border: 'none',
                            ...getActionButtonStyle(),
                            cursor: notes.trim() ? 'pointer' : 'not-allowed',
                            opacity: notes.trim() ? 1 : 0.5,
                            fontWeight: 600
                        }}
                    >
                        {selectedAction === 'REVOKE_TOKEN' && 'Revoke Token'}
                        {selectedAction === 'MARK_SAFE' && 'Mark as Safe'}
                        {selectedAction === 'CONTACT_PARENT' && 'Contact Parent'}
                        {selectedAction === 'ESCALATE' && 'Escalate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ActionButtons = ({ anomaly, onAction }) => {
    const [showActions, setShowActions] = useState(false);
    const [actionType, setActionType] = useState(null);

    const actions = [
        { id: 'MARK_SAFE', label: 'Mark as Safe', icon: CheckCircle, color: '#10B981', description: 'Confirm this is a false positive' },
        { id: 'CONTACT_PARENT', label: 'Contact Parent', icon: Phone, color: '#3B82F6', description: 'Notify parent via SMS/Email' },
        { id: 'REVOKE_TOKEN', label: 'Revoke Token', icon: Lock, color: '#EF4444', description: 'Immediately disable the token' },
        { id: 'ESCALATE', label: 'Escalate', icon: AlertTriangle, color: '#F59E0B', description: 'Flag for super admin review' }
    ];

    return (
        <>
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowActions(!showActions)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-default)',
                        background: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                >
                    <Flag size={16} />
                    Take Action
                    <ChevronDown size={14} style={{ transform: showActions ? 'rotate(180deg)' : 'none' }} />
                </button>

                {showActions && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        minWidth: '240px',
                        zIndex: 10,
                        overflow: 'hidden'
                    }}>
                        {actions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => {
                                    setActionType(action.id);
                                    setShowActions(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    width: '100%',
                                    border: 'none',
                                    background: 'white',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    borderBottom: '1px solid var(--border-default)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                            >
                                <action.icon size={18} color={action.color} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{action.label}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{action.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {actionType && (
                <ActionModal
                    anomaly={anomaly}
                    onClose={() => setActionType(null)}
                    onAction={(type, notes, notifyParent) => {
                        onAction(anomaly.id, type, notes, notifyParent);
                        setActionType(null);
                    }}
                    actionType={actionType}
                />
            )}
        </>
    );
};

const AnomalyCard = ({ anomaly, onResolve, onAction, canAct }) => {
    const [expanded, setExpanded] = useState(false);
    const type = ANOMALY_TYPES[anomaly.type] || {
        label: anomaly.type,
        color: '#475569',
        bg: '#F1F5F9',
        icon: '⚠️',
        severity: 'MEDIUM'
    };
    const severity = SEVERITY_COLORS[anomaly.severity] || SEVERITY_COLORS.MEDIUM;

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            border: `1px solid ${anomaly.resolved ? 'var(--border-default)' : type.color + '40'}`,
            boxShadow: anomaly.resolved ? 'var(--shadow-card)' : `0 2px 8px ${type.color}20`,
            overflow: 'hidden',
            transition: 'all 0.2s',
            position: 'relative'
        }}>
            {/* Severity Indicator */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: type.color
            }} />

            <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* Icon */}
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: type.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0
                    }}>
                        {type.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {anomaly.student_name}
                            </span>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                background: type.bg,
                                color: type.color
                            }}>
                                {type.label}
                            </span>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                background: severity.bg,
                                color: severity.color
                            }}>
                                {severity.label} Severity
                            </span>
                            {anomaly.resolved && (
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    background: '#ECFDF5',
                                    color: '#047857'
                                }}>
                                    ✓ Resolved
                                </span>
                            )}
                        </div>

                        {/* Time */}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            {formatRelativeTime(anomaly.created_at)} · {formatDateTime(anomaly.created_at)}
                        </div>

                        {/* Details */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                                <MapPin size={14} color="var(--text-muted)" />
                                <span>{anomaly.ip_city}</span>
                                <code style={{ fontFamily: 'monospace', fontSize: '0.7rem', background: 'var(--color-slate-100)', padding: '2px 6px', borderRadius: '4px' }}>
                                    {anomaly.ip_address}
                                </code>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                                <Monitor size={14} color="var(--text-muted)" />
                                <span>{anomaly.device}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                                <AlertTriangle size={14} color="var(--text-muted)" />
                                <code style={{ fontFamily: 'monospace', fontSize: '0.7rem', background: 'var(--color-slate-100)', padding: '2px 6px', borderRadius: '4px' }}>
                                    {maskTokenHash(anomaly.token_hash)}
                                </code>
                            </div>
                        </div>

                        {/* Expandable Details */}
                        {expanded && (
                            <div style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: 'var(--color-slate-50)',
                                borderRadius: '12px',
                                display: 'grid',
                                gap: '12px'
                            }}>
                                {anomaly.frequency_count && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 600 }}>Scan Frequency:</span>
                                        <span>{anomaly.frequency_count} scans in {anomaly.time_window}</span>
                                    </div>
                                )}
                                {anomaly.scan_location && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 600 }}>Expected Location:</span>
                                        <span>{anomaly.location?.city || 'Unknown'}</span>
                                    </div>
                                )}
                                {anomaly.scan_location && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 600 }}>Actual Scan Location:</span>
                                        <span>{anomaly.scan_location.city}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 600 }}>Parent Contact:</span>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <a href={`tel:${anomaly.parent_phone}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Phone size={14} /> Call
                                        </a>
                                        <a href={`mailto:${anomaly.parent_email}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Mail size={14} /> Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resolution Note */}
                        {anomaly.notes && (
                            <div style={{
                                marginTop: '12px',
                                padding: '10px 14px',
                                background: anomaly.resolved ? '#ECFDF5' : '#FEF3C7',
                                borderRadius: '10px',
                                borderLeft: `3px solid ${anomaly.resolved ? '#10B981' : '#F59E0B'}`,
                                fontSize: '0.8125rem',
                                color: anomaly.resolved ? '#047857' : '#92400E'
                            }}>
                                <strong>{anomaly.resolved ? 'Resolution:' : 'Note:'}</strong> {anomaly.notes}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'flex-start' }}>
                        {!anomaly.resolved && canAct && (
                            <ActionButtons anomaly={anomaly} onAction={onAction} />
                        )}
                        <button
                            onClick={() => setExpanded(!expanded)}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-default)',
                                background: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Anomalies() {
    const { can, user } = useAuth();
    const { showToast } = useToast();
    const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
    const [filter, setFilter] = useState('UNRESOLVED');
    const [severityFilter, setSeverityFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [stats, setStats] = useState({ total: 0, resolved: 0, unresolved: 0, bySeverity: {} });

    // Calculate stats
    React.useEffect(() => {
        const unresolved = anomalies.filter(a => !a.resolved).length;
        const resolved = anomalies.filter(a => a.resolved).length;
        const bySeverity = {
            CRITICAL: anomalies.filter(a => a.severity === 'CRITICAL' && !a.resolved).length,
            HIGH: anomalies.filter(a => a.severity === 'HIGH' && !a.resolved).length,
            MEDIUM: anomalies.filter(a => a.severity === 'MEDIUM' && !a.resolved).length,
            LOW: anomalies.filter(a => a.severity === 'LOW' && !a.resolved).length
        };
        setStats({ total: anomalies.length, resolved, unresolved, bySeverity });
    }, [anomalies]);

    const filteredAnomalies = anomalies.filter(a => {
        const matchFilter = filter === 'ALL' ? true : filter === 'UNRESOLVED' ? !a.resolved : a.resolved;
        const matchSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
        const matchType = typeFilter === 'ALL' || a.type === typeFilter;
        return matchFilter && matchSeverity && matchType;
    });

    const handleAction = (id, actionType, notes, notifyParent) => {
        setAnomalies(prev => prev.map(a => {
            if (a.id === id) {
                return {
                    ...a,
                    resolved: true,
                    notes: notes,
                    school_action_taken: actionType,
                    resolved_at: new Date().toISOString(),
                    resolved_by: user?.name || 'School Admin'
                };
            }
            return a;
        }));

        // Show success message
        let message = '';
        switch (actionType) {
            case 'MARK_SAFE':
                message = 'Anomaly marked as safe. Student record updated.';
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

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    margin: 0,
                    background: 'linear-gradient(135deg, var(--color-brand-600), var(--color-brand-800))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Scan Anomalies
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                    Monitor and respond to suspicious scan activities
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--border-default)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Shield size={20} color="#64748B" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total Alerts</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.total}</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--border-default)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <AlertTriangle size={20} color="#EF4444" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Unresolved</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EF4444' }}>{stats.unresolved}</div>
                </div>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--border-default)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <CheckCircle size={20} color="#10B981" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Resolved</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>{stats.resolved}</div>
                </div>
            </div>

            {/* Severity Summary */}
            <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '24px',
                padding: '16px',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--border-default)'
            }}>
                {Object.entries(stats.bySeverity).map(([severity, count]) => {
                    const colors = SEVERITY_COLORS[severity];
                    return count > 0 && (
                        <div key={severity} style={{ flex: 1, minWidth: '100px' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: colors.color, marginBottom: '4px' }}>
                                {severity} Severity
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.color }}>{count}</div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '24px',
                padding: '16px',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--border-default)'
            }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                        ['UNRESOLVED', 'Unresolved', stats.unresolved],
                        ['RESOLVED', 'Resolved', stats.resolved],
                        ['ALL', 'All', stats.total]
                    ].map(([key, label, count]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '10px',
                                background: filter === key ? 'var(--color-brand-600)' : 'white',
                                border: `1px solid ${filter === key ? 'var(--color-brand-600)' : 'var(--border-default)'}`,
                                color: filter === key ? 'white' : 'var(--text-secondary)',
                                fontWeight: filter === key ? 600 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {label}
                            <span style={{
                                background: filter === key ? 'rgba(255,255,255,0.2)' : 'var(--color-slate-100)',
                                borderRadius: '20px',
                                padding: '2px 8px',
                                fontSize: '0.7rem'
                            }}>
                                {count}
                            </span>
                        </button>
                    ))}
                </div>

                <select
                    value={severityFilter}
                    onChange={e => setSeverityFilter(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-default)',
                        background: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <option value="ALL">All Severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>

                <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-default)',
                        background: 'white',
                        cursor: 'pointer',
                        flex: 1,
                        minWidth: '180px'
                    }}
                >
                    <option value="ALL">All Types</option>
                    {Object.entries(ANOMALY_TYPES).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Anomaly List */}
            {filteredAnomalies.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid var(--border-default)',
                    padding: '60px',
                    textAlign: 'center'
                }}>
                    <Shield size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>No anomalies found</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {filter !== 'ALL' ? 'Try changing your filters' : 'All systems are running smoothly'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredAnomalies.map(anomaly => (
                        <AnomalyCard
                            key={anomaly.id}
                            anomaly={anomaly}
                            onAction={handleAction}
                            canAct={can('anomalies.manage')}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}