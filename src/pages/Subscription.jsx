import React from "react";
import { CreditCard, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import Card from "../components/ui/Card";

export default function SubscriptionPage() {
    const stats = [
        { label: "Active Subscriptions", value: 38, icon: CreditCard },
        { label: "Expiring Soon", value: 5, icon: AlertTriangle },
        { label: "Monthly Revenue", value: "₹4,20,000", icon: TrendingUp },
        { label: "No Subscription", value: 3, icon: Calendar },
    ];

    const subscriptions = [
        {
            id: "1",
            school: "Green Valley School",
            plan: "Premium",
            students: 850,
            price: "₹50 / student",
            status: "ACTIVE",
            end_date: "2026-01-01",
        },
        {
            id: "2",
            school: "Sunrise Public School",
            plan: "Standard",
            students: 420,
            price: "₹30 / student",
            status: "EXPIRING",
            end_date: "2025-03-01",
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Subscriptions
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage plans, billing lifecycle, and renewals
                    </p>
                </div>

                {/* KPI Cards */}
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

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">School</th>
                                <th className="p-3 text-left">Plan</th>
                                <th className="p-3 text-left">Students</th>
                                <th className="p-3 text-left">Pricing</th>
                                <th className="p-3 text-left">End Date</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {subscriptions.map((s) => (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{s.school}</td>
                                    <td className="p-3">{s.plan}</td>
                                    <td className="p-3">{s.students}</td>
                                    <td className="p-3">{s.price}</td>
                                    <td className="p-3">{s.end_date}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${s.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="text-xs text-gray-400">
                    Subscription data impacts billing and feature access.
                </p>
            </div>
        </div>
    );
}