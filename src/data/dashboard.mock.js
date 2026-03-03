// ── Mock Stats ─────────────────────────────────────────────────────────────────
export const MOCK_STATS = {
  totalSchools: 142,
  activeSchools: 128,
  totalStudents: 89430,
  activeSubscriptions: 119,
  trialingSchools: 9,
  pastDueSchools: 4,
  mrrUsd: 47800,
  schoolsThisMonth: 7,
  studentsThisMonth: 3210,
};

// ── Growth Chart Data ──────────────────────────────────────────────────────────
export const MOCK_GROWTH = [
  { month: "Aug", schools: 108, students: 67200 },
  { month: "Sep", schools: 114, students: 72000 },
  { month: "Oct", schools: 119, students: 76400 },
  { month: "Nov", schools: 124, students: 80100 },
  { month: "Dec", schools: 128, students: 83900 },
  { month: "Jan", schools: 135, students: 86700 },
  { month: "Feb", schools: 142, students: 89430 },
];

// ── Subscription Breakdown ─────────────────────────────────────────────────────
export const MOCK_SUB_BREAKDOWN = [
  { status: "ACTIVE", count: 119, color: "#10B981" },
  { status: "TRIALING", count: 9, color: "#0EA5E9" },
  { status: "PAST_DUE", count: 4, color: "#F59E0B" },
  { status: "CANCELED", count: 6, color: "#EF4444" },
  { status: "EXPIRED", count: 4, color: "#94A3B8" },
];

// ── Recently Registered Schools ────────────────────────────────────────────────
export const MOCK_RECENT_SCHOOLS = [
  {
    id: "s1",
    name: "Delhi Public School, Noida",
    city: "Noida",
    status: "TRIALING",
    students: 0,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "s2",
    name: "St. Mary's Convent, Pune",
    city: "Pune",
    status: "ACTIVE",
    students: 412,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "s3",
    name: "Kendriya Vidyalaya, Bhopal",
    city: "Bhopal",
    status: "ACTIVE",
    students: 287,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "s4",
    name: "Ryan International, Mumbai",
    city: "Mumbai",
    status: "TRIALING",
    students: 0,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "s5",
    name: "Cambridge High School, Hyderabad",
    city: "Hyderabad",
    status: "ACTIVE",
    students: 650,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

// ── Recent Audit Logs ──────────────────────────────────────────────────────────
export const MOCK_RECENT_AUDIT = [
  {
    id: "a1",
    action: "SCHOOL_CREATED",
    actor: "super@admin.com",
    entity: "Delhi Public School",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "a2",
    action: "SUBSCRIPTION_UPDATED",
    actor: "super@admin.com",
    entity: "Ryan International",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "a3",
    action: "FEATURE_FLAG_TOGGLED",
    actor: "super@admin.com",
    entity: "allow_location",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "a4",
    action: "ADMIN_CREATED",
    actor: "super@admin.com",
    entity: "Ramesh Kumar",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "a5",
    action: "SCHOOL_SUSPENDED",
    actor: "super@admin.com",
    entity: "Old Academy, Delhi",
    created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
];

// ── Style Maps ─────────────────────────────────────────────────────────────────
export const SUB_STATUS_STYLE = {
  ACTIVE: { bg: "#ECFDF5", color: "#047857" },
  TRIALING: { bg: "#E0F2FE", color: "#0369A1" },
  PAST_DUE: { bg: "#FFFBEB", color: "#B45309" },
  CANCELED: { bg: "#FEF2F2", color: "#B91C1C" },
  EXPIRED: { bg: "#F1F5F9", color: "#475569" },
};

export const AUDIT_ACTION_META = {
  SCHOOL_CREATED: { icon: "🏫", color: "#2563EB" },
  SUBSCRIPTION_UPDATED: { icon: "💳", color: "#10B981" },
  FEATURE_FLAG_TOGGLED: { icon: "🚩", color: "#F59E0B" },
  ADMIN_CREATED: { icon: "👤", color: "#8B5CF6" },
  SCHOOL_SUSPENDED: { icon: "⛔", color: "#EF4444" },
};
