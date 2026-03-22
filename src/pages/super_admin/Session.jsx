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
  { id: 1,  type: "Parent", name: "Jane Doe",      email: "jane.doe@example.com",    platform: "iOS",     lastActive: "2h 15m ago",              ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 2,  type: "Parent", name: "Jane Doe",      email: "jane.doe@example.com",    platform: "Android", lastActive: "06 Mar 2026 14:30 IST",   ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 3,  type: "School", name: "School Staff",  email: "schoolstaff@example.com", platform: "Android", lastActive: "06 Mar 2026 14:30 IST",   ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 4,  type: "Parent", name: "Admin Numan",   email: "jane.doe@example.com",    platform: "macOS",   lastActive: "06 Mar 2026 14:30 IST",   ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 5,  type: "Parent", name: "Admin Svan",    email: "jane.doe@example.com",    platform: "Android", lastActive: "2h 15m ago",              ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 6,  type: "School", name: "Jane Doe",      email: "jane.doe@example.com",    platform: "iOS",     lastActive: "2h 15m ago",              ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Expired" },
  { id: 7,  type: "School", name: "Jane Doe",      email: "jane.doe@example.com",    platform: "Windows", lastActive: "2h 15m ago",              ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Expired" },
  { id: 8,  type: "Parent", name: "Priya Sharma",  email: "priya.s@gmail.com",       platform: "iOS",     lastActive: "30 min ago",              ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 9,  type: "School", name: "Rajesh Kumar",  email: "rajesh@ryan.edu.in",      platform: "Web",     lastActive: "5 min ago",               ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 10, type: "Parent", name: "Sunita Patel",  email: "sunita.p@gmail.com",      platform: "Android", lastActive: "3h ago",                  ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Idle"    },
  { id: 11, type: "School", name: "Kavitha R",     email: "kavitha.r@kv.edu",        platform: "macOS",   lastActive: "1h ago",                  ip: "103.212.x.x", expires: "07 Mar 2026 14:30 IST", status: "Active"  },
  { id: 12, type: "Parent", name: "Mohan Lal",     email: "mohan.l@yahoo.com",       platform: "Android", lastActive: "22h ago",                 ip: "103.212.x.x", expires: "06 Mar 2026 14:30 IST", status: "Expired" },
];

const PER_PAGE = 7;

// ─── Status Tag ───────────────────────────────────────────────────────────────
const STATUS_TAG = {
  Active:  { badge: "bg-success-100 text-success-700", dot: "bg-success-500"  },
  Idle:    { badge: "bg-warning-100 text-warning-700", dot: "bg-warning-500"  },
  Expired: { badge: "bg-slate-100   text-slate-500",   dot: "bg-slate-400"    },
};

const StatusTag = ({ status }) => {
  const s = STATUS_TAG[status] ?? STATUS_TAG.Expired;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold px-[9px] py-[3px] rounded-full ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {status}
    </span>
  );
};

// ─── User Type Cell ───────────────────────────────────────────────────────────
const UserTypeCell = ({ type }) => {
  const isParent = type === "Parent";
  return (
    <div className={[
      "inline-flex items-center gap-1.5 px-[9px] py-[3px] rounded-md text-xs font-semibold border",
      isParent
        ? "bg-brand-50 text-brand-600 border-brand-100"
        : "bg-info-50 text-info-700 border-info-100",
    ].join(" ")}>
      {isParent ? <ParentIcon /> : <SchoolIcon />}
      {type}
    </div>
  );
};

// ─── Filter Button ────────────────────────────────────────────────────────────
const FilterBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={[
      "py-[5px] px-3 rounded-md text-[0.8125rem] cursor-pointer font-body transition-colors",
      active
        ? "bg-brand-600 text-white border-none font-semibold"
        : "bg-transparent border border-[var(--border-default)] text-[var(--text-secondary)] font-normal hover:bg-slate-50",
    ].join(" ")}
  >
    {label}
  </button>
);

