import React, { useState } from "react";
import {
    Building2,
    Users,
    Key,
    CreditCard,
    Settings,
    Shield,
    Activity,
    Globe,
    Calendar,
    MoreVertical,
} from "lucide-react";

export default function SchoolDetailsPage() {
    const school = {
        name: "Green Valley School",
        code: "GVS001",
        city: "Kolkata",
        country: "IN",
        timezone: "Asia/Kolkata",
        is_active: true,
        created_at: "2024-01-01",
    };

    const metrics = [
        { label: "Students", value: 1245 },
        { label: "Active Tokens", value: 980 },
        { label: "Total Tokens", value: 1100 },
        { label: "Admins", value: 5 },
        { label: "Active Subscription", value: "Premium" },
        { label: "MRR", value: "₹42,000" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="bg-white border rounded-2xl p-6 flex justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Building2 /> {school.name}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Code: {school.code} • {school.city}, {school.country}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                            <span>Timezone: {school.timezone}</span>
                            <span>Created: {school.created_at}</span>
                        </div>
                    </div>

                    <button className="p-2 border rounded-lg">
                        <MoreVertical />
                    </button>
                </div>

                {/* METRICS */}
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {metrics.map((m) => (
                        <div key={m.label} className="bg-white border rounded-xl p-4">
                            <p className="text-xs text-gray-500">{m.label}</p>
                            <p className="text-xl font-semibold">{m.value}</p>
                        </div>
                    ))}
                </div>

                {/* SECTIONS GRID */}
                <div className="grid lg:grid-cols-2 gap-4">

                    {/* ADMINS */}
                    <Section icon={Users} title="School Admins">
                        <p className="text-sm text-gray-500">
                            Manage school staff and permissions
                        </p>
                        <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                            Manage Admins
                        </button>
                    </Section>

                    {/* TOKENS */}
                    <Section icon={Key} title="Token Management">
                        <p className="text-sm text-gray-500">
                            View token lifecycle and inventory
                        </p>
                        <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                            View Tokens
                        </button>
                    </Section>

                    {/* SUBSCRIPTION */}
                    <Section icon={CreditCard} title="Subscription & Billing">
                        <p className="text-sm text-gray-500">
                            Plan details, billing history, payments
                        </p>
                        <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                            Manage Subscription
                        </button>
                    </Section>

                    {/* SETTINGS */}
                    <Section icon={Settings} title="School Settings">
                        <p className="text-sm text-gray-500">
                            Scan rules, token limits, privacy controls
                        </p>
                        <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                            Configure Settings
                        </button>
                    </Section>

                    {/* API */}
                    <Section icon={Shield} title="API & Integrations">
                        <p className="text-sm text-gray-500">
                            API keys and webhook endpoints
                        </p>
                        <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                            View Integrations
                        </button>
                    </Section>

                    {/* ACTIVITY */}
                    <Section icon={Activity} title="Audit & Activity Logs">
                        <p className="text-sm text-gray-500">
                            Track all actions and events
                        </p>
                        <button className="mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">
                            View Logs
                        </button>
                    </Section>
                </div>

                {/* FOOTER */}
                <div className="text-xs text-gray-400">
                    This page aggregates all operational data related to the school entity.
                </div>
            </div>
        </div>
    );
}

function Section({ icon: Icon, title, children }) {
    return (
        <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2 font-semibold">
                <Icon size={16} /> {title}
            </div>
            {children}
        </div>
    );
}