import React from "react";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Users,
    ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SchoolDetails({ school }) {
    // fallback example if no props passed
    const data =
        school ||
        {
            name: "Green Valley Public School",
            address: "MG Road, Bengaluru, India",
            contact_email: "contact@gvps.com",
            contact_phone: "+91 9876543210",
            plan_type: "Premium",
            contract_start: "2025-01-01",
            contract_end: "2026-01-01",
            created_at: "2025-01-01",
            studentsCount: 1245,
            metadata: {
                board: "CBSE",
                principal: "Mr. Sharma",
            },
        };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Building2 className="text-indigo-600 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {data.name}
                        </h1>
                        <p className="text-gray-500 text-sm">School Details Overview</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <Link to="/token" target="_blank" className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
                        All Token
                    </Link>
                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                        Edit
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                        Delete
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">
                        Block
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                        Renew Plan
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                        Add Student
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900">
                        Subscriptions
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                {/* Total Students */}
                <div className="p-5 rounded-xl border bg-gradient-to-br from-indigo-50 to-indigo-100">
                    <div className="flex items-center gap-3">
                        <Users className="text-indigo-600" />
                        <div>
                            <p className="text-sm text-gray-600">Total Students</p>
                            <p className="text-2xl font-semibold text-gray-800">
                                {data.studentsCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Cards */}
                <div className="p-5 rounded-xl border bg-gradient-to-br from-emerald-50 to-emerald-100">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="text-emerald-600" />
                        <div>
                            <p className="text-sm text-gray-600">Active Cards</p>
                            <p className="text-2xl font-semibold text-gray-800">
                                {data.activeCardsCount ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Plan Type */}
                <div className="p-5 rounded-xl border bg-gradient-to-br from-green-50 to-green-100">
                    <p className="text-sm text-gray-600">Plan Type</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {data.plan_type}
                    </p>
                </div>

                {/* Contract End */}
                <div className="p-5 rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100">
                    <p className="text-sm text-gray-600">Contract Ends</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {data.contract_end || "—"}
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="border rounded-xl p-5">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Basic Information
                    </h2>
                    <div className="space-y-3 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} /> {data.address}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <Mail size={16} /> {data.contact_email}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <Phone size={16} /> {data.contact_phone}
                        </p>
                    </div>
                </div>

                {/* Contract */}
                <div className="border rounded-xl p-5">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Contract Details
                    </h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                            <Calendar size={16} /> Start: {data.contract_start}
                        </p>
                        <p className="flex items-center gap-2">
                            <Calendar size={16} /> End: {data.contract_end || "—"}
                        </p>
                        <p className="flex items-center gap-2">
                            <ShieldAlert size={16} /> Created: {data.created_at}
                        </p>
                    </div>
                </div>

                {/* Metadata */}
                {data.metadata && (
                    <div className="border rounded-xl p-5 lg:col-span-2">
                        <h2 className="font-semibold text-gray-800 mb-4">
                            Additional Metadata
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                            {Object.entries(data.metadata).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 rounded-lg p-3">
                                    <p className="font-medium capitalize">{key}</p>
                                    <p>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}