// ─── Revoke Modal (shared layout) ─────────────────────────────────────────────
const RevokeModal = ({ onClose, children }) => (
  <div onClick={onClose} className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100]">
    <div onClick={e => e.stopPropagation()} className="animate-fadeIn bg-white rounded-2xl p-7 shadow-[var(--shadow-modal)]">
      {children}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Sessions() {
  const [search,          setSearch]          = useState("");
  const [userTypeFilter,  setUserTypeFilter]  = useState("All");
  const [platformFilter,  setPlatformFilter]  = useState("All");
  const [lastActiveFilter, setLastActive]     = useState("24h");
  const [page,            setPage]            = useState(1);
  const [revokeTarget,    setRevokeTarget]    = useState(null);
  const [revokeAll,       setRevokeAll]       = useState(false);

  const filtered = MOCK_SESSIONS.filter(s => {
    const q = search.toLowerCase();
    const matchQ        = !q || s.email.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.ip.includes(q);
    const matchType     = userTypeFilter === "All" || s.type === userTypeFilter || (userTypeFilter === "Admin" && s.name.startsWith("Admin"));
    const matchPlatform = platformFilter === "All" || s.platform === platformFilter;
    return matchQ && matchType && matchPlatform;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const rows        = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalActive = MOCK_SESSIONS.filter(s => s.status === "Active").length;

  // Shared table header cell classes
  const thCls = "text-left px-3.5 py-[10px] text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-[0.06em] border-b border-[var(--border-default)] whitespace-nowrap bg-slate-50";
  const tdCls = "px-3.5 py-[11px] text-[0.8125rem] text-[var(--text-secondary)] align-middle border-b border-slate-100";

  return (
    <div className="bg-[var(--bg-page)] min-h-screen font-body">
      <div className="px-8 py-6 animate-fadeIn">

        {/* ── Header row ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="font-display text-[1.25rem] font-bold text-[var(--text-primary)] m-0">
            Active Sessions
          </h2>

          {/* Summary stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)] m-0 mb-0.5">Total Active Sessions:</p>
              <p className="font-display text-[1.625rem] font-bold text-[var(--text-primary)] m-0 leading-none">{totalActive}</p>
            </div>
            <div className="w-px h-9 bg-[var(--border-default)]" />
            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)] m-0 mb-0.5">Sessions Expiring Soon (24h):</p>
              <p className="font-display text-[1.625rem] font-bold text-warning-600 m-0 leading-none">38</p>
            </div>
            <div className="w-px h-9 bg-[var(--border-default)]" />
            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)] m-0 mb-0.5">Most Active OS:</p>
              <p className="font-display text-lg font-bold text-[var(--text-primary)] m-0 leading-none">iOS (112 sessions)</p>
            </div>
          </div>
        </div>

        {/* ── Main card ─────────────────────────────────────────────────── */}
        <div className="card">

          {/* Filters row */}
          <div className="px-5 py-4 border-b border-[var(--border-default)] flex items-center justify-between gap-4 flex-wrap">

            <div className="flex items-center gap-3 flex-wrap">

              {/* Search */}
              <div className="relative">
                <span className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] flex pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search Sessions (Email, IP)"
                  className="h-[33px] pl-[30px] pr-3 border border-[var(--border-default)] rounded-lg text-[0.8125rem] text-[var(--text-primary)] font-body bg-white outline-none w-[210px] focus:border-brand-500 transition-colors"
                />
              </div>

              {/* User type */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">User Type</span>
                <div className="flex gap-1 items-center">
                  {["Parent", "School", "Admin"].map(t => (
                    <FilterBtn key={t} label={t} active={userTypeFilter === t} onClick={() => { setUserTypeFilter(userTypeFilter === t ? "All" : t); setPage(1); }} />
                  ))}
                  <button className="flex items-center p-[5px] bg-transparent border border-[var(--border-default)] rounded-md cursor-pointer text-[var(--text-muted)] hover:bg-slate-50 transition-colors">
                    <ChevronDownIcon />
                  </button>
                </div>
              </div>

              {/* Device platform */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Device Platform</span>
                <div className="flex gap-1 items-center">
                  {["iOS", "Android", "Web"].map(p => (
                    <FilterBtn key={p} label={p} active={platformFilter === p} onClick={() => { setPlatformFilter(platformFilter === p ? "All" : p); setPage(1); }} />
                  ))}
                  <button className="flex items-center p-[5px] bg-transparent border border-[var(--border-default)] rounded-md cursor-pointer text-[var(--text-muted)] hover:bg-slate-50 transition-colors">
                    <ChevronDownIcon />
                  </button>
                </div>
              </div>

              {/* Last active */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-muted)]">Last Active</span>
                <div className="flex gap-1">
                  {["1h", "24h", "7d"].map(t => (
                    <FilterBtn key={t} label={t} active={lastActiveFilter === t} onClick={() => setLastActive(t)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Revoke all */}
            <button
              onClick={() => setRevokeAll(true)}
              className="py-2 px-[18px] rounded-lg bg-slate-800 text-white border-none text-[0.8125rem] font-semibold cursor-pointer font-body whitespace-nowrap hover:bg-slate-700 transition-colors"
            >
              Revoke All Sessions
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["User Type", "Identifier", "Device Platform", "Last Active", "IP Address", "Expires At", "Status Tag", "Actions"].map(h => (
                    <th key={h} className={thCls}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[var(--text-muted)] text-sm">
                      No sessions match your filters.
                    </td>
                  </tr>
                ) : rows.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}>

                    {/* User Type */}
                    <td className={tdCls}><UserTypeCell type={s.type} /></td>

                    {/* Identifier */}
                    <td className={tdCls}>
                      <p className="font-semibold text-brand-600 m-0 mb-[1px] text-[0.8125rem]">{s.name}</p>
                      <p className="text-[0.6875rem] text-[var(--text-muted)] m-0">{s.email}</p>
                    </td>

                    {/* Device Platform */}
                    <td className={`${tdCls} font-medium text-[var(--text-primary)]`}>{s.platform}</td>

                    {/* Last Active */}
                    <td className={`${tdCls} text-xs font-mono text-[var(--text-secondary)]`}>{s.lastActive}</td>

                    {/* IP Address */}
                    <td className={tdCls}>
                      <span className="font-mono text-xs bg-slate-100 text-[var(--text-secondary)] px-2 py-0.5 rounded">
                        {s.ip}
                      </span>
                    </td>

                    {/* Expires At */}
                    <td className={`${tdCls} text-xs font-mono text-[var(--text-secondary)]`}>{s.expires}</td>

                    {/* Status */}
                    <td className={tdCls}><StatusTag status={s.status} /></td>

                    {/* Actions */}
                    <td className={tdCls}>
                      <div className="flex items-center gap-1.5">
                        <button className="py-[5px] px-2.5 rounded-md bg-transparent border border-[var(--border-default)] text-brand-600 text-xs font-semibold cursor-pointer font-body whitespace-nowrap hover:bg-brand-50 hover:border-brand-300 transition-colors">
                          View User Profile
                        </button>
                        {s.status !== "Expired" && (
                          <button
                            onClick={() => setRevokeTarget(s)}
                            className="py-[5px] px-2.5 rounded-md bg-transparent border border-danger-200 text-danger-600 text-xs font-semibold cursor-pointer font-body whitespace-nowrap hover:bg-danger-50 transition-colors"
                          >
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

          {/* Pagination */}
          <div className="px-5 py-3.5 border-t border-[var(--border-default)] flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)] m-0">
              Showing{" "}
              <strong className="text-[var(--text-secondary)]">
                {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)}
              </strong>{" "}
              of <strong className="text-[var(--text-secondary)]">{filtered.length}</strong> sessions
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-md border border-[var(--border-default)] bg-transparent text-[var(--text-muted)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeftIcon />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={[
                    "w-[30px] h-[30px] rounded-md text-[0.8125rem] cursor-pointer font-body transition-colors",
                    n === page
                      ? "bg-brand-600 text-white border-none font-semibold"
                      : "bg-transparent border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-slate-50",
                  ].join(" ")}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-md border border-[var(--border-default)] bg-transparent text-[var(--text-muted)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Revoke Single Session Modal ───────────────────────────────────── */}
      {revokeTarget && (
        <RevokeModal onClose={() => setRevokeTarget(null)}>
          <div className="w-[400px]">
            <div className="w-11 h-11 rounded-full bg-danger-100 text-danger-600 flex items-center justify-center mb-4">
              <WarningIcon />
            </div>
            <h3 className="font-display text-[1.0625rem] font-bold text-[var(--text-primary)] m-0 mb-1.5">
              Revoke Session?
            </h3>
            <p className="text-[0.8125rem] text-[var(--text-muted)] m-0 mb-4 leading-relaxed">
              This will immediately log out and blacklist the session for:
            </p>
            <div className="bg-slate-50 border border-[var(--border-default)] rounded-lg px-3.5 py-2.5 mb-5">
              <p className="font-semibold text-[var(--text-primary)] m-0 mb-0.5 text-sm">{revokeTarget.name}</p>
              <p className="text-xs text-[var(--text-muted)] m-0">{revokeTarget.email}</p>
              <p className="text-xs text-[var(--text-muted)] m-0 mt-[3px] font-mono">{revokeTarget.ip} · {revokeTarget.platform}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRevokeTarget(null)} className="flex-1 py-2.5 border border-[var(--border-default)] rounded-lg bg-transparent text-sm font-semibold text-[var(--text-secondary)] cursor-pointer font-body hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setRevokeTarget(null)} className="flex-1 py-2.5 border-none rounded-lg bg-danger-600 text-sm font-semibold text-white cursor-pointer font-body hover:bg-danger-700 transition-colors">Yes, Revoke</button>
            </div>
          </div>
        </RevokeModal>
      )}

      {/* ── Revoke All Modal ──────────────────────────────────────────────── */}
      {revokeAll && (
        <RevokeModal onClose={() => setRevokeAll(false)}>
          <div className="w-[420px]">
            <div className="w-11 h-11 rounded-full bg-danger-100 text-danger-600 flex items-center justify-center mb-4">
              <WarningIcon />
            </div>
            <h3 className="font-display text-[1.0625rem] font-bold text-[var(--text-primary)] m-0 mb-1.5">
              Revoke All Active Sessions?
            </h3>
            <p className="text-[0.8125rem] text-[var(--text-muted)] m-0 mb-5 leading-relaxed">
              This will immediately log out{" "}
              <strong className="text-danger-600">all {totalActive} active users</strong>{" "}
              across the platform. Their refresh tokens will be blacklisted. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setRevokeAll(false)} className="flex-1 py-2.5 border border-[var(--border-default)] rounded-lg bg-transparent text-sm font-semibold text-[var(--text-secondary)] cursor-pointer font-body hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setRevokeAll(false)} className="flex-1 py-2.5 border-none rounded-lg bg-danger-600 text-sm font-semibold text-white cursor-pointer font-body hover:bg-danger-700 transition-colors">Revoke All</button>
            </div>
          </div>
        </RevokeModal>
      )}
    </div>
  );
}