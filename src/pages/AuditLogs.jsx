import React, { useState } from "react";
import { Download, Search, FileText } from "lucide-react";

export default function AuditLogsPage() {
    const [query, setQuery] = useState("");
    const [logs] = useState([
        {
            id: "1",
            actor: "Admin User",
            role: "ADMIN",
            action: "TOKEN_RESET",
            entity: "Token",
            entity_id: "tok_123",
            date: "2026-02-20 10:30",
            metadata: { reason: "Damaged QR" },
        },
        {
            id: "2",
            actor: "Super Admin",
            role: "SUPER_ADMIN",
            action: "SCHOOL_CREATED",
            entity: "School",
            entity_id: "sch_456",
            date: "2026-02-18 14:10",
        },
    ]);

    const handleExport = () => {
        // Replace with real export logic
        alert("Exporting audit logs...");
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Audit Logs
                        </h1>
                        <p className="text-sm text-gray-500">
                            Track all system actions for compliance and monitoring
                        </p>
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3">
                    <input
                        placeholder="Search by entity ID or action"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                    />

                    <select className="border rounded-lg px-3 py-2">
                        <option>All Entities</option>
                        <option>Token</option>
                        <option>School</option>
                        <option>Student</option>
                    </select>

                    <select className="border rounded-lg px-3 py-2">
                        <option>All Actions</option>
                        <option>Create</option>
                        <option>Update</option>
                        <option>Delete</option>
                    </select>

                    <input type="date" className="border rounded-lg px-3 py-2" />
                    <input type="date" className="border rounded-lg px-3 py-2" />
                </div>

                {/* Logs Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Actor</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Action</th>
                                <th className="p-3 text-left">Entity</th>
                                <th className="p-3 text-left">Entity ID</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-right">Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{log.actor}</td>
                                    <td className="p-3">{log.role}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-3">{log.entity}</td>
                                    <td className="p-3">{log.entity_id}</td>
                                    <td className="p-3">{log.date}</td>
                                    <td className="p-3 text-right">
                                        <button className="text-indigo-600 text-xs flex items-center gap-1">
                                            <FileText size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Info */}
                <p className="text-xs text-gray-400">
                    Audit logs are immutable and stored for compliance purposes.
                </p>
            </div>
        </div>
    );
}