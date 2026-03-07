import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const ChevronDownIcon = ({ size = 12 }) => (
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
const MapPinIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const DeviceIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
  </svg>
);
const UserIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const SchoolIcon = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
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
const SCAN_LOGS = [
  { id: 1,  student: "Vikram Nair (Student)",    school: "Greenwood High",       scanType: "QR_SCAN",           location: "New Delhi, DL, IN", device: "iPhone 15 Pro", ip: "192.168.19.250", result: "SUCCESS",      time: "2026-03-07 10:28:03 AM", responseMs: 42,  metadata: { token_prefix: "tok_abc", scan_purpose: "entry" } },
  { id: 2,  student: "Fatima Khan (Student)",    school: "Greenwood High",       scanType: "SUCCESSFUL",        location: "New Delhi, DL, IN", device: "iPhone 15 Pro", ip: "192.168.19.258", result: "SUCCESS",      time: "2026-03-07 10:28:03 AM", responseMs: 38,  metadata: { token_prefix: "tok_def", scan_purpose: "exit" } },
  { id: 3,  student: "Vikram Nair (Student)",    school: "Greenwood High",       scanType: "UNKNOWN_SCAN",      location: "New Delhi, DL, IN", device: "Samsung S23",   ip: "192.168.19.230", result: "SUCCESS",      time: "2026-03-07 09:15:22 AM", responseMs: 55,  metadata: { token_prefix: "tok_ghi", note: "unknown device hash" } },
  { id: 4,  student: "Priya Das (Student)",      school: "Central Public School",scanType: "ANOMALY_TRIGGER",   location: "Mumbai, MH, IN",    device: "Samsung S23",   ip: "192.168.19.230", result: "ANOMALY",      time: "2026-03-06 04:30:10 AM", responseMs: 120, metadata: { anomaly_type: "rapid_scan", count: 5 } },
  { id: 5,  student: "Akash Gupta (Student)",    school: "Central Public School",scanType: "ANOMALY_TRIGGER",   location: "New Delhi, DL, IN", device: "Samsung S23",   ip: "192.168.19.230", result: "FAILED",       time: "2026-03-07 11:45:00 AM", responseMs: 210, metadata: { error: "token_revoked" } },
  { id: 6,  student: "Sunita Roy (Student)",     school: "Ryan Noida",           scanType: "QR_SCAN",           location: "New Delhi, DL, IN", device: "Samsung S23",   ip: "192.168.19.230", result: "RATE_LIMITED", time: "2026-03-07 01:05:44 AM", responseMs: 15,  metadata: { blocked_until: "2026-03-07T02:05:44Z" } },
  { id: 7,  student: "Unassigned Token",         school: "Greenwood High",       scanType: "QR_SCAN",           location: "New Delhi, DL, IN", device: "Samsung S23",   ip: "192.168.19.130", result: "RATE_LIMITED", time: "2026-03-07 11:22:30 AM", responseMs: 12,  metadata: { identifier_type: "IP" } },
  { id: 8,  student: "School User: Adm. Singh",  school: "DPS Noida",            scanType: "REGISTRATION_SCAN", location: "London, UK",        device: "FAILED",        ip: "192.168.19.230", result: "MALICIOUS",    time: "2026-03-07 10:22:57 AM", responseMs: 8,   metadata: { reason: "geo_mismatch", flag: "suspicious_ip" } },
  { id: 9,  student: "Ravi Kumar (Student)",     school: "Amity School",         scanType: "QR_SCAN",           location: "Chennai, TN, IN",   device: "Pixel 7",       ip: "192.168.19.100", result: "SUCCESS",      time: "2026-03-07 08:00:00 AM", responseMs: 44,  metadata: { token_prefix: "tok_xyz" } },
  { id: 10, student: "Deepak Sharma (Student)",  school: "Kendriya Vidyalaya",   scanType: "QR_SCAN",           location: "Lucknow, UP, IN",   device: "Redmi Note 12", ip: "192.168.19.180", result: "EXPIRED",      time: "2026-03-06 03:15:00 PM", responseMs: 33,  metadata: { expired_at: "2026-03-05T00:00:00Z" } },
  { id: 11, student: "Meena Patel (Student)",    school: "DPS Noida",            scanType: "QR_SCAN",           location: "Noida, UP, IN",     device: "iPhone 14",     ip: "192.168.19.211", result: "INVALID",      time: "2026-03-06 01:44:00 PM", responseMs: 19,  metadata: { reason: "hash_mismatch" } },
  { id: 12, student: "Kavya Singh (Student)",    school: "Ryan International",   scanType: "ANOMALY_TRIGGER",   location: "Delhi, DL, IN",     device: "Samsung S22",   ip: "192.168.19.222", result: "ANOMALY",      time: "2026-03-05 09:30:00 AM", responseMs: 95,  metadata: { anomaly_type: "location_jump" } },
];

