/**
 * FormInput — Input wired for react-hook-form or manual use.
 *
 * Props:
 *   label       string
 *   required    bool
 *   error       string      — field error message
 *   hint        string      — helper text (shown when no error)
 *   prefix      node        — left icon/text
 *   suffix      node        — right icon/button
 *   register    object      — react-hook-form register() return value (spread onto input)
 *   ...rest                 — native input props (type, placeholder, value, onChange, etc.)
 *
 * Usage (manual):
 *   <FormInput label="Email" type="email" required value={v} onChange={e => setV(e.target.value)} />
 *
 * Usage (react-hook-form):
 *   <FormInput label="Email" required register={register('email')} error={errors.email?.message} />
 */

import Input from '../ui/Input.jsx';

export default function FormInput({
    label,
    required,
    error,
    hint,
    prefix,
    suffix,
    register,
    ...rest
}) {
    return (
        <Input
            label={label}
            required={required}
            error={error}
            hint={hint}
            prefix={prefix}
            suffix={suffix}
            {...register}
            {...rest}
        />
    );
}