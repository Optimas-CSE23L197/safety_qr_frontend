import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
const ParentIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const SchoolIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);
const WarningIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_SESSIONS = [
  { id: 1,  type: "Parent", name: "Jane Doe",    email: "jane.doe@example.com",    platform: "iOS",     lastActive: "2h 15m ago",           ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 2,  type: "Parent", name: "Jane Doe",    email: "jane.doe@example.com",    platform: "Android", lastActive: "06 Mar 2026 14:30 IST", ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 3,  type: "School", name: "School Staff",email: "schoolstaff@example.com", platform: "Android", lastActive: "06 Mar 2026 14:30 IST", ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 4,  type: "Parent", name: "Admin Numan", email: "jane.doe@example.com",    platform: "macOS",   lastActive: "06 Mar 2026 14:30 IST", ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 5,  type: "Parent", name: "Admin Svan",  email: "jane.doe@example.com",    platform: "Android", lastActive: "2h 15m ago",           ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 6,  type: "School", name: "Jane Doe",    email: "jane.doe@example.com",    platform: "iOS",     lastActive: "2h 15m ago",           ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Expired" },
  { id: 7,  type: "School", name: "Jane Doe",    email: "jane.doe@example.com",    platform: "Windows", lastActive: "2h 15m ago",           ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Expired" },
  { id: 8,  type: "Parent", name: "Priya Sharma",email: "priya.s@gmail.com",       platform: "iOS",     lastActive: "30 min ago",           ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 9,  type: "School", name: "Rajesh Kumar",email: "rajesh@ryan.edu.in",      platform: "Web",     lastActive: "5 min ago",            ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 10, type: "Parent", name: "Sunita Patel",email: "sunita.p@gmail.com",      platform: "Android", lastActive: "3h ago",               ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 11, type: "School", name: "Kavitha R",   email: "kavitha.r@kv.edu",        platform: "macOS",   lastActive: "1h ago",               ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 12, type: "Parent", name: "Mohan Lal",   email: "mohan.l@yahoo.com",       platform: "Android", lastActive: "22h ago",              ip: "103.212.x.x", expires: "06 Mar 2026 14:30 IST", status: "Expired" },
];

const PER_PAGE = 7;

// ─── Status Tag ───────────────────────────────────────────────────────────────
const StatusTag = ({ status }) => {
  const map = {
    Active:  { bg: "var(--color-success-100)", color: "var(--color-success-700)", dot: "var(--color-success-500)" },
    Idle:    { bg: "var(--color-warning-100)", color: "var(--color-warning-700)", dot: "var(--color-warning-500)" },
    Expired: { bg: "var(--color-slate-100)",   color: "var(--color-slate-500)",   dot: "var(--color-slate-400)"   },
  };
  const s = map[status] || map.Expired;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      fontSize: "0.6875rem", fontWeight: 600,
      padding: "3px 9px", borderRadius: 9999,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
};

// ─── User Type Cell ───────────────────────────────────────────────────────────
const UserTypeCell = ({ type }) => {
  const isParent = type === "Parent";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5,
      background: isParent ? "var(--color-brand-50)" : "var(--color-info-50)",
      color: isParent ? "var(--color-brand-600)" : "var(--color-info-700)",
      border: `1px solid ${isParent ? "var(--color-brand-100)" : "var(--color-info-100)"}`,
      padding: "3px 9px", borderRadius: "var(--radius-md)",
      fontSize: "0.75rem", fontWeight: 600,
    }}>
      {isParent ? <ParentIcon /> : <SchoolIcon />}
      {type}
    </div>
  );
};

