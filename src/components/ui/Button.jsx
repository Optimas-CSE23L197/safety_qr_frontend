/**
 * Button — matches the design system used across admin pages.
 *
 * Variants:
 *   primary   — blue gradient  (default)
 *   success   — green gradient
 *   danger    — red gradient
 *   ghost     — white + border
 *   subtle    — slate bg, no border
 *
 * Sizes: sm | md (default) | lg
 *
 * Usage:
 *   <Button>Save</Button>
 *   <Button variant="ghost" icon={ArrowLeft}>Back</Button>
 *   <Button variant="danger" size="sm" loading={deleting}>Delete</Button>
 *   <Button variant="success" icon={CheckCircle}>Register School</Button>
 */

const VARIANTS = {
    primary: {
        background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        hoverShadow: '0 6px 16px rgba(37,99,235,0.4)',
    },
    success: {
        background: 'linear-gradient(135deg, #10B981, #059669)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
        hoverShadow: '0 6px 16px rgba(16,185,129,0.4)',
    },
    danger: {
        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
        hoverShadow: '0 6px 16px rgba(239,68,68,0.4)',
    },
    ghost: {
        background: 'white',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-default)',
        boxShadow: 'none',
        hoverShadow: 'none',
        hoverBg: 'var(--color-slate-50)',
    },
    subtle: {
        background: 'var(--color-slate-100)',
        color: 'var(--text-secondary)',
        border: 'none',
        boxShadow: 'none',
        hoverShadow: 'none',
        hoverBg: 'var(--color-slate-200)',
    },
};

const SIZES = {
    sm: { padding: '6px 13px', fontSize: '0.8125rem', gap: '5px', iconSize: 13 },
    md: { padding: '9px 18px', fontSize: '0.875rem', gap: '6px', iconSize: 15 },
    lg: { padding: '11px 22px', fontSize: '0.9375rem', gap: '8px', iconSize: 16 },
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    style: extraStyle = {},
}) {
    const v = VARIANTS[variant] ?? VARIANTS.primary;
    const s = SIZES[size] ?? SIZES.md;
    const isDisabled = disabled || loading;

    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        borderRadius: '8px',
        border: v.border ?? 'none',
        background: isDisabled ? '#CBD5E1' : v.background,
        color: isDisabled ? '#94A3B8' : v.color,
        boxShadow: isDisabled ? 'none' : v.boxShadow,
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: s.fontSize,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...extraStyle,
    };

    return (
        <button
            type={type}
            onClick={isDisabled ? undefined : onClick}
            disabled={isDisabled}
            style={baseStyle}
            onMouseEnter={e => {
                if (isDisabled) return;
                if (v.hoverBg) e.currentTarget.style.background = v.hoverBg;
                if (v.hoverShadow) e.currentTarget.style.boxShadow = v.hoverShadow;
            }}
            onMouseLeave={e => {
                if (isDisabled) return;
                e.currentTarget.style.background = v.background;
                e.currentTarget.style.boxShadow = v.boxShadow ?? 'none';
            }}
        >
            {loading ? (
                <span style={{
                    width: s.iconSize, height: s.iconSize, borderRadius: '50%',
                    border: `2px solid ${v.color === 'white' ? 'rgba(255,255,255,0.3)' : 'var(--border-default)'}`,
                    borderTopColor: v.color === 'white' ? 'white' : 'var(--color-brand-600)',
                    animation: 'btn-spin 0.6s linear infinite',
                    display: 'inline-block', flexShrink: 0,
                }} />
            ) : Icon ? (
                <Icon size={s.iconSize} style={{ flexShrink: 0 }} />
            ) : null}
            {children}
            {!loading && IconRight && <IconRight size={s.iconSize} style={{ flexShrink: 0 }} />}
            <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
        </button>
    );
}