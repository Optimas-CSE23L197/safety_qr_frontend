/**
 * SUPER ADMIN — TOKEN CONTROL
 * Inspect token lifecycle, activity, and perform administrative actions.
 * Aligned with Token model from schema:
 * - id, token_hash, status, student_id, school_id, batch_id, order_id
 * - activated_at, assigned_at, expires_at, revoked_at
 * - is_honeypot, replaced_by_id
 */

import { useState } from 'react';
import {
    Search, Copy, RefreshCw, User, Building2, Calendar, Activity,
    ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, Cpu,
    Hash, MapPin, Smartphone, Eye, Ban, RotateCcw, Trash2,
    FileText, AlertOctagon, Shield, Check, X, ChevronRight,
    Loader2, ExternalLink
} from 'lucide-react';
import { formatDate, formatDateTime, formatRelativeTime, maskTokenHash } from '../../../utils/formatters.js';

// ─── Mock Token Data (Matches Schema) ─────────────────────────────────────────
const MOCK_TOKENS_DB = {
    'QR-A1B2C3D4': {
        id: 'tok_001',
        token_hash: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
        status: 'ACTIVE',
        is_honeypot: false,
        student_id: 'stu_001',
        student: { id: 'stu_001', full_name: 'Rahul Sharma', class: '10A', roll_number: '24', admission_number: 'ADM-2024-001' },
        school_id: 'sch_001',
        school: { id: 'sch_001', name: 'Green Valley School', code: 'GVS-2024-001', city: 'New Delhi' },
        batch_id: 'batch_001',
        batch_name: 'Batch-001',
        order_id: 'ORD-2024-001',
        activated_at: '2025-01-02T10:30:00Z',
        assigned_at: '2025-01-02T11:00:00Z',
        expires_at: '2026-01-01T23:59:59Z',
        revoked_at: null,
        revoked_reason: null,
        replaced_by_id: null,
        created_at: '2025-01-01T09:00:00Z',
        scan_activity: {
            total_scans: 342,
            last_scan: new Date(Date.now() - 3600000 * 2).toISOString(),
            last_scan_location: { city: 'New Delhi', lat: 28.6139, lng: 77.2090 },
            last_scan_device: 'iPhone 15 Pro · iOS 17.2',
            last_scan_ip: '103.58.92.10',
            scan_today: 2,
            scan_this_week: 18
        },
        anomalies: {
            total: 1,
            last_anomaly: new Date(Date.now() - 86400000 * 3).toISOString(),
            last_anomaly_type: 'AFTER_HOURS',
            resolved: true
        },
        risk_score: 15,
        risk_level: 'LOW'
    },
    'QR-REVOKED01': {
        id: 'tok_002',
        token_hash: 'R3V0K3D7O8K9E0Y1U2I3O4P5A6S7D8F9G0',
        status: 'REVOKED',
        is_honeypot: false,
        student_id: 'stu_002',
        student: { id: 'stu_002', full_name: 'Priya Patel', class: '9B', roll_number: '12', admission_number: 'ADM-2024-002' },
        school_id: 'sch_001',
        school: { id: 'sch_001', name: 'Green Valley School', code: 'GVS-2024-001', city: 'New Delhi' },
        batch_id: 'batch_001',
        batch_name: 'Batch-001',
        order_id: 'ORD-2024-001',
        activated_at: '2025-01-05T09:15:00Z',
        assigned_at: '2025-01-05T10:00:00Z',
        expires_at: '2026-01-04T23:59:59Z',
        revoked_at: '2025-11-15T14:30:00Z',
        revoked_reason: 'Token lost reported by parent',
        replaced_by_id: 'tok_005',
        created_at: '2025-01-04T08:00:00Z',
        scan_activity: { total_scans: 89, last_scan: '2025-11-14T16:20:00Z', last_scan_location: { city: 'New Delhi' }, last_scan_device: 'Samsung S23', last_scan_ip: '182.74.1.22' },
        anomalies: { total: 2, last_anomaly: '2025-11-10T22:30:00Z', last_anomaly_type: 'AFTER_HOURS', resolved: true },
        risk_score: 45,
        risk_level: 'MEDIUM'
    },
    'QR-HONEYPOT': {
        id: 'tok_003',
        token_hash: 'H0N3YP0T7O8K9E0Y1U2I3O4P5A6S7D8F9G0',
        status: 'ACTIVE',
        is_honeypot: true,
        student_id: null,
        student: null,
        school_id: 'sch_001',
        school: { id: 'sch_001', name: 'Green Valley School', code: 'GVS-2024-001', city: 'New Delhi' },
        batch_id: 'batch_honeypot',
        batch_name: 'Honeypot-Batch',
        order_id: null,
        activated_at: '2025-02-01T00:00:00Z',
        assigned_at: null,
        expires_at: '2026-02-01T23:59:59Z',
        revoked_at: null,
        revoked_reason: null,
        replaced_by_id: null,
        created_at: '2025-01-30T12:00:00Z',
        scan_activity: { total_scans: 156, last_scan: new Date(Date.now() - 3600000).toISOString(), last_scan_location: { city: 'Mumbai' }, last_scan_device: 'Unknown', last_scan_ip: '45.67.89.10' },
        anomalies: { total: 12, last_anomaly: new Date(Date.now() - 1800000).toISOString(), last_anomaly_type: 'BULK_SCRAPING', resolved: false },
        risk_score: 95,
        risk_level: 'CRITICAL'
    }
};

