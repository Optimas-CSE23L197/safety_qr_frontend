import React, { useState } from "react";
import Card from "../components/ui/Card";
import {
    School,
    Users,
    QrCode,
    ScanLine,
    AlertTriangle,
    Activity,
    Server,
    TrendingUp,
    TrendingDown,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Zap,
    Globe,
    Shield,
    Download,
    RefreshCw,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    ChevronRight,
} from "lucide-react";

export default function Dashboard() {
    const [timeRange, setTimeRange] = useState("7d");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const stats = [
        {
            label: "Total Schools",
            value: 42,
            change: "+12%",
            trend: "up",
            icon: School,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            gradient: "from-indigo-500 to-indigo-600",
        },
        {
            label: "Active Students",
            value: "12,540",
            change: "+8.2%",
            trend: "up",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            gradient: "from-blue-500 to-blue-600",
        },
        {
            label: "Active Tokens",
            value: "11,200",
            change: "+5.4%",
            trend: "up",
            icon: QrCode,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            gradient: "from-emerald-500 to-emerald-600",
        },
        {
            label: "Today's Scans",
            value: 530,
            change: "-2.1%",
            trend: "down",
            icon: ScanLine,
            color: "text-purple-600",
            bg: "bg-purple-50",
            gradient: "from-purple-500 to-purple-600",
        },
    ];

    const alerts = [
        {
            type: "warning",
            icon: AlertTriangle,
            color: "text-amber-600",
            bg: "bg-amber-50",
            message: "3 contracts expiring in 7 days",
            action: "Review",
        },
        {
            type: "error",
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50",
            message: "12 revoked tokens this week",
            action: "View Details",
        },
        {
            type: "info",
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50",
            message: "API latency higher than normal",
            action: "Check Status",
        },
    ];

    const recentSchools = [
        {
            name: "Green Valley School",
            students: 450,
            plan: "Premium",
            status: "active",
            joinedDays: 2,
        },
        {
            name: "Sunrise Public School",
            students: 320,
            plan: "Standard",
            status: "active",
            joinedDays: 5,
        },
        {
            name: "Delhi Modern Academy",
            students: 680,
            plan: "Enterprise",
            status: "active",
            joinedDays: 7,
        },
        {
            name: "St. Xavier's International",
            students: 520,
            plan: "Premium",
            status: "pending",
            joinedDays: 1,
        },
    ];

    const tokenStats = [
        { label: "Activated", value: 9400, percentage: 84, color: "bg-green-500" },
        { label: "Issued", value: 1200, percentage: 11, color: "bg-blue-500" },
        { label: "Expired", value: 600, percentage: 5, color: "bg-amber-500" },
        { label: "Revoked", value: 200, percentage: 2, color: "bg-red-500" },
    ];

    const systemMetrics = [
        {
            label: "API Status",
            value: "Healthy",
            icon: Server,
            status: "success",
            color: "text-green-600",
        },
        {
            label: "DB Response",
            value: "42ms",
            icon: Activity,
            status: "success",
            color: "text-green-600",
        },
        {
            label: "Error Rate",
            value: "0.4%",
            icon: AlertTriangle,
            status: "warning",
            color: "text-amber-600",
        },
        {
            label: "Uptime",
            value: "99.9%",
            icon: CheckCircle,
            status: "success",
            color: "text-green-600",
        },
    ];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    return (
        <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Time Range Filter */}
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        {["24h", "7d", "30d", "90d"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${timeRange === range
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        <span className="text-sm font-medium">Refresh</span>
                    </button>

                    {/* Export Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Export</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(({ label, value, change, trend, icon: Icon, color, bg, gradient }) => (
                    <Card
                        key={label}
                        className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${bg}`}>
                                <Icon className={color} size={24} />
                            </div>
                            <div
                                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === "up"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {trend === "up" ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : (
                                    <TrendingDown className="w-3 h-3" />
                                )}
                                {change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{label}</p>
                            <p className="text-3xl font-bold text-gray-900">{value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts + Alerts */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Scan Trend Chart */}
                <Card className="lg:col-span-2 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            Scan Activity
                        </h3>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    {/* Placeholder Chart Area */}
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium">
                                Daily Scan Activity Chart
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Chart visualization goes here
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats Below Chart */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Peak Hour</p>
                            <p className="text-lg font-bold text-gray-900">10:00 AM</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Avg. Daily</p>
                            <p className="text-lg font-bold text-gray-900">480</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">This Week</p>
                            <p className="text-lg font-bold text-gray-900">3,360</p>
                        </div>
                    </div>
                </Card>

                {/* Operational Alerts */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            Alerts
                        </h3>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            3 New
                        </span>
                    </div>

                    <div className="space-y-3">
                        {alerts.map((alert, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg ${alert.bg} border border-${alert.color.replace('text-', '')}/20 hover:shadow-md transition-all cursor-pointer`}
                            >
                                <div className="flex items-start gap-3">
                                    <alert.icon className={`w-5 h-5 ${alert.color} shrink-0 mt-0.5`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 font-medium mb-2">
                                            {alert.message}
                                        </p>
                                        <button className={`text-xs font-semibold ${alert.color} hover:underline flex items-center gap-1`}>
                                            {alert.action}
                                            <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        View All Alerts
                    </button>
                </Card>
            </div>

            {/* Recent Schools + Token Distribution */}
            <div className="grid lg:grid-cols-2 gap-4">
                {/* Recent Schools */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <School className="w-5 h-5 text-indigo-600" />
                            Recent Schools
                        </h3>
                        <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recentSchools.map((school, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {school.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {school.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {school.students} students · {school.plan}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${school.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {school.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {school.joinedDays}d ago
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Token Distribution */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-emerald-600" />
                            Token Distribution
                        </h3>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {tokenStats.map((stat, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                                        <span className="text-sm font-medium text-gray-900">
                                            {stat.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">
                                            {stat.percentage}%
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {stat.value.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${stat.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                                Total Tokens
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                                {tokenStats.reduce((a, b) => a + b.value, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Health */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        System Health
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-600">All Systems Operational</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                    {systemMetrics.map((metric, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                                <span className="text-sm text-gray-600">{metric.label}</span>
                            </div>
                            <p className={`text-2xl font-bold ${metric.color}`}>
                                {metric.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Additional System Info */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">
                            Region: <span className="font-medium text-gray-900">Asia-Pacific</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">
                            Last Updated: <span className="font-medium text-gray-900">2 min ago</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span className="text-gray-600">
                            Load: <span className="font-medium text-gray-900">Light</span>
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}