const SCAN_RESULTS = ["All Results", "SUCCESS", "FAILED", "ANOMALY", "RATE_LIMITED", "MALICIOUS", "EXPIRED", "INVALID", "INACTIVE"];
const SCHOOLS_LIST = ["All Schools", "Greenwood High", "DPS Noida", "Ryan Noida", "Ryan International", "Central Public School", "Amity School", "Kendriya Vidyalaya"];
const PER_PAGE_OPTS = [10, 25, 50];

// ─── Result Badge ─────────────────────────────────────────────────────────────
const ResultBadge = ({ result }) => {
  const map = {
    SUCCESS:      { bg: "var(--color-success-100)", color: "var(--color-success-700)", border: "var(--color-success-100)" },
    ANOMALY:      { bg: "var(--color-warning-100)", color: "var(--color-warning-700)", border: "var(--color-warning-100)" },
    FAILED:       { bg: "var(--color-danger-100)",  color: "var(--color-danger-700)",  border: "var(--color-danger-100)"  },
    RATE_LIMITED: { bg: "var(--color-slate-200)",   color: "var(--color-slate-600)",   border: "var(--color-slate-200)"   },
    MALICIOUS:    { bg: "var(--color-danger-600)",  color: "#fff",                     border: "var(--color-danger-600)"  },
    EXPIRED:      { bg: "var(--color-slate-100)",   color: "var(--color-slate-500)",   border: "var(--color-slate-100)"   },
    INVALID:      { bg: "var(--color-danger-50)",   color: "var(--color-danger-600)",  border: "var(--color-danger-100)"  },
    INACTIVE:     { bg: "var(--color-slate-100)",   color: "var(--color-slate-400)",   border: "var(--color-slate-100)"   },
  };
  const s = map[result] || map.INVALID;
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: "0.6875rem", fontWeight: 700,
      padding: "3px 10px", borderRadius: "var(--radius-md)",
      display: "inline-block", whiteSpace: "nowrap",
      letterSpacing: "0.02em",
    }}>
      {result}
    </span>
  );
};

