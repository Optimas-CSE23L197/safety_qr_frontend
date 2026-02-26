import React, { useState } from "react";
import Card from "../../components/ui/Card";
import {
    KeyRound,
    ShieldCheck,
    Activity,
    AlertTriangle,
    Plus,
    Search,
    Copy,
    ChevronRight,
    Ban,
    RotateCw
} from "lucide-react";

export default function ApiKeysPage() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    const keys = [
        {
            id: "key_1",
            name: "Production API",
            prefix: "pk_live_9sd",
            scopes: ["scans:read", "tokens:write"],
            lastUsed: "10 mins ago",
            expires: "2026-01-01",
            revoked: false,
        },
        {
            id: "key_2",
            name: "Integration Test",
            prefix: "pk_test_72d",
            scopes: ["students:read"],
            lastUsed: "—",
            expires: "2025-05-01",
            revoked: true,
        },
    ];

    const stats = [
        { label: "Active Keys", value: 7, icon: KeyRound },
        { label: "Usage Today", value: "12.4k", icon: Activity },
        { label: "Expiring Soon", value: 2, icon: AlertTriangle },
        { label: "Secure", value: "100%", icon: ShieldCheck },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            API Keys
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage programmatic access and integration credentials
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <Plus size={16} /> Create Key
                    </button>
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
                            placeholder="Search by name or prefix"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full border rounded-lg pl-9 pr-3 py-2"
                        />
                    </div>

                    <select className="border rounded-lg px-3 py-2">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Revoked</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Prefix</th>
                                <th className="p-3 text-left">Scopes</th>
                                <th className="p-3 text-left">Last Used</th>
                                <th className="p-3 text-left">Expires</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Manage</th>
                            </tr>
                        </thead>

                        <tbody>
                            {keys.map((key) => (
                                <tr
                                    key={key.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelected(key)}
                                >
                                    <td className="p-3 font-medium">{key.name}</td>
                                    <td className="p-3 font-mono flex items-center gap-2">
                                        {key.prefix}
                                        <Copy size={14} className="text-gray-400" />
                                    </td>
                                    <td className="p-3">
                                        {key.scopes.map(s => (
                                            <span key={s} className="mr-1 px-2 py-1 bg-gray-100 text-xs rounded">
                                                {s}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="p-3">{key.lastUsed}</td>
                                    <td className="p-3">{key.expires}</td>
                                    <td className="p-3">
                                        {key.revoked ? (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">
                                                Revoked
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                                                Active
                                            </span>
                                        )}
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
                                <h3 className="font-semibold">{selected.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Key prefix: {selected.prefix}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                    <RotateCw size={16} /> Rotate
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg">
                                    <Ban size={16} /> Revoke
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <Detail label="Last Used" value={selected.lastUsed} />
                            <Detail label="Expiration" value={selected.expires} />
                            <Detail label="Scopes" value={selected.scopes.join(", ")} />
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