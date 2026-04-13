/**
 * FormTextArea — styled <textarea> with label + error.
 *
 * Props:
 *   label     string
 *   required  bool
 *   error     string
 *   hint      string
 *   rows      number  (default 4)
 *   register  object  — react-hook-form register() spread
 *   ...rest           — native textarea props
 *
 * Usage:
 *   <FormTextArea label="Address" rows={3} value={v} onChange={e => setV(e.target.value)} />
 */

export default function FormTextArea({
    label,
    required,
    error,
    hint,
    rows = 4,
    register,
    style: extraStyle = {},
    ...rest
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && (
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {label}
                    {required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
                </label>
            )}

            <textarea
                rows={rows}
                style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: `1px solid ${error ? '#FCA5A5' : 'var(--border-default)'}`,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    background: rest.disabled ? 'var(--color-slate-50)' : 'white',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    ...extraStyle,
                }}
                onFocus={e => e.target.style.borderColor = error ? '#EF4444' : 'var(--color-brand-500)'}
                onBlur={e => e.target.style.borderColor = error ? '#FCA5A5' : 'var(--border-default)'}
                {...register}
                {...rest}
            />

            {(error || hint) && (
                <p style={{ margin: 0, fontSize: '0.75rem', color: error ? '#EF4444' : 'var(--text-muted)' }}>
                    {error || hint}
                </p>
            )}
        </div>
    );
}
