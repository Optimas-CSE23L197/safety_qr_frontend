const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--color-surface-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', margin: '0 0 6px' }}>{label}</p>
            {payload.map(entry => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                        {entry.name}: {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ChartTooltip;