import React, { useState } from "react";
import { Search, Download } from "lucide-react";

export default function ScanLogsPage() {
    const [query, setQuery] = useState("");

    const logs = [
        {
            id: "1",
            token: "QR-123456",
            student: "Rahul Sharma",
            school: "Green Valley School",
            scanned_at: "2026-02-23 10:45",
            ip: "103.45.22.10",
            status: "SUCCESS",
        },
        {
            id: "2",
            token: "QR-987654",
            student: "—",
            school: "Sunrise Public School",
            scanned_at: "2026-02-23 09:12",
            ip: "115.98.44.21",
            status: "FAILED",
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Scan Logs
                        </h1>
                        <p className="text-sm text-gray-500">
                            Track all QR scan activities across the platform
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        <Download size={16} /> Export
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white border rounded-xl p-4 flex gap-3">
                    <input
                        placeholder="Search by token or IP"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2"
                    />

                    <input type="date" className="border rounded-lg px-3 py-2" />
                    <input type="date" className="border rounded-lg px-3 py-2" />

                    <select className="border rounded-lg px-3 py-2">
                        <option>All Status</option>
                        <option>Success</option>
                        <option>Failed</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-3 text-left">Token</th>
                                <th className="p-3 text-left">Student</th>
                                <th className="p-3 text-left">School</th>
                                <th className="p-3 text-left">Timestamp</th>
                                <th className="p-3 text-left">IP Address</th>
                                <th className="p-3 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{log.token}</td>
                                    <td className="p-3">{log.student}</td>
                                    <td className="p-3">{log.school}</td>
                                    <td className="p-3">{log.scanned_at}</td>
                                    <td className="p-3">{log.ip}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${log.status === "SUCCESS"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Showing 1–50 of 12,430 logs</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border rounded-lg">Prev</button>
                        <button className="px-3 py-1 border rounded-lg">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}