/**
 * FormSelect — styled <select> with label + error, matching the design system.
 *
 * Props:
 *   label     string
 *   required  bool
 *   error     string
 *   hint      string
 *   options   Array<{ value, label }> | Array<string>
 *   register  object  — react-hook-form register() spread
 *   ...rest           — native select props (value, onChange, disabled, etc.)
 *
 * Usage (manual):
 *   <FormSelect label="Role" value={role} onChange={e => setRole(e.target.value)}
 *     options={[{ value: 'ADMIN', label: 'Admin' }, { value: 'STAFF', label: 'Staff' }]} />
 *
 * Usage (react-hook-form):
 *   <FormSelect label="Role" register={register('role')} error={errors.role?.message}
 *     options={ROLE_OPTIONS} />
 */

export default function FormSelect({
    label,
    required,
    error,
    hint,
    options = [],
    register,
    style: extraStyle = {},
    ...rest
}) {
    const normalised = options.map(o =>
        typeof o === 'string' ? { value: o, label: o } : o
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && (
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {label}
                    {required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
                </label>
            )}

            <select
                style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: `1px solid ${error ? '#FCA5A5' : 'var(--border-default)'}`,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    background: rest.disabled ? 'var(--color-slate-50)' : 'white',
                    outline: 'none',
                    cursor: rest.disabled ? 'not-allowed' : 'pointer',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                    appearance: 'auto',
                    ...extraStyle,
                }}
                onFocus={e => e.target.style.borderColor = error ? '#EF4444' : 'var(--color-brand-500)'}
                onBlur={e => e.target.style.borderColor = error ? '#FCA5A5' : 'var(--border-default)'}
                {...register}
                {...rest}
            >
                {normalised.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {(error || hint) && (
                <p style={{ margin: 0, fontSize: '0.75rem', color: error ? '#EF4444' : 'var(--text-muted)' }}>
                    {error || hint}
                </p>
            )}
        </div>
    );
}