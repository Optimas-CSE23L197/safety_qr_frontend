import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { humanizeEnum } from '../../utils/formatters.js';
import SectionHeader from './SectionHeader.jsx';
import Skeleton from './Skeleton.jsx';

const SubscriptionDonut = ({ data, loading }) => (
    <div style={{
        background: 'var(--color-surface-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: '14px',
        padding: '20px 24px',
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
    }}>
        <SectionHeader title="Subscription Breakdown" />
        {loading ? <Skeleton w="100%" h="220px" radius="8px" /> : (
            <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <PieChart width={180} height={180}>
                        <Pie
                            data={data}
                            cx={85}
                            cy={85}
                            innerRadius={52}
                            outerRadius={80}
                            dataKey="count"
                            nameKey="status"
                            paddingAngle={3}
                        >
                            {data.map(entry => (
                                <Cell key={entry.status} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [value, humanizeEnum(name)]}
                            contentStyle={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', borderRadius: '8px' }}
                        />
                    </PieChart>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {data.map(entry => (
                        <div key={entry.status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: entry.color, flexShrink: 0 }} />
                                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{humanizeEnum(entry.status)}</span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{entry.count}</span>
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
);

export default SubscriptionDonut;