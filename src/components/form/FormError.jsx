/**
 * FormError — form-level error banner (not field-level).
 * Use for API errors returned after submit.
 *
 * Props:
 *   message  string|node  — error text
 *   onDismiss fn          — optional dismiss handler
 *
 * Usage:
 *   <FormError message="Invalid credentials. Please try again." />
 *   <FormError message={apiError} onDismiss={() => setApiError(null)} />
 */

import { AlertCircle, X } from 'lucide-react';

export default function FormError({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            marginBottom: '16px',
        }}>
            <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{
                margin: 0, flex: 1,
                fontSize: '0.875rem',
                color: '#B91C1C',
                lineHeight: 1.5,
            }}>
                {message}
            </p>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    style={{
                        border: 'none', background: 'none',
                        cursor: 'pointer', color: '#DC2626',
                        padding: '0', display: 'flex', flexShrink: 0,
                    }}
                >
                    <X size={15} />
                </button>
            )}
        </div>
    );
}