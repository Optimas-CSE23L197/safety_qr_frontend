import { formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import { AUDIT_ACTION_META } from '../../data/dashboard.mock.js';
import SectionHeader from './SectionHeader.jsx';
import { ROUTES } from '../../config/routes.config.js';

const RecentAudit = ({ logs }) => (
    <div style={{
        background: 'var(--color-surface-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: '14px',
        padding: '20px 24px',
        flex: 1,
        minWidth: 0,
    }}>
        <SectionHeader
            title="Recent Audit Activity"
            actionLabel="Full Log"
            actionPath={ROUTES.SUPER_ADMIN.AUDIT_LOGS}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {logs.map(log => {
                const meta = AUDIT_ACTION_META[log.action] || { icon: '📋', color: '#64748B' };
                return (
                    <div
                        key={log.id}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '10px 8px', borderRadius: '8px', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '8px',
                            background: `${meta.color}18`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', flexShrink: 0,
                        }}>
                            {meta.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>
                                {humanizeEnum(log.action)}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {log.entity} · {formatRelativeTime(log.created_at)}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default RecentAudit;