// ─── Filter Button ────────────────────────────────────────────────────────────
const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 12px", borderRadius: "var(--radius-md)",
    fontSize: "0.8125rem", fontWeight: active ? 600 : 400,
    border: active ? "none" : "1px solid var(--border-default)",
    background: active ? "var(--color-brand-600)" : "transparent",
    color: active ? "#fff" : "var(--text-secondary)",
    cursor: "pointer", fontFamily: "var(--font-body)",
    transition: "var(--transition-fast)",
  }}>
    {label}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Sessions() {
  const [search,        setSearch]        = useState("");
  const [userTypeFilter,setUserTypeFilter]= useState("All");   // All | Parent | School | Admin
  const [platformFilter,setPlatformFilter]= useState("All");   // All | iOS | Android | Web
  const [lastActiveFilter, setLastActive] = useState("24h");   // 1h | 24h | 7d
  const [page,          setPage]          = useState(1);
  const [revokeTarget,  setRevokeTarget]  = useState(null);
  const [revokeAll,     setRevokeAll]     = useState(false);

  // ── Filter logic ──
  const filtered = MOCK_SESSIONS.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.email.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.ip.includes(q);
    const matchType     = userTypeFilter === "All" || s.type === userTypeFilter || (userTypeFilter === "Admin" && s.name.startsWith("Admin"));
    const matchPlatform = platformFilter === "All" || s.platform === platformFilter;
    return matchQ && matchType && matchPlatform;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const rows       = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalActive   = MOCK_SESSIONS.filter(s => s.status === "Active").length;
  const expiringSoon  = 38;
  const mostActiveOS  = "iOS (112 sessions)";

  // ── Style helpers ──
  const card = {
    background: "var(--bg-card)", border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-card)",
  };
  const thS = {
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
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Manage Sessions
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            Platform Control / System /{" "}
            <span style={{ color: "var(--color-brand-600)" }}>Sessions</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
            <BellIcon />
          </button>
          <div style={{ width: 1, height: 28, background: "var(--border-default)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-brand-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>SA</div>
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>Super Admin</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>SUPER_ADMIN</p>
            </div>
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div style={{ padding: "1.5rem 2rem" }} className="animate-fadeIn">

        {/* ── Active Sessions Header Row ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>

          {/* Title */}
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            Active Sessions
          </h2>

          {/* Summary Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 2px" }}>Total Active Sessions:</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{totalActive}</p>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--border-default)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 2px" }}>Sessions Expiring Soon (24h):</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.625rem", fontWeight: 700, color: "var(--color-warning-600)", margin: 0, lineHeight: 1 }}>{expiringSoon}</p>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--border-default)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 2px" }}>Most Active OS:</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{mostActiveOS}</p>
            </div>
          </div>
        </div>

        {/* ── Main Table Card ── */}
        <div style={card}>

          {/* ── Filters Row ── */}
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

            {/* Left: Search + User Type + Platform + Last Active */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

              {/* Search */}
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex" }}>
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search Sessions (Email, IP)"
                  style={{
                    paddingLeft: 30, paddingRight: 12, height: 33,
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "0.8125rem", color: "var(--text-primary)",
                    fontFamily: "var(--font-body)", background: "#fff",
                    outline: "none", width: 210,
                  }}
                />
              </div>

              {/* User Type group */}
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", marginRight: 8 }}>User Type</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {["Parent", "School", "Admin"].map(t => (
                    <FilterBtn key={t} label={t} active={userTypeFilter === t} onClick={() => { setUserTypeFilter(userTypeFilter === t ? "All" : t); setPage(1); }} />
                  ))}
                  <button style={{ display: "flex", alignItems: "center", padding: "5px 7px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-muted)" }}>
                    <ChevronDownIcon />
                  </button>
                </div>
              </div>

              {/* Device Platform group */}
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", marginRight: 8 }}>Device Platform</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {["iOS", "Android", "Web"].map(p => (
                    <FilterBtn key={p} label={p} active={platformFilter === p} onClick={() => { setPlatformFilter(platformFilter === p ? "All" : p); setPage(1); }} />
                  ))}
                  <button style={{ display: "flex", alignItems: "center", padding: "5px 7px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-muted)" }}>
                    <ChevronDownIcon />
                  </button>
                </div>
              </div>

              {/* Last Active group */}
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", marginRight: 8 }}>Last Active</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {["1h", "24h", "7d"].map(t => (
                    <FilterBtn key={t} label={t} active={lastActiveFilter === t} onClick={() => setLastActive(t)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Revoke All Sessions */}
            <button
              onClick={() => setRevokeAll(true)}
              style={{
                padding: "8px 18px", borderRadius: "var(--radius-lg)",
                background: "var(--color-slate-800)", color: "#fff",
                border: "none", fontSize: "0.8125rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-body)",
                whiteSpace: "nowrap",
              }}>
              Revoke All Sessions
            </button>
          </div>

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thS}>User Type</th>
                  <th style={thS}>Identifier</th>
                  <th style={thS}>Device Platform</th>
                  <th style={thS}>Last Active</th>
                  <th style={thS}>IP Address</th>
                  <th style={thS}>Expires At</th>
                  <th style={thS}>Status Tag</th>
                  <th style={{ ...thS, textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      No sessions match your filters.
                    </td>
                  </tr>
                ) : rows.map((s, i) => (
                  <tr key={s.id} style={{ background: i % 2 === 1 ? "var(--color-slate-50)" : "#fff" }}>

                    {/* User Type */}
                    <td style={tdS}>
                      <UserTypeCell type={s.type} />
                    </td>

                    {/* Identifier */}
                    <td style={tdS}>
                      <p style={{ fontWeight: 600, color: "var(--color-brand-600)", margin: "0 0 1px", fontSize: "0.8125rem" }}>{s.name}</p>
                      <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0 }}>{s.email}</p>
                    </td>

                    {/* Device Platform */}
                    <td style={{ ...tdS, fontWeight: 500, color: "var(--text-primary)" }}>{s.platform}</td>

                    {/* Last Active */}
                    <td style={{ ...tdS, fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{s.lastActive}</td>

                    {/* IP Address */}
                    <td style={tdS}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", background: "var(--color-slate-100)", color: "var(--text-secondary)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
                        {s.ip}
                      </span>
                    </td>

                    {/* Expires At */}
                    <td style={{ ...tdS, fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{s.expires}</td>

                    {/* Status Tag */}
                    <td style={tdS}><StatusTag status={s.status} /></td>

                    {/* Actions */}
                    <td style={tdS}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button style={{
                          padding: "5px 10px", borderRadius: "var(--radius-md)",
                          background: "transparent", border: "1px solid var(--border-default)",
                          color: "var(--color-brand-600)", fontSize: "0.75rem", fontWeight: 600,
                          cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap",
                        }}>
                          View User Profile
                        </button>
                        {s.status !== "Expired" && (
                          <button
                            onClick={() => setRevokeTarget(s)}
                            style={{
                              padding: "5px 10px", borderRadius: "var(--radius-md)",
                              background: "transparent", border: "1px solid var(--color-danger-200)",
                              color: "var(--color-danger-600)", fontSize: "0.75rem", fontWeight: 600,
                              cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap",
                            }}>
                            Revoke Session
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
              Showing{" "}
              <strong style={{ color: "var(--text-secondary)" }}>
                {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)}
              </strong>{" "}
              of <strong style={{ color: "var(--text-secondary)" }}>{filtered.length}</strong> sessions
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === 1 ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}>
                <ChevronLeftIcon />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{
                  width: 30, height: 30, borderRadius: "var(--radius-md)",
                  border: n === page ? "none" : "1px solid var(--border-default)",
                  background: n === page ? "var(--color-brand-600)" : "transparent",
                  color: n === page ? "#fff" : "var(--text-secondary)",
                  fontSize: "0.8125rem", fontWeight: n === page ? 600 : 400,
                  cursor: "pointer", fontFamily: "var(--font-body)",
                }}>{n}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === totalPages ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === totalPages ? 0.4 : 1 }}>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Revoke Single Session Modal ── */}
      {revokeTarget && (
        <div onClick={() => setRevokeTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", padding: "1.75rem", width: 400, boxShadow: "var(--shadow-modal)" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-danger-100)", color: "var(--color-danger-600)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <WarningIcon />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Revoke Session?</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 1rem", lineHeight: 1.6 }}>
              This will immediately log out and blacklist the session for:
            </p>
            <div style={{ background: "var(--color-slate-50)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "10px 14px", marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: "0 0 2px", fontSize: "0.875rem" }}>{revokeTarget.name}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{revokeTarget.email}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "3px 0 0", fontFamily: "var(--font-mono)" }}>{revokeTarget.ip} · {revokeTarget.platform}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRevokeTarget(null)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", background: "transparent", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
              <button onClick={() => setRevokeTarget(null)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-lg)", background: "var(--color-danger-600)", fontSize: "0.875rem", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)" }}>Yes, Revoke</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Revoke All Modal ── */}
      {revokeAll && (
        <div onClick={() => setRevokeAll(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", padding: "1.75rem", width: 420, boxShadow: "var(--shadow-modal)" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-danger-100)", color: "var(--color-danger-600)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <WarningIcon />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Revoke All Active Sessions?</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
              This will immediately log out <strong style={{ color: "var(--color-danger-600)" }}>all {totalActive} active users</strong> across the platform. Their refresh tokens will be blacklisted. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRevokeAll(false)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", background: "transparent", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
              <button onClick={() => setRevokeAll(false)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-lg)", background: "var(--color-danger-600)", fontSize: "0.875rem", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)" }}>Revoke All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}