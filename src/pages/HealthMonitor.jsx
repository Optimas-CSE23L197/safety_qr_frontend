import React from "react";
import Card from "../components/ui/Card";
import {
    Activity,
    Server,
    Database,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react";

export default function HealthMonitorPage() {
    const systemStats = [
        { label: "API Status", value: "Healthy", color: "text-green-600" },
        { label: "DB Latency", value: "42ms", color: "text-gray-800" },
        { label: "Error Rate", value: "0.4%", color: "text-yellow-600" },
        { label: "Uptime", value: "99.98%", color: "text-green-600" },
    ];

    const services = [
        { name: "Auth Service", status: "Operational" },
        { name: "Token Service", status: "Operational" },
        { name: "Scan API", status: "Operational" },
        { name: "Background Jobs", status: "Operational" },
    ];

    const alerts = [
        "High latency detected earlier today",
        "3 failed scan attempts (resolved)",
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <Activity size={20} /> System Health Monitor
                    </h1>
                    <p className="text-sm text-gray-500">
                        Real-time overview of platform reliability and performance
                    </p>
                </div>

                {/* System KPIs */}
                <div className="grid md:grid-cols-4 gap-4">
                    {systemStats.map((s) => (
                        <Card key={s.label}>
                            <p className="text-sm text-gray-500">{s.label}</p>
                            <p className={`text-2xl font-semibold ${s.color}`}>
                                {s.value}
                            </p>
                        </Card>
                    ))}
                </div>

                {/* Performance Metrics */}
                <div className="grid lg:grid-cols-2 gap-4">
                    <Card className="h-64 flex items-center justify-center text-gray-400">
                        Requests & Latency Chart
                    </Card>

                    <Card className="h-64 flex items-center justify-center text-gray-400">
                        Scan Activity Chart
                    </Card>
                </div>

                {/* Services Status */}
                <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Server size={16} /> Services Status
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {services.map((svc) => (
                            <div
                                key={svc.name}
                                className="flex items-center justify-between border rounded-lg px-4 py-3"
                            >
                                <span>{svc.name}</span>
                                <span className="text-green-600 font-medium">
                                    {svc.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Alerts */}
                <Card>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle size={16} /> Alerts & Incidents
                    </h3>

                    <ul className="space-y-2 text-sm text-gray-600">
                        {alerts.map((alert, i) => (
                            <li key={i}>⚠️ {alert}</li>
                        ))}
                    </ul>
                </Card>

                {/* Footer */}
                <p className="text-xs text-gray-400">
                    Health data updates periodically. Integrate with monitoring tools
                    like Prometheus or Sentry for live metrics.
                </p>
            </div>
        </div>
    );
}