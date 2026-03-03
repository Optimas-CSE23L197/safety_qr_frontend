/**
 * SUPER ADMIN — TOKEN CONTROL
 * Inspect token lifecycle, activity, and perform actions. Matches design system.
 */

import { useState } from 'react';
import {
    Search, Copy, RefreshCw, User, Building2, Calendar, Activity,
    ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, Cpu,
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../../utils/formatters.js';

const MOCK_TOKEN = {
    token: 'QR-A1B2C3D4',
    token_hash: 'A1B2C3D4E5F6G7H8I9J0',
    status: 'ACTIVE',
    issued_at: '2025-01-01',
    activated_at: '2025-01-02',
    expires_at: '2026-01-01',
    student: { full_name: 'Rahul Sharma', class: 'Class 9', section: 'A', student_id: 'STU2024001' },
    school: { name: 'Green Valley School', code: 'GVS001' },
    scan_count: 12,
    last_scan: new Date(Date.now() - 3600000 * 2).toISOString(),
    last_scan_city: 'Kolkata',
    risk: 'LOW',
    anomaly_count: 0,
};

const STATUS_META = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857', Icon: CheckCircle, border: '#10B981' },
    REVOKED: { bg: '#FEF2F2', color: '#B91C1C', Icon: XCircle, border: '#EF4444' },
    EXPIRED: { bg: '#FFFBEB', color: '#B45309', Icon: Clock, border: '#F59E0B' },
    INACTIVE: { bg: '#F1F5F9', color: '#475569', Icon: Clock, border: '#CBD5E1' },
};

const RISK_META = {
    LOW: { bg: '#ECFDF5', color: '#047857' },
    MEDIUM: { bg: '#FFFBEB', color: '#B45309' },
    HIGH: { bg: '#FEF2F2', color: '#B91C1C' },
};

const InfoBlock = ({ title, children }) => (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: '10px', padding: '16px', background: 'var(--color-slate-50)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{children}</div>
    </div>
);

const Detail = ({ icon: Icon, label, value, mono }) => (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'white', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={14} color="var(--text-muted)" />
        </div>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '1px' }}>{label}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{value || '—'}</div>
        </div>
    </div>
);

const ActionButton = ({ label, color, bg, border, onClick }) => (
    <button
        onClick={onClick}
        style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${border || color}40`, background: bg || `${color}10`, color, fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; }}
        onMouseLeave={e => { e.currentTarget.style.background = bg || `${color}10`; }}
    >
        {label}
    </button>
);

export default function TokenControlPage() {
    const [query, setQuery] = useState('');
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setToken(MOCK_TOKEN);
        setLoading(false);
    };

    const copyHash = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const statusMeta = token ? (STATUS_META[token.status] || STATUS_META.ACTIVE) : null;
    const riskMeta = token ? (RISK_META[token.risk] || RISK_META.LOW) : null;

    return (
        <div style={{ maxWidth: '1100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Token Control</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Inspect token lifecycle, activity, and perform administrative actions</p>
                </div>
            </div>

            {/* Search bar */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Enter token hash, QR ID, or student ID..."
                        style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 22px', borderRadius: '8px', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', flexShrink: 0 }}
                >
                    <Search size={15} /> Search Token
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '40px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
                    <RefreshCw size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--color-brand-600)', marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fetching token data…</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !token && (
                <div style={{ background: 'white', borderRadius: '12px', border: '2px dashed var(--border-default)', padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Cpu size={36} style={{ marginBottom: '12px', opacity: 0.25, display: 'block', margin: '0 auto 12px' }} />
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Search for a token</div>
                    <div style={{ fontSize: '0.875rem' }}>Enter a token hash or QR ID above to inspect its details</div>
                </div>
            )}

            {/* Token detail */}
            {!loading && token && (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                    {/* Status strip */}
                    <div style={{ height: '4px', background: statusMeta.border }} />

                    <div style={{ padding: '20px 24px' }}>
                        {/* Token header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: statusMeta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <statusMeta.Icon size={22} color={statusMeta.color} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', background: 'var(--color-slate-100)', padding: '4px 10px', borderRadius: '6px' }}>{token.token}</code>
                                        <button onClick={copyHash} style={{ border: 'none', background: 'none', cursor: 'pointer', color: copied ? '#10B981' : 'var(--text-muted)' }} title="Copy hash">
                                            {copied ? <CheckCircle size={15} /> : <Copy size={15} />}
                                        </button>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: statusMeta.bg, color: statusMeta.color }}>
                                            <statusMeta.Icon size={11} /> {token.status}
                                        </span>
                                        <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: riskMeta.bg, color: riskMeta.color }}>
                                            Risk: {token.risk}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {token.token_hash}
                                    </div>
                                </div>
                            </div>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer' }}>
                                <RefreshCw size={13} /> Refresh
                            </button>
                        </div>

                        {/* Detail grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                            <InfoBlock title="Ownership">
                                <Detail icon={User} label="Student" value={token.student.full_name} />
                                <Detail icon={User} label="Student ID" value={token.student.student_id} mono />
                                <Detail icon={Building2} label="School" value={token.school.name} />
                            </InfoBlock>
                            <InfoBlock title="Student">
                                <Detail icon={User} label="Class" value={`${token.student.class} · Section ${token.student.section}`} />
                                <Detail icon={Building2} label="School Code" value={token.school.code} mono />
                            </InfoBlock>
                            <InfoBlock title="Lifecycle">
                                <Detail icon={Calendar} label="Issued" value={formatDate(token.issued_at)} />
                                <Detail icon={Calendar} label="Activated" value={formatDate(token.activated_at)} />
                                <Detail icon={Calendar} label="Expires" value={formatDate(token.expires_at)} />
                            </InfoBlock>
                            <InfoBlock title="Activity">
                                <Detail icon={Activity} label="Total Scans" value={token.scan_count} />
                                <Detail icon={Activity} label="Last Scan" value={formatRelativeTime(token.last_scan)} />
                                <Detail icon={ShieldAlert} label="Anomalies" value={token.anomaly_count === 0 ? 'None' : token.anomaly_count} />
                            </InfoBlock>
                        </div>

                        {/* Token Actions */}
                        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Token Actions</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <ActionButton label="Reset Token" color="#2563EB" />
                                <ActionButton label="Revoke Token" color="#B45309" />
                                <ActionButton label="Replace Token" color="#475569" />
                                <ActionButton label="View Scan Logs" color="#6D28D9" />
                                <div style={{ marginLeft: 'auto' }}>
                                    <ActionButton label="Delete Permanently" color="#B91C1C" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}