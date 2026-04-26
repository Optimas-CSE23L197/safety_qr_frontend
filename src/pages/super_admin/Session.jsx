import { useState } from 'react';
import { useSessions } from '#hooks/super-admin/useSessions.js';

const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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

const StatusTag = ({ status }) => {
  const map = {
    ACTIVE: { bg: "var(--color-success-100)", color: "var(--color-success-700)", dot: "var(--color-success-500)" },
    EXPIRED: { bg: "var(--color-slate-100)", color: "var(--color-slate-500)", dot: "var(--color-slate-400)" },
    REVOKED: { bg: "var(--color-danger-100)", color: "var(--color-danger-700)", dot: "var(--color-danger-500)" },
    INACTIVE: { bg: "var(--color-warning-100)", color: "var(--color-warning-700)", dot: "var(--color-warning-500)" },
  };
  const s = map[status] || map.ACTIVE;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold px-[9px] py-[3px] rounded-full ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {status}
    </span>
  );
};

const UserTypeCell = ({ type }) => {
  const isParent = type === "PARENT";
  return (
    <div className={[
      "inline-flex items-center gap-1.5 px-[9px] py-[3px] rounded-md text-xs font-semibold border",
      isParent
        ? "bg-brand-50 text-brand-600 border-brand-100"
        : "bg-info-50 text-info-700 border-info-100",
    ].join(" ")}>
      {isParent ? <ParentIcon /> : <SchoolIcon />}
      {type === "PARENT" ? "Parent" : type === "SCHOOL" ? "School" : "Super Admin"}
    </div>
  );
};

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

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const PER_PAGE = 7;

