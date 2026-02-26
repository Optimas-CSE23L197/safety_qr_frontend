import React, { useState } from "react";
import {
    Search,
    QrCode,
    User,
    School,
    Calendar,
    Activity,
    Copy,
    ShieldAlert,
    RefreshCw,
} from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Token Control</h1>
                    <p className="text-gray-600">
                        Inspect token lifecycle, activity, and perform actions
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white border rounded-xl p-4 flex gap-3 shadow-sm">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter token hash or QR ID"
                        className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                        <Search size={16} /> Search
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-white border rounded-xl p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                )}

                {/* Token Details */}
                {token && (
                    <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">

                        {/* Top Row */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <span className="font-mono">{token.token}</span>
                                    <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                                </h2>

                                <StatusBadge status={token.status} />
                            </div>

                            <div className="flex gap-2">
                                <button className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1">
                                    <RefreshCw size={14} /> Refresh
                                </button>
                            </div>
                        </div>

                        {/* Main Info Grid */}
                        <div className="grid md:grid-cols-2 gap-4">

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
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-3">
                                Token Actions
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                <ActionBtn label="Reset Token" style="primary" />
                                <ActionBtn label="Revoke" style="warning" />
                                <ActionBtn label="Replace" style="secondary" />
                                <ActionBtn label="Delete" style="danger" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- COMPONENTS ---------- */

function StatusBadge({ status }) {
    const map = {
        ACTIVE: "bg-green-100 text-green-700",
        REVOKED: "bg-red-100 text-red-700",
        EXPIRED: "bg-gray-200 text-gray-700",
    };

    return (
        <span className={`mt-1 inline-block px-3 py-1 text-xs rounded-full ${map[status]}`}>
            {status}
        </span>
    );
}

function InfoBlock({ title, children }) {
    return (
        <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                {title}
            </h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <Icon size={16} className="text-gray-400" />
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium">{value || "—"}</p>
            </div>
        </div>
    );
}

function ActionBtn({ label, style }) {
    const styles = {
        primary: "bg-indigo-600 hover:bg-indigo-700",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        secondary: "bg-gray-800 hover:bg-gray-900",
        danger: "bg-red-600 hover:bg-red-700",
    };

    return (
        <button className={`px-4 py-2 text-white text-sm rounded-lg ${styles[style]}`}>
            {label}
        </button>
    );
}