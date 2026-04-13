/**
 * FormCheckBox — styled checkbox with label + optional description.
 *
 * Props:
 *   label       string
 *   description string  — small muted text under label
 *   error       string
 *   register    object  — react-hook-form register() spread
 *   ...rest             — native input[type=checkbox] props (checked, onChange, disabled)
 *
 * Usage:
 *   <FormCheckBox label="Send welcome email" checked={v} onChange={e => setV(e.target.checked)} />
 *   <FormCheckBox label="Enable SMS alerts" description="Requires SMS credits on the plan." />
 */

export default function FormCheckBox({
    label,
    description,
    error,
    register,
    ...rest
}) {
    return (
        <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            cursor: rest.disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
        }}>
            <input
                type="checkbox"
                style={{
                    marginTop: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    accentColor: 'var(--color-brand-600)',
                    cursor: rest.disabled ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                }}
                {...register}
                {...rest}
            />
            <div>
                {label && (
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: rest.disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                        display: 'block',
                    }}>
                        {label}
                    </span>
                )}
                {description && (
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        display: 'block',
                        lineHeight: 1.4,
                    }}>
                        {description}
                    </span>
                )}
                {error && (
                    <span style={{ fontSize: '0.75rem', color: '#EF4444', display: 'block', marginTop: '3px' }}>
                        {error}
                    </span>
                )}
            </div>
        </label>
    );
}
