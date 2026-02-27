/**
 * SUPER ADMIN — FEATURE FLAGS
 * Global feature flags + per-school overrides.
 */

import { useState } from 'react';
import { ToggleLeft, ToggleRight, Plus, Search, Building2, X } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const MOCK_FLAGS = [
    { id: 'ff1', key: 'allow_location', enabled: true, description: 'Enable GPS-based location tracking for scan anomaly detection', updated_at: new Date(Date.now() - 86400000 * 2).toISOString(), schools_overridden: 3 },
    { id: 'ff2', key: 'allow_parent_edit', enabled: true, description: 'Allow parents to submit student profile update requests', updated_at: new Date(Date.now() - 86400000 * 5).toISOString(), schools_overridden: 1 },
    { id: 'ff3', key: 'scan_notifications_enabled', enabled: true, description: 'Enable SMS and push notifications on QR scan events', updated_at: new Date(Date.now() - 86400000 * 10).toISOString(), schools_overridden: 0 },
    { id: 'ff4', key: 'advanced_anomaly_detection', enabled: false, description: 'Beta: ML-powered anomaly scoring and severity classification', updated_at: new Date(Date.now() - 86400000 * 15).toISOString(), schools_overridden: 0 },
    { id: 'ff5', key: 'bulk_qr_export', enabled: true, description: 'Allow admins to export QR codes in bulk as ZIP archive', updated_at: new Date(Date.now() - 86400000 * 3).toISOString(), schools_overridden: 5 },
    { id: 'ff6', key: 'parent_app_access', enabled: true, description: 'Enable parent mobile app access to student profiles', updated_at: new Date(Date.now() - 86400000 * 8).toISOString(), schools_overridden: 2 },
    { id: 'ff7', key: 'emergency_profile_public', enabled: true, description: 'Make emergency profiles publicly accessible via QR scan', updated_at: new Date(Date.now() - 86400000 * 1).toISOString(), schools_overridden: 4 },
    { id: 'ff8', key: 'webhook_integrations', enabled: false, description: 'Beta: Allow schools to configure outbound webhooks for events', updated_at: new Date(Date.now() - 86400000 * 20).toISOString(), schools_overridden: 0 },
    { id: 'ff9', key: 'audit_log_export', enabled: true, description: 'Enable CSV export of audit logs for compliance reporting', updated_at: new Date(Date.now() - 86400000 * 6).toISOString(), schools_overridden: 0 },
    { id: 'ff10', key: 'multi_admin_roles', enabled: true, description: 'Allow schools to create multiple admin accounts with different roles', updated_at: new Date(Date.now() - 86400000 * 12).toISOString(), schools_overridden: 1 },
];

const CreateFlagModal = ({ onClose }) => {
    const [form, setForm] = useState({ key: '', description: '', enabled: false });

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>New Feature Flag</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Flag Key <span style={{ color: '#EF4444' }}>*</span>
                    </label>

                    {/* ✅ FIXED onChange parentheses */}
                    <input
                        value={form.key}
                        onChange={e =>
                            setForm(p => ({
                                ...p,
                                key: e.target.value.replace(/\s+/g, '_').toLowerCase(),
                            }))
                        }
                        placeholder="e.g. my_new_feature"
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--color-brand-500)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Description
                    </label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="What does this flag control?"
                        rows={2}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--color-brand-500)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Default State:</label>
                    <button
                        onClick={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '7px', border: '1px solid', borderColor: form.enabled ? '#10B981' : 'var(--border-default)', background: form.enabled ? '#ECFDF5' : 'white', color: form.enabled ? '#047857' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                        {form.enabled ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        {form.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        Cancel
                    </button>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                        Create Flag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function FeatureFlags() {
    const [flags, setFlags] = useState(MOCK_FLAGS);
    const [search, setSearch] = useState('');
    const [filterEnabled, setFilterEnabled] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = flags.filter(f => {
        const matchSearch =
            !debouncedSearch ||
            f.key.includes(debouncedSearch.toLowerCase()) ||
            f.description.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchEnabled =
            filterEnabled === 'ALL' ||
            (filterEnabled === 'ENABLED' ? f.enabled : !f.enabled);

        return matchSearch && matchEnabled;
    });

    const toggle = id =>
        setFlags(prev =>
            prev.map(f =>
                f.id === id
                    ? { ...f, enabled: !f.enabled, updated_at: new Date().toISOString() }
                    : f
            )
        );

    return (
        <div style={{ maxWidth: '960px' }}>
            {showModal && <CreateFlagModal onClose={() => setShowModal(false)} />}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, margin: 0 }}>
                        Feature Flags
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                        {flags.filter(f => f.enabled).length} of {flags.length} flags enabled globally
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '8px', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                    <Plus size={16} /> New Flag
                </button>
            </div>

            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    {['ALL', 'ENABLED', 'DISABLED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterEnabled(f)}
                            style={{ padding: '6px 13px', borderRadius: '7px', border: '1px solid', borderColor: filterEnabled === f ? 'var(--color-brand-500)' : 'var(--border-default)', background: filterEnabled === f ? 'var(--color-brand-600)' : 'white', color: filterEnabled === f ? 'white' : 'var(--text-secondary)', fontWeight: filterEnabled === f ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}
                        >
                            {f === 'ALL' ? 'All' : f === 'ENABLED' ? 'Enabled' : 'Disabled'}
                        </button>
                    ))}
                </div>

                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search flags..."
                        style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '220px' }}
                    />
                </div>
            </div>

            {/* Flag cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filtered.map(flag => (
                    <div key={flag.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <button onClick={() => toggle(flag.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                            {flag.enabled ? <ToggleRight size={28} color="#10B981" /> : <ToggleLeft size={28} color="#94A3B8" />}
                        </button>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                <code style={{ fontSize: '0.9rem', fontWeight: 700 }}>{flag.key}</code>

                                <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: flag.enabled ? '#ECFDF5' : '#F1F5F9', color: flag.enabled ? '#047857' : '#64748B' }}>
                                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                                </span>

                                {flag.schools_overridden > 0 && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        <Building2 size={11} /> {flag.schools_overridden} school override{flag.schools_overridden > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            <p style={{ fontSize: '0.875rem', margin: '0 0 8px' }}>{flag.description}</p>

                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Last updated {formatRelativeTime(flag.updated_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
