/**
 * SUPER ADMIN — FEATURE FLAGS
 * Global feature flags + per-school overrides.
 */

import { useState } from 'react';
import { ToggleLeft, ToggleRight, Plus, Search, Building2, X } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const MOCK_FLAGS = [
    { id: 'ff1',  key: 'allow_location',            enabled: true,  description: 'Enable GPS-based location tracking for scan anomaly detection',              updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),  schools_overridden: 3 },
    { id: 'ff2',  key: 'allow_parent_edit',          enabled: true,  description: 'Allow parents to submit student profile update requests',                    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),  schools_overridden: 1 },
    { id: 'ff3',  key: 'scan_notifications_enabled', enabled: true,  description: 'Enable SMS and push notifications on QR scan events',                        updated_at: new Date(Date.now() - 86400000 * 10).toISOString(), schools_overridden: 0 },
    { id: 'ff4',  key: 'advanced_anomaly_detection', enabled: false, description: 'Beta: ML-powered anomaly scoring and severity classification',                updated_at: new Date(Date.now() - 86400000 * 15).toISOString(), schools_overridden: 0 },
    { id: 'ff5',  key: 'bulk_qr_export',             enabled: true,  description: 'Allow admins to export QR codes in bulk as ZIP archive',                     updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),  schools_overridden: 5 },
    { id: 'ff6',  key: 'parent_app_access',          enabled: true,  description: 'Enable parent mobile app access to student profiles',                        updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),  schools_overridden: 2 },
    { id: 'ff7',  key: 'emergency_profile_public',   enabled: true,  description: 'Make emergency profiles publicly accessible via QR scan',                    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),  schools_overridden: 4 },
    { id: 'ff8',  key: 'webhook_integrations',       enabled: false, description: 'Beta: Allow schools to configure outbound webhooks for events',              updated_at: new Date(Date.now() - 86400000 * 20).toISOString(), schools_overridden: 0 },
    { id: 'ff9',  key: 'audit_log_export',           enabled: true,  description: 'Enable CSV export of audit logs for compliance reporting',                   updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),  schools_overridden: 0 },
    { id: 'ff10', key: 'multi_admin_roles',          enabled: true,  description: 'Allow schools to create multiple admin accounts with different roles',       updated_at: new Date(Date.now() - 86400000 * 12).toISOString(), schools_overridden: 1 },
];

