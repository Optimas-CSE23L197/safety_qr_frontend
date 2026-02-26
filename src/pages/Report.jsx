import React from "react";
import Card from "../components/ui/Card";
import {
    Activity,
    School,
    Key,
    MapPin,
    CreditCard,
    Shield,
    Users,
    Download,
} from "lucide-react";

export default function ReportsPage() {
    const categories = [
        {
            title: "Students & Safety",
            icon: Users,
            reports: [
                "Student Roster",
                "Emergency Profile Coverage",
                "Parent Linkage",
            ],
        },
        {
            title: "School Operations",
            icon: School,
            reports: [
                "School Overview",
                "Admin Activity",
                "Settings Compliance",
            ],
        },
        {
            title: "Token & Scan",
            icon: Key,
            reports: [
                "Token Inventory",
                "Scan Activity",
                "Token Lifecycle",
                "Scan Anomalies",
            ],
        },
        {
            title: "Location & Safety",
            icon: MapPin,
            reports: [
                "Location Events",
                "Consent Compliance",
            ],
        },
        {
            title: "Billing & Revenue",
            icon: CreditCard,
            reports: [
                "Subscriptions",
                "Revenue",
                "Payments",
            ],
        },
        {
            title: "Security & Audit",
            icon: Shield,
            reports: [
                "Audit Logs",
                "Login Activity",
                "API Usage",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600">
                        Export operational, financial, and safety insights
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <div className="grid md:grid-cols-4 gap-3">
                        <select className="border rounded-lg px-3 py-2">
                            <option>All Schools</option>
                        </select>
                        <input type="date" className="border rounded-lg px-3 py-2" />
                        <input type="date" className="border rounded-lg px-3 py-2" />
                        <button className="bg-indigo-600 text-white rounded-lg px-4">
                            Apply Filters
                        </button>
                    </div>
                </Card>

                {/* Categories */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <Card key={cat.title}>
                            <div className="flex items-center gap-2 mb-3 font-semibold">
                                <cat.icon size={18} /> {cat.title}
                            </div>

                            <div className="space-y-2">
                                {cat.reports.map((r) => (
                                    <div
                                        key={r}
                                        className="flex justify-between items-center border rounded-lg px-3 py-2"
                                    >
                                        <span className="text-sm">{r}</span>

                                        <div className="flex gap-1">
                                            <ExportBtn label="CSV" />
                                            <ExportBtn label="Excel" />
                                            <ExportBtn label="PDF" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <p className="text-xs text-gray-400">
                    Reports are generated from real-time system data.
                </p>
            </div>
        </div>
    );
}

function ExportBtn({ label }) {
    return (
        <button className="text-xs px-2 py-1 bg-gray-100 rounded flex items-center gap-1">
            <Download size={12} /> {label}
        </button>
    );
}