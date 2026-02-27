import React from "react";
import {
    Building2,
    Users,
    Key,
    CreditCard,
    Settings,
    Shield,
    Activity,
    MoreVertical,
    Cpu,
} from "lucide-react";

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
        { label: "Students", value: 1245 },
        { label: "Active Tokens", value: 980 },
        { label: "Total Tokens", value: 1100 },
        { label: "Admins", value: 5 },
        { label: "Subscription", value: "Premium" },
        { label: "MRR", value: "₹42,000" },
    ];

    return (
        <div style={{ maxWidth: "1200px" }}>
            {/* HEADER */}
            <div
                style={{
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid var(--border-default)",
                    padding: 20,
                    marginBottom: 20,
                    boxShadow: "var(--shadow-card)",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            margin: 0,
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                        }}
                    >
                        <Building2 size={18} /> {school.name}
                    </h2>

                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                        Code: {school.code} • {school.city}, {school.country}
                    </div>

                    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                        <span>Timezone: {school.timezone}</span>
                        <span>Created: {school.created_at}</span>
                    </div>
                </div>

                <button
                    style={{
                        padding: 8,
                        borderRadius: 8,
                        border: "1px solid var(--border-default)",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    <MoreVertical size={16} />
                </button>
            </div>

            {/* METRICS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        style={{
                            background: "white",
                            borderRadius: 12,
                            border: "1px solid var(--border-default)",
                            padding: "18px 20px",
                            boxShadow: "var(--shadow-card)",
                        }}
                    >
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{m.label}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem" }}>
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* SECTIONS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
                <Section icon={Users} title="School Admins" button="Manage Admins" />
                <Section icon={Cpu} title="Token Management" button="View Tokens" />
                <Section icon={CreditCard} title="Subscription & Billing" button="Manage Subscription" />
                <Section icon={Settings} title="School Settings" button="Configure Settings" />
                <Section icon={Shield} title="API & Integrations" button="View Integrations" />
                <Section icon={Activity} title="Audit & Activity Logs" button="View Logs" />
            </div>

            {/* FOOTER */}
            <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>
                This page aggregates operational data related to the school entity.
            </div>
        </div>
    );
}

function Section({ icon: Icon, title, button }) {
    return (
        <div
            style={{
                background: "white",
                borderRadius: 12,
                border: "1px solid var(--border-default)",
                padding: 18,
                boxShadow: "var(--shadow-card)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, marginBottom: 6 }}>
                <Icon size={16} /> {title}
            </div>

            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                Manage and configure this section
            </p>

            <button
                style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg,#2563EB,#1E40AF)",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                }}
            >
                {button}
            </button>
        </div>
    );
}