// ─── Status Config (Matches TokenStatus Enum) ─────────────────────────────────
const STATUS_CONFIG = {
    ACTIVE: { label: 'Active', color: '#10B981', bg: '#ECFDF5', Icon: CheckCircle, border: '#10B981' },
    UNASSIGNED: { label: 'Unassigned', color: '#6B7280', bg: '#F3F4F6', Icon: Clock, border: '#CBD5E1' },
    ISSUED: { label: 'Issued', color: '#3B82F6', bg: '#EFF6FF', Icon: Eye, border: '#3B82F6' },
    INACTIVE: { label: 'Inactive', color: '#9CA3AF', bg: '#F9FAFB', Icon: AlertTriangle, border: '#CBD5E1' },
    REVOKED: { label: 'Revoked', color: '#EF4444', bg: '#FEF2F2', Icon: XCircle, border: '#EF4444' },
    EXPIRED: { label: 'Expired', color: '#F59E0B', bg: '#FFFBEB', Icon: AlertOctagon, border: '#F59E0B' },
};

const RISK_CONFIG = {
    LOW: { label: 'Low Risk', color: '#10B981', bg: '#ECFDF5', Icon: Shield },
    MEDIUM: { label: 'Medium Risk', color: '#F59E0B', bg: '#FFFBEB', Icon: AlertTriangle },
    HIGH: { label: 'High Risk', color: '#EF4444', bg: '#FEF2F2', Icon: AlertOctagon },
    CRITICAL: { label: 'Critical', color: '#991B1B', bg: '#FEF2F2', Icon: ShieldAlert },
};

