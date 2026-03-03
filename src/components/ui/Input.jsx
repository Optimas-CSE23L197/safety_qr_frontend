/**
 * Input — styled text input with label, error, and optional affix.
 *
 * Props:
 *   label        string   — field label
 *   required     bool     — shows red asterisk
 *   error        string   — red helper text below input
 *   hint         string   — grey helper text below input (shown when no error)
 *   prefix       node     — icon/text inside left side
 *   suffix       node     — icon/button inside right side
 *   ...rest               — passed to <input> (type, value, onChange, placeholder, etc.)
 *
 * Usage:
 *   <Input label="Email" required type="email" value={v} onChange={setV} />
 *   <Input label="Search" prefix={<Search size={14} />} placeholder="Search..." />
 *   <Input
 *     label="Password"
 *     type={show ? 'text' : 'password'}
 *     suffix={<button onClick={toggle}><Eye size={15} /></button>}
 *   />
 */

export default function Input({
    label,
    required,
    error,
    hint,
    prefix,
    suffix,
    style: extraStyle = {},
    ...rest
}) {
    const hasAffix = prefix || suffix;

    const inputStyle = {
        width: '100%',
        padding: `9px ${suffix ? '36px' : '12px'} 9px ${prefix ? '34px' : '12px'}`,
        border: `1px solid ${error ? '#FCA5A5' : 'var(--border-default)'}`,
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: 'var(--text-primary)',
        background: rest.disabled ? 'var(--color-slate-50)' : 'white',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxSizing: 'border-box',
        ...extraStyle,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {label && (
                <label style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                }}>
                    {label}
                    {required && (
                        <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>
                    )}
                </label>
            )}

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {prefix && (
                    <span style={{
                        position: 'absolute', left: '10px',
                        display: 'flex', alignItems: 'center',
                        color: 'var(--text-muted)', pointerEvents: 'none',
                    }}>
                        {prefix}
                    </span>
                )}

                <input
                    style={inputStyle}
                    onFocus={e => {
                        e.target.style.borderColor = error ? '#EF4444' : 'var(--color-brand-500)';
                        e.target.style.boxShadow = error
                            ? '0 0 0 3px rgba(239,68,68,0.1)'
                            : '0 0 0 3px rgba(37,99,235,0.1)';
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = error ? '#FCA5A5' : 'var(--border-default)';
                        e.target.style.boxShadow = 'none';
                    }}
                    {...rest}
                />

                {suffix && (
                    <span style={{
                        position: 'absolute', right: '10px',
                        display: 'flex', alignItems: 'center',
                        color: 'var(--text-muted)',
                    }}>
                        {suffix}
                    </span>
                )}
            </div>

            {(error || hint) && (
                <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: error ? '#EF4444' : 'var(--text-muted)',
                }}>
                    {error || hint}
                </p>
            )}
        </div>
    );
}