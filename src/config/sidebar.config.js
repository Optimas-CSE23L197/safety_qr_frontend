/**
 * SIDEBAR CONFIG
 * Defines navigation items per role.
 * Change nav structure here — sidebar component renders from this data.
 */

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
    group: "Management",
    items: [
      {
        label: "Admins",
        path: ROUTES.SUPER_ADMIN.ADMIN_MANAGEMENT,
        icon: "Users",
      },
      {
        label: "Subscriptions",
        path: ROUTES.SUPER_ADMIN.SUBSCRIPTIONS,
        icon: "CreditCard",
      },
      {
        label: "Feature Flags",
        path: ROUTES.SUPER_ADMIN.FEATURE_FLAGS,
        icon: "ToggleLeft",
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
    ],
  },
  {
    group: "System",
    items: [
      {
        label: "Audit Logs",
        path: ROUTES.SUPER_ADMIN.AUDIT_LOGS,
        icon: "ScrollText",
      },
      {
        label: "Reports",
        path: ROUTES.SUPER_ADMIN.REPORTS,
        icon: "BarChart3",
      },
      {
        label: "API Keys",
        path: ROUTES.SUPER_ADMIN.API_KEYS,
        icon: "Key",
      },
      {
        label: "Webhooks",
        path: ROUTES.SUPER_ADMIN.WEBHOOKS,
        icon: "Webhook",
      },
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
    ],
  },
  {
    group: "Students",
    items: [
      {
        label: "All Students",
        path: ROUTES.SCHOOL_ADMIN.STUDENTS,
        icon: "GraduationCap",
      },
      {
        label: "Parent Requests",
        path: ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS,
        icon: "ClipboardList",
        badgeKey: "pendingRequests", // key in uiStore.badges
      },
    ],
  },
  {
    group: "ID Cards & QR",
    items: [
      {
        label: "Token Inventory",
        path: ROUTES.SCHOOL_ADMIN.TOKEN_INVENTORY,
        icon: "Cpu",
      },
      {
        label: "Token Control",
        path: ROUTES.SCHOOL_ADMIN.TOKEN_CONTROL,
        icon: "Settings2",
        allowedRoles: ["ADMIN"], // STAFF and VIEWER cannot see this
      },
      {
        label: "Card Template",
        path: ROUTES.SCHOOL_ADMIN.CARD_TEMPLATE,
        icon: "IdCard",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "QR Management",
        path: ROUTES.SCHOOL_ADMIN.QR_MANAGEMENT,
        icon: "QrCode",
      },
    ],
  },
  {
    group: "Monitoring",
    items: [
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
      {
        label: "Notifications",
        path: ROUTES.SCHOOL_ADMIN.NOTIFICATIONS,
        icon: "Bell",
        badgeKey: "unreadNotifications",
      },
    ],
  },
  {
    group: "System",
    items: [
      {
        label: "Audit Logs",
        path: ROUTES.SCHOOL_ADMIN.AUDIT_LOGS,
        icon: "ScrollText",
        allowedRoles: ["ADMIN"],
      },
      {
        label: "Settings",
        path: ROUTES.SCHOOL_ADMIN.SETTINGS,
        icon: "Settings",
        allowedRoles: ["ADMIN"],
      },
    ],
  },
];
