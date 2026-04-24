/**
 * SUPER ADMIN — AUDIT LOGS
 */

import { useState } from 'react';
import {
    Search, ScrollText, Shield, User,
    Building2, Settings, CreditCard,
} from 'lucide-react';
import { formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import useDebounce from '../../hooks/useDebounce.js';

const ACTOR_TYPES    = ['ALL', 'SUPER_ADMIN', 'SCHOOL_USER', 'SYSTEM'];

const MOCK_LOGS = Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i + 1}`,
    actor_type: ['SUPER_ADMIN', 'SUPER_ADMIN', 'SCHOOL_USER', 'SYSTEM'][i % 4],
    actor_name: i % 4 === 3 ? 'System' : ['super@admin.com', 'admin2@admin.com'][i % 2],
    action: ['SCHOOL_CREATED', 'SCHOOL_SUSPENDED', 'SUBSCRIPTION_UPDATED', 'FEATURE_FLAG_TOGGLED',
             'ADMIN_CREATED', 'ADMIN_DEACTIVATED', 'SCHOOL_ACTIVATED', 'PASSWORD_RESET'][i % 8],
    entity: ["Delhi Public School", 'Ryan International', 'allow_location', 'Rajesh Kumar',
             "St. Mary's Convent", 'audit_log_export'][i % 6],
    entity_type: ['SCHOOL', 'SUBSCRIPTION', 'FEATURE_FLAG', 'USER', 'SCHOOL', 'FEATURE_FLAG'][i % 6],
    ip_address: `103.${21 + (i % 3)}.${58 + (i % 2)}.${i + 1}`,
    created_at: new Date(Date.now() - i * 3600000 * 3).toISOString(),
    metadata: { before: null, after: null },
}));

const ENTITY_ICON = {
    SCHOOL:       Building2,
    SUBSCRIPTION: CreditCard,
    FEATURE_FLAG: Settings,
    USER:         User,
    SYSTEM:       Shield,
};

// Tailwind text + bg classes for each action (bg uses opacity via bg-[color]/10)
const ACTION_STYLE = {
    SCHOOL_CREATED:        { text: 'text-success-500',  bg: 'bg-success-500/10'  },
    SCHOOL_SUSPENDED:      { text: 'text-danger-500',   bg: 'bg-danger-500/10'   },
    SCHOOL_ACTIVATED:      { text: 'text-success-500',  bg: 'bg-success-500/10'  },
    SUBSCRIPTION_UPDATED:  { text: 'text-brand-500',    bg: 'bg-brand-500/10'    },
    FEATURE_FLAG_TOGGLED:  { text: 'text-warning-500',  bg: 'bg-warning-500/10'  },
    ADMIN_CREATED:         { text: 'text-violet-500',   bg: 'bg-violet-500/10'   },
    ADMIN_DEACTIVATED:     { text: 'text-danger-500',   bg: 'bg-danger-500/10'   },
    PASSWORD_RESET:        { text: 'text-indigo-500',   bg: 'bg-indigo-500/10'   },
};
const ACTION_FALLBACK = { text: 'text-slate-500', bg: 'bg-slate-100' };

const PAGE_SIZE = 15;

export default function AuditLogs() {
    const [actorFilter, setActorFilter] = useState('ALL');
    const [search, setSearch]           = useState('');
    const [page, setPage]               = useState(1);
    const debouncedSearch = useDebounce(search, 300);

    const filtered = MOCK_LOGS.filter(l => {
        const matchActor  = actorFilter === 'ALL' || l.actor_type === actorFilter;
        const q           = debouncedSearch.toLowerCase();
        const matchSearch = !q
            || l.action.toLowerCase().includes(q)
            || l.entity.toLowerCase().includes(q)
            || l.actor_name.toLowerCase().includes(q);
        return matchActor && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="max-w-[1100px]">

            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="mb-6">
                <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                    Audit Logs
                </h2>
                <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                    Complete record of all super-admin and system actions
                </p>
            </div>

            {/* ── Filters ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] p-4 mb-4 flex gap-3 items-center flex-wrap">

                {/* Actor pills */}
                <div className="flex gap-1.5 flex-wrap">
                    {ACTOR_TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => { setActorFilter(t); setPage(1); }}
                            className={[
                                'py-1.5 px-[13px] rounded-[7px] border text-[0.8125rem] cursor-pointer transition-colors',
                                actorFilter === t
                                    ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                    : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {t === 'ALL' ? 'All Actors' : humanizeEnum(t)}
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
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search action, entity, actor..."
                        className="py-[7px] pr-3 pl-8 border border-[var(--border-default)] rounded-lg text-sm outline-none w-60 focus:border-brand-500 transition-colors"
                    />
                </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                <table className="w-full border-collapse">

                    {/* Head */}
                    <thead>
                        <tr className="border-b border-[var(--border-default)] bg-slate-50">
                            {['Time', 'Action', 'Entity', 'Actor', 'IP Address'].map(h => (
                                <th
                                    key={h}
                                    className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-16 text-center text-[var(--text-muted)]">
                                    <ScrollText size={36} className="mx-auto mb-3 opacity-30" />
                                    <div className="font-medium">No audit logs found</div>
                                </td>
                            </tr>
                        ) : paginated.map((log, idx) => {
                            const EntityIcon = ENTITY_ICON[log.entity_type] ?? Shield;
                            const style      = ACTION_STYLE[log.action]     ?? ACTION_FALLBACK;

                            return (
                                <tr
                                    key={log.id}
                                    className={[
                                        'transition-colors hover:bg-slate-50',
                                        idx < paginated.length - 1
                                            ? 'border-b border-[var(--border-default)]'
                                            : '',
                                    ].join(' ')}
                                >
                                    {/* Time */}
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="text-[0.8125rem] font-medium text-[var(--text-primary)]">
                                            {formatRelativeTime(log.created_at)}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)] mt-0.5">
                                            {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>

                                    {/* Action badge */}
                                    <td className="py-3 px-4">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold font-mono ${style.bg} ${style.text}`}>
                                            {log.action}
                                        </span>
                                    </td>

                                    {/* Entity */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-1.5 text-sm text-[var(--text-primary)] font-medium">
                                            <EntityIcon size={13} className="text-[var(--text-muted)]" />
                                            {log.entity}
                                        </div>
                                    </td>

                                    {/* Actor */}
                                    <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                                        {log.actor_name}
                                    </td>

                                    {/* IP address */}
                                    <td className="py-3 px-4">
                                        <code className="font-mono text-xs text-[var(--text-muted)] bg-slate-100 px-[7px] py-0.5 rounded">
                                            {log.ip_address}
                                        </code>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* ── Pagination ─────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="py-3.5 px-4 border-t border-[var(--border-default)] flex items-center justify-between">
                        <span className="text-[0.8125rem] text-[var(--text-muted)]">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={[
                                        'w-8 h-8 rounded-md border text-[0.8125rem] cursor-pointer transition-colors',
                                        p === page
                                            ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                            : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                                    ].join(' ')}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
