/**
 * Spinner — animated loading indicator.
 *
 * Props:
 *   size    number — diameter in px (default 24)
 *   color   string — border color (default brand blue)
 *   center  bool   — wraps in a centred flex container
 *
 * Usage:
 *   <Spinner />
 *   <Spinner size={16} color="#10B981" />
 *   <Spinner center />    ← fills parent and centres
 */

export default function Spinner({ size = 24, color = 'var(--color-brand-600)', center = false }) {
    const spinner = (
        <>
            <span style={{
                display: 'inline-block',
                width: size,
                height: size,
                borderRadius: '50%',
                border: `${Math.max(2, size / 10)}px solid ${color}30`,
                borderTopColor: color,
                animation: 'spin 0.6s linear infinite',
                flexShrink: 0,
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );

    if (center) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '60px 0',
            }}>
                {spinner}
            </div>
        );
    }

    return spinner;
}