/**
 * Modal — centred overlay dialog.
 *
 * Props:
 *   open     bool     — controls visibility
 *   onClose  fn       — called on backdrop click or X button
 *   title    string   — header title
 *   size     sm|md|lg — max-width preset
 *   children          — modal body
 *   footer            — optional footer node (replaces default close btn)
 *
 * Usage:
 *   <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Admin Account">
 *     <CreateAdminForm onClose={() => setShowModal(false)} />
 *   </Modal>
 */

import { X } from 'lucide-react';
import { useEffect } from 'react';

const SIZES = {
    sm: '380px',
    md: '440px',
    lg: '580px',
    xl: '720px',
};

export default function Modal({
    open,
    onClose,
    title,
    size = 'md',
    children,
    footer,
}) {
    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
                backdropFilter: 'blur(2px)',
                animation: 'modal-fade-in 0.15s ease',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '28px',
                maxWidth: SIZES[size] ?? SIZES.md,
                width: '100%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                animation: 'modal-slide-up 0.2s ease',
                maxHeight: '90vh',
                overflowY: 'auto',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '20px',
                }}>
                    <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                    }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none', background: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: '4px', borderRadius: '6px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-100)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                {children}

                {/* Footer */}
                {footer && (
                    <div style={{
                        display: 'flex', gap: '10px', justifyContent: 'flex-end',
                        marginTop: '20px', paddingTop: '16px',
                        borderTop: '1px solid var(--border-default)',
                    }}>
                        {footer}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes modal-fade-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modal-slide-up {
                    from { transform: translateY(12px); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
            `}</style>
        </div>
    );
}
