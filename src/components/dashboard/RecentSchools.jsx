import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { formatRelativeTime, humanizeEnum } from '../../utils/formatters.js';
import { SUB_STATUS_STYLE } from '../../data/dashboard.mock.js';
import SectionHeader from './SectionHeader.jsx';
import { ROUTES } from '../../config/routes.config.js';

const RecentSchools = ({ schools }) => {
    const navigate = useNavigate();
    return (
        <div style={{
            background: 'var(--color-surface-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '14px',
            padding: '20px 24px',
            flex: 1,
            minWidth: 0,
        }}>
            <SectionHeader
                title="Recently Registered Schools"
                actionLabel="All Schools"
                actionPath={ROUTES.SUPER_ADMIN.SCHOOLS}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {schools.map(school => {
                    const s = SUB_STATUS_STYLE[school.status] || SUB_STATUS_STYLE.ACTIVE;
                    return (
                        <div
                            key={school.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 8px', borderRadius: '8px', cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            onClick={() => navigate(`/super/schools/${school.id}`)}
                        >
                            <div style={{
                                width: '34px', height: '34px', borderRadius: '8px',
                                background: 'var(--color-slate-100)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <Building2 size={15} color="var(--color-text-tertiary)" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {school.name}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', margin: '1px 0 0' }}>
                                    {school.city} · {formatRelativeTime(school.created_at)}
                                </p>
                            </div>
                            <span style={{
                                padding: '3px 9px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                                background: s.bg, color: s.color, flexShrink: 0,
                            }}>
                                {humanizeEnum(school.status)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentSchools;