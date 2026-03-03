/**
 * Avatar — circular initial avatar with optional name + subtitle row.
 *
 * Props:
 *   name       string   — used to derive initials & gradient
 *   subtitle   string   — shown below name (email, role, etc.)
 *   size       sm|md|lg
 *   highlight  bool     — golden gradient for SUPER_ADMIN style
 *   src        string   — optional image URL; falls back to initials
 *
 * Usage:
 *   <Avatar name="Rajesh Kumar" subtitle="admin@school.edu.in" />
 *   <Avatar name="Rajesh Kumar" highlight />                   ← super admin gold
 *   <Avatar name="Priya Sharma" subtitle="ADMIN" size="sm" />
 *   <Avatar name="DPS" size="lg" />                            ← school avatar
 */

import { Mail } from 'lucide-react';

function getInitials(name = '') {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
    sm: { circle: 28, font: '0.6875rem', nameFont: '0.8125rem', subFont: '0.6875rem', gap: '8px' },
    md: { circle: 36, font: '0.8125rem', nameFont: '0.875rem', subFont: '0.75rem', gap: '10px' },
    lg: { circle: 44, font: '0.9375rem', nameFont: '0.9375rem', subFont: '0.8125rem', gap: '12px' },
};

export default function Avatar({
    name = '',
    subtitle,
    subtitleIcon = true,
    size = 'md',
    highlight = false,
    src,
    style: extraStyle = {},
}) {
    const s = SIZES[size] ?? SIZES.md;

    const circleStyle = {
        width: s.circle,
        height: s.circle,
        borderRadius: '50%',
        background: highlight
            ? 'linear-gradient(135deg, #D97706, #F59E0B)'
            : 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: s.font,
        color: highlight ? 'white' : 'var(--color-brand-700)',
        flexShrink: 0,
        overflow: 'hidden',
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: s.gap, ...extraStyle }}>
            <div style={circleStyle}>
                {src ? (
                    <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    getInitials(name)
                )}
            </div>

            {(name || subtitle) && (
                <div>
                    {name && (
                        <div style={{
                            fontWeight: 600,
                            fontSize: s.nameFont,
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                        }}>
                            {name}
                        </div>
                    )}
                    {subtitle && (
                        <div style={{
                            fontSize: s.subFont,
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '1px',
                        }}>
                            {subtitleIcon && <Mail size={10} />}
                            {subtitle}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}