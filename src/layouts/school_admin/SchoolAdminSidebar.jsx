export const SCHOOL_ADMIN_NAV = [
    {
        group: "Overview",
        items: [
            { label: "Dashboard", icon: "LayoutDashboard", path: "/dashboard" },
            {
                label: "Live Scan Monitor", icon: "Activity", path: "/live-scans",
                badge: "liveScans"
            },                    // ← NEW real-time
        ]
    },
    {
        group: "People",
        items: [
            { label: "Students", icon: "GraduationCap", path: "/students" },
            { label: "Parents", icon: "Users", path: "/parents" },
            {
                label: "Staff Members", icon: "UserCog", path: "/staff",
                allowedRoles: ["ADMIN"]
            },               // ← NEW ADMIN only
            {
                label: "Update Requests", icon: "ClipboardList", path: "/update-requests",
                badgeKey: "pendingRequests"
            },
        ]
    },
    {
        group: "Safety",
        items: [
            {
                label: "Emergency Profiles", icon: "Shield", path: "/emergency-profiles",
                badgeKey: "incompleteProfiles"
            },        // ← NEW badge for incomplete
            { label: "Location Tracking", icon: "MapPin", path: "/locations" }, // ← NEW
            { label: "Scan Logs", icon: "ScanLine", path: "/scan-logs" },
            {
                label: "Scan Anomalies", icon: "AlertTriangle", path: "/scan-anomalies",
                badgeKey: "unresolvedAnomalies", badgeVariant: "danger"
            },
        ]
    },
    {
        group: "ID Cards & Tokens",
        items: [
            {
                label: "Token Inventory", icon: "Database", path: "/token-inventory",
                badgeKey: "unassignedTokens"
            },          // ← NEW
            { label: "ID Cards", icon: "IdCard", path: "/cards" },
            { label: "QR Management", icon: "QrCode", path: "/qr" },
            {
                label: "Order Tokens", icon: "PackagePlus", path: "/token-orders",
                allowedRoles: ["ADMIN"]
            },               // ← NEW school orders from you
        ]
    },
    {
        group: "Communication",
        items: [
            {
                label: "Notifications", icon: "Bell", path: "/notifications",
                badgeKey: "failedNotifications"
            },
            { label: "Devices", icon: "Cpu", path: "/devices" },
        ]
    },
    {
        group: "Analytics",                            // ← NEW entire section
        items: [
            { label: "Scan Analytics", icon: "BarChart2", path: "/analytics/scans" },
            { label: "Reports", icon: "FileBarChart", path: "/reports" },
        ]
    },
    {
        group: "Billing",                              // ← NEW entire section
        items: [
            {
                label: "Subscription", icon: "CreditCard", path: "/billing",
                allowedRoles: ["ADMIN"]
            },
        ]
    },
    {
        group: "Settings",
        items: [
            {
                label: "School Profile", icon: "Building2", path: "/school-profile",
                allowedRoles: ["ADMIN"]
            },
            {
                label: "Notification Prefs", icon: "BellCog", path: "/settings/notifications",
                allowedRoles: ["ADMIN"]
            },
            { label: "Audit Logs", icon: "ScrollText", path: "/audit-logs" },
            { label: "My Profile", icon: "User", path: "/profile" },
        ]
    },
];