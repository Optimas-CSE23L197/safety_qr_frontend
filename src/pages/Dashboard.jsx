import Card from "../components/ui/Card";
import {
    School,
    Users,
    QrCode,
    ScanLine,
    AlertTriangle,
    Activity,
    Server,
} from "lucide-react";

export default function Dashboard() {
    const stats = [
        {
            label: "Total Schools",
            value: 42,
            icon: School,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            label: "Active Students",
            value: "12,540",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Active Tokens",
            value: "11,200",
            icon: QrCode,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Today's Scans",
            value: 530,
            icon: ScanLine,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    return (
        <div className="space-y-6">

            {/* 🔢 KPI Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <Card key={label}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{label}</p>
                                <p className="text-2xl font-semibold">{value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${bg}`}>
                                <Icon className={color} size={20} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 📊 Charts + Alerts */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Scan Trend */}
                <Card className="lg:col-span-2 h-72 flex items-center justify-center text-gray-400">
                    Scan Activity Chart (daily scans)
                </Card>

                {/* Alerts */}
                <Card>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle size={16} /> Operational Alerts
                    </h3>

                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>⚠️ 3 contracts expiring in 7 days</li>
                        <li>🚫 12 revoked tokens this week</li>
                        <li>⚡ API latency higher than normal</li>
                    </ul>
                </Card>
            </div>

            {/* 🏫 Business + Token Insights */}
            <div className="grid lg:grid-cols-2 gap-4">
                {/* Recent Schools */}
                <Card>
                    <h3 className="font-semibold mb-3">Recent Schools</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>Green Valley School</p>
                        <p>Sunrise Public School</p>
                        <p>Delhi Modern Academy</p>
                    </div>
                </Card>

                {/* Token Distribution */}
                <Card>
                    <h3 className="font-semibold mb-3">Token Status Overview</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>Activated: 9,400</p>
                        <p>Issued: 1,200</p>
                        <p>Expired: 600</p>
                        <p>Revoked: 200</p>
                    </div>
                </Card>
            </div>

            {/* 💻 System Health */}
            <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Activity size={16} /> System Health
                </h3>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Server className="text-green-600" size={16} />
                        API Status: <span className="font-medium text-green-600">Healthy</span>
                    </div>

                    <div>
                        DB Response Time: <span className="font-medium">42ms</span>
                    </div>

                    <div>
                        Error Rate: <span className="font-medium text-yellow-600">0.4%</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}