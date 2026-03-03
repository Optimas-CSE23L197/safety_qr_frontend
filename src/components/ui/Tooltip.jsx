/**
 * Tooltip — hover tooltip wrapper.
 *
 * Props:
 *   text      string   — tooltip content
 *   position  top|bottom|left|right  (default 'top')
 *   children  node     — the element to wrap
 *
 * Usage:
 *   <Tooltip text="Send password reset">
 *     <button>…</button>
 *   </Tooltip>
 */

import { useState } from 'react';

const POSITIONS = {
    top: { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    left: { right: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' },
    right: { left: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' },
};

export default function Tooltip({ text, position = 'top', children }) {
    const [visible, setVisible] = useState(false);

    return (
        <div
            style={{ position: 'relative', display: 'inline-flex' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && text && (
                <div style={{
                    position: 'absolute',
                    ...POSITIONS[position],
                    background: '#1E293B',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    padding: '5px 9px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    animation: 'tooltip-in 0.1s ease',
                }}>
                    {text}
                </div>
            )}
            <style>{`
                @keyframes tooltip-in {
                    from { opacity: 0; transform: ${POSITIONS[position].transform} translateY(${position === 'top' ? '4px' : position === 'bottom' ? '-4px' : '0'}); }
                    to   { opacity: 1; transform: ${POSITIONS[position].transform} translateY(0); }
                }
            `}</style>
        </div>
    );
}