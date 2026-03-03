import { useState } from "react";
import { schoolRegistervalidators } from "../validation/school.schema";
import { STEPS, PLANS, TRIAL_OPTIONS } from "../../utils/constants";

export function validateStep(step, schoolInfo, adminInfo) {
  if (step === 1)
    return {
      name: schoolRegistervalidators.schoolName(schoolInfo.name),
      code: schoolRegistervalidators.schoolCode(schoolInfo.code),
      email: schoolRegistervalidators.email(schoolInfo.email),
      phone: schoolRegistervalidators.phone(schoolInfo.phone),
      city: schoolRegistervalidators.city(schoolInfo.city),
    };
  if (step === 2)
    return {
      name: schoolRegistervalidators.adminName(adminInfo.name),
      email: schoolRegistervalidators.adminEmail(adminInfo.email),
      password: schoolRegistervalidators.password(adminInfo.password),
    };
  return {};
}

export function FieldGroup({ label, required, error, help, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
      {!error && help && <p className="text-xs text-slate-400 mt-1">{help}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  placeholder,
  suffix,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const borderClass = error
    ? "border-red-300 bg-red-50"
    : focused
      ? "border-blue-500 bg-white"
      : "border-slate-200 bg-slate-50";

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg text-sm text-slate-900 outline-none transition-all duration-150 border-[1.5px] ${borderClass} ${suffix ? "pr-10" : ""}`}
        {...rest}
      />
      {suffix && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          {suffix}
        </div>
      )}
    </div>
  );
}

export function Stepper({ current }) {
  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-6 py-4 mb-6 shadow-sm">
      {STEPS.map((s, idx) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2
                ${done ? "bg-emerald-50 border-emerald-300 text-emerald-600" : ""}
                ${active ? "bg-blue-600 border-blue-600 text-white" : ""}
                ${!done && !active ? "bg-slate-100 border-slate-200 text-slate-400" : ""}
              `}
              >
                {done ? "✓" : s.id}
              </div>
              <span
                className={`
                text-[0.6875rem] whitespace-nowrap
                ${done ? "text-emerald-600 font-medium" : ""}
                ${active ? "text-blue-600 font-bold" : ""}
                ${!done && !active ? "text-slate-400 font-medium" : ""}
              `}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1.5 mb-4 rounded-full transition-all duration-300 ${done ? "bg-emerald-300" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ReviewSection({ title, rows }) {
  return (
    <div className="mb-5">
      <p className="text-[0.6875rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {title}
      </p>
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={`flex justify-between items-center px-4 py-2.5 ${i < rows.length - 1 ? "border-b border-slate-100" : ""}`}
          >
            <span className="text-xs text-slate-500">{k}</span>
            <span className="text-sm text-slate-900 font-semibold">
              {v || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InfoBanner({ children, variant = "info" }) {
  const cls =
    variant === "warning"
      ? "bg-orange-50 border-orange-200 text-orange-700"
      : "bg-blue-50 border-blue-200 text-blue-700";
  const icon = variant === "warning" ? "⚠️" : "ℹ️";
  return (
    <div
      className={`flex gap-2 items-start px-4 py-3 rounded-lg border text-xs mt-1 ${cls}`}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export function Textarea({
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  rows = 2,
}) {
  const [focused, setFocused] = useState(false);
  const borderClass = error
    ? "border-red-300 bg-red-50"
    : focused
      ? "border-blue-500 bg-white"
      : "border-slate-200 bg-slate-50";

  return (
    <textarea
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 rounded-lg text-sm text-slate-900 outline-none transition-all duration-150 border-[1.5px] resize-y ${borderClass}`}
    />
  );
}

export function SelectInput({ value, onChange, onBlur, error, children }) {
  const [focused, setFocused] = useState(false);
  const borderClass = error
    ? "border-red-300 bg-red-50"
    : focused
      ? "border-blue-500 bg-white"
      : "border-slate-200 bg-slate-50";

  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      className={`w-full px-3 py-2 rounded-lg text-sm text-slate-900 outline-none transition-all duration-150 border-[1.5px] cursor-pointer ${borderClass}`}
    >
      {children}
    </select>
  );
}

export function hasErrors(errs) {
  return Object.values(errs).some(Boolean);
}
