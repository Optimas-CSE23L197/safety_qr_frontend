import React, { useState } from "react";
import { Search, Copy, RefreshCw, User, School, Calendar, Activity, ShieldAlert } from "lucide-react";

export default function TokenControlPage() {
    const [query, setQuery] = useState("");
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);

        const fakeToken = {
            token: "QR-123456",
            status: "ACTIVE",
            issued_at: "2025-01-01",
            activated_at: "2025-01-02",
            expires_at: "2026-01-01",
            student: { full_name: "Rahul Sharma" },
            school: { name: "Green Valley School" },
            scan_count: 12,
            last_scan: "2025-02-20 10:30",
            risk: "LOW",
        };

        setTimeout(() => {
            setToken(fakeToken);
            setLoading(false);
        }, 500);
    };

    return (
        <div style={{ maxWidth: "1200px" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, margin: 0 }}>
                        Token Control
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 4 }}>
                        Inspect token lifecycle, activity, and perform actions
                    </p>
                </div>
            </div>

            {/* Search */}
            <div style={{
                background: "white",
                borderRadius: 12,
                border: "1px solid var(--border-default)",
                padding: 16,
                marginBottom: 16,
                display: "flex",
                gap: 12,
                alignItems: "center",
                boxShadow: "var(--shadow-card)"
            }}>
                <div style={{ position: "relative", flex: 1 }}>
                    <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter token hash or QR ID"
                        style={{
                            width: "100%",
                            padding: "7px 12px 7px 32px",
                            border: "1px solid var(--border-default)",
                            borderRadius: 8,
                            fontSize: "0.875rem",
                            outline: "none"
                        }}
                    />
                </div>

                <button
                    onClick={handleSearch}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 18px",
                        borderRadius: 8,
                        background: "linear-gradient(135deg,#2563EB,#1E40AF)",
                        color: "white",
                        border: "none",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    <Search size={16} /> Search
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div style={{
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid var(--border-default)",
                    padding: 20,
                    boxShadow: "var(--shadow-card)"
                }}>
                    Loading token data…
                </div>
            )}

            {/* Token Details */}
            {token && (
                <div style={{
                    background: "white",
                    borderRadius: 12,
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--shadow-card)",
                    padding: 24
                }}>
                    {/* Top */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                <code style={{ background: "var(--color-slate-100)", padding: "4px 8px", borderRadius: 6 }}>
                                    {token.token}
                                </code>
                                <Copy size={14} style={{ marginLeft: 8, cursor: "pointer" }} />
                            </h3>

                            <span style={{
                                padding: "3px 10px",
                                borderRadius: 999,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                background: "#ECFDF5",
                                color: "#047857"
                            }}>
                                {token.status}
                            </span>
                        </div>

                        <button style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            border: "1px solid var(--border-default)",
                            background: "white",
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            cursor: "pointer"
                        }}>
                            <RefreshCw size={14} /> Refresh
                        </button>
                    </div>

                    {/* Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>

                        <InfoBlock title="Ownership">
                            <Detail icon={User} label="Student" value={token.student.full_name} />
                            <Detail icon={School} label="School" value={token.school.name} />
                        </InfoBlock>

                        <InfoBlock title="Lifecycle">
                            <Detail icon={Calendar} label="Issued" value={token.issued_at} />
                            <Detail icon={Calendar} label="Activated" value={token.activated_at} />
                            <Detail icon={Calendar} label="Expires" value={token.expires_at} />
                        </InfoBlock>

                        <InfoBlock title="Activity">
                            <Detail icon={Activity} label="Total Scans" value={token.scan_count} />
                            <Detail icon={Activity} label="Last Scan" value={token.last_scan} />
                        </InfoBlock>

                        <InfoBlock title="Risk Assessment">
                            <Detail icon={ShieldAlert} label="Risk Level" value={token.risk} />
                        </InfoBlock>
                    </div>

                    {/* Actions */}
                    <div style={{ borderTop: "1px solid var(--border-default)", marginTop: 20, paddingTop: 16 }}>
                        <h4 style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>
                            Token Actions
                        </h4>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                            <ActionBtn label="Reset Token" color="#2563EB" />
                            <ActionBtn label="Revoke" color="#F59E0B" />
                            <ActionBtn label="Replace" color="#334155" />
                            <ActionBtn label="Delete" color="#EF4444" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- UI Components ---------- */

function InfoBlock({ title, children }) {
    return (
        <div style={{
            border: "1px solid var(--border-default)",
            borderRadius: 12,
            padding: 16,
            background: "var(--color-slate-50)"
        }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 10 }}>
                {title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {children}
            </div>
        </div>
    );
}

function Detail({ icon: Icon, label, value }) {
    return (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Icon size={16} style={{ color: "var(--text-muted)" }} />
            <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{label}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{value || "—"}</div>
            </div>
        </div>
    );
}

function ActionBtn({ label, color }) {
    return (
        <button style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: color,
            color: "white",
            fontWeight: 600,
            cursor: "pointer"
        }}>
            {label}
        </button>
    );
}