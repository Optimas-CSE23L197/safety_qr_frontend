import React, { useState } from "react";
import Card from "../../components/ui/Card";
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
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Webhooks
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage event integrations and delivery pipelines
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <Plus size={16} /> Add Webhook
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
                            placeholder="Search by URL or event"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full border rounded-lg pl-9 pr-3 py-2"
                        />
                    </div>

                    <select className="border rounded-lg px-3 py-2">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Disabled</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Endpoint</th>
                                <th className="p-3 text-left">Events</th>
                                <th className="p-3 text-left">Last Delivery</th>
                                <th className="p-3 text-left">Failures</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Manage</th>
                            </tr>
                        </thead>

                        <tbody>
                            {webhooks.map((hook) => (
                                <tr
                                    key={hook.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelected(hook)}
                                >
                                    <td className="p-3 font-medium">{hook.url}</td>
                                    <td className="p-3">{hook.events.join(", ")}</td>
                                    <td className="p-3">{hook.lastDelivery}</td>
                                    <td className="p-3">{hook.failures}</td>

                                    <td className="p-3">
                                        {hook.active ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
                                                Disabled
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

                {/* Detail */}
                {selected && (
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold">{selected.url}</h3>
                                <p className="text-sm text-gray-500">
                                    Subscribed events: {selected.events.join(", ")}
                                </p>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                <RefreshCw size={16} /> Retry Failed
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <Detail label="Status" value={selected.active ? "Active" : "Disabled"} />
                            <Detail label="Failures" value={selected.failures} />
                            <Detail label="Security" value="Signed with secret" icon={Shield} />
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