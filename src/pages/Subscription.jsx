import React, { useState } from "react";
import {
    CreditCard,
    TrendingUp,
    AlertTriangle,
    Calendar,
    Search,
    Eye,
    X,
    MoreVertical,
} from "lucide-react";

export default function SubscriptionPage() {
    const [selected, setSelected] = useState(null);

    const stats = [
        { label: "Active", value: 38, icon: CreditCard },
        { label: "Trialing", value: 6, icon: Calendar },
        { label: "Past Due", value: 4, icon: AlertTriangle },
        { label: "MRR", value: "₹4,20,000", icon: TrendingUp },
    ];

    const subscriptions = [
        {
            id: "sub_1",
            school: { name: "Green Valley School" },
            plan: "PREMIUM",
            status: "ACTIVE",
            provider: "Stripe",
            current_period_start: "2025-02-01",
            current_period_end: "2026-02-01",
            trial_ends_at: null,
            payments: [
                { amount: 42000, status: "SUCCESS", created_at: "2025-12-01" },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Subscription Management
                    </h1>
                    <p className="text-gray-600">
                        Control billing lifecycle, plans, and renewals
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    {stats.map(({ label, value, icon: Icon }) => (
                        <div
                            key={label}
                            className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm"
                        >
                            <div>
                                <p className="text-sm text-gray-500">{label}</p>
                                <p className="text-2xl font-semibold">{value}</p>
                            </div>
                            <Icon className="text-indigo-600" />
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Search school..."
                        className="flex-1 outline-none"
                    />
                    <select className="border rounded-lg px-3 py-2 text-sm">
                        <option>All Status</option>
                        <option>ACTIVE</option>
                        <option>TRIALING</option>
                        <option>PAST_DUE</option>
                        <option>CANCELED</option>
                        <option>EXPIRED</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">School</th>
                                <th className="p-3 text-left">Plan</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Provider</th>
                                <th className="p-3 text-left">Period End</th>
                                <th className="p-3 text-right"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {subscriptions.map((s) => (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{s.school.name}</td>
                                    <td className="p-3">{s.plan}</td>
                                    <td className="p-3">
                                        <StatusBadge status={s.status} />
                                    </td>
                                    <td className="p-3">{s.provider}</td>
                                    <td className="p-3">{s.current_period_end}</td>
                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() => setSelected(s)}
                                            className="flex items-center gap-1 text-indigo-600"
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex justify-end">
                    <div className="w-[420px] bg-white h-full p-6 shadow-xl overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-lg font-semibold">Subscription Details</h2>
                            <button onClick={() => setSelected(null)}>
                                <X />
                            </button>
                        </div>

                        <Detail label="School" value={selected.school.name} />
                        <Detail label="Plan" value={selected.plan} />
                        <Detail label="Status" value={selected.status} />
                        <Detail label="Provider" value={selected.provider} />
                        <Detail label="Period Start" value={selected.current_period_start} />
                        <Detail label="Period End" value={selected.current_period_end} />
                        <Detail label="Trial Ends" value={selected.trial_ends_at} />

                        <div className="mt-6">
                            <h3 className="text-sm font-semibold mb-2">Payments</h3>
                            {selected.payments.map((p, i) => (
                                <div key={i} className="border rounded-lg p-3 mb-2">
                                    <p className="text-sm">₹{p.amount}</p>
                                    <p className="text-xs text-gray-500">{p.created_at}</p>
                                    <StatusBadge status={p.status} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg">
                                Renew
                            </button>
                            <button className="flex-1 border py-2 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        ACTIVE: "bg-green-100 text-green-700",
        TRIALING: "bg-blue-100 text-blue-700",
        PAST_DUE: "bg-red-100 text-red-700",
        CANCELED: "bg-gray-200 text-gray-700",
        EXPIRED: "bg-gray-300 text-gray-700",
        SUCCESS: "bg-green-100 text-green-700",
    };

    return (
        <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || styles.ACTIVE}`}>
            {status}
        </span>
    );
}

function Detail({ label, value }) {
    return (
        <div className="mb-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium">{value || "—"}</p>
        </div>
    );
}