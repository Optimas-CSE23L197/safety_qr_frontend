/**
 * SUPER ADMIN — AUDIT LOGS
 */

import { useState } from 'react';
import { Search, ScrollText, Shield, User, Building2, Settings, CreditCard } from 'lucide-react';
import { formatDateTime, formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const ACTOR_TYPES = ['ALL', 'SUPER_ADMIN', 'SCHOOL_USER', 'SYSTEM'];
const ACTION_FILTERS = ['ALL', 'SCHOOL', 'SUBSCRIPTION', 'ADMIN', 'FEATURE_FLAG', 'SYSTEM'];

const MOCK_LOGS = Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i + 1}`,
    actor_type: ['SUPER_ADMIN', 'SUPER_ADMIN', 'SCHOOL_USER', 'SYSTEM'][i % 4],
    actor_name: i % 4 === 3 ? 'System' : ['super@admin.com', 'admin2@admin.com'][i % 2],
    action: ['SCHOOL_CREATED', 'SCHOOL_SUSPENDED', 'SUBSCRIPTION_UPDATED', 'FEATURE_FLAG_TOGGLED', 'ADMIN_CREATED', 'ADMIN_DEACTIVATED', 'SCHOOL_ACTIVATED', 'PASSWORD_RESET'][i % 8],
    entity: ['Delhi Public School', 'Ryan International', 'allow_location', 'Rajesh Kumar', 'St. Mary\'s Convent', 'audit_log_export'][i % 6],
    entity_type: ['SCHOOL', 'SUBSCRIPTION', 'FEATURE_FLAG', 'USER', 'SCHOOL', 'FEATURE_FLAG'][i % 6],
    ip_address: `103.${21 + (i % 3)}.${58 + (i % 2)}.${i + 1}`,
    created_at: new Date(Date.now() - i * 3600000 * 3).toISOString(),
    metadata: { before: null, after: null },
}));

const ENTITY_ICON = {
    SCHOOL: Building2, SUBSCRIPTION: CreditCard,
    FEATURE_FLAG: Settings, USER: User, SYSTEM: Shield,
};

const ACTION_COLOR = {
    SCHOOL_CREATED: '#10B981', SCHOOL_SUSPENDED: '#EF4444', SCHOOL_ACTIVATED: '#10B981',
    SUBSCRIPTION_UPDATED: '#2563EB', FEATURE_FLAG_TOGGLED: '#F59E0B',
    ADMIN_CREATED: '#8B5CF6', ADMIN_DEACTIVATED: '#EF4444', PASSWORD_RESET: '#6366F1',
};

export default function AuditLogs() {
    const [actorFilter, setActorFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 300);
    const PAGE_SIZE = 15;

    const filtered = MOCK_LOGS.filter(l => {
        const matchActor = actorFilter === 'ALL' || l.actor_type === actorFilter;
        const matchSearch = !debouncedSearch ||
            l.action.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            l.entity.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            l.actor_name.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchActor && matchSearch;
    });
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div style={{ maxWidth: '1100px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Audit Logs</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Complete record of all super-admin and system actions</p>
            </div>

            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ACTOR_TYPES.map(t => (
                        <button key={t} onClick={() => { setActorFilter(t); setPage(1); }}
                            style={{ padding: '6px 13px', borderRadius: '7px', border: '1px solid', borderColor: actorFilter === t ? 'var(--color-brand-500)' : 'var(--border-default)', background: actorFilter === t ? 'var(--color-brand-600)' : 'white', color: actorFilter === t ? 'white' : 'var(--text-secondary)', fontWeight: actorFilter === t ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>
                            {t === 'ALL' ? 'All Actors' : humanizeEnum(t)}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search action, entity, actor..."
                        style={{ padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '240px' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                            {['Time', 'Action', 'Entity', 'Actor', 'IP Address'].map(h => (
                                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <ScrollText size={36} style={{ marginBottom: '12px', opacity: 0.3, display: 'block', margin: '0 auto 12px' }} />
                                <div style={{ fontWeight: 500 }}>No audit logs found</div>
                            </td></tr>
                        ) : paginated.map((log, idx) => {
                            const EntityIcon = ENTITY_ICON[log.entity_type] || Shield;
                            const color = ACTION_COLOR[log.action] || '#64748B';
                            return (
                                <tr key={log.id} style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{formatRelativeTime(log.created_at)}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, background: `${color}15`, color, fontFamily: 'var(--font-mono)' }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                            <EntityIcon size={13} color="var(--text-muted)" />
                                            {log.entity}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{log.actor_name}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--color-slate-100)', padding: '2px 7px', borderRadius: '4px' }}>{log.ip_address}</code>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid', borderColor: p === page ? 'var(--color-brand-500)' : 'var(--border-default)', background: p === page ? 'var(--color-brand-600)' : 'white', color: p === page ? 'white' : 'var(--text-secondary)', fontWeight: p === page ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>{p}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}