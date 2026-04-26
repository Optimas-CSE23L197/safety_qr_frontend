/**
 * ResQID School Admin Dashboard
 * Plan-aware: Basic vs Premium
 * Self-contained demo with mock data — drop into your project and wire up real hooks.
 *
 * Usage in your project:
 *   import SchoolAdminDashboard from './SchoolAdminDashboard';
 *   <SchoolAdminDashboard plan="basic" />   // or plan="premium"
 */

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_STATS_BASIC = {
  totalStudents: 187, activeTokens: 142, expiringTokens: 23, todayScans: 64,
  scanChangePercent: null, scanTrendUp: null, newStudentsThisMonth: null,
};
const MOCK_STATS_PREMIUM = {
  totalStudents: 187, activeTokens: 142, expiringTokens: 23, todayScans: 64,
  scanChangePercent: 12, scanTrendUp: true, newStudentsThisMonth: 9,
  profileCompletion: 74, missingEmergencyInfo: 10, anomalyCount: 4,
};

const MOCK_SCAN_TREND_7D = [
  { date: "Mon", success: 58, failed: 4 },
  { date: "Tue", success: 72, failed: 2 },
  { date: "Wed", success: 61, failed: 7 },
  { date: "Thu", success: 80, failed: 3 },
  { date: "Fri", success: 75, failed: 5 },
  { date: "Sat", success: 32, failed: 1 },
  { date: "Sun", success: 21, failed: 0 },
];
const MOCK_SCAN_TREND_30D = [
  ...MOCK_SCAN_TREND_7D,
  { date: "Mon2", success: 65, failed: 3 }, { date: "Tue2", success: 78, failed: 2 },
  { date: "Wed2", success: 55, failed: 6 }, { date: "Thu2", success: 88, failed: 1 },
  { date: "Fri2", success: 71, failed: 4 }, { date: "Sat2", success: 29, failed: 0 },
  { date: "Sun2", success: 18, failed: 2 },
];

const MOCK_TOKEN_BREAKDOWN = [
  { status: "ACTIVE", count: 142, color: "#10B981" },
  { status: "UNASSIGNED", count: 31, color: "#94A3B8" },
  { status: "ISSUED", count: 18, color: "#0EA5E9" },
  { status: "EXPIRED", count: 9, color: "#F59E0B" },
  { status: "REVOKED", count: 5, color: "#EF4444" },
];

const MOCK_ANOMALIES = [
  { id: 1, type: "DUPLICATE_SCAN", student_name: "Rahul Sharma", severity: "HIGH", created_at: new Date(Date.now() - 1800000).toISOString(), source: "AI" },
  { id: 2, type: "AFTER_HOURS_SCAN", student_name: "Priya Patel", severity: "MEDIUM", created_at: new Date(Date.now() - 3600000).toISOString(), source: "RULE" },
  { id: 3, type: "LOCATION_MISMATCH", student_name: "Arjun Singh", severity: "HIGH", created_at: new Date(Date.now() - 7200000).toISOString(), source: "AI" },
  { id: 4, type: "UNRECOGNIZED_DEVICE", student_name: "Sneha Reddy", severity: "LOW", created_at: new Date(Date.now() - 14400000).toISOString(), source: "RULE" },
];

const MOCK_PARENTS = [
  { id: 1, name: "Ramesh Sharma", student_name: "Rahul Sharma", complete: true, lastSeen: "2 days ago" },
  { id: 2, name: "Anita Patel", student_name: "Priya Patel", complete: false, lastSeen: "5 days ago" },
  { id: 3, name: "Vijay Singh", student_name: "Arjun Singh", complete: false, lastSeen: "8 days ago" },
  { id: 4, name: "Meena Reddy", student_name: "Sneha Reddy", complete: true, lastSeen: "1 day ago" },
  { id: 5, name: "Suresh Kumar", student_name: "Aditya Kumar", complete: false, lastSeen: "12 days ago" },
];

const MOCK_PENDING_REQUESTS = [
  { id: 1, student_name: "Rahul Sharma", parent_name: "Ramesh Sharma", type: "CARD_REISSUE", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, student_name: "Priya Patel", parent_name: "Anita Patel", type: "PROFILE_UPDATE", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, student_name: "Arjun Singh", parent_name: "Vijay Singh", type: "EMERGENCY_INFO", created_at: new Date(Date.now() - 18000000).toISOString() },
];

const MOCK_RECENT_SCANS = [
  { id: 1, student_name: "Rahul Sharma", time: "08:32 AM", status: "SUCCESS", type: "NORMAL" },
  { id: 2, student_name: "Priya Patel", time: "08:34 AM", status: "SUCCESS", type: "NORMAL" },
  { id: 3, student_name: "Arjun Singh", time: "08:37 AM", status: "FAILED", type: "NORMAL" },
  { id: 4, student_name: "Sneha Reddy", time: "08:40 AM", status: "SUCCESS", type: "EMERGENCY" },
  { id: 5, student_name: "Aditya Kumar", time: "08:45 AM", status: "SUCCESS", type: "NORMAL" },
];

const MOCK_STUDENTS = [
  { id: 1, name: "Rahul Sharma", class: "10-A", cardStatus: "ACTIVE", parentComplete: true },
  { id: 2, name: "Priya Patel", class: "9-B", cardStatus: "ACTIVE", parentComplete: false },
  { id: 3, name: "Arjun Singh", class: "10-B", cardStatus: "INACTIVE", parentComplete: false },
  { id: 4, name: "Sneha Reddy", class: "8-A", cardStatus: "ACTIVE", parentComplete: true },
  { id: 5, name: "Aditya Kumar", class: "9-A", cardStatus: "ISSUED", parentComplete: false },
];

