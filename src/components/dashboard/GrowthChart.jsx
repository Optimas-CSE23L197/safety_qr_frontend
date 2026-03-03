import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatCompact } from '../../utils/formatters.js';
import SectionHeader from './SectionHeader.jsx';
import Skeleton from './Skeleton.jsx';
import ChartTooltip from './ChartTooltip.jsx';

const GrowthChart = ({ data, loading }) => (
    <div style={{
        background: 'var(--color-surface-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: '14px',
        padding: '20px 24px',
        flex: 2,
        minWidth: 0,
    }}>
        <SectionHeader title="Platform Growth" subtitle="Schools & students over the last 7 months" />
        {loading ? <Skeleton w="100%" h="220px" radius="8px" /> : (
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradSchools" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.18} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="schools" orientation="left" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="students" orientation="right" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} axisLine={false} tickLine={false} tickFormatter={v => formatCompact(v)} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area yAxisId="schools" type="monotone" dataKey="schools" name="Schools" stroke="#6366F1" strokeWidth={2} fill="url(#gradSchools)" dot={false} />
                    <Area yAxisId="students" type="monotone" dataKey="students" name="Students" stroke="#10B981" strokeWidth={2} fill="url(#gradStudents)" dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        )}
    </div>
);

export default GrowthChart;