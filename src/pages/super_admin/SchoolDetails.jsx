import {
    Building2, Users, Key, CreditCard,
    Settings, Shield, Activity, MoreVertical, Cpu,
} from "lucide-react";

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ icon: Icon, title, button }) {
    return (
        <div className="card p-[18px]">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)] mb-1.5">
                <Icon size={16} className="text-[var(--text-muted)]" /> {title}
            </div>
            <p className="text-[0.8125rem] text-[var(--text-muted)] mb-3 m-0">
                Manage and configure this section
            </p>
            <button className="py-2 px-3.5 rounded-lg border-none bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold text-[0.8125rem] cursor-pointer hover:opacity-90 transition-opacity">
                {button}
            </button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SchoolDetailsPage() {
    const school = {
        name: "Green Valley School",
        code: "GVS001",
        city: "Kolkata",
        country: "IN",
        timezone: "Asia/Kolkata",
        is_active: true,
        created_at: "2024-01-01",
    };

    const metrics = [
        { label: "Students",       value: 1245       },
        { label: "Active Tokens",  value: 980        },
        { label: "Total Tokens",   value: 1100       },
        { label: "Admins",         value: 5          },
        { label: "Subscription",   value: "Premium"  },
        { label: "MRR",            value: "₹42,000"  },
    ];

    return (
        <div className="max-w-[1200px]">

            {/* ── Header card ───────────────────────────────────────────── */}
            <div className="card p-5 mb-5 flex justify-between items-start">
                <div>
                    <h2 className="font-display font-bold text-[var(--text-primary)] m-0 flex items-center gap-2">
                        <Building2 size={18} className="text-[var(--text-muted)]" />
                        {school.name}
                    </h2>
                    <div className="text-[0.8125rem] text-[var(--text-muted)] mt-1">
                        Code: {school.code} · {school.city}, {school.country}
                    </div>
                    <div className="flex gap-3.5 text-xs text-[var(--text-muted)] mt-1.5">
                        <span>Timezone: {school.timezone}</span>
                        <span>Created: {school.created_at}</span>
                    </div>
                </div>

                <button className="p-2 rounded-lg border border-[var(--border-default)] bg-white cursor-pointer text-[var(--text-muted)] hover:bg-slate-50 transition-colors">
                    <MoreVertical size={16} />
                </button>
            </div>

            {/* ── Metrics grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-[14px] mb-5">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className="card px-5 py-[18px]"
                    >
                        <div className="text-xs text-[var(--text-muted)] mb-1">{m.label}</div>
                        <div className="font-display font-bold text-[1.4rem] text-[var(--text-primary)]">
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Section cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-[14px]">
                <Section icon={Users}      title="School Admins"           button="Manage Admins"        />
                <Section icon={Cpu}        title="Token Management"        button="View Tokens"          />
                <Section icon={CreditCard} title="Subscription & Billing"  button="Manage Subscription"  />
                <Section icon={Settings}   title="School Settings"         button="Configure Settings"   />
                <Section icon={Shield}     title="API & Integrations"      button="View Integrations"    />
                <Section icon={Activity}   title="Audit & Activity Logs"   button="View Logs"            />
            </div>

            {/* ── Footer note ───────────────────────────────────────────── */}
            <div className="mt-4 text-xs text-[var(--text-muted)]">
                This page aggregates operational data related to the school entity.
            </div>
        </div>
    );
}