export default function Sessions() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [lastActiveFilter, setLastActiveFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeAll, setRevokeAll] = useState(false);

  const {
    sessions,
    stats,
    pagination,
    loading,
    revokeSession,
    isRevoking,
    revokeAllSessions,
    isRevokingAll,
    refetch,
  } = useSessions({
    page,
    limit: PER_PAGE,
    search,
    user_type: userTypeFilter,
    platform: platformFilter,
    last_active: lastActiveFilter,
    status: statusFilter,
  });

  const handleRevoke = (id) => {
    revokeSession({ id, reason: 'REVOKED_BY_SUPER_ADMIN' });
    setRevokeTarget(null);
  };

  const handleRevokeAll = () => {
    revokeAllSessions({ reason: 'REVOKED_ALL_BY_SUPER_ADMIN' });
    setRevokeAll(false);
  };

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
      <div style={{ padding: "1.5rem 2rem" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            Active Sessions
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 2px" }}>Total Active Sessions:</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{stats.total_active || 0}</p>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--border-default)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 2px" }}>Sessions Expiring Soon (24h):</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.625rem", fontWeight: 700, color: "var(--color-warning-600)", margin: 0, lineHeight: 1 }}>{stats.expiring_soon_24h || 0}</p>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--border-default)" }} />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 2px" }}>Most Active OS:</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{stats.most_active_platform || 'None'}</p>
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex" }}>
                  <SearchIcon />
                </span>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search Sessions (Email, IP)"
                  className="h-[33px] pl-[30px] pr-3 border border-[var(--border-default)] rounded-lg text-[0.8125rem] text-[var(--text-primary)] font-body bg-white outline-none w-[210px] focus:border-brand-500 transition-colors"
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", marginRight: 8 }}>User Type</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {["PARENT", "SCHOOL", "SUPER_ADMIN"].map(t => (
                    <FilterBtn key={t} label={t === "SUPER_ADMIN" ? "Admin" : t} active={userTypeFilter === t} onClick={() => { setUserTypeFilter(userTypeFilter === t ? "" : t); setPage(1); }} />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", marginRight: 8 }}>Status</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {["ACTIVE", "EXPIRED", "REVOKED"].map(s => (
                    <FilterBtn key={s} label={s} active={statusFilter === s} onClick={() => { setStatusFilter(statusFilter === s ? "" : s); setPage(1); }} />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", marginRight: 8 }}>Last Active</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {["1h", "24h", "7d"].map(t => (
                    <FilterBtn key={t} label={t} active={lastActiveFilter === t} onClick={() => { setLastActiveFilter(lastActiveFilter === t ? "" : t); setPage(1); }} />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setRevokeAll(true)}
              className="py-2 px-[18px] rounded-lg bg-slate-800 text-white border-none text-[0.8125rem] font-semibold cursor-pointer font-body whitespace-nowrap hover:bg-slate-700 transition-colors"
            >
              Revoke All Sessions
            </button>
          </div>

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
                  <th style={thS}>Status</th>
                  <th style={{ ...thS, textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading...</td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>No sessions match your filters.</td>
                  </tr>
                ) : sessions.map((s, i) => (
                  <tr key={s.id} style={{ background: i % 2 === 1 ? "var(--color-slate-50)" : "#fff" }}>
                    <td style={tdS}><UserTypeCell type={s.user_type} /></td>
                    <td style={tdS}>
                      <p style={{ fontWeight: 600, color: "var(--color-brand-600)", margin: "0 0 1px", fontSize: "0.8125rem" }}>{s.user_name || '—'}</p>
                      <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0 }}>{s.user_email || '—'}</p>
                    </td>
                    <td style={{ ...tdS, fontWeight: 500, color: "var(--text-primary)" }}>{s.platform || 'Unknown'}</td>
                    <td style={{ ...tdS, fontSize: "0.75rem", color: "var(--text-secondary)" }} title={formatDate(s.last_active_at)}>{formatRelativeTime(s.last_active_at)}</td>
                    <td style={tdS}><span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", background: "var(--color-slate-100)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>{s.ip_address || '—'}</span></td>
                    <td style={{ ...tdS, fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>{formatDate(s.expires_at)}</td>
                    <td style={tdS}><StatusTag status={s.status} /></td>
                    <td style={tdS}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {s.status === "ACTIVE" && (
                          <button
                            onClick={() => setRevokeTarget(s)}
                            disabled={isRevoking}
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

          {pagination.totalPages > 1 && (
            <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, pagination.total)} of {pagination.total} sessions
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === 1 ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === 1 ? 0.4 : 1 }}>
                  <ChevronLeftIcon />
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let p = page;
                  if (pagination.totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)} style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", border: p === page ? "none" : "1px solid var(--border-default)", background: p === page ? "var(--color-brand-600)" : "transparent", color: p === page ? "#fff" : "var(--text-secondary)", fontSize: "0.8125rem", fontWeight: p === page ? 600 : 400, cursor: "pointer" }}>{p}</button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", background: "transparent", cursor: page === pagination.totalPages ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: page === pagination.totalPages ? 0.4 : 1 }}>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {revokeTarget && (
        <div onClick={() => setRevokeTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "var(--radius-2xl)", padding: "1.75rem", width: 400, boxShadow: "var(--shadow-modal)" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-danger-100)", color: "var(--color-danger-600)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <WarningIcon />
            </div>
            <h3 className="font-display text-[1.0625rem] font-bold text-[var(--text-primary)] m-0 mb-1.5">
              Revoke Session?
            </h3>
            <p className="text-[0.8125rem] text-[var(--text-muted)] m-0 mb-4 leading-relaxed">
              This will immediately log out and blacklist the session for:
            </p>
            <div style={{ background: "var(--color-slate-50)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "10px 14px", marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: "0 0 2px", fontSize: "0.875rem" }}>{revokeTarget.user_name || 'User'}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{revokeTarget.user_email || '—'}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "3px 0 0", fontFamily: "var(--font-mono)" }}>{revokeTarget.ip_address || '—'} · {revokeTarget.platform || 'Unknown'}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRevokeTarget(null)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", background: "transparent", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => handleRevoke(revokeTarget.id)} disabled={isRevoking} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-lg)", background: "var(--color-danger-600)", fontSize: "0.875rem", fontWeight: 600, color: "#fff", cursor: "pointer" }}>{isRevoking ? 'Revoking...' : 'Yes, Revoke'}</button>
            </div>
          </div>
        </RevokeModal>
      )}

      {revokeAll && (
        <div onClick={() => setRevokeAll(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "var(--radius-2xl)", padding: "1.75rem", width: 420, boxShadow: "var(--shadow-modal)" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--color-danger-100)", color: "var(--color-danger-600)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <WarningIcon />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Revoke All Active Sessions?</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
              This will immediately log out <strong style={{ color: "var(--color-danger-600)" }}>all {stats.total_active || 0} active users</strong> across the platform. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setRevokeAll(false)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", background: "transparent", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRevokeAll} disabled={isRevokingAll} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-lg)", background: "var(--color-danger-600)", fontSize: "0.875rem", fontWeight: 600, color: "#fff", cursor: "pointer" }}>{isRevokingAll ? 'Revoking...' : 'Revoke All'}</button>
            </div>
          </div>
        </RevokeModal>
      )}
    </div>
  );
}
