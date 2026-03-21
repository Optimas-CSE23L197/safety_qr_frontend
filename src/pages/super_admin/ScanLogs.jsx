import { useState } from "react";
import { Search, Download, Eye, X, Filter } from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_BADGE = {
    SUCCESS: "bg-success-100 text-success-700",
    INVALID: "bg-danger-100  text-danger-700",
    REVOKED: "bg-warning-100 text-warning-700",
    EXPIRED: "bg-slate-200   text-slate-600",
};

function StatusBadge({ status }) {
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[status] ?? STATUS_BADGE.INVALID}`}>
            {status}
        </span>
    );
}

// ─── Detail row (drawer) ──────────────────────────────────────────────────────
function Detail({ label, value }) {
    return (
        <div className="mb-3">
            <p className="text-xs text-[var(--text-muted)] m-0 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] m-0">{value ?? "—"}</p>
        </div>
    );
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const LOGS = [
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ScanLogsPage() {
    const [selectedLog, setSelectedLog] = useState(null);

    return (
        <div className="min-h-screen bg-[var(--bg-page)] p-8 font-body">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                            Scan Logs
                        </h1>
                        <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                            Full audit trail of all scans
                        </p>
                    </div>

                    <button className="flex items-center gap-2 py-[9px] px-[18px] bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-lg border-none font-display font-semibold text-sm cursor-pointer shadow-[var(--shadow-brand)] hover:opacity-90 transition-opacity">
                        <Download size={16} /> Export
                    </button>
                </div>

                {/* ── Filter bar ───────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] px-4 py-3 flex gap-3 items-center">
                    <Search size={15} className="text-[var(--text-muted)] shrink-0" />
                    <input
                        placeholder="Search token, IP, student..."
                        className="flex-1 outline-none text-sm text-[var(--text-primary)] bg-transparent placeholder:text-[var(--text-muted)]"
                    />
                    <Filter size={15} className="text-[var(--text-muted)] shrink-0" />
                </div>

                {/* ── Table ────────────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-[var(--border-default)]">
                                {['Token', 'Student', 'School', 'Result', 'Timestamp', 'Location', 'Response', ''].map(h => (
                                    <th
                                        key={h}
                                        className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-[0.05em] whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {LOGS.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="py-[13px] px-4 font-mono text-xs font-semibold text-brand-600">
                                        {log.token.token_hash}
                                    </td>
                                    <td className="py-[13px] px-4 text-[var(--text-primary)] font-medium">
                                        {log.token.student?.first_name} {log.token.student?.last_name}
                                    </td>
                                    <td className="py-[13px] px-4 text-[var(--text-secondary)]">
                                        {log.token.school.name}
                                    </td>
                                    <td className="py-[13px] px-4">
                                        <StatusBadge status={log.result} />
                                    </td>
                                    <td className="py-[13px] px-4 font-mono text-xs text-[var(--text-muted)] whitespace-nowrap">
                                        {log.created_at}
                                    </td>
                                    <td className="py-[13px] px-4 text-[var(--text-secondary)]">
                                        {log.ip_city}, {log.ip_country}
                                    </td>
                                    <td className="py-[13px] px-4 font-mono text-xs text-[var(--text-secondary)]">
                                        {log.response_time_ms} ms
                                    </td>
                                    <td className="py-[13px] px-4">
                                        <button
                                            onClick={() => setSelectedLog(log)}
                                            className="flex items-center gap-1 text-brand-600 text-[0.8125rem] font-medium cursor-pointer bg-transparent border-none p-0 hover:text-brand-700 transition-colors"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Detail Drawer ─────────────────────────────────────────────── */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
                    <div className="w-[420px] bg-white h-full p-6 shadow-[var(--shadow-modal)] overflow-y-auto">

                        {/* Drawer header */}
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] m-0">
                                Scan Details
                            </h2>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Detail rows */}
                        <Detail label="Log ID"        value={selectedLog.id}               />
                        <Detail label="Token"         value={selectedLog.token.token_hash} />
                        <Detail label="Result"        value={selectedLog.result}           />
                        <Detail label="Timestamp"     value={selectedLog.created_at}       />
                        <Detail label="IP Address"    value={selectedLog.ip_address}       />
                        <Detail label="City"          value={selectedLog.ip_city}          />
                        <Detail label="Country"       value={selectedLog.ip_country}       />
                        <Detail label="Latitude"      value={selectedLog.latitude}         />
                        <Detail label="Longitude"     value={selectedLog.longitude}        />
                        <Detail label="Response Time" value={`${selectedLog.response_time_ms} ms`} />
                        <Detail label="Device"        value={selectedLog.device}           />
                        <Detail label="User Agent"    value={selectedLog.user_agent}       />
                    </div>
                </div>
            )}
        </div>
    );
}