const SAFETY_SCORE = { score: 78, breakdown: [
  { label: "Profile Completion", val: 74 }, { label: "Card Active Rate", val: 88 },
  { label: "Anomaly Handling", val: 62 }, { label: "Scan Reliability", val: 91 },
]};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const humanize = (s) => s ? s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "";
const relTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Plan config ──────────────────────────────────────────────────────────────
const PLAN = {
  basic: {
    scanDays: 7, students: 200, tokens: 50,
    hasAnomalyDetails: false, hasParentAction: false,
    hasBroadcast: false, hasBulkOps: false, hasExport: false,
    hasScheduledReports: false, hasAIAnomalies: false,
    hasSafetyScore: false, hasLocationTracking: false,
    hasCustomAlerts: false, hasFullScanFilters: false,
  },
  premium: {
    scanDays: 365, students: null, tokens: null,
    hasAnomalyDetails: true, hasParentAction: true,
    hasBroadcast: true, hasBulkOps: true, hasExport: true,
    hasScheduledReports: true, hasAIAnomalies: true,
    hasSafetyScore: true, hasLocationTracking: true,
    hasCustomAlerts: true, hasFullScanFilters: true,
  },
};

// ─── Micro components ─────────────────────────────────────────────────────────
const Badge = ({ label, color = "#64748b", bg = "#f1f5f9" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", padding: "2px 10px",
    borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 600,
    background: bg, color, whiteSpace: "nowrap",
  }}>{label}</span>
);

const SectionHeader = ({ title, sub, action, onAction }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
    <div>
      <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }}>{title}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{sub}</div>}
    </div>
    {action && (
      <button onClick={onAction} style={{
        display: "flex", alignItems: "center", gap: "4px",
        padding: "5px 12px", borderRadius: "6px",
        border: "1px solid var(--bd)", background: "transparent",
        fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", cursor: "pointer",
      }}>
        {action} →
      </button>
    )}
  </div>
);

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px", padding: "10px 14px",
    }}>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", marginBottom: "6px" }}>{label}</div>
      {payload.map(e => (
        <div key={e.name} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: e.color }} />
          <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}>{e.name}: {e.value}</span>
        </div>
      ))}
    </div>
  );
};

