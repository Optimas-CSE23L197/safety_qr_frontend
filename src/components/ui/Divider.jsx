/**
 * Divider — horizontal or vertical separator.
 *
 * Props:
 *   label      string   — optional centred label text
 *   vertical   bool     — renders a vertical divider (needs parent height)
 *   style      object   — extra overrides
 *
 * Usage:
 *   <Divider />
 *   <Divider label="or" />
 *   <Divider vertical style={{ height: '20px' }} />
 */

export default function Divider({ label, vertical = false, style: extraStyle = {} }) {
    if (vertical) {
        return (
            <div style={{
                width: '1px',
                background: 'var(--border-default)',
                alignSelf: 'stretch',
                flexShrink: 0,
                ...extraStyle,
            }} />
        );
    }

    if (label) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                margin: '4px 0',
                ...extraStyle,
            }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {label}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
            </div>
        );
    }

    return (
        <div style={{
            height: '1px',
            background: 'var(--border-default)',
            margin: '4px 0',
            ...extraStyle,
        }} />
    );
}
