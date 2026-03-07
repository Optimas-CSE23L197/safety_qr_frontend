import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const ChevronDownIcon = ({ size = 14 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const ChevronsLeftIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);
const ChevronsRightIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);
const SortIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);
const SchoolBuildingIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);
const PushIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
  </svg>
);
const EmailIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const SmsIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CodeIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1,  recipient: "Rahul Sharma (Student)",  school: "Greenwood High",      type: "SCAN_ALERT",    channel: "PUSH",  status: "SENT",     sentAt: "2026-03-07 10:30:15 AM", error: null,                          payload: { token: "tok_abc", scan_result: "SUCCESS" } },
  { id: 2,  recipient: "Fatima Khan (Student)",   school: "Greenwood High",      type: "SCAN_ALERT",    channel: "PUSH",  status: "FAILED",   sentAt: "2026-03-07 10:28:03 AM", error: '"Parent device token invalid"', payload: { token: "tok_def", error: "invalid_token" } },
  { id: 3,  recipient: "Central Public School",   school: "School",              type: "BILLING_ALERT", channel: "EMAIL", status: "SENT",     sentAt: "2026-03-07 09:15:22 AM", error: null,                          payload: { amount: 12999, due_date: "2026-04-01" } },
  { id: 4,  recipient: "Akash Gupta (Student)",   school: "Central Public School",type: "SCAN_ANOMALY", channel: "SMS",   status: "QUEUED",   sentAt: "2026-03-07 11:45:00 AM", error: null,                          payload: { anomaly_type: "rapid_scan", count: 5 } },
  { id: 5,  recipient: "Priya Das (Student)",     school: "Greenwood High",      type: "CARD_REPLACED", channel: "EMAIL", status: "SENT",     sentAt: "2026-03-06 04:30:10 PM", error: null,                          payload: { old_card: "CRD-001", new_card: "CRD-002" } },
  { id: 6,  recipient: "Arun Mehta (Student)",    school: "DPS Noida",           type: "CARD_EXPIRING", channel: "PUSH",  status: "SENT",     sentAt: "2026-03-06 02:10:00 PM", error: null,                          payload: { expires_in_days: 7 } },
  { id: 7,  recipient: "Sunita Roy (Student)",    school: "Ryan International",  type: "SCAN_ALERT",    channel: "SMS",   status: "FAILED",   sentAt: "2026-03-06 01:05:44 PM", error: '"SMS gateway timeout"',        payload: { token: "tok_ghi" } },
  { id: 8,  recipient: "Vikram Nair (Student)",   school: "Kendriya Vidyalaya",  type: "CARD_REVOKED",  channel: "EMAIL", status: "SENT",     sentAt: "2026-03-06 11:22:30 AM", error: null,                          payload: { reason: "lost" } },
  { id: 9,  recipient: "Meena Patel (Student)",   school: "Amity School",        type: "SCAN_ANOMALY",  channel: "PUSH",  status: "SUPPRESSED",sentAt: "2026-03-05 08:44:10 AM", error: null,                         payload: { suppressed_reason: "cooldown" } },
  { id: 10, recipient: "Deepak Sharma (Student)", school: "Greenwood High",      type: "BILLING_ALERT", channel: "EMAIL", status: "QUEUED",   sentAt: "2026-03-05 07:00:00 AM", error: null,                          payload: { amount: 5999 } },
  { id: 11, recipient: "Kavya Singh (Student)",   school: "DPS Noida",           type: "SCAN_ALERT",    channel: "PUSH",  status: "SENT",     sentAt: "2026-03-04 03:15:00 PM", error: null,                          payload: { token: "tok_jkl" } },
  { id: 12, recipient: "Ravi Kumar (Student)",    school: "Central Public School",type: "CARD_REPLACED", channel: "SMS",  status: "FAILED",   sentAt: "2026-03-04 12:50:00 PM", error: '"Number unreachable"',         payload: { old_card: "CRD-003" } },
];

