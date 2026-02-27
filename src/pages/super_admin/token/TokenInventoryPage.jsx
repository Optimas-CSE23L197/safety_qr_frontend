import React, { useState } from "react";
import {
    Boxes,
    QrCode,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    ChevronRight,
    Ban,
    RefreshCw,
    Cpu,
} from "lucide-react";

export default function TokenInventoryPage() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    const tokens = [
        {
            id: "tok_1",
            hash: "QR-123456",
            status: "ACTIVE",
            student: "Rahul Sharma",
            batch: "Batch-001",
            expires: "2026-01-01",
            created: "2025-01-01",
        },
        {
            id: "tok_2",
            hash: "QR-987654",
            status: "UNASSIGNED",
            student: null,
            batch: "Batch-002",
            expires: "—",
            created: "2025-02-01",
        },
    ];

    const stats = [
        { label: "Total Tokens", value: 12000 },
        { label: "Active", value: 9400 },
        { label: "Expiring Soon", value: 320 },
        { label: "Unassigned", value: 1100 },
    ];

    const STATUS_STYLE = {
        ACTIVE: { bg: "#ECFDF5", color: "#047857" },
        UNASSIGNED: { bg: "#F1F5F9", color: "#475569" },
        EXPIRED: { bg: "#FFFBEB", color: "#B45309" },
        REVOKED: { bg: "#FEF2F2", color: "#B91C1C" },
    };

    return (
        <div style={{ maxWidth: "1200px" }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, margin: 0 }}>
                    Token Inventory
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
                    Monitor token lifecycle, batches, and assignments
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
                {stats.map((s) => (
                    <div key={s.label} style={{ background: "white", borderRadius: 12, border: "1px solid var(--border-default)", padding: "18px 20px", boxShadow: "var(--shadow-card)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>{s.label}</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700 }}>{s.value}</div>
                            </div>
                            <Cpu size={20} color="#2563EB" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border-default)", padding: 16, marginBottom: 16, display: "flex", gap: 12, alignItems: "center", boxShadow: "var(--shadow-card)" }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search token or student..."
                        style={{ width: "100%", padding: "7px 12px 7px 32px", border: "1px solid var(--border-default)", borderRadius: 8 }}
                    />
                </div>

                <button style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border-default)", background: "white", display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                    <Filter size={14} /> Filters
                </button>
            </div>

            {/* Table */}
            <div style={{ background: "white", borderRadius: 12, border: "1px solid var(--border-default)", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-default)", background: "var(--color-slate-50)" }}>
                            {["Token", "Student", "Batch", "Created", "Expires", "Status", ""].map((h) => (
                                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 12, color: "var(--text-muted)" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((t) => {
                            const s = STATUS_STYLE[t.status] || STATUS_STYLE.UNASSIGNED;
                            return (
                                <tr key={t.id} style={{ borderBottom: "1px solid var(--border-default)", cursor: "pointer" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-slate-50)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    onClick={() => setSelected(t)}
                                >
                                    <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)" }}>{t.hash}</td>
                                    <td style={{ padding: "13px 16px" }}>{t.student || "—"}</td>
                                    <td style={{ padding: "13px 16px" }}>{t.batch}</td>
                                    <td style={{ padding: "13px 16px" }}>{t.created}</td>
                                    <td style={{ padding: "13px 16px" }}>{t.expires}</td>
                                    <td style={{ padding: "13px 16px" }}>
                                        <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                                        <ChevronRight size={16} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Detail Panel */}
            {selected && (
                <div style={{ marginTop: 16, background: "white", borderRadius: 12, border: "1px solid var(--border-default)", padding: 20, boxShadow: "var(--shadow-card)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                        <div>
                            <h3 style={{ fontWeight: 700 }}>{selected.hash}</h3>
                            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Batch: {selected.batch}</p>
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border-default)", background: "white", display: "flex", gap: 6 }}>
                                <RefreshCw size={14} /> Replace
                            </button>
                            <button style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#EF4444", color: "white", display: "flex", gap: 6 }}>
                                <Ban size={14} /> Revoke
                            </button>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        <Detail label="Status" value={selected.status} />
                        <Detail label="Student" value={selected.student || "Unassigned"} />
                        <Detail label="Expiry" value={selected.expires} />
                    </div>
                </div>
            )}
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div style={{ border: "1px solid var(--border-default)", borderRadius: 8, padding: 12, background: "var(--color-slate-50)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</div>
            <div style={{ fontWeight: 600 }}>{value}</div>
        </div>
    );
}