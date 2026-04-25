/**
 * Drawer — slide-in side panel (right side by default).
 *
 * Props:
 *   open      bool     — controls visibility
 *   onClose   fn       — called on backdrop click or X button
 *   title     string   — header title
 *   subtitle  string   — optional subtext under title
 *   width     string   — default '480px'
 *   footer    node     — fixed footer (e.g. Save/Cancel buttons)
 *   children
 *
 * Usage:
 *   <Drawer open={open} onClose={close} title="School Details">
 *     …content…
 *   </Drawer>
 *   <Drawer open={open} onClose={close} title="Edit" footer={<><Button>Save</Button><Button variant="ghost">Cancel</Button></>}>
 *     …form…
 *   </Drawer>
 */

import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Drawer({
    open,
    onClose,
    title,
    subtitle,
    width = '480px',
    footer,
    children,
}) {
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 999,
                    backdropFilter: 'blur(2px)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'all' : 'none',
                    transition: 'opacity 0.25s',
                }}
            />

            {/* Panel */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width,
                background: 'white',
                zIndex: 1000,
                display: 'flex', flexDirection: 'column',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.15)',
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.28s cubic-bezier(0.32,0.72,0,1)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border-default)',
                    flexShrink: 0,
                }}>
                    <div>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.125rem', fontWeight: 700,
                            color: 'var(--text-primary)', margin: 0,
                        }}>
                            {title}
                        </h3>
                        {subtitle && (
                            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none', background: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: '4px', borderRadius: '6px',
                            display: 'flex', transition: 'background 0.15s', marginTop: '-2px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-100)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid var(--border-default)',
                        display: 'flex', gap: '10px', justifyContent: 'flex-end',
                        flexShrink: 0,
                        background: 'white',
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
}