// ─── Metadata Modal ───────────────────────────────────────────────────────────
const MetaModal = ({ item, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", width: 480, boxShadow: "var(--shadow-modal)", overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", background: "var(--color-brand-50)", color: "var(--color-brand-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CodeIcon />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.875rem" }}>Scan Metadata</p>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0 }}>{item.student} · {item.scanType}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }}>
          <XIcon />
        </button>
      </div>
      <div style={{ padding: "1.25rem" }}>
        {/* Summary row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <ResultBadge result={item.result} />
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}>
            <DeviceIcon /> {item.device}
          </span>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{item.ip}</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>{item.responseMs}ms</span>
        </div>
        <pre style={{
          background: "var(--color-slate-900)", color: "#e2e8f0",
          borderRadius: "var(--radius-lg)", padding: "1rem",
          fontSize: "0.75rem", fontFamily: "var(--font-mono)",
          lineHeight: 1.7, overflowX: "auto", margin: 0, maxHeight: 280,
        }}>
          {JSON.stringify({ ...item.metadata, scan_time: item.time, location: item.location }, null, 2)}
        </pre>
      </div>
      <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "7px 16px", background: "var(--color-slate-800)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const DropSelect = ({ value, options, onChange, width = 150, placeholder }) => (
  <div style={{ position: "relative", width }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", height: 32, appearance: "none", WebkitAppearance: "none",
        border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)",
        fontSize: "0.8125rem", color: value === options[0] ? "var(--text-muted)" : "var(--text-secondary)",
        fontFamily: "var(--font-body)", background: "#fff",
        padding: "0 26px 0 10px", outline: "none", cursor: "pointer",
      }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <span style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
      <ChevronDownIcon size={11} />
    </span>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ScanLogs() {
  const [search,      setSearch]      = useState("");
  const [schoolFilter,setSchoolFilter]= useState("All Schools");
  const [resultFilter,setResultFilter]= useState("All Results");
  const [perPage,     setPerPage]     = useState(10);
  const [page,        setPage]        = useState(1);
  const [metaItem,    setMetaItem]    = useState(null);

  // ── Filtered ──
  const filtered = SCAN_LOGS.filter(s => {
    const q = search.toLowerCase();
    const matchQ      = !q || s.student.toLowerCase().includes(q) || s.ip.includes(q) || s.school.toLowerCase().includes(q) || s.scanType.toLowerCase().includes(q);
    const matchSchool = schoolFilter === "All Schools" || s.school === schoolFilter;
    const matchResult = resultFilter === "All Results" || s.result === resultFilter;
    return matchQ && matchSchool && matchResult;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows       = filtered.slice((page - 1) * perPage, page * perPage);
  const totalCount = 210; // platform-wide total

  // ── Style helpers ──
  const card = { background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-card)" };
  const thS  = {
    textAlign: "left", padding: "10px 14px",
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
        {/* Left: title */}
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Scan Logs
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            Platform Control Center
          </p>
        </div>

        {/* Right: search + filters + bell + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex" }}>
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search"
              style={{
                paddingLeft: 28, paddingRight: 10, height: 32,
                border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)",
                fontSize: "0.8125rem", color: "var(--text-primary)",
                fontFamily: "var(--font-body)", background: "#fff",
                outline: "none", width: 180,
              }}
            />
          </div>

          {/* Schools filter */}
          <DropSelect
            value={schoolFilter}
            options={SCHOOLS_LIST}
            onChange={v => { setSchoolFilter(v); setPage(1); }}
            width={140}
          />

          {/* Scan Result filter */}
          <DropSelect
            value={resultFilter}
            options={SCAN_RESULTS}
            onChange={v => { setResultFilter(v); setPage(1); }}
            width={150}
          />

          <div style={{ width: 1, height: 24, background: "var(--border-default)" }} />
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
            <BellIcon />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--color-brand-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700 }}>SA</div>
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>Super Admin</p>
              <p style={{ fontSize: "0.625rem", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>SUPER_ADMIN</p>
            </div>
            <ChevronDownIcon size={11} />
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div style={{ padding: "1.5rem 2rem" }} className="animate-fadeIn">
        <div style={card}>

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thS}>Student/User</th>
                  <th style={thS}>Scan Type</th>
                  <th style={thS}>Location</th>
                  <th style={thS}>Device &amp; IP</th>
                  <th style={{ ...thS, minWidth: 130 }}>Scan Result (Status)</th>
                  <th style={thS}>Time</th>
                  <th style={thS}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "3.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      No scan logs match your filters.
                    </td>
                  </tr>
                ) : rows.map((s, i) => (
                  <tr key={s.id} style={{ background: i % 2 === 1 ? "var(--color-slate-50)" : "#fff" }}>

                    {/* Student/User */}
                    <td style={tdS}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: "var(--radius-md)", flexShrink: 0,
                          background: s.result === "MALICIOUS" ? "var(--color-danger-100)" : "var(--color-slate-100)",
                          color: s.result === "MALICIOUS" ? "var(--color-danger-600)" : "var(--color-slate-500)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <UserIcon />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.8125rem" }}>
                            {s.student}
                          </p>
                          <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, display: "flex", alignItems: "center", gap: 3 }}>
                            <SchoolIcon /> {s.school}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Scan Type */}
                    <td style={{ ...tdS, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-brand-600)", fontWeight: 500 }}>
                      {s.scanType}
                    </td>

                    {/* Location */}
                    <td style={tdS}>
                      <span style={{ display: "flex", alignItems: "flex-start", gap: 4, color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                        <span style={{ color: "var(--text-muted)", marginTop: 1, flexShrink: 0 }}><MapPinIcon /></span>
                        <span>{s.location}</span>
                      </span>
                    </td>

                    {/* Device & IP */}
                    <td style={tdS}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--text-muted)" }}><DeviceIcon /></span>
                          {s.device}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                          {s.ip}
                        </span>
                      </div>
                    </td>

                    {/* Scan Result */}
                    <td style={tdS}>
                      <ResultBadge result={s.result} />
                    </td>

                    {/* Time */}
                    <td style={{ ...tdS, fontFamily: "var(--font-mono)", fontSize: "0.6875rem", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                      {s.time}
                    </td>

                    {/* Actions */}
                    <td style={tdS}>
                      <button
                        onClick={() => setMetaItem(s)}
                        style={{
                          background: "none", border: "none",
                          color: "var(--color-brand-600)",
                          fontSize: "0.75rem", fontWeight: 600,
                          cursor: "pointer", padding: 0,
                          fontFamily: "var(--font-body)",
                          whiteSpace: "nowrap",
                        }}>
                        {s.result === "RATE_LIMITED" ? "[View Payload]" : "[View Metadata]"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>

            {/* Left: per page + count */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pagination:</span>
              <div style={{ position: "relative" }}>
                <select
                  value={perPage}
                  onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                  style={{ height: 26, appearance: "none", WebkitAppearance: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)", background: "#fff", padding: "0 20px 0 7px", outline: "none", cursor: "pointer" }}>
                  {PER_PAGE_OPTS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
                  <ChevronDownIcon size={9} />
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {totalCount}
              </span>
            </div>

            {/* Right: page nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <button onClick={() => setPage(1)} disabled={page === 1} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === 1 ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronsLeftIcon />
              </button>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === 1 ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronLeftIcon />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{
                  width: 26, height: 26, borderRadius: "var(--radius-sm)",
                  border: n === page ? "none" : "1px solid var(--border-default)",
                  background: n === page ? "var(--color-brand-600)" : "transparent",
                  color: n === page ? "#fff" : "var(--text-secondary)",
                  fontSize: "0.75rem", fontWeight: n === page ? 600 : 400,
                  cursor: "pointer", fontFamily: "var(--font-body)",
                }}>{n}</button>
              ))}

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === totalPages ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}>
                <ChevronRightIcon />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === totalPages ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}>
                <ChevronsRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metadata Modal ── */}
      {metaItem && <MetaModal item={metaItem} onClose={() => setMetaItem(null)} />}
    </div>
  );
}