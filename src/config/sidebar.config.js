import { ROUTES } from "./routes.config.js";

// ── Super Admin Navigation ────────────────────────────────────────────────────
export const SUPER_ADMIN_NAV = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        path: ROUTES.SUPER_ADMIN.DASHBOARD,
        icon: "LayoutDashboard",
      },
      {
        label: "Health Monitor",
        path: ROUTES.SUPER_ADMIN.HEALTH_MONITOR,
        icon: "Activity",
      },
    ],
  },
  {
    group: "Schools",
    items: [
      {
        label: "All Schools",
        path: ROUTES.SUPER_ADMIN.ALL_SCHOOLS,
        icon: "Building2",
      },
      {
        label: "Register School",
        path: ROUTES.SUPER_ADMIN.REGISTER_SCHOOL,
        icon: "PlusCircle",
      },
    ],
  },
  {
    group: "People",
    items: [
      {
        label: "Admins",
        path: ROUTES.SUPER_ADMIN.ADMIN_MANAGEMENT,
        icon: "Shield",
      },
      {
        label: "All Students",
        path: ROUTES.SUPER_ADMIN.ALL_STUDENTS,
        icon: "GraduationCap",
      },
      {
        label: "All Parents",
        path: ROUTES.SUPER_ADMIN.ALL_PARENTS,
        icon: "Users",
      },
    ],
  },
  {
    group: "Tokens",
    items: [
      {
        label: "Token Inventory",
        path: ROUTES.SUPER_ADMIN.TOKEN_INVENTORY,
        icon: "Cpu",
      },
      {
        label: "Token Control",
        path: ROUTES.SUPER_ADMIN.TOKEN_CONTROL,
        icon: "Settings2",
      },
      {
        label: "Token Orders",
        path: ROUTES.SUPER_ADMIN.TOKEN_ORDERS,
        icon: "PackagePlus",
        badgeKey: "pendingTokenOrders",
        badgeVariant: "danger",
      },
    ],
  },
  {
    group: "Safety",
    items: [
      {
        label: "Scan Logs",
        path: ROUTES.SUPER_ADMIN.SCAN_LOGS,
        icon: "ScanLine",
      },
      {
        label: "Scan Anomalies",
        path: ROUTES.SUPER_ADMIN.SCAN_ANOMALIES,
        icon: "AlertTriangle",
        badgeKey: "unresolvedAnomalies",
        badgeVariant: "danger",
      },
      {
        label: "Emergency Profiles",
        path: ROUTES.SUPER_ADMIN.EMERGENCY_PROFILES,
        icon: "Shield",
      },
      {
        label: "Location Tracking",
        path: ROUTES.SUPER_ADMIN.LOCATION_TRACKING,
        icon: "MapPin",
      },
    ],
  },
  {
    group: "Business",
    items: [
      {
        label: "Subscriptions",
        path: ROUTES.SUPER_ADMIN.SUBSCRIPTIONS,
        icon: "CreditCard",
      },
      {
        label: "Payments",
        path: ROUTES.SUPER_ADMIN.PAYMENTS,
        icon: "DollarSign",
      },
      { label: "Revenue", path: ROUTES.SUPER_ADMIN.REVENUE, icon: "BarChart3" },
    ],
  },
  {
    group: "System",
    items: [
      {
        label: "Feature Flags",
        path: ROUTES.SUPER_ADMIN.FEATURE_FLAGS,
        icon: "ToggleLeft",
      },
      {
        label: "Audit Logs",
        path: ROUTES.SUPER_ADMIN.AUDIT_LOGS,
        icon: "ScrollText",
      },
      {
        label: "Notifications",
        path: ROUTES.SUPER_ADMIN.NOTIFICATIONS,
        icon: "Bell",
      },
      { label: "Reports", path: ROUTES.SUPER_ADMIN.REPORTS, icon: "BarChart3" },
      {
        label: "Sessions",
        path: ROUTES.SUPER_ADMIN.SESSIONS,
        icon: "Activity",
      },
    ],
  },
  {
    group: "Developer",
    items: [
      { label: "API Keys", path: ROUTES.SUPER_ADMIN.API_KEYS, icon: "Key" },
      { label: "Webhooks", path: ROUTES.SUPER_ADMIN.WEBHOOKS, icon: "Webhook" },
    ],
  },
];

