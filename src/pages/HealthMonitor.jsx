import React from "react";
import Card from "../components/ui/Card";
import {
    Activity,
    Server,
    Database,
    ShieldCheck,
    AlertTriangle,
    RefreshCw,
    Clock,
    Globe,
} from "lucide-react";

export default function HealthMonitorPage() {
    const systemStats = [
        {
            label: "API Status",
            value: "Operational",
            icon: Server,
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            label: "DB Latency",
            value: "42ms",
            icon: Database,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Error Rate",
            value: "0.4%",
            icon: AlertTriangle,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Uptime",
            value: "99.98%",
            icon: ShieldCheck,
            color: "text-green-600",
            bg: "bg-green-50",
        },
    ];

    const services = [
        { name: "Auth Service", status: "Operational", latency: "32ms" },
        { name: "Token Service", status: "Operational", latency: "45ms" },
        { name: "Scan API", status: "Operational", latency: "51ms" },
        { name: "Background Workers", status: "Operational", latency: "—" },
    ];

    const incidents = [
        {
            title: "High latency spike",
            time: "2 hours ago",
            severity: "warning",
        },
        {
            title: "Failed scan attempts detected",
            time: "Yesterday",
            severity: "info",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="text-indigo-600" /> System Health
                        </h1>
                        <p className="text-gray-600">
                            Real-time infrastructure and platform monitoring
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select className="border rounded-lg px-3 py-2 text-sm">
                            <option>Production</option>
                            <option>Staging</option>
                        </select>

                        <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </div>

                {/* Global Status Banner */}
                <div className="bg-green-600 text-white rounded-xl px-6 py-3 flex items-center justify-between">
                    <span className="font-medium">All systems operational</span>
                    <span className="text-sm opacity-90 flex items-center gap-1">
                        <Clock size={14} /> Updated 2 min ago
                    </span>
                </div>

                {/* KPI Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    {systemStats.map((s) => (
                        <Card key={s.label} className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${s.bg}`}>
                                <s.icon className={s.color} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{s.label}</p>
                                <p className={`text-xl font-semibold ${s.color}`}>
                                    {s.value}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Metrics */}
                <div className="grid lg:grid-cols-2 gap-4">
                    <Card className="h-72 flex items-center justify-center text-gray-400">
                        Requests & Latency Chart
                    </Card>
                    <Card className="h-72 flex items-center justify-center text-gray-400">
                        Traffic & Scan Volume
                    </Card>
                </div>

                {/* Services Health */}
                <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Server size={16} /> Services Health
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        {services.map((svc) => (
                            <div
                                key={svc.name}
                                className="flex items-center justify-between border rounded-lg px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">{svc.name}</p>
                                    <p className="text-xs text-gray-500">
                                        Latency: {svc.latency}
                                    </p>
                                </div>

                                <span className="flex items-center gap-2 text-green-600 font-medium">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    {svc.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Incident Timeline */}
                <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} /> Incidents & Alerts
                    </h3>

                    <div className="space-y-3">
                        {incidents.map((incident, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-lg border"
                            >
                                <div
                                    className={`w-2 h-2 mt-2 rounded-full ${incident.severity === "warning"
                                            ? "bg-yellow-500"
                                            : "bg-blue-500"
                                        }`}
                                />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {incident.title}
                                    </p>
                                    <p className="text-xs text-gray-500">{incident.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Footer Info */}
                <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Globe size={14} />
                    Monitoring region: Asia-Pacific • Integrate with Prometheus,
                    Datadog, or Sentry for real-time telemetry
                </div>
            </div>
        </div>
    );
}