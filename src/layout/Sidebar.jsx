import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    School,
    Users,
    User,
    QrCode,
    ScanLine,
    CreditCard,
    FileBarChart,
    Palette,
    Activity,
    Shield,
    Settings,
    Menu,
    Database,
    Search
} from "lucide-react";

const sections = [
    {
        title: "Core",
        items: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { name: "School Lookup", icon: Search, path: "/all-schools" },
            { name: "Manage Schools", icon: School, path: "/schools" }
            // { name: "Students", icon: Users, path: "/students" },
            // { name: "Parents", icon: User, path: "/parents" },
        ],
    },
    {
        title: "Token & QR",
        items: [
            { name: "Token Control", icon: QrCode, path: "/token" },
            { name: "QR Management", icon: QrCode, path: "/qr" },
            { name: "Scan Logs", icon: ScanLine, path: "/scan-logs" },
        ],
    },
    {
        title: "Business",
        items: [
            { name: "Subscriptions", icon: CreditCard, path: "/subscriptions" },
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
        title: "System",
        items: [
            { name: "Health Monitor", icon: Activity, path: "/health" },
            { name: "Audit Logs", icon: Database, path: "/audit-logs" },
            { name: "Admin Management", icon: Shield, path: "/admins" },
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
                            <span className="text-white font-bold text-sm">QR</span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 leading-none">QR Safe</p>
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
                            {section.items.map(({ name, icon: Icon, path, external }) =>
                                external ? (
                                    <a
                                        key={name}
                                        href={path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900"
                                    >
                                        <Icon size={18} />
                                        {!collapsed && <span>{name}</span>}
                                    </a>
                                ) : (
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
                                )
                            )}
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