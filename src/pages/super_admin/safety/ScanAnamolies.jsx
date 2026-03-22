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
const ChevronDownIcon = ({ size = 11 }) => (
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
const WarningTriangleIcon = ({ size = 14, color = "var(--color-warning-600)" }) => (
  <svg width={size} height={size} fill="none" stroke={color} strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);
const LinkIcon = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ANOMALIES = [
  { id: "ANOM-9923", token: "tk_492...3525266...", student: "Vikram Nair", school: "Greenwood High", reason: "MALICIOUS_USER_AGENT", time: "2026-03-07 10:28:03 AM", resolved: false, resolvedBy: null, metadata: { user_agent: "Scrapy/2.5", ip: "192.168.19.250", token_id: "tk_4923525266abc" } },
  { id: "ANOM-9922", token: "tk_492...3525266...", student: "Fatima Khan", school: "Greenwood High", reason: "LOCATION_INCONSISTENT", time: "2026-03-07 10:28:03 AM", resolved: true, resolvedBy: "admin@sg.com", metadata: { lat: 28.61, lng: 77.21, expected: "Delhi", actual: "Mumbai" } },
  { id: "ANOM-9921", token: "tk_492...3525266...", student: "Vikram Nair", school: "Central Public", reason: "LOCATION_INCONSISTENT", time: "2026-03-07 09:15:22 AM", resolved: true, resolvedBy: "admin@sg.com", metadata: { distance_km: 1402, time_gap_mins: 12 } },
  { id: "ANOM-9920", token: "tk_492...3531266...", student: "Priya Das", school: "Central Public", reason: "SCAN_RATE_EXCEEDED", time: "2026-03-07 04:30:10 AM", resolved: false, resolvedBy: null, metadata: { scans_in_window: 14, window_mins: 5, threshold: 3 } },
  { id: "ANOM-9928", token: "tk_492...3525266...", student: "Priya Das", school: "Greenwood High", reason: "SCAN_RATE_EXCEEDED", time: "2026-03-07 04:30:10 PM", resolved: false, resolvedBy: null, metadata: { scans_in_window: 9, window_mins: 5, threshold: 3 } },
  { id: "ANOM-9927", token: "tk_492...3531266...", student: "Priya Das", school: "Adm. Singh", reason: "INVALID_REGISTRATION_ATTEMPT", time: "2026-03-07 11:22:30 AM", resolved: false, resolvedBy: null, metadata: { attempt_count: 3, nonce: "used", ip: "192.168.19.130" } },
  { id: "ANOM-9924", token: "tk_492...3531266...", student: "Arun Mehta", school: "DPS Noida", reason: "INVALID_REGISTRATION_ATTEMPT", time: "2026-03-07 02:11:04 AM", resolved: true, resolvedBy: "admin", metadata: { attempt_count: 5, nonce: "expired" } },
  { id: "ANOM-9925", token: "tk_492...3531266...", student: "Adm. Singh", school: "Adm. Singh", reason: "INVALID_REGISTRATION_ATTEMPT", time: "2026-03-07 10:52:45 AM", resolved: true, resolvedBy: "admin", metadata: { attempt_count: 2, note: "duplicate nonce" } },
  { id: "ANOM-9919", token: "tk_492...3531266...", student: "Kavya Singh", school: "Ryan International", reason: "RAPID_SCAN", time: "2026-03-06 08:10:00 AM", resolved: false, resolvedBy: null, metadata: { scans: 22, window_mins: 2 } },
  { id: "ANOM-9918", token: "tk_492...3525266...", student: "Ravi Kumar", school: "Amity School", reason: "LOCATION_INCONSISTENT", time: "2026-03-06 06:00:00 AM", resolved: true, resolvedBy: "admin", metadata: { distance_km: 800 } },
  { id: "ANOM-9917", token: "tk_492...3531266...", student: "Deepak Sharma", school: "Kendriya Vidyalaya", reason: "MALICIOUS_USER_AGENT", time: "2026-03-05 03:45:00 PM", resolved: false, resolvedBy: null, metadata: { user_agent: "python-requests/2.28" } },
  { id: "ANOM-9916", token: "tk_492...3531266...", student: "Meena Patel", school: "DPS Noida", reason: "SCAN_RATE_EXCEEDED", time: "2026-03-05 01:30:00 PM", resolved: true, resolvedBy: "admin", metadata: { scans_in_window: 7 } },
];

const RESOLVED_OPTS = ["Resolved Status", "UNRESOLVED", "RESOLVED"];
const REASON_OPTS = ["Reason", "MALICIOUS_USER_AGENT", "LOCATION_INCONSISTENT", "SCAN_RATE_EXCEEDED", "INVALID_REGISTRATION_ATTEMPT", "RAPID_SCAN"];
const PER_PAGE_OPTS = [10, 25, 50];

// ─── Details Modal ────────────────────────────────────────────────────────────
const DetailsModal = ({ item, onClose, onResolve }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", width: 500, boxShadow: "var(--shadow-modal)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "var(--radius-md)", background: "var(--color-warning-100)", color: "var(--color-warning-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldIcon />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: "var(--text-primary)", margin: 0, fontSize: "0.875rem", fontFamily: "var(--font-display)" }}>Anomaly Details</p>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, fontFamily: "var(--font-mono)" }}>{item.id}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }}>
          <XIcon />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Summary grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["Student", item.student],
            ["School", item.school],
            ["Reason", item.reason],
            ["Status", item.resolved ? "RESOLVED" : "UNRESOLVED"],
          ].map(([label, val]) => (
            <div key={label} style={{ background: "var(--color-slate-50)", border: "1px solid var(--color-slate-100)", borderRadius: "var(--radius-lg)", padding: "8px 12px" }}>
              <p style={{ fontSize: "0.625rem", fontWeight: 600, color: "var(--text-muted)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: label === "Status" ? (item.resolved ? "var(--color-success-700)" : "var(--color-warning-700)") : "var(--text-primary)", margin: 0, fontFamily: label === "Reason" ? "var(--font-mono)" : "var(--font-body)", wordBreak: "break-all" }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Token + time */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            <LinkIcon /> {item.token}
          </span>
          <span style={{ color: "var(--color-slate-300)" }}>·</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{item.time}</span>
        </div>

        {/* Metadata */}
        <div>
          <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-muted)", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Metadata</p>
          <pre style={{ background: "var(--color-slate-900)", color: "#e2e8f0", borderRadius: "var(--radius-lg)", padding: "0.875rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)", lineHeight: 1.7, overflowX: "auto", margin: 0, maxHeight: 200 }}>
            {JSON.stringify(item.metadata, null, 2)}
          </pre>
        </div>

        {item.resolvedBy && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            Resolved by <strong style={{ color: "var(--text-secondary)" }}>{item.resolvedBy}</strong>
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button onClick={onClose} style={{ padding: "7px 16px", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
          Close
        </button>
        {!item.resolved && (
          <button onClick={() => { onResolve(item.id); onClose(); }} style={{ padding: "7px 16px", background: "var(--color-success-600)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <CheckIcon /> Mark Resolved
          </button>
        )}
      </div>
    </div>
  </div>
);

// ─── Filter Pill (X-able) ─────────────────────────────────────────────────────
const FilterPill = ({ value, placeholder, options, onChange }) => {
  const isSet = value !== options[0];
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 32, appearance: "none", WebkitAppearance: "none",
          border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)",
          fontSize: "0.8125rem",
          color: isSet ? "var(--text-primary)" : "var(--text-muted)",
          fontFamily: "var(--font-body)", background: isSet ? "var(--color-slate-50)" : "#fff",
          padding: `0 ${isSet ? "52px" : "28px"} 0 12px`, outline: "none", cursor: "pointer",
          fontWeight: isSet ? 600 : 400,
          minWidth: 155,
        }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {/* chevron or X */}
      {isSet ? (
        <button
          onClick={e => { e.stopPropagation(); onChange(options[0]); }}
          style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "var(--color-slate-200)", border: "none", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", padding: 0, flexShrink: 0 }}>
          <XIcon />
        </button>
      ) : (
        <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
          <ChevronDownIcon size={11} />
        </span>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ScanAnomalies() {
  const [search, setSearch] = useState("");
  const [resolvedFilter, setResolvedFilter] = useState("Resolved Status");
  const [reasonFilter, setReasonFilter] = useState("Reason");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [detailItem, setDetailItem] = useState(null);
  const [anomalies, setAnomalies] = useState(ANOMALIES);

  const handleResolve = (id) => {
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: true, resolvedBy: "super_admin" } : a));
  };

  // ── Filtered ──
  const filtered = anomalies.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || a.id.toLowerCase().includes(q) || a.student.toLowerCase().includes(q) || a.school.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q);
    const matchResolved = resolvedFilter === "Resolved Status" || (resolvedFilter === "RESOLVED" ? a.resolved : !a.resolved);
    const matchReason = reasonFilter === "Reason" || a.reason === reasonFilter;
    return matchQ && matchResolved && matchReason;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);
  const totalCount = 210;

  // ── Styles ──
  const card = { background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-card)" };
  const thS = {
    textAlign: "left", padding: "10px 14px",
    fontSize: "0.6875rem", fontWeight: 600,
    color: "var(--color-slate-400)", textTransform: "uppercase",
    letterSpacing: "0.06em", borderBottom: "1px solid var(--border-default)",
    whiteSpace: "nowrap", background: "var(--color-slate-50)",
  };
  const tdS = {
    padding: "10px 14px", fontSize: "0.8125rem",
    color: "var(--text-secondary)", verticalAlign: "middle",
    borderBottom: "1px solid var(--color-slate-100)",
  };

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      {/* ── Page Body ── */}
      <div style={{ padding: "0rem 2rem" }} className="animate-fadeIn">
        <div style={card}>

          {/* ── Toolbar ── */}
          <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex" }}>
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search"
                style={{
                  width: "100%", paddingLeft: 28, paddingRight: 10, height: 32,
                  border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)",
                  fontSize: "0.8125rem", color: "var(--text-primary)",
                  fontFamily: "var(--font-body)", background: "#fff", outline: "none",
                }}
              />
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <FilterPill
                value={resolvedFilter}
                options={RESOLVED_OPTS}
                onChange={v => { setResolvedFilter(v); setPage(1); }}
              />
              <FilterPill
                value={reasonFilter}
                options={REASON_OPTS}
                onChange={v => { setReasonFilter(v); setPage(1); }}
              />
            </div>
          </div>

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thS}>Anomaly ID</th>
                  <th style={thS}>Token/Student</th>
                  <th style={thS}>School</th>
                  <th style={thS}>Reason</th>
                  <th style={thS}>Time</th>
                  <th style={thS}>Resolved Status</th>
                  <th style={thS}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "3.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      No anomalies match your filters.
                    </td>
                  </tr>
                ) : rows.map((a, i) => (
                  <tr
                    key={a.id}
                    style={{
                      background: !a.resolved
                        ? (i % 2 === 0 ? "rgba(254,243,199,0.25)" : "rgba(254,243,199,0.4)")
                        : (i % 2 === 1 ? "var(--color-slate-50)" : "#fff"),
                    }}
                  >
                    {/* Anomaly ID */}
                    <td style={tdS}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <WarningTriangleIcon
                          size={15}
                          color={a.resolved ? "var(--color-slate-400)" : "var(--color-warning-600)"}
                        />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {a.id}
                        </span>
                      </div>
                    </td>

                    {/* Token/Student */}
                    <td style={tdS}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                          <span style={{ color: "var(--text-muted)" }}><LinkIcon /></span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: "var(--color-brand-600)", fontWeight: 500 }}>
                            {a.token}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {a.student}
                        </p>
                      </div>
                    </td>

                    {/* School */}
                    <td style={{ ...tdS, fontSize: "0.8125rem", fontWeight: 500 }}>
                      {a.school}
                    </td>

                    {/* Reason */}
                    <td style={{ ...tdS, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-slate-700)", fontWeight: 500 }}>
                      {a.reason}
                    </td>

                    {/* Time */}
                    <td style={{ ...tdS, fontFamily: "var(--font-mono)", fontSize: "0.6875rem", whiteSpace: "nowrap" }}>
                      {a.time}
                    </td>

                    {/* Resolved Status */}
                    <td style={tdS}>
                      <span style={{
                        display: "inline-block",
                        fontSize: "0.6875rem", fontWeight: 700,
                        padding: "3px 10px", borderRadius: "var(--radius-md)",
                        background: a.resolved ? "var(--color-success-100)" : "var(--color-warning-100)",
                        color: a.resolved ? "var(--color-success-700)" : "var(--color-warning-700)",
                        border: `1px solid ${a.resolved ? "var(--color-success-100)" : "var(--color-warning-100)"}`,
                      }}>
                        {a.resolved ? "RESOLVED" : "UNRESOLVED"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={tdS}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <button
                          onClick={() => setDetailItem(a)}
                          style={{ background: "none", border: "none", color: "var(--color-brand-600)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, textAlign: "left", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
                          [View Details]
                        </button>
                        {!a.resolved && (
                          <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                            (revealing metadata)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
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

      {/* ── Details Modal ── */}
      {detailItem && (
        <DetailsModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}