// Lock overlay for premium-gated sections
const PlanGate = ({ plan, feature, desc, children }) => {
  if (plan === "premium") return children;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(3px)", pointerEvents: "none", userSelect: "none", opacity: 0.5 }}>{children}</div>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "10px",
        background: "rgba(255,255,255,0.88)", borderRadius: "10px",
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: "#FFF8E7", border: "1px solid #F0C060",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "18px" }}>⭐</span>
        </div>
        <div style={{ textAlign: "center", maxWidth: "200px" }}>
          <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1e293b", marginBottom: "4px" }}>{feature}</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>{desc}</div>
        </div>
        <button style={{
          padding: "7px 16px", borderRadius: "7px", border: "none",
          background: "#C97C10", color: "#fff", fontSize: "0.8rem",
          fontWeight: 700, cursor: "pointer",
        }}>⭐ Upgrade to Premium</button>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, trendLabel, trendDir, loading, limit, current, plan, note }) => {
  const usedPct = limit ? Math.min(100, Math.round((current / limit) * 100)) : null;
  const nearLimit = usedPct !== null && usedPct >= 80;
  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px",
      padding: "20px 22px", flex: 1, minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>{label}</div>
          <div style={{ fontSize: "1.875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
            {loading ? "—" : value}
          </div>
          {trendLabel && !loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
              {trendDir === "up" && <span style={{ color: "#10b981", fontSize: "0.75rem" }}>↑</span>}
              {trendDir === "down" && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>↓</span>}
              <span style={{ fontSize: "0.75rem", color: trendDir === "up" ? "#10b981" : trendDir === "down" ? "#ef4444" : "var(--text-muted)", fontWeight: 500 }}>
                {trendLabel}
              </span>
            </div>
          )}
          {!loading && limit && plan === "basic" && (
            <div style={{ marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "0.68rem", color: nearLimit ? "#b45309" : "var(--text-muted)", fontWeight: 500 }}>{current}/{limit}</span>
                <span style={{ fontSize: "0.68rem", color: nearLimit ? "#b45309" : "var(--text-muted)", fontWeight: 500 }}>{usedPct}%</span>
              </div>
              <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${usedPct}%`,
                  background: usedPct >= 90 ? "#ef4444" : usedPct >= 80 ? "#f59e0b" : color,
                  borderRadius: "2px", transition: "width 0.4s",
                }} />
              </div>
            </div>
          )}
          {!loading && !limit && plan === "premium" && current != null && (
            <div style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: 600, marginTop: "6px" }}>✓ Unlimited</div>
          )}
          {note && !loading && <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "6px" }}>{note}</div>}
        </div>
        <div style={{
          width: "42px", height: "42px", borderRadius: "10px",
          background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, marginLeft: "14px", fontSize: "20px",
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// ─── Premium upsell panel (right column for basic) ────────────────────────────
const PremiumUpsellPanel = () => {
  const features = [
    { icon: "🤖", label: "AI anomaly detection" },
    { icon: "📣", label: "Broadcast alerts to parents" },
    { icon: "👨‍👩‍👧", label: "Parent engagement automation" },
    { icon: "📊", label: "12-month scan history & trends" },
    { icon: "🔄", label: "Bulk card operations & export" },
    { icon: "📍", label: "Location tracking" },
    { icon: "📅", label: "Scheduled PDF / Excel reports" },
    { icon: "🏆", label: "Safety score & leaderboard" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "8px 0", height: "100%" }}>
      <div style={{
        width: "52px", height: "52px", borderRadius: "14px",
        background: "#FFF8E7", border: "1.5px solid #F0C060",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px", marginBottom: "14px",
      }}>⭐</div>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "6px" }}>Upgrade to Premium</div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "18px", maxWidth: "280px" }}>
        Run your school smarter with AI-powered tools, unlimited capacity, and automated workflows.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", width: "100%", textAlign: "left", marginBottom: "18px" }}>
        {features.map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "6px",
              background: "#FFF8E7", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", flexShrink: 0,
            }}>{f.icon}</div>
            {f.label}
          </div>
        ))}
      </div>
      <button style={{
        width: "100%", padding: "10px 20px", borderRadius: "8px", border: "none",
        background: "#C97C10", color: "#fff", fontSize: "0.875rem",
        fontWeight: 700, cursor: "pointer",
      }}>⭐ Upgrade now</button>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "8px" }}>30-day money-back guarantee</div>
    </div>
  );
};

// ─── TABS for navigation within dashboard ─────────────────────────────────────
const TABS_BASIC = ["Overview", "Students", "Scan Logs", "Anomalies", "Notifications"];
const TABS_PREMIUM = ["Overview", "Students", "Scan Logs", "Anomalies", "Parent Requests", "Broadcast", "Card Ops", "Reports", "Safety Score"];

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ plan, limits, stats }) => {
  const cfg = PLAN[plan];
  const scanData = plan === "basic" ? MOCK_SCAN_TREND_7D : MOCK_SCAN_TREND_30D;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Alert banners - premium only */}
      {plan === "premium" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {stats.missingEmergencyInfo > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "#fef9c3", border: "1px solid #fde047",
              borderRadius: "8px", padding: "10px 16px",
            }}>
              <span>⚠️</span>
              <span style={{ fontSize: "0.8125rem", color: "#713f12", fontWeight: 500 }}>
                <strong>{stats.missingEmergencyInfo} students</strong> are missing emergency contact info.
              </span>
              <button style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#854d0e", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Fix now →</button>
            </div>
          )}
          {stats.anomalyCount > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "#fef2f2", border: "1px solid #fca5a5",
              borderRadius: "8px", padding: "10px 16px",
            }}>
              <span>🚨</span>
              <span style={{ fontSize: "0.8125rem", color: "#7f1d1d", fontWeight: 500 }}>
                <strong>{stats.anomalyCount} unresolved anomalies</strong> need your attention.
              </span>
              <button style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#991b1b", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Review →</button>
            </div>
          )}
        </div>
      )}

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        <StatCard label="Total Students" value={fmt(stats.totalStudents)} icon="🎓" color="#6366f1"
          trendLabel={plan === "premium" && stats.newStudentsThisMonth ? `+${stats.newStudentsThisMonth} this month` : "Enrolled"}
          trendDir={plan === "premium" ? "up" : null}
          plan={plan} current={stats.totalStudents} limit={limits.students} />
        <StatCard label="Active Cards" value={fmt(stats.activeTokens)} icon="🪪" color="#10b981"
          trendLabel={limits.tokens ? `${limits.tokens} max` : plan === "premium" ? "Unlimited" : null}
          plan={plan} current={stats.activeTokens} limit={limits.tokens} />
        <StatCard label="Expiring Soon" value={fmt(stats.expiringTokens)} icon="⏰" color="#f59e0b"
          trendLabel="Within 30 days" note={plan === "premium" ? "Click to bulk renew" : null} />
        <StatCard label="Today's Scans" value={fmt(stats.todayScans)} icon="📷" color="#0ea5e9"
          trendLabel={plan === "premium" && stats.scanChangePercent ? `${stats.scanChangePercent}% vs yesterday` : "Today"}
          trendDir={plan === "premium" && stats.scanTrendUp ? "up" : null} />
      </div>

      {/* Premium extra KPIs */}
      {plan === "premium" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          <StatCard label="Profile Completion" value={`${stats.profileCompletion}%`} icon="👨‍👩‍👧" color="#8b5cf6" trendLabel="Of parent profiles" />
          <StatCard label="AI Anomalies" value={fmt(stats.anomalyCount)} icon="🤖" color="#ef4444" trendLabel="Needs review" />
          <StatCard label="Safety Score" value="78/100" icon="🏆" color="#f59e0b" trendLabel="+4 vs last month" trendDir="up" />
        </div>
      )}

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: plan === "premium" ? "1fr 320px" : "1fr 320px", gap: "16px" }}>
        {/* Scan chart */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px" }}>
          <SectionHeader
            title="Scan Activity"
            sub={plan === "basic" ? "Last 7 days — basic plan" : "Last 30 days — full history"}
            action="View logs"
          />
          {plan === "basic" && (
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#eff6ff", borderRadius: "7px", padding: "7px 12px", marginBottom: "14px",
            }}>
              <span style={{ fontSize: "0.75rem", color: "#1e40af", fontWeight: 500 }}>📅 7-day history only</span>
              <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>Upgrade for 12-month trends →</span>
            </div>
          )}
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={scanData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="success" name="Success" stroke="#10b981" strokeWidth={2} fill="url(#sg)" dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" strokeWidth={2} fill="url(#fg)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Token donut */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px" }}>
          <SectionHeader title="Card Status" action="Manage" />
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={MOCK_TOKEN_BREAKDOWN} cx="50%" cy="50%" innerRadius={44} outerRadius={64}
                paddingAngle={2} dataKey="count" nameKey="status" strokeWidth={0}>
                {MOCK_TOKEN_BREAKDOWN.map(e => <Cell key={e.status} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, humanize(n)]} contentStyle={{ fontSize: "0.8rem", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {MOCK_TOKEN_BREAKDOWN.map(e => (
              <div key={e.status} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: e.color }} />
                  <span style={{ color: "var(--text-secondary)" }}>{humanize(e.status)}</span>
                </div>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{e.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Anomalies */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px" }}>
          <SectionHeader title="Recent Anomalies"
            sub={plan === "premium" ? `${MOCK_ANOMALIES.length} flagged · AI-powered` : `${MOCK_ANOMALIES.length} flagged`}
            action="View all" />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {MOCK_ANOMALIES.slice(0, 4).map(a => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 10px", borderRadius: "8px", cursor: "pointer",
                transition: "background 0.1s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                  background: plan === "premium" && a.source === "AI" ? "#eef2ff" : "#fef2f2",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
                }}>{plan === "premium" && a.source === "AI" ? "🤖" : "⚠️"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.8125rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {humanize(a.type)}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{a.student_name} · {relTime(a.created_at)}</div>
                </div>
                <Badge
                  label={a.severity}
                  bg={a.severity === "HIGH" ? "#fef2f2" : a.severity === "MEDIUM" ? "#fffbeb" : "#f0f9ff"}
                  color={a.severity === "HIGH" ? "#b91c1c" : a.severity === "MEDIUM" ? "#b45309" : "#0369a1"}
                />
                {plan === "premium" && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button style={{ fontSize: "0.68rem", padding: "3px 8px", borderRadius: "5px", border: "1px solid #d1d5db", background: "transparent", cursor: "pointer", color: "#374151" }}>Resolve</button>
                    <button style={{ fontSize: "0.68rem", padding: "3px 8px", borderRadius: "5px", border: "1px solid #d1d5db", background: "transparent", cursor: "pointer", color: "#374151" }}>Note</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {plan === "basic" && (
            <div style={{
              marginTop: "12px", padding: "10px 12px",
              background: "#eef2ff", border: "1px dashed #a5b4fc",
              borderRadius: "8px", fontSize: "0.75rem", color: "#4338ca",
            }}>
              <strong>🤖 AI Anomaly Detection</strong> — catch duplicate scans, location mismatches & after-hours entries automatically.{" "}
              <span style={{ color: "#1d4ed8", fontWeight: 700, cursor: "pointer" }}>Upgrade →</span>
            </div>
          )}
        </div>

        {/* Right: Parent engagement (premium) or upsell (basic) */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px", display: "flex", flexDirection: "column" }}>
          {plan === "premium" ? (
            <>
              <SectionHeader title="Parent Engagement" sub={`${MOCK_PARENTS.filter(p => !p.complete).length} incomplete profiles`} action="Send reminders" />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                {MOCK_PARENTS.map(p => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "8px 10px", borderRadius: "8px",
                  }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: p.complete ? "#f0fdf4" : "#fff7ed",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0,
                    }}>{p.complete ? "✅" : "⏳"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.8125rem" }}>{p.student_name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{p.name} · {p.lastSeen}</div>
                    </div>
                    {!p.complete && (
                      <button style={{ fontSize: "0.68rem", padding: "3px 8px", borderRadius: "5px", border: "1px solid #fde68a", background: "#fffbeb", cursor: "pointer", color: "#92400e", fontWeight: 600 }}>
                        Remind
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button style={{
                marginTop: "12px", width: "100%", padding: "9px", borderRadius: "8px",
                border: "1px solid var(--bd)", background: "transparent",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", color: "var(--accent)",
              }}>📣 Send bulk reminder to incomplete parents</button>
            </>
          ) : (
            <PremiumUpsellPanel />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Students Tab ─────────────────────────────────────────────────────────────
const StudentsTab = ({ plan }) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const filtered = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.class.includes(search)
  );

  const toggleSelect = (id) => setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="🔍 Search students..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: "200px", padding: "8px 14px", borderRadius: "8px",
            border: "1px solid var(--bd)", background: "var(--card-bg)",
            fontSize: "0.875rem", color: "var(--text-primary)", outline: "none",
          }}
        />
        <PlanGate plan={plan} feature="Export CSV" desc="Upgrade to Premium to export student data.">
          <button style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--bd)", background: plan === "premium" ? "transparent" : "#f1f5f9", cursor: plan === "premium" ? "pointer" : "not-allowed", fontSize: "0.8rem", fontWeight: 600, color: plan === "premium" ? "var(--accent)" : "#94a3b8" }}>
            📥 Export CSV
          </button>
        </PlanGate>
        {plan === "premium" && selectedIds.length > 0 && (
          <div style={{ display: "flex", gap: "6px" }}>
            <button style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #bbf7d0", background: "#f0fdf4", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "#15803d" }}>
              ✓ Activate ({selectedIds.length})
            </button>
            <button style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "#b91c1c" }}>
              ✗ Deactivate ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {plan === "basic" && (
        <div style={{ background: "#eff6ff", borderRadius: "8px", padding: "10px 14px", fontSize: "0.75rem", color: "#1e40af" }}>
          👁️ <strong>View-only mode.</strong> Upgrade to Premium for bulk actions, card assignment, and CSV export.
        </div>
      )}

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--bd)", background: "#f8fafc" }}>
              {plan === "premium" && <th style={{ padding: "10px 14px", width: "32px" }}></th>}
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Student</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Class</th>
              <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Card Status</th>
              {plan === "premium" && <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Parent Profile</th>}
              {plan === "premium" && <th style={{ padding: "10px 14px", textAlign: "right", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--bd)" : "none" }}>
                {plan === "premium" && (
                  <td style={{ padding: "10px 14px" }}>
                    <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelect(s.id)} />
                  </td>
                )}
                <td style={{ padding: "10px 14px", fontSize: "0.875rem", fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: "10px 14px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{s.class}</td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge
                    label={s.cardStatus}
                    bg={s.cardStatus === "ACTIVE" ? "#f0fdf4" : s.cardStatus === "ISSUED" ? "#eff6ff" : "#f8fafc"}
                    color={s.cardStatus === "ACTIVE" ? "#15803d" : s.cardStatus === "ISSUED" ? "#1d4ed8" : "#64748b"}
                  />
                </td>
                {plan === "premium" && (
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: "0.8rem" }}>{s.parentComplete ? "✅ Complete" : "⏳ Incomplete"}</span>
                  </td>
                )}
                {plan === "premium" && (
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <button style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "5px", border: "1px solid var(--bd)", background: "transparent", cursor: "pointer", fontWeight: 600 }}>
                      Assign Card
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Scan Logs Tab ────────────────────────────────────────────────────────────
const ScanLogsTab = ({ plan }) => {
  const [typeFilter, setTypeFilter] = useState("ALL");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--bd)", background: "var(--card-bg)", fontSize: "0.875rem", cursor: "pointer" }}
        >
          <option value="ALL">All types</option>
          <option value="NORMAL">Normal</option>
          <option value="EMERGENCY">Emergency</option>
        </select>
        <PlanGate plan={plan} feature="Advanced Filters" desc="Filter by student, date range, and scan type with Premium.">
          <input
            disabled={plan === "basic"}
            placeholder="🔍 Filter by student..."
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--bd)", background: plan === "basic" ? "#f8fafc" : "var(--card-bg)", fontSize: "0.875rem", color: plan === "basic" ? "#94a3b8" : "var(--text-primary)", cursor: plan === "basic" ? "not-allowed" : "text", outline: "none" }}
          />
        </PlanGate>
        {plan === "premium" && (
          <>
            <input type="date" style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--bd)", background: "var(--card-bg)", fontSize: "0.875rem", cursor: "pointer" }} />
            <button style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--bd)", background: "transparent", fontSize: "0.8rem", fontWeight: 600, color: "#0ea5e9", cursor: "pointer" }}>
              📍 Location View
            </button>
          </>
        )}
      </div>

      {plan === "basic" && (
        <div style={{ background: "#eff6ff", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "#1e40af" }}>📅 Showing last 7 days only</span>
          <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>Upgrade for 12-month history + location tracking →</span>
        </div>
      )}

      <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--bd)", background: "#f8fafc" }}>
              {["Student", "Time", "Status", "Type", ...(plan === "premium" ? ["Location"] : [])].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RECENT_SCANS.filter(s => typeFilter === "ALL" || s.type === typeFilter).map((s, i, arr) => (
              <tr key={s.id} style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--bd)" : "none" }}>
                <td style={{ padding: "10px 14px", fontSize: "0.875rem", fontWeight: 600 }}>{s.student_name}</td>
                <td style={{ padding: "10px 14px", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{s.time}</td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge label={s.status} bg={s.status === "SUCCESS" ? "#f0fdf4" : "#fef2f2"} color={s.status === "SUCCESS" ? "#15803d" : "#b91c1c"} />
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge label={s.type} bg={s.type === "EMERGENCY" ? "#fef9c3" : "#f1f5f9"} color={s.type === "EMERGENCY" ? "#854d0e" : "#475569"} />
                </td>
                {plan === "premium" && (
                  <td style={{ padding: "10px 14px", fontSize: "0.8rem", color: "#0ea5e9" }}>📍 Main Gate</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Anomalies Tab ─────────────────────────────────────────────────────────────
const AnomaliesTab = ({ plan }) => {
  const [resolvedIds, setResolvedIds] = useState([]);
  const [notes, setNotes] = useState({});
  const [noteOpen, setNoteOpen] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {plan === "basic" && (
        <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "8px", padding: "12px 16px", fontSize: "0.8125rem", color: "#3730a3" }}>
          <strong>👁️ Awareness only.</strong> You can see anomalies but cannot resolve, add notes, or mark false alerts.{" "}
          <span style={{ color: "#1d4ed8", fontWeight: 700, cursor: "pointer" }}>Upgrade for full anomaly management →</span>
        </div>
      )}
      {MOCK_ANOMALIES.map(a => {
        const resolved = resolvedIds.includes(a.id);
        return (
          <div key={a.id} style={{
            background: "var(--card-bg)", border: `1px solid ${resolved ? "#bbf7d0" : "var(--bd)"}`,
            borderRadius: "12px", padding: "16px 18px", opacity: resolved ? 0.6 : 1,
            transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
                background: plan === "premium" && a.source === "AI" ? "#eef2ff" : "#fef2f2",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px",
              }}>{plan === "premium" && a.source === "AI" ? "🤖" : "⚠️"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{humanize(a.type)}</span>
                  <Badge label={a.severity} bg={a.severity === "HIGH" ? "#fef2f2" : "#fffbeb"} color={a.severity === "HIGH" ? "#b91c1c" : "#b45309"} />
                  {plan === "premium" && a.source === "AI" && <Badge label="AI Detected" bg="#eef2ff" color="#4338ca" />}
                  {resolved && <Badge label="Resolved" bg="#f0fdf4" color="#15803d" />}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Student: <strong style={{ color: "var(--text-secondary)" }}>{a.student_name}</strong> · {relTime(a.created_at)}
                </div>
                {notes[a.id] && (
                  <div style={{ marginTop: "8px", padding: "8px 10px", background: "#f8fafc", borderRadius: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", border: "1px solid var(--bd)" }}>
                    📝 {notes[a.id]}
                  </div>
                )}
                {noteOpen === a.id && (
                  <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
                    <input
                      placeholder="Add internal note..."
                      style={{ flex: 1, padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--bd)", background: "var(--card-bg)", fontSize: "0.8rem" }}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          setNotes(n => ({ ...n, [a.id]: e.target.value }));
                          setNoteOpen(null);
                        }
                      }}
                    />
                    <button onClick={() => setNoteOpen(null)} style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--bd)", background: "transparent", cursor: "pointer", fontSize: "0.8rem" }}>Cancel</button>
                  </div>
                )}
              </div>
              {plan === "premium" && !resolved && (
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button onClick={() => setNoteOpen(a.id)} style={{ padding: "5px 12px", borderRadius: "7px", border: "1px solid var(--bd)", background: "transparent", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
                    📝 Note
                  </button>
                  <button style={{ padding: "5px 12px", borderRadius: "7px", border: "1px solid #fde68a", background: "#fffbeb", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: "#92400e" }}>
                    🚫 False Alert
                  </button>
                  <button onClick={() => setResolvedIds(p => [...p, a.id])} style={{ padding: "5px 12px", borderRadius: "7px", border: "1px solid #bbf7d0", background: "#f0fdf4", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: "#15803d" }}>
                    ✓ Resolve
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Notifications Tab ─────────────────────────────────────────────────────────
const NotificationsTab = ({ plan }) => {
  const NOTIFS = [
    { id: 1, text: "Token expiry alert: 23 cards expiring in 30 days", time: "2h ago", type: "warning" },
    { id: 2, text: "New anomaly detected: Duplicate scan for Rahul Sharma", time: "3h ago", type: "danger" },
    { id: 3, text: "Monthly scan report is ready", time: "1d ago", type: "info" },
    { id: 4, text: "Parent profile incomplete: Arjun Singh's parent hasn't completed registration", time: "2d ago", type: "warning" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {plan === "basic" && (
        <div style={{ background: "#eff6ff", borderRadius: "8px", padding: "10px 14px", fontSize: "0.75rem", color: "#1e40af", display: "flex", justifyContent: "space-between" }}>
          <span>👁️ Read-only. Upgrade to send broadcast alerts to parents.</span>
          <span style={{ fontWeight: 700, cursor: "pointer" }}>Upgrade →</span>
        </div>
      )}
      {NOTIFS.map(n => (
        <div key={n.id} style={{
          background: "var(--card-bg)", border: "1px solid var(--bd)",
          borderRadius: "10px", padding: "14px 16px",
          borderLeft: `4px solid ${n.type === "danger" ? "#ef4444" : n.type === "warning" ? "#f59e0b" : "#0ea5e9"}`,
        }}>
          <div style={{ fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "4px" }}>{n.text}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{n.time}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Parent Requests Tab (Premium only) ────────────────────────────────────────
const ParentRequestsTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {MOCK_PENDING_REQUESTS.map(r => (
      <div key={r.id} style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "16px 18px", display: "flex", gap: "14px", alignItems: "center" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0 }}>👨‍👩‍👧</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{r.student_name}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.parent_name} · {humanize(r.type)} · {relTime(r.created_at)}</div>
        </div>
        <Badge label="PENDING" bg="#fffbeb" color="#b45309" />
        <div style={{ display: "flex", gap: "6px" }}>
          <button style={{ padding: "6px 14px", borderRadius: "7px", border: "1px solid #bbf7d0", background: "#f0fdf4", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "#15803d" }}>✓ Approve</button>
          <button style={{ padding: "6px 14px", borderRadius: "7px", border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "#b91c1c" }}>✗ Reject</button>
        </div>
      </div>
    ))}
  </div>
);

// ─── Broadcast Tab (Premium only) ─────────────────────────────────────────────
const BroadcastTab = () => {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ background: "#fefce8", border: "1px solid #fde047", borderRadius: "10px", padding: "12px 16px", fontSize: "0.8125rem", color: "#713f12" }}>
        📣 Send an alert or announcement to <strong>all parents</strong> of your school instantly.
      </div>
      {sent ? (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#15803d" }}>Broadcast sent successfully!</div>
          <div style={{ fontSize: "0.8rem", color: "#16a34a", marginTop: "4px" }}>All parents have been notified.</div>
          <button onClick={() => { setSent(false); setMsg(""); }} style={{ marginTop: "14px", padding: "8px 18px", borderRadius: "8px", border: "1px solid #86efac", background: "transparent", cursor: "pointer", fontWeight: 600, color: "#15803d" }}>Send another</button>
        </div>
      ) : (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Alert Type</label>
            <select style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid var(--bd)", background: "var(--card-bg)", fontSize: "0.875rem" }}>
              <option>🚨 Emergency Alert</option>
              <option>📢 School Announcement</option>
              <option>ℹ️ General Information</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>Message</label>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Type your message to all parents..."
              rows={4}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--bd)", background: "var(--card-bg)", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={() => msg.trim() && setSent(true)}
            style={{ padding: "11px", borderRadius: "8px", border: "none", background: msg.trim() ? "#1d4ed8" : "#e2e8f0", color: msg.trim() ? "#fff" : "#94a3b8", fontSize: "0.875rem", fontWeight: 700, cursor: msg.trim() ? "pointer" : "not-allowed" }}
          >
            📣 Send to all parents ({MOCK_STUDENTS.length * 2} recipients)
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Card Operations Tab (Premium only) ────────────────────────────────────────
const CardOpsTab = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
    {[
      { icon: "🪪", title: "Bulk Card Request", desc: "Request new cards for multiple students at once.", action: "Request Cards" },
      { icon: "🔄", title: "Bulk Reissue", desc: "Reissue lost or damaged cards in bulk.", action: "Reissue Cards" },
      { icon: "📄", title: "Download Card PDFs", desc: "Generate and download card PDFs for printing.", action: "Generate PDFs" },
      { icon: "📦", title: "Track Dispatch Status", desc: "Track the print and delivery status of cards.", action: "View Status" },
    ].map(op => (
      <div key={op.title} style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px" }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>{op.icon}</div>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "6px" }}>{op.title}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "16px" }}>{op.desc}</div>
        <button style={{ padding: "8px 18px", borderRadius: "8px", border: "1px solid var(--bd)", background: "transparent", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "var(--accent)" }}>
          {op.action} →
        </button>
      </div>
    ))}
  </div>
);

// ─── Reports Tab (Premium only) ────────────────────────────────────────────────
const ReportsTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "12px 16px", fontSize: "0.8125rem", color: "#15803d" }}>
      📅 Scheduled reports are active — monthly summary sent every 1st of the month.
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
      {[
        { icon: "📊", title: "Scan Summary", desc: "Monthly scan activity report with trends.", last: "Apr 1, 2025" },
        { icon: "🚨", title: "Anomaly Report", desc: "All anomalies detected and resolution status.", last: "Apr 1, 2025" },
        { icon: "👨‍👩‍👧", title: "Parent Engagement", desc: "Profile completion and engagement stats.", last: "Apr 1, 2025" },
      ].map(r => (
        <div key={r.title} style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>{r.icon}</div>
          <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "4px" }}>{r.title}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "12px" }}>{r.desc}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "10px" }}>Last generated: {r.last}</div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button style={{ flex: 1, padding: "7px", borderRadius: "7px", border: "1px solid var(--bd)", background: "transparent", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)" }}>📥 PDF</button>
            <button style={{ flex: 1, padding: "7px", borderRadius: "7px", border: "1px solid var(--bd)", background: "transparent", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)" }}>📊 Excel</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Safety Score Tab (Premium only) ──────────────────────────────────────────
const SafetyScoreTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px" }}>
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "28px", textAlign: "center" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "16px" }}>Overall Safety Score</div>
        <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 16px" }}>
          <svg viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)", width: "120px", height: "120px" }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 50 * SAFETY_SCORE.score / 100} ${2 * Math.PI * 50}`}
              strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#b45309" }}>{SAFETY_SCORE.score}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>/100</div>
          </div>
        </div>
        <Badge label="Good Standing" bg="#fffbeb" color="#92400e" />
      </div>
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "18px" }}>Score Breakdown</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {SAFETY_SCORE.breakdown.map(item => (
            <div key={item.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: item.val >= 80 ? "#15803d" : item.val >= 60 ? "#b45309" : "#b91c1c" }}>{item.val}%</span>
              </div>
              <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${item.val}%`, background: item.val >= 80 ? "#10b981" : item.val >= 60 ? "#f59e0b" : "#ef4444", borderRadius: "3px", transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--bd)", borderRadius: "12px", padding: "22px" }}>
      <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "14px" }}>🏆 School Leaderboard (District)</div>
      {[
        { rank: 1, name: "Delhi Public School", score: 94 },
        { rank: 2, name: "St. Xavier's School", score: 89 },
        { rank: 3, name: "Your School", score: 78, isYou: true },
        { rank: 4, name: "Modern High School", score: 71 },
      ].map(s => (
        <div key={s.rank} style={{
          display: "flex", alignItems: "center", gap: "12px", padding: "10px 0",
          borderBottom: "1px solid var(--bd)",
          background: s.isYou ? "#fffbeb" : "transparent",
          marginLeft: s.isYou ? "-8px" : undefined, marginRight: s.isYou ? "-8px" : undefined,
          padding: s.isYou ? "10px 8px" : "10px 0",
          borderRadius: s.isYou ? "8px" : 0,
        }}>
          <div style={{ width: "28px", fontWeight: 700, fontSize: "1rem", color: s.rank === 1 ? "#b45309" : "var(--text-muted)", textAlign: "center" }}>
            {s.rank === 1 ? "🥇" : s.rank === 2 ? "🥈" : s.rank === 3 ? "🥉" : `#${s.rank}`}
          </div>
          <div style={{ flex: 1, fontWeight: s.isYou ? 700 : 400, fontSize: "0.875rem" }}>
            {s.name}{s.isYou && " ← You"}
          </div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: s.score >= 80 ? "#15803d" : s.score >= 60 ? "#b45309" : "#b91c1c" }}>{s.score}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
// ─── Upgrade Modal ────────────────────────────────────────────────────────────
const UpgradeModal = ({ onClose, onConfirm }) => {
  const features = [
    { icon: "🤖", label: "AI anomaly detection" },
    { icon: "📣", label: "Broadcast alerts to all parents" },
    { icon: "👨‍👩‍👧", label: "Parent engagement automation" },
    { icon: "📊", label: "12-month scan history & trends" },
    { icon: "🔄", label: "Bulk card operations & CSV export" },
    { icon: "📍", label: "Location tracking on scans" },
    { icon: "📅", label: "Scheduled PDF / Excel reports" },
    { icon: "🏆", label: "Safety score & district leaderboard" },
  ];
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "16px", padding: "36px",
          maxWidth: "480px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        {/* close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", lineHeight: 1, color: "#94a3b8",
          }}
        >×</button>

        {/* icon */}
        <div style={{
          width: "56px", height: "56px", borderRadius: "14px",
          background: "#FFF8E7", border: "1.5px solid #F0C060",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", marginBottom: "18px",
        }}>⭐</div>

        <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
          Upgrade to Premium
        </div>
        <div style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6, marginBottom: "22px" }}>
          Unlock AI-powered tools, unlimited capacity, and automated workflows to run your school smarter.
        </div>

        {/* feature list */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "26px" }}>
          {features.map(f => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#334155" }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "6px",
                background: "#FFF8E7", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "13px", flexShrink: 0,
              }}>{f.icon}</div>
              {f.label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onConfirm}
          style={{
            width: "100%", padding: "12px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #C97C10, #E5A020)",
            color: "#fff", fontSize: "0.9375rem", fontWeight: 700,
            cursor: "pointer", marginBottom: "10px",
          }}
        >
          ⭐ Activate Premium Now
        </button>
        <div style={{ textAlign: "center", fontSize: "0.72rem", color: "#94a3b8" }}>
          30-day money-back guarantee · Cancel anytime
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function SchoolAdminDashboard({ plan: planProp = "basic" }) {
  const [plan, setPlan] = useState(planProp);
  const [activeTab, setActiveTab] = useState("Overview");
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const limits = PLAN[plan];
  const stats = plan === "premium" ? MOCK_STATS_PREMIUM : MOCK_STATS_BASIC;
  const tabs = plan === "premium" ? TABS_PREMIUM : TABS_BASIC;

  useEffect(() => { setActiveTab("Overview"); }, [plan]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // When user confirms upgrade in modal
  const handleUpgradeConfirm = () => {
    setPlan("premium");
    setShowUpgradeModal(false);
    setBannerDismissed(false);
  };

  const openUpgrade = () => setShowUpgradeModal(true);

  const LOCKED_TABS = plan === "basic"
    ? ["Parent Requests", "Broadcast", "Card Ops", "Reports", "Safety Score"]
    : [];

  return (
    <div style={{
      "--card-bg": "#ffffff",
      "--text-primary": "#0f172a",
      "--text-secondary": "#334155",
      "--text-muted": "#64748b",
      "--bd": "#e2e8f0",
      "--accent": "#1d4ed8",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "28px",
      boxSizing: "border-box",
    }}>

      {/* ── Upgrade modal ─────────────────────────────────────────────────── */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onConfirm={handleUpgradeConfirm}
        />
      )}

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "22px" }}>
        <div>
          <h1 style={{ fontFamily: "'DM Sans', system-ui", fontSize: "1.375rem", fontWeight: 700, color: "#0f172a", margin: 0, marginBottom: "4px" }}>
            Good morning 👋
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>{today}</p>
        </div>

        {/* Top-right: plan badge + upgrade button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {plan === "premium" ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "6px 16px", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 700,
              background: "#FFF8E7", color: "#92400e", border: "1.5px solid #F0C060",
            }}>
              ⭐ Premium Active
            </span>
          ) : (
            <>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                padding: "6px 14px", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 600,
                background: "#f1f5f9", color: "#475569", border: "1.5px solid #cbd5e1",
              }}>
                🔒 Basic Plan
              </span>
              <button
                onClick={openUpgrade}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "8px 18px", borderRadius: "9px", border: "none",
                  background: "linear-gradient(135deg, #C97C10, #E5A020)",
                  color: "#fff", fontSize: "0.85rem", fontWeight: 700,
                  cursor: "pointer", boxShadow: "0 2px 8px rgba(201,124,16,0.35)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                ⭐ Upgrade to Premium
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Premium active confirmation banner ─────────────────────────────── */}
      {plan === "premium" && !bannerDismissed && (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px",
          background: "#f0fdf4", border: "1px solid #86efac",
          borderRadius: "10px", padding: "12px 18px",
        }}>
          <span style={{ fontSize: "18px" }}>✅</span>
          <div style={{ flex: 1, fontSize: "0.875rem", color: "#15803d" }}>
            <strong>Premium active</strong> — AI anomaly detection, 12-month history, unlimited capacity &amp; parent workflows are all unlocked.
          </div>
          <button onClick={() => setBannerDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", lineHeight: 1, color: "#94a3b8" }}>×</button>
        </div>
      )}

      {/* ── Basic plan inline nudge (subtle, not a big banner) ────────────── */}
      {plan === "basic" && !bannerDismissed && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: "10px", padding: "11px 16px",
        }}>
          <span style={{ fontSize: "16px" }}>⚡</span>
          <div style={{ flex: 1, fontSize: "0.8125rem", color: "#1e40af" }}>
            <strong>You're on the Basic plan.</strong> Upgrade to unlock AI anomaly detection, broadcast alerts, 12-month scan history and more.
          </div>
          <button
            onClick={openUpgrade}
            style={{
              padding: "5px 14px", borderRadius: "7px", border: "none",
              background: "#1d4ed8", color: "#fff", fontSize: "0.78rem",
              fontWeight: 700, cursor: "pointer", flexShrink: 0,
            }}
          >See what's included →</button>
          <button onClick={() => setBannerDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", lineHeight: 1, color: "#93c5fd" }}>×</button>
        </div>
      )}

      {/* ── Tab navigation ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "22px", background: "#fff", borderRadius: "10px", padding: "5px", border: "1px solid #e2e8f0", overflowX: "auto" }}>
        {tabs.map(tab => {
          const locked = LOCKED_TABS.includes(tab);
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                if (!locked) setActiveTab(tab);
                else openUpgrade();
              }}
              style={{
                padding: "7px 14px", borderRadius: "7px", border: "none",
                background: active ? "#1d4ed8" : "transparent",
                color: active ? "#fff" : locked ? "#94a3b8" : "#475569",
                fontSize: "0.8rem", fontWeight: active ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {locked && "🔒 "}{tab}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ────────────────────────────────────────────────────── */}
      {activeTab === "Overview" && <OverviewTab plan={plan} limits={limits} stats={stats} onUpgrade={openUpgrade} />}
      {activeTab === "Students" && <StudentsTab plan={plan} />}
      {activeTab === "Scan Logs" && <ScanLogsTab plan={plan} />}
      {activeTab === "Anomalies" && <AnomaliesTab plan={plan} />}
      {activeTab === "Notifications" && <NotificationsTab plan={plan} />}
      {activeTab === "Parent Requests" && plan === "premium" && <ParentRequestsTab />}
      {activeTab === "Broadcast" && plan === "premium" && <BroadcastTab />}
      {activeTab === "Card Ops" && plan === "premium" && <CardOpsTab />}
      {activeTab === "Reports" && plan === "premium" && <ReportsTab />}
      {activeTab === "Safety Score" && plan === "premium" && <SafetyScoreTab />}
    </div>
  );
}