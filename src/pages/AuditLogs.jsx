import React, { useState } from "react";
import {
    Search,
    Download,
    Eye,
    X,
    Filter,
} from "lucide-react";

export default function AuditLogsPage() {
    const [selectedLog, setSelectedLog] = useState(null);

    const logs = [
        {
            id: "log_1",
            actor: "Admin User",
            actor_type: "SCHOOL_USER",
            action: "TOKEN_RESET",
            entity: "Token",
            entity_id: "tok_123",
            created_at: "2026-02-20 10:30",
            ip_address: "103.45.22.10",
            metadata: { reason: "Damaged QR" },
            new_value: null,
            old_value: null,
        },
        {
            id: "log_2",
            actor: "Super Admin",
            actor_type: "SUPER_ADMIN",
            action: "SCHOOL_CREATED",
            entity: "School",
            entity_id: "sch_456",
            created_at: "2026-02-18 14:10",
            ip_address: "115.98.44.21",
            metadata: { plan: "Premium" },
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Audit Logs
                        </h1>
                        <p className="text-gray-600">
                            Immutable history of system actions
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <Download size={16} /> Export
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Search action, entity, actor..."
                        className="flex-1 outline-none"
                    />
                    <Filter className="w-4 h-4 text-gray-500" />
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Actor</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Action</th>
                                <th className="p-3 text-left">Entity</th>
                                <th className="p-3 text-left">Entity ID</th>
                                <th className="p-3 text-left">Timestamp</th>
                                <th className="p-3 text-left"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{log.actor}</td>
                                    <td className="p-3">{log.actor_type}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-3">{log.entity}</td>
                                    <td className="p-3">{log.entity_id}</td>
                                    <td className="p-3">{log.created_at}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => setSelectedLog(log)}
                                            className="flex items-center gap-1 text-indigo-600 hover:underline"
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

            {/* Detail Drawer */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/40 flex justify-end">
                    <div className="w-[420px] bg-white h-full p-6 shadow-xl overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Audit Details</h2>
                            <button onClick={() => setSelectedLog(null)}>
                                <X />
                            </button>
                        </div>

                        <Detail label="Log ID" value={selectedLog.id} />
                        <Detail label="Actor" value={selectedLog.actor} />
                        <Detail label="Actor Type" value={selectedLog.actor_type} />
                        <Detail label="Action" value={selectedLog.action} />
                        <Detail label="Entity" value={selectedLog.entity} />
                        <Detail label="Entity ID" value={selectedLog.entity_id} />
                        <Detail label="Timestamp" value={selectedLog.created_at} />
                        <Detail label="IP Address" value={selectedLog.ip_address} />
                        <Detail
                            label="Metadata"
                            value={JSON.stringify(selectedLog.metadata, null, 2)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="mb-4">
            <p className="text-xs text-gray-500">{label}</p>
            <pre className="text-sm font-medium text-gray-900 whitespace-pre-wrap">
                {value || "—"}
            </pre>
        </div>
    );
}