const SCHOOLS  = ["All Schools", "Greenwood High", "DPS Noida", "Ryan International", "Kendriya Vidyalaya", "Amity School", "Central Public School"];
const TYPES    = ["All Types",   "SCAN_ALERT", "SCAN_ANOMALY", "BILLING_ALERT", "CARD_EXPIRING", "CARD_REVOKED", "CARD_REPLACED"];
const CHANNELS = ["All Channels","PUSH", "EMAIL", "SMS"];
const STATUSES = ["All Status",  "SENT", "FAILED", "QUEUED", "SUPPRESSED"];
const DATE_RANGES = ["Last 30 Days", "Last 7 Days", "Last 24h", "This Month", "Custom"];
const PER_PAGE_OPTS = [10, 25, 50];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    SENT:       { bg: "var(--color-success-100)", color: "var(--color-success-700)" },
    FAILED:     { bg: "var(--color-danger-100)",  color: "var(--color-danger-700)"  },
    QUEUED:     { bg: "var(--color-warning-100)", color: "var(--color-warning-700)" },
    SUPPRESSED: { bg: "var(--color-slate-100)",   color: "var(--color-slate-500)"   },
  };
  const s = map[status] || map.SUPPRESSED;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: "0.6875rem", fontWeight: 600,
      padding: "3px 10px", borderRadius: 9999,
      display: "inline-block",
    }}>
      {status}
    </span>
  );
};

// ─── Channel Cell ─────────────────────────────────────────────────────────────
const ChannelCell = ({ channel }) => {
  const icons = { PUSH: <PushIcon />, EMAIL: <EmailIcon />, SMS: <SmsIcon /> };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--text-secondary)", fontSize: "0.8125rem" }}>
      <span style={{ color: "var(--text-muted)" }}>{icons[channel]}</span>
      {channel.charAt(0) + channel.slice(1).toLowerCase()}
    </span>
  );
};

// ─── Dropdown Select ─────────────────────────────────────────────────────────
const DropSelect = ({ value, options, onChange, width = 160 }) => (
  <div style={{ position: "relative", width }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", height: 34, appearance: "none", WebkitAppearance: "none",
        border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)",
        fontSize: "0.8125rem", color: "var(--text-secondary)",
        fontFamily: "var(--font-body)", background: "#fff",
        padding: "0 30px 0 10px", outline: "none", cursor: "pointer",
      }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <span style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
      <ChevronDownIcon size={12} />
    </span>
  </div>
);

