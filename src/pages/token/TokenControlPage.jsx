import React, { useState } from "react";
import {
    Search,
    QrCode,
    User,
    School,
    Calendar,
    Activity,
    Copy,
} from "lucide-react";

export default function TokenControlPage() {
    const [query, setQuery] = useState("");
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);

        const fakeToken = {
            token: "QR-123456",
            status: "ACTIVATED",
            issued_at: "2025-01-01",
            activated_at: "2025-01-02",
            expires_at: "2026-01-01",
            student: { full_name: "Rahul Sharma" },
            school: { name: "Green Valley School" },
            scan_count: 12,
        };

        setTimeout(() => {
            setToken(fakeToken);
            setLoading(false);
        }, 600);
    };

    const statusColor = {
        ACTIVATED: "bg-green-100 text-green-700",
        REVOKED: "bg-red-100 text-red-700",
        EXPIRED: "bg-gray-200 text-gray-700",
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Token Control
                        </h1>
                        <p className="text-sm text-gray-500">
                            Search and manage token lifecycle
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white border rounded-xl p-4 flex gap-3 shadow-sm">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter token or QR key"
                        className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Search size={16} /> Search
                    </button>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="bg-white border rounded-xl p-6 animate-pulse space-y-4">
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-12 bg-gray-200 rounded" />
                            <div className="h-12 bg-gray-200 rounded" />
                        </div>
                    </div>
                )}

                {/* Empty */}
                {!loading && searched && !token && (
                    <div className="bg-white border rounded-xl p-12 text-center">
                        <QrCode className="mx-auto mb-3 text-gray-300" size={36} />
                        <p className="text-gray-500">No token found</p>
                    </div>
                )}

                {/* Token Card */}
                {!loading && token && (
                    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">

                        {/* Token Top */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <span className="font-mono">{token.token}</span>
                                    <Copy size={14} className="text-gray-400 cursor-pointer" />
                                </h2>
                                <span
                                    className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${statusColor[token.status]}`}
                                >
                                    {token.status}
                                </span>
                            </div>
                        </div>

                        {/* Sections */}
                        <Section title="Student & School">
                            <Detail icon={User} label="Student" value={token.student.full_name} />
                            <Detail icon={School} label="School" value={token.school.name} />
                        </Section>

                        <Section title="Lifecycle">
                            <Detail icon={Calendar} label="Issued" value={token.issued_at} />
                            <Detail icon={Calendar} label="Activated" value={token.activated_at} />
                            <Detail icon={Calendar} label="Expires" value={token.expires_at} />
                        </Section>

                        <Section title="Activity">
                            <Detail icon={Activity} label="Scan Count" value={token.scan_count} />
                        </Section>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t">
                            <ActionBtn label="Reset Token" variant="primary" />
                            <ActionBtn label="Revoke" variant="warning" />
                            <ActionBtn label="Replace" variant="secondary" />
                            <ActionBtn label="Delete" variant="danger" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- UI Components ---------- */

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                {title}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

function Detail({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
            <Icon size={16} className="text-gray-400 mt-0.5" />
            <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
            </div>
        </div>
    );
}

function ActionBtn({ label, variant }) {
    const styles = {
        primary: "bg-indigo-600 hover:bg-indigo-700",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        secondary: "bg-gray-800 hover:bg-gray-900",
        danger: "bg-red-600 hover:bg-red-700",
    };

    return (
        <button
            className={`px-4 py-2 text-sm text-white rounded-lg ${styles[variant]} transition`}
        >
            {label}
        </button>
    );
}