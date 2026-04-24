import React, { useState } from "react";
import {
    Webhook,
    Activity,
    CheckCircle,
    AlertTriangle,
    Plus,
    Search,
    ChevronRight,
    RefreshCw,
    Shield,
} from "lucide-react";

export default function WebhooksPage() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    const webhooks = [
        {
            id: "wh_1",
            url: "https://api.school.com/webhook",
            events: ["SCAN_ALERT", "TOKEN_REVOKED"],
            active: true,
            lastDelivery: "2 mins ago",
            failures: 1,
        },
        {
            id: "wh_2",
            url: "https://erp.school.com/hooks",
            events: ["STUDENT_CREATED"],
            active: false,
            lastDelivery: "—",
            failures: 0,
        },
    ];

    const stats = [
        { label: "Active Webhooks", value: 12, icon: Webhook },
        { label: "Deliveries Today", value: 843, icon: Activity },
        { label: "Failures", value: 5, icon: AlertTriangle },
        { label: "Healthy", value: "98.7%", icon: CheckCircle },
    ];

    return (
        <div style={{ maxWidth: 1200 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                    <h2 style={{ margin: 0, fontWeight: 700 }}>Webhooks</h2>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                        Manage event integrations and delivery pipelines
                    </p>
                </div>

                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "linear-gradient(135deg,#2563EB,#1E40AF)",
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    <Plus size={16} /> Add Webhook
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
                {stats.map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        style={{
                            background: "white",
                            borderRadius: 12,
                            border: "1px solid var(--border-default)",
                            padding: "18px 20px",
                            boxShadow: "var(--shadow-card)",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{value}</div>
                        </div>
                        <Icon size={20} color="var(--color-brand-600)" />
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div
                style={{
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid var(--border-default)",
                    padding: 14,
                    marginBottom: 16,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                }}
            >
                <div style={{ position: "relative", flex: 1 }}>
                    <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by URL or event"
                        style={{
                            width: "100%",
                            padding: "7px 12px 7px 32px",
                            border: "1px solid var(--border-default)",
                            borderRadius: 8,
                            fontSize: 14,
                        }}
                    />
                </div>

                <select style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border-default)" }}>
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Disabled</option>
                </select>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border-default)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--color-slate-50)", borderBottom: "1px solid var(--border-default)" }}>
                            {["Endpoint", "Events", "Last Delivery", "Failures", "Status", ""].map((h) => (
                                <th key={h} style={{ padding: 12, textAlign: "left", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {webhooks.map((hook, idx) => (
                            <tr
                                key={hook.id}
                                onClick={() => setSelected(hook)}
                                style={{ borderBottom: idx < webhooks.length - 1 ? "1px solid var(--border-default)" : "none", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-slate-50)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                <td style={{ padding: 12 }}>{hook.url}</td>
                                <td style={{ padding: 12 }}>{hook.events.join(", ")}</td>
                                <td style={{ padding: 12 }}>{hook.lastDelivery}</td>
                                <td style={{ padding: 12 }}>{hook.failures}</td>
                                <td style={{ padding: 12 }}>
                                    <span
                                        style={{
                                            padding: "3px 10px",
                                            borderRadius: 999,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            background: hook.active ? "#ECFDF5" : "#F1F5F9",
                                            color: hook.active ? "#047857" : "#475569",
                                        }}
                                    >
                                        {hook.active ? "Active" : "Disabled"}
                                    </span>
                                </td>
                                <td style={{ padding: 12, textAlign: "right" }}>
                                    <ChevronRight size={16} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Panel */}
            {selected && (
                <div
                    style={{
                        marginTop: 16,
                        background: "white",
                        borderRadius: 12,
                        border: "1px solid var(--border-default)",
                        padding: 18,
                        boxShadow: "var(--shadow-card)",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                            <h3 style={{ margin: 0 }}>{selected.url}</h3>
                            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                                Subscribed events: {selected.events.join(", ")}
                            </p>
                        </div>

                        <button style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--border-default)", background: "white", cursor: "pointer", display: "flex", gap: 6 }}>
                            <RefreshCw size={14} /> Retry Failed
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        <Detail label="Status" value={selected.active ? "Active" : "Disabled"} />
                        <Detail label="Failures" value={selected.failures} />
                        <Detail label="Security" value="Signed with secret" icon={Shield} />
                    </div>
                </div>
            )}
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div style={{ border: "1px solid var(--border-default)", borderRadius: 10, padding: 12, background: "var(--color-slate-50)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</div>
            <div style={{ fontWeight: 600 }}>{value}</div>
        </div>
    );
}
