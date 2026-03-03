/**
 * Card — white rounded container matching the table/filter card style.
 *
 * Props:
 *   padding    string|number   — default '20px'
 *   shadow     bool            — enables var(--shadow-card) (default true)
 *   noBorder   bool            — removes border
 *   style      object          — extra overrides
 *   children
 *
 * Usage:
 *   <Card>…</Card>
 *   <Card padding="28px">…</Card>
 *   <Card shadow={false} style={{ overflow: 'hidden' }}>…</Card>
 */

export default function Card({
    children,
    padding = '20px',
    shadow = true,
    noBorder = false,
    style: extraStyle = {},
}) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            border: noBorder ? 'none' : '1px solid var(--border-default)',
            boxShadow: shadow ? 'var(--shadow-card)' : 'none',
            padding,
            ...extraStyle,
        }}>
            {children}
        </div>
    );
}