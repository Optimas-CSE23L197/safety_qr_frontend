/**
 * Badge — pill-shaped status/role labels.
 *
 * Preset variants (map to the colours used across admin pages):
 *   success  — green   (Active, enabled)
 *   danger   — red     (Inactive, failed, error)
 *   warning  — amber   (Pending, trial)
 *   info     — blue    (Admin, info)
 *   purple   — violet  (Staff, special)
 *   neutral  — slate   (Viewer, default, inactive)
 *
 * Or pass a `colorStyle` object {bg, color} for custom colours
 * (used by ROLE_STYLE maps, plan colours, etc.)
 *
 * Usage:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="warning" icon={Clock}>Pending</Badge>
 *   <Badge colorStyle={{ bg: '#EFF6FF', color: '#1D4ED8' }} icon={Users}>Admin</Badge>
 */

const VARIANTS = {
    success: { bg: '#ECFDF5', color: '#047857' },
    danger: { bg: '#FEF2F2', color: '#B91C1C' },
    warning: { bg: '#FEF3C7', color: '#B45309' },
    info: { bg: '#EFF6FF', color: '#1D4ED8' },
    purple: { bg: '#F5F3FF', color: '#6D28D9' },
    neutral: { bg: '#F1F5F9', color: '#475569' },
};

const SIZES = {
    sm: { padding: '2px 8px', fontSize: '0.6875rem', gap: '4px', iconSize: 10 },
    md: { padding: '3px 10px', fontSize: '0.75rem', gap: '5px', iconSize: 11 },
    lg: { padding: '4px 12px', fontSize: '0.8125rem', gap: '6px', iconSize: 12 },
};

export default function Badge({
    children,
    variant = 'neutral',
    colorStyle,         // { bg, color } — overrides variant
    icon: Icon,
    size = 'md',
    dot = false,        // show coloured dot instead of icon
}) {
    const { bg, color } = colorStyle ?? VARIANTS[variant] ?? VARIANTS.neutral;
    const s = SIZES[size] ?? SIZES.md;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: s.gap,
            padding: s.padding,
            borderRadius: '9999px',
            fontSize: s.fontSize,
            fontWeight: 600,
            background: bg,
            color,
            whiteSpace: 'nowrap',
        }}>
            {dot && (
                <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                }} />
            )}
            {Icon && !dot && <Icon size={s.iconSize} style={{ flexShrink: 0 }} />}
            {children}
        </span>
    );
}
