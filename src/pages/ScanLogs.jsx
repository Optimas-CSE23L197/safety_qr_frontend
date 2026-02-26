import React, { useState } from "react";
import {
    Search,
    Download,
    Eye,
    X,
    Filter,
} from "lucide-react";

export default function ScanLogsPage() {
    const [selectedLog, setSelectedLog] = useState(null);

    const logs = [
        {
            id: "log_1",
            created_at: "2026-02-23 10:45",
            ip_address: "103.45.22.10",
            ip_city: "Kolkata",
            ip_country: "IN",
            latitude: 22.5726,
            longitude: 88.3639,
            response_time_ms: 120,
            device: "Android",
            user_agent: "Chrome Mobile",
            result: "SUCCESS",
            token: {
                token_hash: "QR-123456",
                student: { first_name: "Rahul", last_name: "Sharma" },
                school: { name: "Green Valley School" },
            },
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Scan Logs</h1>
                        <p className="text-gray-600">Full audit trail of all scans</p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <Download size={16} /> Export
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-xl border flex gap-3 items-center">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input placeholder="Search token, IP, student..." className="flex-1 outline-none" />
                    <Filter className="w-4 h-4 text-gray-500" />
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Token</th>
                                <th className="p-3 text-left">Student</th>
                                <th className="p-3 text-left">School</th>
                                <th className="p-3 text-left">Result</th>
                                <th className="p-3 text-left">Timestamp</th>
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-left">Response</th>
                                <th className="p-3 text-left"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-indigo-600">
                                        {log.token.token_hash}
                                    </td>
                                    <td className="p-3">
                                        {log.token.student?.first_name} {log.token.student?.last_name}
                                    </td>
                                    <td className="p-3">{log.token.school.name}</td>
                                    <td className="p-3">
                                        <StatusBadge status={log.result} />
                                    </td>
                                    <td className="p-3">{log.created_at}</td>
                                    <td className="p-3">
                                        {log.ip_city}, {log.ip_country}
                                    </td>
                                    <td className="p-3">{log.response_time_ms} ms</td>
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
                            <h2 className="text-lg font-semibold">Scan Details</h2>
                            <button onClick={() => setSelectedLog(null)}>
                                <X />
                            </button>
                        </div>

                        <Detail label="Log ID" value={selectedLog.id} />
                        <Detail label="Token" value={selectedLog.token.token_hash} />
                        <Detail label="Result" value={selectedLog.result} />
                        <Detail label="Timestamp" value={selectedLog.created_at} />
                        <Detail label="IP Address" value={selectedLog.ip_address} />
                        <Detail label="City" value={selectedLog.ip_city} />
                        <Detail label="Country" value={selectedLog.ip_country} />
                        <Detail label="Latitude" value={selectedLog.latitude} />
                        <Detail label="Longitude" value={selectedLog.longitude} />
                        <Detail label="Response Time" value={`${selectedLog.response_time_ms} ms`} />
                        <Detail label="Device" value={selectedLog.device} />
                        <Detail label="User Agent" value={selectedLog.user_agent} />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        SUCCESS: "bg-green-100 text-green-700",
        INVALID: "bg-red-100 text-red-700",
        REVOKED: "bg-orange-100 text-orange-700",
        EXPIRED: "bg-gray-200 text-gray-700",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs ${styles[status] || styles.INVALID}`}>
            {status}
        </span>
    );
}

function Detail({ label, value }) {
    return (
        <div className="mb-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium text-gray-900">{value || "—"}</p>
        </div>
    );
}