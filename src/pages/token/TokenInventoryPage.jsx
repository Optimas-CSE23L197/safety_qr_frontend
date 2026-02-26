import React, { useState } from "react";
import Card from "../../components/ui/Card";
import {
    Boxes,
    QrCode,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    ChevronRight,
    Ban,
    RefreshCw
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
        { label: "Total Tokens", value: 12000, icon: Boxes },
        { label: "Active", value: 9400, icon: CheckCircle },
        { label: "Expiring Soon", value: 320, icon: AlertTriangle },
        { label: "Unassigned", value: 1100, icon: QrCode },
    ];

    const statusColor = {
        ACTIVE: "bg-green-100 text-green-700",
        UNASSIGNED: "bg-gray-200 text-gray-700",
        REVOKED: "bg-red-100 text-red-700",
        EXPIRED: "bg-yellow-100 text-yellow-700",
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Token Inventory
                    </h1>
                    <p className="text-sm text-gray-500">
                        Monitor token lifecycle, batches, and assignments
                    </p>
                </div>

                {/* KPI */}
                <div className="grid md:grid-cols-4 gap-4">
                    {stats.map(({ label, value, icon: Icon }) => (
                        <Card key={label}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{label}</p>
                                    <p className="text-2xl font-semibold">{value}</p>
                                </div>
                                <Icon className="text-indigo-600" size={20} />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white border rounded-xl p-4 flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            placeholder="Search token or student"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full border rounded-lg pl-9 pr-3 py-2"
                        />
                    </div>

                    <select className="border rounded-lg px-3 py-2">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Unassigned</option>
                        <option>Expired</option>
                    </select>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Token</th>
                                <th className="p-3 text-left">Student</th>
                                <th className="p-3 text-left">Batch</th>
                                <th className="p-3 text-left">Created</th>
                                <th className="p-3 text-left">Expires</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Manage</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tokens.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelected(t)}
                                >
                                    <td className="p-3 font-mono">{t.hash}</td>
                                    <td className="p-3">{t.student || "—"}</td>
                                    <td className="p-3">{t.batch}</td>
                                    <td className="p-3">{t.created}</td>
                                    <td className="p-3">{t.expires}</td>

                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${statusColor[t.status]}`}>
                                            {t.status}
                                        </span>
                                    </td>

                                    <td className="p-3 text-right">
                                        <ChevronRight size={16} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detail Panel */}
                {selected && (
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold">{selected.hash}</h3>
                                <p className="text-sm text-gray-500">
                                    Batch: {selected.batch}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                    <RefreshCw size={16} /> Replace
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg">
                                    <Ban size={16} /> Revoke
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <Detail label="Status" value={selected.status} />
                            <Detail label="Student" value={selected.student || "Unassigned"} />
                            <Detail label="Expiry" value={selected.expires} />
                        </div>
                    </Card>
                )}

            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="border rounded-lg p-3 bg-gray-50">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}