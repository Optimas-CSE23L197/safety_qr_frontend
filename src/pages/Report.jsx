import React from "react";
import Card from "../components/ui/Card";
import { Download, FileBarChart, Activity, School, CreditCard } from "lucide-react";

export default function ReportsPage() {
    const reports = [
        {
            title: "Scan Activity Report",
            description: "Daily and monthly scan trends across all schools",
            icon: Activity,
        },
        {
            title: "School Usage Report",
            description: "Activity and engagement by school",
            icon: School,
        },
        {
            title: "Token Lifecycle Report",
            description: "Status distribution and token activity",
            icon: FileBarChart,
        },
        {
            title: "Subscription & Revenue",
            description: "Billing insights and revenue summary",
            icon: CreditCard,
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Reports & Exports
                    </h1>
                    <p className="text-sm text-gray-500">
                        Generate insights and download operational data
                    </p>
                </div>

                {/* Report Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    {reports.map(({ title, description, icon: Icon }) => (
                        <Card key={title}>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold">{title}</h3>
                                    <p className="text-sm text-gray-500">{description}</p>
                                </div>
                                <Icon className="text-indigo-600" size={20} />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="px-3 py-2 text-xs bg-indigo-600 text-white rounded-lg flex items-center gap-1">
                                    <Download size={14} /> CSV
                                </button>
                                <button className="px-3 py-2 text-xs bg-gray-800 text-white rounded-lg flex items-center gap-1">
                                    <Download size={14} /> Excel
                                </button>
                                <button className="px-3 py-2 text-xs bg-gray-200 rounded-lg flex items-center gap-1">
                                    <Download size={14} /> PDF
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Custom Report Generator */}
                <Card>
                    <h3 className="font-semibold mb-3">Custom Report</h3>

                    <div className="grid md:grid-cols-4 gap-3">
                        <select className="border rounded-lg px-3 py-2">
                            <option>Select Data Type</option>
                            <option>Scans</option>
                            <option>Tokens</option>
                            <option>Subscriptions</option>
                        </select>

                        <input type="date" className="border rounded-lg px-3 py-2" />
                        <input type="date" className="border rounded-lg px-3 py-2" />

                        <button className="bg-indigo-600 text-white rounded-lg px-4">
                            Generate
                        </button>
                    </div>
                </Card>

                {/* Info */}
                <p className="text-xs text-gray-400">
                    Reports can be exported for compliance, accounting, and analytics.
                </p>
            </div>
        </div>
    );
}