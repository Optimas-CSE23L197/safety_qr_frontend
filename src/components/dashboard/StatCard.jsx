import { TrendingUp, TrendingDown } from 'lucide-react';
import Skeleton from './Skeleton.jsx';

const StatCard = ({ label, value, icon: Icon, color, bg, trend, trendLabel, loading }) => (
    <div
        style={{
            background: 'var(--color-surface-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '14px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                </span>

                {loading ? <Skeleton w="80px" h="28px" /> : (
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
                        {value}
                    </span>
                )}

                {!loading && trendLabel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        {trend === 'up'
                            ? <TrendingUp size={13} color="#10B981" />
                            : trend === 'down'
                                ? <TrendingDown size={13} color="#EF4444" />
                                : null}
                        <span style={{ fontSize: '0.75rem', color: trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : 'var(--color-text-tertiary)', fontWeight: 500 }}>
                            {trendLabel}
                        </span>
                    </div>
                )}
            </div>

            <div style={{ background: bg, color, borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} />
            </div>
        </div>
    </div>
);

export default StatCard;