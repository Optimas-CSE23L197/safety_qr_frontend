export default function FormInput({
    label,
    error,
    rightElement,
    className = "",
    ...props
}) {
    return (
        <div className="space-y-2">
            {label && <label className="text-slate-300 text-sm">{label}</label>}

            <div className="relative">
                <input
                    {...props}
                    className={`w-full rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2 text-white ${rightElement ? "pr-10" : ""
                        } ${className}`}
                />
                {rightElement}
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    );
}