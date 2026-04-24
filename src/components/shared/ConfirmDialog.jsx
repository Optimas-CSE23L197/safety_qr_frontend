/**
 * ConfirmDialog — destructive action confirmation modal.
 *
 * Props:
 *   open        bool
 *   onClose     fn
 *   onConfirm   fn
 *   title       string
 *   message     string|node
 *   confirmLabel string  (default 'Confirm')
 *   variant     'danger'|'warning'|'primary'
 *   loading     bool
 *
 * Usage:
 *   <ConfirmDialog
 *     open={confirmOpen}
 *     onClose={() => setConfirmOpen(false)}
 *     onConfirm={handleDeactivate}
 *     title="Deactivate Admin?"
 *     message="This will revoke their access immediately. You can re-activate them later."
 *     confirmLabel="Deactivate"
 *     variant="danger"
 *   />
 */

import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { AlertTriangle, Info } from 'lucide-react';

const ICON_MAP = {
    danger: { Icon: AlertTriangle, bg: '#FEF2F2', color: '#DC2626' },
    warning: { Icon: AlertTriangle, bg: '#FEF3C7', color: '#D97706' },
    primary: { Icon: Info, bg: '#EFF6FF', color: '#2563EB' },
};

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    variant = 'danger',
    loading = false,
}) {
    const { Icon, bg, color } = ICON_MAP[variant] ?? ICON_MAP.danger;

    return (
        <Modal open={open} onClose={onClose} size="sm"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={variant === 'primary' ? 'primary' : variant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '4px' }}>
                <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                }}>
                    <Icon size={24} color={color} />
                </div>
                <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1rem',
                    fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px',
                }}>
                    {title}
                </h3>
                {message && (
                    <p style={{
                        fontSize: '0.875rem', color: 'var(--text-secondary)',
                        lineHeight: 1.6, margin: 0,
                    }}>
                        {message}
                    </p>
                )}
            </div>
        </Modal>
    );
}