// ─── Components ────────────────────────────────────────────────────────────────
const InfoCard = ({ title, icon: Icon, children }) => (
    <div className="border border-[var(--border-default)] rounded-xl p-4 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-3">
            <Icon size={14} className="text-[var(--text-muted)]" />
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">{title}</span>
        </div>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoRow = ({ label, value, mono, highlight }) => (
    <div className="flex justify-between items-start">
        <span className="text-xs text-[var(--text-muted)] font-medium">{label}</span>
        <span className={`text-sm ${mono ? 'font-mono' : ''} ${highlight ? 'font-semibold text-amber-600' : 'text-[var(--text-primary)]'} text-right break-all max-w-[180px]`}>
            {value || '—'}
        </span>
    </div>
);

const ActionButton = ({ label, icon: Icon, color, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: `${color}10`, color: color, border: `1px solid ${color}30` }}
        onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; }}
    >
        {Icon && <Icon size={13} />} {label}
    </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TokenControlPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError(null);
        await new Promise(r => setTimeout(r, 600));

        const found = MOCK_TOKENS_DB[searchQuery.toUpperCase()];
        if (found) {
            setToken(found);
            setError(null);
        } else {
            setToken(null);
            setError('Token not found. Please check the token hash or QR ID.');
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAction = async (action, tokenId) => {
        setActionLoading(action);
        await new Promise(r => setTimeout(r, 800));
        console.log(`Action: ${action} on token ${tokenId}`);
        setActionLoading(null);
    };

    const statusConfig = token ? STATUS_CONFIG[token.status] || STATUS_CONFIG.UNASSIGNED : null;
    const riskConfig = token ? RISK_CONFIG[token.risk_level] || RISK_CONFIG.LOW : null;
    const StatusIcon = statusConfig?.Icon;
    const RiskIcon = riskConfig?.Icon;

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                        <Cpu size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0">Token Control</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">Inspect token lifecycle, activity, and perform administrative actions</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-6 shadow-sm">
                <div className="flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter token hash, QR ID, or token ID..."
                            className="w-full py-2.5 pl-10 pr-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                        {loading ? 'Searching...' : 'Search Token'}
                    </button>
                </div>
                {error && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                        <AlertTriangle size={14} /> {error}
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-12 text-center">
                    <Loader2 size={32} className="animate-spin text-brand-600 mx-auto mb-3" />
                    <p className="text-[var(--text-muted)]">Fetching token data...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !token && !error && (
                <div className="bg-white rounded-xl border-2 border-dashed border-[var(--border-default)] p-12 text-center">
                    <Cpu size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-30" />
                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Search for a token</h3>
                    <p className="text-sm text-[var(--text-muted)]">Enter a token hash or QR ID above to inspect its details</p>
                </div>
            )}

            {/* Token Details */}
            {!loading && token && statusConfig && (
                <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden shadow-sm">
                    {/* Status Bar */}
                    <div className="h-1" style={{ background: statusConfig.border }} />

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: statusConfig.bg }}>
                                    <StatusIcon size={22} color={statusConfig.color} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="font-mono font-bold text-lg bg-slate-100 px-3 py-1 rounded-lg">
                                            {maskTokenHash(token.token_hash)}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(token.token_hash)}
                                            className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                                            title="Copy full hash"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-[var(--text-muted)]" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                                            <StatusIcon size={10} /> {statusConfig.label}
                                        </span>
                                        {token.is_honeypot && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                <Shield size={10} /> Honeypot Token
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: riskConfig.bg, color: riskConfig.color }}>
                                            <RiskIcon size={10} /> {riskConfig.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={16} className="text-[var(--text-muted)]" />
                            </button>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Token Info */}
                            <InfoCard title="Token Info" icon={Hash}>
                                <InfoRow label="Token ID" value={token.id} mono />
                                <InfoRow label="Batch" value={token.batch_name} />
                                <InfoRow label="Order ID" value={token.order_id || '—'} mono />
                                <InfoRow label="Created" value={formatDate(token.created_at)} />
                            </InfoCard>

                            {/* Student Info */}
                            <InfoCard title="Student" icon={User}>
                                {token.student ? (
                                    <>
                                        <InfoRow label="Name" value={token.student.full_name} />
                                        <InfoRow label="Class/Section" value={`${token.student.class || '—'} · ${token.student.section || '—'}`} />
                                        <InfoRow label="Roll No" value={token.student.roll_number || '—'} />
                                        <InfoRow label="Admission No" value={token.student.admission_number || '—'} />
                                    </>
                                ) : (
                                    <InfoRow label="Status" value="Not assigned" highlight />
                                )}
                            </InfoCard>

                            {/* School Info */}
                            <InfoCard title="School" icon={Building2}>
                                <InfoRow label="School Name" value={token.school.name} />
                                <InfoRow label="School Code" value={token.school.code} mono />
                                <InfoRow label="City" value={token.school.city} />
                            </InfoCard>

                            {/* Lifecycle */}
                            <InfoCard title="Lifecycle" icon={Calendar}>
                                <InfoRow label="Activated" value={formatDate(token.activated_at)} />
                                <InfoRow label="Assigned" value={formatDate(token.assigned_at)} />
                                <InfoRow label="Expires" value={formatDate(token.expires_at)} highlight={new Date(token.expires_at) < new Date(Date.now() + 30 * 86400000)} />
                                {token.revoked_at && <InfoRow label="Revoked" value={formatDate(token.revoked_at)} />}
                            </InfoCard>
                        </div>

                        {/* Scan Activity Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <InfoCard title="Scan Activity" icon={Activity}>
                                <InfoRow label="Total Scans" value={token.scan_activity.total_scans?.toLocaleString()} />
                                <InfoRow label="Today" value={token.scan_activity.scan_today || 0} />
                                <InfoRow label="This Week" value={token.scan_activity.scan_this_week || 0} />
                                <InfoRow label="Last Scan" value={formatRelativeTime(token.scan_activity.last_scan)} />
                                <InfoRow label="Last Device" value={token.scan_activity.last_scan_device} />
                                <InfoRow label="Last IP" value={token.scan_activity.last_scan_ip} mono />
                                {token.scan_activity.last_scan_location?.city && (
                                    <InfoRow label="Last Location" value={token.scan_activity.last_scan_location.city} />
                                )}
                            </InfoCard>

                            {/* Anomalies Section */}
                            <InfoCard title="Security & Anomalies" icon={ShieldAlert}>
                                <InfoRow label="Total Anomalies" value={token.anomalies.total} />
                                {token.anomalies.last_anomaly && (
                                    <>
                                        <InfoRow label="Last Anomaly" value={formatRelativeTime(token.anomalies.last_anomaly)} />
                                        <InfoRow label="Anomaly Type" value={token.anomalies.last_anomaly_type?.replace('_', ' ') || '—'} />
                                    </>
                                )}
                                <InfoRow label="Risk Score" value={`${token.risk_score}/100`} highlight={token.risk_score > 50} />
                                {token.revoked_reason && <InfoRow label="Revoke Reason" value={token.revoked_reason} />}
                                {token.replaced_by_id && <InfoRow label="Replaced By" value={maskTokenHash(token.replaced_by_id)} mono />}
                            </InfoCard>
                        </div>

                        {/* Token Actions */}
                        <div className="pt-4 border-t border-[var(--border-default)]">
                            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Token Actions</div>
                            <div className="flex flex-wrap gap-2">
                                {token.status === 'ACTIVE' && (
                                    <>
                                        <ActionButton label="Revoke Token" icon={Ban} color="#EF4444" onClick={() => handleAction('revoke', token.id)} disabled={actionLoading === 'revoke'} />
                                        <ActionButton label="Replace Token" icon={RotateCcw} color="#F59E0B" onClick={() => handleAction('replace', token.id)} disabled={actionLoading === 'replace'} />
                                        <ActionButton label="Reset Token" icon={RefreshCw} color="#3B82F6" onClick={() => handleAction('reset', token.id)} disabled={actionLoading === 'reset'} />
                                    </>
                                )}
                                {token.status === 'REVOKED' && (
                                    <ActionButton label="View Replacement" icon={ExternalLink} color="#6366F1" onClick={() => handleAction('viewReplacement', token.id)} />
                                )}
                                <ActionButton label="View Scan Logs" icon={FileText} color="#8B5CF6" onClick={() => handleAction('scanLogs', token.id)} />
                                <ActionButton label="View Anomalies" icon={AlertOctagon} color="#F59E0B" onClick={() => handleAction('anomalies', token.id)} />
                                {token.is_honeypot && (
                                    <ActionButton label="Honeypot Analytics" icon={Shield} color="#7C3AED" onClick={() => handleAction('honeypot', token.id)} />
                                )}
                                <div className="flex-1" />
                                <ActionButton label="Delete Permanently" icon={Trash2} color="#DC2626" onClick={() => handleAction('delete', token.id)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
