import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    School,
    Users,
    User,
    QrCode,
    ScanLine,
    AlertTriangle,
    MapPin,
    Bell,
    CreditCard,
    DollarSign,
    FileBarChart,
    Palette,
    Activity,
    Shield,
    Settings,
    Key,
    Webhook,
    Database,
    Flag,
    Menu,
    Search,
} from "lucide-react";

const sections = [
    {
        title: "Core",
        items: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { name: "School Lookup", icon: Search, path: "/school-lookup" },
            { name: "Schools", icon: School, path: "/schools" },
            { name: "Students", icon: Users, path: "/students" },
            { name: "Parents", icon: User, path: "/parents" },
        ],
    },
    {
        title: "Token & Safety",
        items: [
            { name: "Token Control", icon: QrCode, path: "/token" },
            { name: "Token Inventory", icon: Database, path: "/token-inventory" },
            { name: "QR Management", icon: QrCode, path: "/qr" },
            { name: "Scan Logs", icon: ScanLine, path: "/scan-logs" },
            { name: "Scan Anomalies", icon: AlertTriangle, path: "/scan-anomalies" },
        ],
    },
    {
        title: "Operations",
        items: [
            { name: "Notifications", icon: Bell, path: "/notifications" },
            { name: "Location Tracking", icon: MapPin, path: "/locations" },
            { name: "Emergency Profiles", icon: Shield, path: "/emergency-profiles" },
        ],
    },
    {
        title: "Business",
        items: [
            { name: "Subscriptions", icon: CreditCard, path: "/subscriptions" },
            { name: "Payments", icon: DollarSign, path: "/payments" },
            { name: "Revenue Analytics", icon: Activity, path: "/revenue" },
            { name: "Reports", icon: FileBarChart, path: "/reports" },
        ],
    },
    {
        title: "Design",
        items: [
            { name: "Card Templates", icon: Palette, path: "/templates" },
        ],
    },
    {
        title: "Security",
        items: [
            { name: "Audit Logs", icon: Database, path: "/audit-logs" },
            { name: "Sessions", icon: Activity, path: "/sessions" },
            { name: "API Keys", icon: Key, path: "/api-keys" },
            { name: "Webhooks", icon: Webhook, path: "/webhooks" },
        ],
    },
    {
        title: "System",
        items: [
            { name: "Admin Management", icon: Shield, path: "/admins" },
            { name: "Feature Flags", icon: Flag, path: "/feature-flags" },
            { name: "Health Monitor", icon: Activity, path: "/health" },
            { name: "Settings", icon: Settings, path: "/settings" },
        ],
    },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    return (
        <aside
            className={`h-screen sticky top-0 transition-all duration-300 flex flex-col
      bg-gray-50 border-r border-gray-200 shadow-sm
      ${collapsed ? "w-16" : "w-72"}`}
        >
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-4">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">RD</span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 leading-none">
                                RESQID
                            </p>
                            <p className="text-xs text-gray-400">Control Panel</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition"
                >
                    <Menu size={18} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.title} className="mb-4">
                        {!collapsed && (
                            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase">
                                {section.title}
                            </p>
                        )}

                        <div className="space-y-1">
                            {section.items.map(({ name, icon: Icon, path }) => (
                                <NavLink
                                    key={name}
                                    to={path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
                    ${isActive
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-gray-600 hover:bg-white hover:text-gray-900"
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    {!collapsed && <span>{name}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        © {new Date().getFullYear()} QR Safe
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">v1.0.0</div>
                </div>
            )}
        </aside>
    );
}