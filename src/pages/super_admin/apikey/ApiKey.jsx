/**
 * SUPER ADMIN — API KEYS
 * Create, view, revoke and manage API keys for school integrations.
 * Matches school admin design system: same CSS vars, card patterns, typography.
 */

import { useState } from 'react';
import {
    Key, Plus, Copy, Eye, EyeOff, Trash2, RefreshCw,
    CheckCircle, AlertTriangle, Clock, Shield, Search,
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../../utils/formatters.js';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_KEYS = [
    {
        id: 'ak1',
        name: 'Production Integration',
        key_prefix: 'sk_live_',
        key_masked: 'sk_live_••••••••••••••••••••••••A3F9',
        key_full: 'sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4A3F9',
        school_name: 'Delhi Public School',
        school_id: 'sch-1',
        scopes: ['students.read', 'scans.read', 'tokens.read'],
        status: 'ACTIVE',
        last_used_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 180).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
        request_count: 12840,
    },
    {
        id: 'ak2',
        name: 'Mobile App Backend',
        key_prefix: 'sk_live_',
        key_masked: 'sk_live_••••••••••••••••••••••••B7D2',
        key_full: 'sk_live_z9y8x7w6v5u4t3s2r1q0p9o8n7mB7D2',
        school_name: 'St. Xavier\'s College',
        school_id: 'sch-2',
        scopes: ['students.read', 'scans.read', 'scans.write'],
        status: 'ACTIVE',
        last_used_at: new Date(Date.now() - 86400000).toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 90).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
        request_count: 5421,
    },
    {
        id: 'ak3',
        name: 'Webhook Listener',
        key_prefix: 'sk_live_',
        key_masked: 'sk_live_••••••••••••••••••••••••C1E5',
        key_full: 'sk_live_m1n2o3p4q5r6s7t8u9v0w1x2y3zC1E5',
        school_name: 'Kendriya Vidyalaya',
        school_id: 'sch-3',
        scopes: ['webhooks.read', 'webhooks.write'],
        status: 'ACTIVE',
        last_used_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        expires_at: null,
        created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
        request_count: 3209,
    },
    {
        id: 'ak4',
        name: 'Analytics Export',
        key_prefix: 'sk_live_',
        key_masked: 'sk_live_••••••••••••••••••••••••D4K8',
        key_full: 'sk_live_f1g2h3i4j5k6l7m8n9o0p1q2r3sD4K8',
        school_name: 'Ryan International',
        school_id: 'sch-4',
        scopes: ['scans.read', 'students.read'],
        status: 'REVOKED',
        last_used_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        expires_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
        request_count: 890,
    },
    {
        id: 'ak5',
        name: 'Test Integration',
        key_prefix: 'sk_test_',
        key_masked: 'sk_test_••••••••••••••••••••••••E2J6',
        key_full: 'sk_test_t1e2s3t4k5e6y7h8e9r0e1a2l3lE2J6',
        school_name: 'Apeejay School',
        school_id: 'sch-5',
        scopes: ['students.read'],
        status: 'EXPIRED',
        last_used_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        expires_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 100).toISOString(),
        request_count: 142,
    },
];

const ALL_SCOPES = [
    { key: 'students.read', label: 'Read Students', group: 'Students' },
    { key: 'students.write', label: 'Write Students', group: 'Students' },
    { key: 'scans.read', label: 'Read Scans', group: 'Scans' },
    { key: 'scans.write', label: 'Write Scans', group: 'Scans' },
    { key: 'tokens.read', label: 'Read Tokens', group: 'Tokens' },
    { key: 'tokens.write', label: 'Write Tokens', group: 'Tokens' },
    { key: 'webhooks.read', label: 'Read Webhooks', group: 'Webhooks' },
    { key: 'webhooks.write', label: 'Write Webhooks', group: 'Webhooks' },
];

const MOCK_SCHOOLS = [
    { id: 'sch-1', name: 'Delhi Public School' },
    { id: 'sch-2', name: 'St. Xavier\'s College' },
    { id: 'sch-3', name: 'Kendriya Vidyalaya' },
    { id: 'sch-4', name: 'Ryan International' },
    { id: 'sch-5', name: 'Apeejay School' },
];