// ─── Payload Modal ────────────────────────────────────────────────────────────
const PayloadModal = ({ item, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", width: 480, boxShadow: "var(--shadow-modal)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", background: "var(--color-brand-50)", color: "var(--color-brand-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CodeIcon />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.875rem" }}>Notification Payload</p>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0 }}>{item.recipient} · {item.type}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }}>
          <XIcon />
        </button>
      </div>
      {/* Body */}
      <div style={{ padding: "1.25rem" }}>
        {item.error && (
          <div style={{ background: "var(--color-danger-50)", border: "1px solid var(--color-danger-100)", borderRadius: "var(--radius-lg)", padding: "8px 12px", marginBottom: 12 }}>
            <p style={{ fontSize: "0.75rem", color: "var(--color-danger-700)", margin: 0, fontWeight: 500 }}>Error: {item.error}</p>
          </div>
        )}
        <pre style={{
          background: "var(--color-slate-900)", color: "#e2e8f0",
          borderRadius: "var(--radius-lg)", padding: "1rem",
          fontSize: "0.75rem", fontFamily: "var(--font-mono)",
          lineHeight: 1.7, overflowX: "auto", margin: 0,
          maxHeight: 300,
        }}>
          {JSON.stringify(item.payload, null, 2)}
        </pre>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>Channel: <strong style={{ color: "var(--text-secondary)" }}>{item.channel}</strong></span>
          <span style={{ color: "var(--color-slate-300)" }}>·</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>Sent: <strong style={{ color: "var(--text-secondary)" }}>{item.sentAt}</strong></span>
          <span style={{ color: "var(--color-slate-300)" }}>·</span>
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "7px 16px", background: "var(--color-slate-800)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Notifications() {
  const [school,    setSchool]    = useState("All Schools");
  const [type,      setType]      = useState("All Types");
  const [channel,   setChannel]   = useState("All Channels");
  const [status,    setStatus]    = useState("All Status");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [perPage,   setPerPage]   = useState(10);
  const [page,      setPage]      = useState(1);
  const [payload,   setPayload]   = useState(null);

  // ── Filtered data ──
  const filtered = NOTIFICATIONS.filter(n => {
    const matchSchool  = school  === "All Schools"  || n.school  === school  || (school !== "All Schools" && n.school.toLowerCase().includes(school.toLowerCase()));
    const matchType    = type    === "All Types"    || n.type    === type;
    const matchChannel = channel === "All Channels" || n.channel === channel;
    const matchStatus  = status  === "All Status"   || n.status  === status;
    return matchSchool && matchType && matchChannel && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows       = filtered.slice((page - 1) * perPage, page * perPage);

  // ── Stats ──
  const totalNotifs    = "450.2K";
  const avgDelivery    = "98.7%";
  const totalFailed    = "5.8K";

  // ── Style helpers ──
  const card = { background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-card)" };
  const thS  = {
    textAlign: "left", padding: "11px 14px",
    fontSize: "0.6875rem", fontWeight: 600,
    color: "var(--color-slate-400)", textTransform: "uppercase",
    letterSpacing: "0.06em", borderBottom: "1px solid var(--border-default)",
    whiteSpace: "nowrap", background: "var(--color-slate-50)",
  };
  const tdS = {
    padding: "11px 14px", fontSize: "0.8125rem",
    color: "var(--text-secondary)", verticalAlign: "middle",
    borderBottom: "1px solid var(--color-slate-100)",
  };

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      {/* ── Top Header ── */}
      <div style={{
        background: "var(--bg-header)", borderBottom: "1px solid var(--border-default)",
        height: "var(--header-height)", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 2rem",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Notifications
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            Platform-wide delivery logs
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Date Range Selector */}
          <div style={{ position: "relative" }}>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              style={{
                height: 32, appearance: "none", WebkitAppearance: "none",
                border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)",
                fontSize: "0.8125rem", color: "var(--text-secondary)",
                fontFamily: "var(--font-body)", background: "#fff",
                padding: "0 28px 0 10px", outline: "none", cursor: "pointer",
              }}>
              {DATE_RANGES.map(d => <option key={d}>{d}</option>)}
            </select>
            <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
              <ChevronDownIcon size={11} />
            </span>
          </div>

          <div style={{ width: 1, height: 28, background: "var(--border-default)" }} />
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
            <BellIcon />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-brand-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>SA</div>
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>Super Admin</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>SUPER_ADMIN</p>
            </div>
            <ChevronDownIcon size={12} />
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }} className="animate-fadeIn">

        {/* ── Stat Cards Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }} className="stagger-children">

          {/* Total Notifications */}
          <div style={{ ...card, padding: "1.5rem 1.75rem" }} className="animate-fadeIn">
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0 0 8px", fontWeight: 500 }}>Total Notifications</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{totalNotifs}</p>
          </div>

          {/* Avg Delivery Rate */}
          <div style={{ ...card, padding: "1.5rem 1.75rem" }} className="animate-fadeIn">
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0 0 8px", fontWeight: 500 }}>Avg. Delivery Rate</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 700, color: "var(--color-success-600)", margin: 0, lineHeight: 1 }}>{avgDelivery}</p>
          </div>

          {/* Total Failed */}
          <div style={{ ...card, padding: "1.5rem 1.75rem" }} className="animate-fadeIn">
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0 0 8px", fontWeight: 500 }}>Total Failed</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 700, color: "var(--color-danger-600)", margin: 0, lineHeight: 1 }}>{totalFailed}</p>
          </div>
        </div>

        {/* ── Notification Logs Table ── */}
        <div style={card} className="animate-fadeIn">

          {/* Table Header + Filters */}
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
              Notification Logs
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <DropSelect value={school}  options={SCHOOLS}  onChange={v => { setSchool(v);  setPage(1); }} width={170} />
              <DropSelect value={type}    options={TYPES}    onChange={v => { setType(v);    setPage(1); }} width={160} />
              <DropSelect value={channel} options={CHANNELS} onChange={v => { setChannel(v); setPage(1); }} width={145} />
              <DropSelect value={status}  options={STATUSES} onChange={v => { setStatus(v);  setPage(1); }} width={140} />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {/* Recipient/Entity with sort */}
                  <th style={thS}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                      Recipient/Entity <SortIcon />
                    </span>
                  </th>
                  <th style={thS}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>Type</span>
                  </th>
                  <th style={thS}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                      Channel <SortIcon />
                    </span>
                  </th>
                  <th style={thS}>Status</th>
                  <th style={thS}>Sent At</th>
                  <th style={thS}>Error/Payload</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "3.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      No notifications match the selected filters.
                    </td>
                  </tr>
                ) : rows.map((n, i) => (
                  <tr key={n.id} style={{ background: i % 2 === 1 ? "var(--color-slate-50)" : "#fff" }}>

                    {/* Recipient/Entity */}
                    <td style={tdS}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", background: "var(--color-slate-100)", color: "var(--color-slate-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <SchoolBuildingIcon />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.8125rem" }}>{n.recipient}</p>
                          <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, display: "flex", alignItems: "center", gap: 3 }}>
                            <SchoolBuildingIcon /> {n.school}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td style={{ ...tdS, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-brand-600)", fontWeight: 500 }}>
                      {n.type}
                    </td>

                    {/* Channel */}
                    <td style={tdS}><ChannelCell channel={n.channel} /></td>

                    {/* Status */}
                    <td style={tdS}><StatusBadge status={n.status} /></td>

                    {/* Sent At */}
                    <td style={{ ...tdS, fontFamily: "var(--font-mono)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                      {n.sentAt}
                    </td>

                    {/* Error/Payload */}
                    <td style={tdS}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {n.error && (
                          <p style={{ fontSize: "0.6875rem", color: "var(--color-danger-600)", margin: 0, fontFamily: "var(--font-mono)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {n.error}
                          </p>
                        )}
                        <button
                          onClick={() => setPayload(n)}
                          style={{ background: "none", border: "none", color: "var(--color-brand-600)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, textAlign: "left", fontFamily: "var(--font-body)" }}>
                          [View Payload]
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>

            {/* Left: per page + count */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pagination:</span>
              <div style={{ position: "relative" }}>
                <select
                  value={perPage}
                  onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                  style={{ height: 28, appearance: "none", WebkitAppearance: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)", background: "#fff", padding: "0 22px 0 8px", outline: "none", cursor: "pointer" }}>
                  {PER_PAGE_OPTS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
                  <ChevronDownIcon size={10} />
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
            </div>

            {/* Right: page controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {/* First page */}
              <button onClick={() => setPage(1)} disabled={page === 1} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === 1 ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronsLeftIcon />
              </button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === 1 ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronLeftIcon />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{
                  width: 28, height: 28, borderRadius: "var(--radius-sm)",
                  border: n === page ? "none" : "1px solid var(--border-default)",
                  background: n === page ? "var(--color-brand-600)" : "transparent",
                  color: n === page ? "#fff" : "var(--text-secondary)",
                  fontSize: "0.75rem", fontWeight: n === page ? 600 : 400,
                  cursor: "pointer", fontFamily: "var(--font-body)",
                }}>{n}</button>
              ))}

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === totalPages ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}>
                <ChevronRightIcon />
              </button>
              {/* Last page */}
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === totalPages ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}>
                <ChevronsRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payload Modal ── */}
      {payload && <PayloadModal item={payload} onClose={() => setPayload(null)} />}
    </div>
  );
}