// ── School Admin Navigation ───────────────────────────────────────────────────
export const SCHOOL_ADMIN_NAV = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        path: ROUTES.SCHOOL_ADMIN.DASHBOARD,
        icon: "LayoutDashboard",
      },
      {
        label: "Live Scan Monitor",
        path: ROUTES.SCHOOL_ADMIN.LIVE_SCANS,
        icon: "Activity",
      },
    ],
  },
  {
    group: "People",
    items: [
      {
        label: "Students",
        path: ROUTES.SCHOOL_ADMIN.STUDENTS,
        icon: "GraduationCap",
      },
      { label: "Parents", path: ROUTES.SCHOOL_ADMIN.PARENTS, icon: "Users" },
      {
        label: "Staff Members",
        path: ROUTES.SCHOOL_ADMIN.STAFF,
        icon: "UserCog",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "Update Requests",
        path: ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS,
        icon: "ClipboardList",
        badgeKey: "pendingRequests",
      },
    ],
  },
  {
    group: "Safety",
    items: [
      {
        label: "Emergency Profiles",
        path: ROUTES.SCHOOL_ADMIN.EMERGENCY_PROFILES,
        icon: "Shield",
        badgeKey: "incompleteProfiles",
        badgeVariant: "danger",
      },
      {
        label: "Location Tracking",
        path: ROUTES.SCHOOL_ADMIN.LOCATION_TRACKING,
        icon: "MapPin",
      },
      {
        label: "Scan Logs",
        path: ROUTES.SCHOOL_ADMIN.SCAN_LOGS,
        icon: "ScanLine",
      },
      {
        label: "Anomalies",
        path: ROUTES.SCHOOL_ADMIN.ANOMALIES,
        icon: "AlertTriangle",
        badgeKey: "unresolvedAnomalies",
        badgeVariant: "danger",
      },
    ],
  },
  {
    group: "ID Cards & Tokens",
    items: [
      {
        label: "Token Inventory",
        path: ROUTES.SCHOOL_ADMIN.TOKEN_INVENTORY,
        icon: "Cpu",
        badgeKey: "unassignedTokens",
      },
      {
        label: "Token Control",
        path: ROUTES.SCHOOL_ADMIN.TOKEN_CONTROL,
        icon: "Settings2",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "Order Tokens",
        path: ROUTES.SCHOOL_ADMIN.TOKEN_ORDERS,
        icon: "PackagePlus",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "QR Management",
        path: ROUTES.SCHOOL_ADMIN.QR_MANAGEMENT,
        icon: "QrCode",
      },
      {
        label: "Card Template",
        path: ROUTES.SCHOOL_ADMIN.CARD_TEMPLATE,
        icon: "IdCard",
        allowedRoles: ["ADMIN"],
      },
    ],
  },
  {
    group: "Communication",
    items: [
      {
        label: "Notifications",
        path: ROUTES.SCHOOL_ADMIN.NOTIFICATIONS,
        icon: "Bell",
        badgeKey: "failedNotifications",
      },
      { label: "Devices", path: ROUTES.SCHOOL_ADMIN.DEVICES, icon: "Cpu" },
    ],
  },
  {
    group: "Analytics",
    items: [
      {
        label: "Scan Analytics",
        path: ROUTES.SCHOOL_ADMIN.SCAN_ANALYTICS,
        icon: "BarChart3",
      },
      {
        label: "Reports",
        path: ROUTES.SCHOOL_ADMIN.REPORTS,
        icon: "ScrollText",
      },
    ],
  },
  {
    group: "Billing",
    items: [
      {
        label: "Subscription & Billing",
        path: ROUTES.SCHOOL_ADMIN.BILLING,
        icon: "CreditCard",
        allowedRoles: ["ADMIN"],
      },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        label: "School Profile",
        path: ROUTES.SCHOOL_ADMIN.SCHOOL_PROFILE,
        icon: "Building2",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "Notification Prefs",
        path: ROUTES.SCHOOL_ADMIN.NOTIFICATION_PREFS,
        icon: "BellDot",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "Audit Logs",
        path: ROUTES.SCHOOL_ADMIN.AUDIT_LOGS,
        icon: "ScrollText",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "My Profile",
        path: ROUTES.SCHOOL_ADMIN.MY_PROFILE,
        icon: "User",
      },
    ],
  },
];