/* ── Create Flag Modal ───────────────────────────────────────────────────── */
const CreateFlagModal = ({ onClose }) => {
    const [form, setForm] = useState({ key: '', description: '', enabled: false });

    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl p-7 w-full max-w-[440px] shadow-[var(--shadow-modal)]">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0">
                        New Feature Flag
                    </h3>
                    <button
                        onClick={onClose}
                        className="border-none bg-transparent cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Flag key */}
                <div className="mb-4">
                    <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                        Flag Key <span className="text-danger-500">*</span>
                    </label>
                    <input
                        value={form.key}
                        onChange={e =>
                            setForm(p => ({
                                ...p,
                                key: e.target.value.replace(/\s+/g, '_').toLowerCase(),
                            }))
                        }
                        placeholder="e.g. my_new_feature"
                        className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm font-mono outline-none focus:border-brand-500 transition-colors box-border"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                        Description
                    </label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="What does this flag control?"
                        rows={2}
                        className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm font-body resize-y outline-none focus:border-brand-500 transition-colors box-border"
                    />
                </div>

                {/* Default state toggle */}
                <div className="flex items-center gap-2.5 mb-6">
                    <label className="text-[0.8125rem] font-semibold text-[var(--text-secondary)]">
                        Default State:
                    </label>
                    <button
                        onClick={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
                        className={[
                            'flex items-center gap-1.5 py-1.5 px-3.5 rounded-[7px] border font-semibold text-sm cursor-pointer transition-colors',
                            form.enabled
                                ? 'border-success-500 bg-success-50 text-success-700'
                                : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)]',
                        ].join(' ')}
                    >
                        {form.enabled ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                        {form.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 justify-end">
                    <button
                        onClick={onClose}
                        className="py-2 px-[18px] rounded-lg border border-[var(--border-default)] bg-white cursor-pointer font-medium text-sm text-[var(--text-secondary)] hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="py-2 px-[18px] rounded-lg border-none bg-gradient-to-br from-brand-500 to-brand-600 text-white cursor-pointer font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        Create Flag
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function FeatureFlags() {
    const [flags, setFlags]               = useState(MOCK_FLAGS);
    const [search, setSearch]             = useState('');
    const [filterEnabled, setFilterEnabled] = useState('ALL');
    const [showModal, setShowModal]       = useState(false);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = flags.filter(f => {
        const q = debouncedSearch.toLowerCase();
        const matchSearch   = !q || f.key.includes(q) || f.description.toLowerCase().includes(q);
        const matchEnabled  = filterEnabled === 'ALL' || (filterEnabled === 'ENABLED' ? f.enabled : !f.enabled);
        return matchSearch && matchEnabled;
    });

    const toggle = (id) =>
        setFlags(prev =>
            prev.map(f =>
                f.id === id
                    ? { ...f, enabled: !f.enabled, updated_at: new Date().toISOString() }
                    : f
            )
        );

    return (
        <div className="max-w-[960px]">
            {showModal && <CreateFlagModal onClose={() => setShowModal(false)} />}

            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                        Feature Flags
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                        {flags.filter(f => f.enabled).length} of {flags.length} flags enabled globally
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 py-[9px] px-[18px] rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none font-semibold text-sm cursor-pointer shadow-[var(--shadow-brand)] hover:opacity-90 transition-opacity"
                >
                    <Plus size={16} /> New Flag
                </button>
            </div>

            {/* ── Filters ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] p-4 mb-4 flex gap-3 items-center">

                {/* State pills */}
                <div className="flex gap-1.5">
                    {['ALL', 'ENABLED', 'DISABLED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterEnabled(f)}
                            className={[
                                'py-1.5 px-[13px] rounded-[7px] border text-[0.8125rem] cursor-pointer transition-colors',
                                filterEnabled === f
                                    ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                    : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {f === 'ALL' ? 'All' : f === 'ENABLED' ? 'Enabled' : 'Disabled'}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="ml-auto relative">
                    <Search
                        size={15}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                    />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search flags..."
                        className="py-[7px] pr-3 pl-8 border border-[var(--border-default)] rounded-lg text-sm outline-none w-[220px] focus:border-brand-500 transition-colors"
                    />
                </div>
            </div>

            {/* ── Flag cards ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
                {filtered.map(flag => (
                    <div
                        key={flag.id}
                        className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] px-5 py-[18px] flex items-start gap-4 hover:border-[var(--border-strong)] transition-colors"
                    >
                        {/* Toggle button */}
                        <button
                            onClick={() => toggle(flag.id)}
                            className="border-none bg-transparent cursor-pointer p-0 shrink-0 mt-0.5"
                        >
                            {flag.enabled
                                ? <ToggleRight size={28} className="text-success-500" />
                                : <ToggleLeft  size={28} className="text-slate-400"   />}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">

                            {/* Key + badges */}
                            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                                <code className="text-[0.9rem] font-bold text-[var(--text-primary)] font-mono">
                                    {flag.key}
                                </code>

                                <span className={[
                                    'px-2 py-0.5 rounded-full text-[0.7rem] font-bold',
                                    flag.enabled
                                        ? 'bg-success-50 text-success-700'
                                        : 'bg-slate-100 text-slate-500',
                                ].join(' ')}>
                                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                                </span>

                                {flag.schools_overridden > 0 && (
                                    <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                        <Building2 size={11} />
                                        {flag.schools_overridden} school override{flag.schools_overridden > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-[var(--text-secondary)] m-0 mb-2">
                                {flag.description}
                            </p>

                            {/* Last updated */}
                            <span className="text-xs text-[var(--text-muted)]">
                                Last updated {formatRelativeTime(flag.updated_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}