const STATUS_STYLE = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857', dot: '#10B981' },
    REVOKED: { bg: '#FEF2F2', color: '#B91C1C', dot: '#EF4444' },
    EXPIRED: { bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B' },
};

// ── Create Key Modal ───────────────────────────────────────────────────────────
const CreateKeyModal = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [schoolId, setSchoolId] = useState('');
    const [selectedScopes, setSelectedScopes] = useState([]);
    const [keyType, setKeyType] = useState('live');
    const [expiryDays, setExpiryDays] = useState('365');
    const [step, setStep] = useState(1); // 1: config, 2: reveal
    const [generatedKey, setGeneratedKey] = useState('');
    const [copied, setCopied] = useState(false);

    const toggleScope = (scope) => {
        setSelectedScopes(prev =>
            prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
        );
    };

    const handleCreate = () => {
        const fakeKey = `sk_${keyType}_${Math.random().toString(36).slice(2, 18)}${Math.random().toString(36).slice(2, 18).toUpperCase()}`;
        setGeneratedKey(fakeKey);
        setStep(2);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedKey).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const scopeGroups = ALL_SCOPES.reduce((acc, s) => {
        if (!acc[s.group]) acc[s.group] = [];
        acc[s.group].push(s);
        return acc;
    }, {});

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
            <div style={{
                background: 'white', borderRadius: '16px', padding: '28px',
                maxWidth: '520px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                maxHeight: '90vh', overflowY: 'auto',
            }}>
                {step === 1 ? (
                    <>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Key size={18} color="#2563EB" />
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                                    Create API Key
                                </h3>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                                    Generate a new key for school integration
                                </p>
                            </div>
                        </div>

                        {/* Key Name */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Key Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Production Mobile App"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                            />
                        </div>

                        {/* School */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>School</label>
                            <select
                                value={schoolId}
                                onChange={e => setSchoolId(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                            >
                                <option value="">Select a school...</option>
                                {MOCK_SCHOOLS.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Key Type */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Environment</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['live', 'test'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setKeyType(type)}
                                        style={{
                                            flex: 1, padding: '8px 14px', borderRadius: '8px',
                                            border: `1px solid ${keyType === type ? 'var(--color-brand-500)' : 'var(--border-default)'}`,
                                            background: keyType === type ? '#EFF6FF' : 'white',
                                            color: keyType === type ? '#1E40AF' : 'var(--text-secondary)',
                                            fontWeight: keyType === type ? 700 : 500,
                                            fontSize: '0.875rem', cursor: 'pointer',
                                        }}
                                    >
                                        {type === 'live' ? '🟢 Live' : '🧪 Test'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Expiry */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Expiry</label>
                            <select
                                value={expiryDays}
                                onChange={e => setExpiryDays(e.target.value)}
                                style={{ ...inputStyle, cursor: 'pointer' }}
                                onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                            >
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                                <option value="180">180 days</option>
                                <option value="365">1 year</option>
                                <option value="0">Never expires</option>
                            </select>
                        </div>

                        {/* Scopes */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Permissions (Scopes)</label>
                            <div style={{
                                border: '1px solid var(--border-default)', borderRadius: '10px',
                                overflow: 'hidden',
                            }}>
                                {Object.entries(scopeGroups).map(([group, scopes], gi) => (
                                    <div key={group} style={{ borderBottom: gi < Object.keys(scopeGroups).length - 1 ? '1px solid var(--border-default)' : 'none' }}>
                                        <div style={{
                                            padding: '8px 14px', background: 'var(--color-slate-50)',
                                            fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
                                            textTransform: 'uppercase', letterSpacing: '0.06em',
                                        }}>
                                            {group}
                                        </div>
                                        <div style={{ padding: '8px 14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {scopes.map(s => (
                                                <button
                                                    key={s.key}
                                                    onClick={() => toggleScope(s.key)}
                                                    style={{
                                                        padding: '4px 12px', borderRadius: '9999px',
                                                        border: `1px solid ${selectedScopes.includes(s.key) ? '#2563EB' : 'var(--border-default)'}`,
                                                        background: selectedScopes.includes(s.key) ? '#EFF6FF' : 'white',
                                                        color: selectedScopes.includes(s.key) ? '#1E40AF' : 'var(--text-secondary)',
                                                        fontWeight: selectedScopes.includes(s.key) ? 600 : 400,
                                                        fontSize: '0.8125rem', cursor: 'pointer',
                                                    }}
                                                >
                                                    {selectedScopes.includes(s.key) ? '✓ ' : ''}{s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedScopes.length === 0 && (
                                <p style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '6px' }}>
                                    ⚠ Select at least one scope
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
                            <button
                                onClick={handleCreate}
                                disabled={!name || !schoolId || selectedScopes.length === 0}
                                style={{
                                    ...primaryBtnStyle,
                                    opacity: (!name || !schoolId || selectedScopes.length === 0) ? 0.5 : 1,
                                    cursor: (!name || !schoolId || selectedScopes.length === 0) ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <Key size={15} /> Generate Key
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Step 2: Reveal Key */}
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: '#ECFDF5', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 12px',
                            }}>
                                <CheckCircle size={28} color="#10B981" />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 6px' }}>
                                API Key Created!
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                                Copy your key now — it won't be shown again.
                            </p>
                        </div>

                        <div style={{
                            background: '#0F172A', borderRadius: '10px', padding: '16px',
                            marginBottom: '16px', position: 'relative',
                        }}>
                            <code style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.8125rem',
                                color: '#86EFAC', wordBreak: 'break-all', display: 'block',
                                lineHeight: 1.6,
                            }}>
                                {generatedKey}
                            </code>
                        </div>

                        <div style={{
                            padding: '10px 14px', background: '#FFFBEB',
                            borderRadius: '8px', border: '1px solid #FCD34D',
                            display: 'flex', gap: '8px', alignItems: 'flex-start',
                            marginBottom: '20px',
                        }}>
                            <AlertTriangle size={15} color="#B45309" style={{ flexShrink: 0, marginTop: '1px' }} />
                            <p style={{ fontSize: '0.8125rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                                Store this key securely. For security reasons, you won't be able to view the full key again after closing this dialog.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleCopy}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px', padding: '10px', borderRadius: '8px',
                                    background: copied ? '#ECFDF5' : 'linear-gradient(135deg,#2563EB,#1E40AF)',
                                    color: copied ? '#047857' : 'white',
                                    border: copied ? '1px solid #10B981' : 'none',
                                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {copied ? <><CheckCircle size={15} /> Copied!</> : <><Copy size={15} /> Copy Key</>}
                            </button>
                            <button
                                onClick={onClose}
                                style={{ ...cancelBtnStyle, padding: '10px 20px' }}
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ── Revoke Confirm Modal ───────────────────────────────────────────────────────
const RevokeModal = ({ apiKey, onClose, onConfirm }) => (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
        <div style={{
            background: 'white', borderRadius: '16px', padding: '28px',
            maxWidth: '420px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={18} color="#B91C1C" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                    Revoke API Key
                </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '12px', lineHeight: 1.6 }}>
                Are you sure you want to revoke <strong>"{apiKey.name}"</strong>? Any integrations using this key will immediately stop working.
            </p>
            <div style={{
                padding: '10px 14px', background: '#FEF2F2', borderRadius: '8px',
                border: '1px solid #FECACA', marginBottom: '20px',
                fontSize: '0.8125rem', color: '#B91C1C', fontWeight: 500,
            }}>
                ⚠ This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
                <button
                    onClick={onConfirm}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 18px', borderRadius: '8px', border: 'none',
                        background: 'linear-gradient(135deg,#DC2626,#B91C1C)',
                        color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                    }}
                >
                    <Trash2 size={14} /> Revoke Key
                </button>
            </div>
        </div>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ApiKey() {
    const [keys, setKeys] = useState(MOCK_KEYS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showCreate, setShowCreate] = useState(false);
    const [revokingKey, setRevokingKey] = useState(null);
    const [visibleKeys, setVisibleKeys] = useState(new Set());
    const [copiedId, setCopiedId] = useState(null);

    const filtered = keys.filter(k => {
        const matchStatus = statusFilter === 'ALL' || k.status === statusFilter;
        const matchSearch = !search ||
            k.name.toLowerCase().includes(search.toLowerCase()) ||
            k.school_name.toLowerCase().includes(search.toLowerCase()) ||
            k.key_masked.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const activeCount = keys.filter(k => k.status === 'ACTIVE').length;
    const revokedCount = keys.filter(k => k.status === 'REVOKED').length;
    const expiredCount = keys.filter(k => k.status === 'EXPIRED').length;
    const totalRequests = keys.reduce((sum, k) => sum + k.request_count, 0);

    const handleRevoke = (id) => {
        setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'REVOKED' } : k));
        setRevokingKey(null);
    };

    const handleCopy = (key) => {
        navigator.clipboard.writeText(key.key_masked).catch(() => { });
        setCopiedId(key.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleVisibility = (id) => {
        setVisibleKeys(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const isExpiringSoon = (expiresAt) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date(Date.now() + 30 * 86400000) && new Date(expiresAt) > new Date();
    };

    return (
        <div style={{ maxWidth: '1100px' }}>
            {showCreate && (
                <CreateKeyModal onClose={() => setShowCreate(false)} onCreate={() => setShowCreate(false)} />
            )}
            {revokingKey && (
                <RevokeModal
                    apiKey={revokingKey}
                    onClose={() => setRevokingKey(null)}
                    onConfirm={() => handleRevoke(revokingKey.id)}
                />
            )}

            {/* ── Page Header ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.375rem',
                        fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px',
                    }}>
                        API Keys
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                        Manage API keys for school integrations and third-party access
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 18px', borderRadius: '8px',
                        background: 'linear-gradient(135deg,#2563EB,#1E40AF)',
                        color: 'white', border: 'none',
                        fontFamily: 'var(--font-display)', fontWeight: 600,
                        fontSize: '0.875rem', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,99,235,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)'}
                >
                    <Plus size={16} /> Create API Key
                </button>
            </div>

            {/* ── Stats Row ─────────────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
                {[
                    ['Active Keys', activeCount, '#10B981', '#ECFDF5', Key],
                    ['Revoked', revokedCount, '#EF4444', '#FEF2F2', Trash2],
                    ['Expired', expiredCount, '#F59E0B', '#FFFBEB', Clock],
                    ['Total Requests', totalRequests.toLocaleString('en-IN'), '#2563EB', '#EFF6FF', RefreshCw],
                ].map(([label, val, color, bg, Icon]) => (
                    <div key={label} style={{
                        background: 'white', borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        padding: '18px 20px', boxShadow: 'var(--shadow-card)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{
                                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
                                    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px',
                                }}>
                                    {label}
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-display)', fontSize: '1.75rem',
                                    fontWeight: 700, color: 'var(--text-primary)',
                                }}>
                                    {val}
                                </div>
                            </div>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Icon size={20} color={color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Security Banner ───────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                background: '#EFF6FF', border: '1px solid #BFDBFE',
                marginBottom: '20px',
            }}>
                <Shield size={16} color="#1D4ED8" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.8125rem', color: '#1E40AF', margin: 0, fontWeight: 500 }}>
                    API keys grant programmatic access to school data. Never share keys publicly or commit them to version control. Rotate keys every 90 days for best security.
                </p>
            </div>

            {/* ── Filters ───────────────────────────────────────────────────── */}
            <div style={{
                background: 'white', borderRadius: '12px',
                border: '1px solid var(--border-default)',
                padding: '14px 16px', marginBottom: '16px',
                display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
                boxShadow: 'var(--shadow-card)',
            }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {[['ALL', 'All Keys'], ['ACTIVE', 'Active'], ['REVOKED', 'Revoked'], ['EXPIRED', 'Expired']].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key)}
                            style={{
                                padding: '6px 14px', borderRadius: '7px',
                                border: '1px solid',
                                borderColor: statusFilter === key ? 'var(--color-brand-500)' : 'var(--border-default)',
                                background: statusFilter === key ? 'var(--color-brand-600)' : 'white',
                                color: statusFilter === key ? 'white' : 'var(--text-secondary)',
                                fontWeight: statusFilter === key ? 700 : 400,
                                fontSize: '0.8125rem', cursor: 'pointer',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{
                        position: 'absolute', left: '10px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--text-muted)',
                    }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or school..."
                        style={{
                            padding: '7px 12px 7px 32px',
                            border: '1px solid var(--border-default)',
                            borderRadius: '8px', fontSize: '0.875rem',
                            outline: 'none', width: '240px',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                    />
                </div>
            </div>

            {/* ── Keys List ─────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.length === 0 ? (
                    <div style={{
                        background: 'white', borderRadius: '12px',
                        border: '1px solid var(--border-default)',
                        padding: '60px', textAlign: 'center',
                        color: 'var(--text-muted)', boxShadow: 'var(--shadow-card)',
                    }}>
                        <Key size={36} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>No API keys found</div>
                        <div style={{ fontSize: '0.875rem' }}>
                            {search ? 'Try adjusting your search' : 'Create your first API key to get started'}
                        </div>
                    </div>
                ) : filtered.map(apiKey => {
                    const s = STATUS_STYLE[apiKey.status] || STATUS_STYLE.REVOKED;
                    const isVisible = visibleKeys.has(apiKey.id);
                    const expiringSoon = isExpiringSoon(apiKey.expires_at);
                    const isActive = apiKey.status === 'ACTIVE';

                    return (
                        <div
                            key={apiKey.id}
                            style={{
                                background: 'white', borderRadius: '12px',
                                border: `1px solid ${!isActive ? 'var(--border-default)' : 'var(--border-default)'}`,
                                boxShadow: 'var(--shadow-card)', overflow: 'hidden',
                                opacity: !isActive ? 0.75 : 1,
                            }}
                        >
                            {/* Color strip */}
                            <div style={{
                                height: '3px',
                                background: apiKey.status === 'ACTIVE'
                                    ? 'linear-gradient(90deg,#2563EB,#3B82F6)'
                                    : apiKey.status === 'REVOKED'
                                        ? '#EF4444'
                                        : '#F59E0B',
                            }} />

                            <div style={{ padding: '18px 20px' }}>
                                {/* Top row: name + status + actions */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    {/* Icon */}
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '10px',
                                        background: isActive ? '#EFF6FF' : 'var(--color-slate-100)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Key size={18} color={isActive ? '#2563EB' : 'var(--text-muted)'} />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                                                {apiKey.name}
                                            </span>
                                            {/* Status badge */}
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '3px 10px', borderRadius: '9999px',
                                                fontSize: '0.75rem', fontWeight: 600,
                                                background: s.bg, color: s.color,
                                            }}>
                                                <span style={{
                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                    background: s.dot, display: 'inline-block',
                                                }} />
                                                {apiKey.status}
                                            </span>
                                            {/* Env badge */}
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '9999px',
                                                fontSize: '0.75rem', fontWeight: 600,
                                                background: apiKey.key_prefix === 'sk_live_' ? '#ECFDF5' : '#F5F3FF',
                                                color: apiKey.key_prefix === 'sk_live_' ? '#047857' : '#6D28D9',
                                            }}>
                                                {apiKey.key_prefix === 'sk_live_' ? '🟢 Live' : '🧪 Test'}
                                            </span>
                                            {expiringSoon && (
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: '9999px',
                                                    fontSize: '0.75rem', fontWeight: 600,
                                                    background: '#FFFBEB', color: '#B45309',
                                                }}>
                                                    ⚠ Expires soon
                                                </span>
                                            )}
                                        </div>

                                        {/* School */}
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                            🏫 {apiKey.school_name}
                                        </div>

                                        {/* Key hash row */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '8px 12px', background: 'var(--color-slate-50)',
                                            borderRadius: '8px', border: '1px solid var(--border-default)',
                                            marginBottom: '12px',
                                        }}>
                                            <code style={{
                                                fontFamily: 'var(--font-mono)', fontSize: '0.8125rem',
                                                color: 'var(--text-primary)', flex: 1, overflow: 'hidden',
                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            }}>
                                                {isVisible ? apiKey.key_full : apiKey.key_masked}
                                            </code>
                                            <button
                                                onClick={() => toggleVisibility(apiKey.id)}
                                                title={isVisible ? 'Hide key' : 'Show key'}
                                                style={iconBtnStyle}
                                            >
                                                {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button
                                                onClick={() => handleCopy(apiKey)}
                                                title="Copy key"
                                                style={{
                                                    ...iconBtnStyle,
                                                    background: copiedId === apiKey.id ? '#ECFDF5' : 'white',
                                                    borderColor: copiedId === apiKey.id ? '#10B981' : 'var(--border-default)',
                                                    color: copiedId === apiKey.id ? '#047857' : 'var(--text-muted)',
                                                }}
                                            >
                                                {copiedId === apiKey.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        {/* Meta row */}
                                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                            <MetaItem label="Requests" value={apiKey.request_count.toLocaleString('en-IN')} />
                                            <MetaItem label="Last used" value={apiKey.last_used_at ? formatRelativeTime(apiKey.last_used_at) : 'Never'} />
                                            <MetaItem label="Created" value={formatDate(apiKey.created_at)} />
                                            <MetaItem
                                                label="Expires"
                                                value={apiKey.expires_at ? formatDate(apiKey.expires_at) : 'Never'}
                                                danger={expiringSoon}
                                            />
                                        </div>

                                        {/* Scopes */}
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {apiKey.scopes.map(scope => (
                                                <span key={scope} style={{
                                                    padding: '2px 10px', borderRadius: '9999px',
                                                    fontSize: '0.75rem', fontWeight: 500,
                                                    background: 'var(--color-slate-100)',
                                                    color: 'var(--text-secondary)',
                                                    fontFamily: 'var(--font-mono)',
                                                }}>
                                                    {scope}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                                        {isActive && (
                                            <>
                                                <button
                                                    onClick={() => setRevokingKey(apiKey)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '5px',
                                                        padding: '7px 12px', borderRadius: '7px',
                                                        border: '1px solid #FECACA', background: '#FEF2F2',
                                                        color: '#B91C1C', fontWeight: 600,
                                                        fontSize: '0.8125rem', cursor: 'pointer',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                                                >
                                                    <Trash2 size={13} /> Revoke
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Footer note ───────────────────────────────────────────────── */}
            <div style={{
                marginTop: '20px', padding: '12px 16px', borderRadius: '8px',
                background: 'var(--color-slate-50)', border: '1px solid var(--border-default)',
                display: 'flex', alignItems: 'center', gap: '8px',
            }}>
                <Shield size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                    All API key usage is logged in Audit Logs. Keys are hashed at rest — full key values are only shown once at creation.
                </p>
            </div>
        </div>
    );
}

// ── Helper sub-components ─────────────────────────────────────────────────────
const MetaItem = ({ label, value, danger }) => (
    <div>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
            {label}
        </div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: danger ? '#B45309' : 'var(--text-secondary)' }}>
            {value}
        </div>
    </div>
);

// ── Shared styles ─────────────────────────────────────────────────────────────
const labelStyle = {
    display: 'block', fontSize: '0.8125rem',
    fontWeight: 600, color: 'var(--text-secondary)',
    marginBottom: '6px',
};

const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: '1px solid var(--border-default)',
    borderRadius: '8px', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-primary)',
    background: 'white',
};

const cancelBtnStyle = {
    padding: '8px 18px', borderRadius: '8px',
    border: '1px solid var(--border-default)',
    background: 'white', cursor: 'pointer',
    fontWeight: 500, fontSize: '0.875rem',
    color: 'var(--text-secondary)',
};

const primaryBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 18px', borderRadius: '8px', border: 'none',
    background: 'linear-gradient(135deg,#2563EB,#1E40AF)',
    color: 'white', fontWeight: 600, fontSize: '0.875rem',
};

const iconBtnStyle = {
    width: '28px', height: '28px', borderRadius: '6px',
    border: '1px solid var(--border-default)',
    background: 'white', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text-muted)',
    flexShrink: 0, transition: 'all 0.1s',
};