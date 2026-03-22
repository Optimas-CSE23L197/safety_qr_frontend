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
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const ShieldAlertIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285zm0 13.036h.008v.008H12v-.008z" />
  </svg>
);
const PencilIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const ClipboardIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROFILES = [
  { id: 1, name: "Vikram Nair (Student)", school: "Kondriya Vididayaya", bloodGroup: "O+", allergies: "Peanuts, Penicillin", conditions: "Asthma", contacts: "[P, S] (2)", visibility: "PUBLIC" },
  { id: 2, name: "Fatima Khan (Student)", school: "Greenwood High", bloodGroup: "AB+", allergies: "None", conditions: "None", contacts: "[P] (1)", visibility: "PUBLIC" },
  { id: 3, name: "Vikram Nair (Student)", school: "Greenwood High", bloodGroup: "A-", allergies: "None", conditions: "Asthma", contacts: "[P] (1)", visibility: "PRIVATE" },
  { id: 4, name: "Akash Gupta (Student)", school: "Central Public School", bloodGroup: "A-", allergies: "None", conditions: "Epilepsy", contacts: "[P] (1)", visibility: "PRIVATE" },
  { id: 5, name: "Priya Das (Student)", school: "DPS Noida", bloodGroup: "A-", allergies: "None", conditions: "Epilepsy", contacts: "[P] (1)", visibility: "PUBLIC" },
  { id: 6, name: "Sunita Roy (Student)", school: "Ryan Intervatora", bloodGroup: "AB+", allergies: "None", conditions: "None", contacts: "[P, S, T] (3)", visibility: "HIDDEN" },
  { id: 7, name: "Sunita Roy (Student)", school: "DPS Noida", bloodGroup: "A-", allergies: "None", conditions: "None", contacts: "[P, S, T] (3)", visibility: "HIDDEN" },
  { id: 8, name: "Ravi Kumar (Student)", school: "Amity School", bloodGroup: "B+", allergies: "Dust, Pollen", conditions: "Rhinitis", contacts: "[P] (1)", visibility: "PUBLIC" },
  { id: 9, name: "Meena Patel (Student)", school: "DPS Noida", bloodGroup: "O-", allergies: "None", conditions: "Diabetes", contacts: "[P, S] (2)", visibility: "PRIVATE" },
  { id: 10, name: "Deepak Sharma (Student)", school: "Kendriya Vidyalaya", bloodGroup: "B-", allergies: "Latex", conditions: "None", contacts: "[P] (1)", visibility: "PUBLIC" },
  { id: 11, name: "Kavya Singh (Student)", school: "Ryan International", bloodGroup: "A+", allergies: "None", conditions: "None", contacts: "[P] (1)", visibility: "HIDDEN" },
  { id: 12, name: "Arun Mehta (Student)", school: "DPS Noida", bloodGroup: "AB-", allergies: "Shellfish", conditions: "Asthma", contacts: "[P, S] (2)", visibility: "PRIVATE" },
];

const BLOOD_GROUPS = ["Filter by Blood Group", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const VISIBILITY_OPTS = ["Filter by Visibility", "PUBLIC", "PRIVATE", "HIDDEN"];
const PER_PAGE_OPTS = [10, 25, 50];

// ─── Visibility Badge ─────────────────────────────────────────────────────────
const VisibilityBadge = ({ v }) => {
  const map = {
    PUBLIC: { bg: "var(--color-success-100)", color: "var(--color-success-700)", border: "var(--color-success-100)" },
    PRIVATE: { bg: "var(--color-warning-100)", color: "var(--color-warning-700)", border: "var(--color-warning-100)" },
    HIDDEN: { bg: "var(--color-slate-200)", color: "var(--color-slate-600)", border: "var(--color-slate-200)" },
  };
  const s = map[v] || map.HIDDEN;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: "0.6875rem", fontWeight: 700,
      padding: "3px 10px", borderRadius: "var(--radius-md)",
      display: "inline-block", whiteSpace: "nowrap",
    }}>
      {v}
    </span>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState({ ...item });
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", width: 480, boxShadow: "var(--shadow-modal)", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", background: "var(--color-brand-50)", color: "var(--color-brand-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PencilIcon />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.875rem", fontFamily: "var(--font-display)" }}>Edit Emergency Profile</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0 }}>{item.name} · {item.school}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }}><XIcon /></button>
        </div>
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Blood Group", key: "bloodGroup" },
            { label: "Allergies", key: "allergies" },
            { label: "Conditions", key: "conditions" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>{label}</label>
              <input
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", height: 34, border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "0 10px", fontSize: "0.8125rem", fontFamily: "var(--font-body)", outline: "none", color: "var(--text-primary)" }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Visibility</label>
            <div style={{ position: "relative" }}>
              <select
                value={form.visibility}
                onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))}
                style={{ width: "100%", height: 34, appearance: "none", WebkitAppearance: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "0 28px 0 10px", fontSize: "0.8125rem", fontFamily: "var(--font-body)", outline: "none", color: "var(--text-primary)", background: "#fff", cursor: "pointer" }}>
                {["PUBLIC", "PRIVATE", "HIDDEN"].map(v => <option key={v}>{v}</option>)}
              </select>
              <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}><ChevronDownIcon /></span>
            </div>
          </div>
        </div>
        <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} style={{ padding: "7px 16px", background: "var(--color-brand-600)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <CheckIcon /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Audit Modal ──────────────────────────────────────────────────────────────
const AuditModal = ({ item, onClose }) => {
  const logs = [
    { action: "VISIBILITY_CHANGED", from: "PUBLIC", to: item.visibility, by: "super_admin", at: "2026-03-07 09:30:00 AM" },
    { action: "FIELD_UPDATED", from: "Peanuts", to: item.allergies, by: "parent@mail.com", at: "2026-03-06 04:15:00 PM" },
    { action: "PROFILE_CREATED", from: null, to: null, by: "school_admin", at: "2026-02-01 10:00:00 AM" },
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", width: 520, boxShadow: "var(--shadow-modal)", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", background: "var(--color-slate-100)", color: "var(--color-slate-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ClipboardIcon />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.875rem", fontFamily: "var(--font-display)" }}>Audit Trail</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0 }}>{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }}><XIcon /></button>
        </div>
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
          {logs.map((l, i) => (
            <div key={i} style={{ background: "var(--color-slate-50)", border: "1px solid var(--color-slate-100)", borderRadius: "var(--radius-lg)", padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600, color: "var(--color-brand-600)" }}>{l.action}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)" }}>{l.at}</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                By <strong style={{ color: "var(--text-primary)" }}>{l.by}</strong>
                {l.from && l.to && <> · <span style={{ color: "var(--color-danger-600)", textDecoration: "line-through" }}>{l.from}</span> → <span style={{ color: "var(--color-success-600)" }}>{l.to}</span></>}
              </p>
            </div>
          ))}
        </div>
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 16px", background: "var(--color-slate-800)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Resolve Anomaly Modal ────────────────────────────────────────────────────
const ResolveModal = ({ onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
    <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", width: 420, boxShadow: "var(--shadow-modal)", overflow: "hidden" }}>
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: "var(--radius-md)", background: "var(--color-danger-50)", color: "var(--color-danger-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldAlertIcon />
          </div>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.875rem", fontFamily: "var(--font-display)" }}>Resolve Anomaly</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 4 }}><XIcon /></button>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 12px" }}>
          Select profiles with anomalous emergency data (e.g. missing contacts, HIDDEN visibility, unverified edits) and mark them as reviewed.
        </p>
        <div style={{ background: "var(--color-warning-50)", border: "1px solid var(--color-warning-100)", borderRadius: "var(--radius-lg)", padding: "10px 12px" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-warning-700)", margin: 0, fontWeight: 500 }}>
            ⚠ 2 profiles with HIDDEN visibility detected — consider reviewing before resolving.
          </p>
        </div>
      </div>
      <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button onClick={onClose} style={{ padding: "7px 16px", background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
        <button onClick={onClose} style={{ padding: "7px 16px", background: "var(--color-danger-600)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <CheckIcon /> Confirm Resolve
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmergencyProfiles() {
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("Filter by Blood Group");
  const [visFilter, setVisFilter] = useState("Filter by Visibility");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [auditItem, setAuditItem] = useState(null);
  const [showResolve, setShowResolve] = useState(false);
  const [profiles, setProfiles] = useState(PROFILES);

  const handleSave = (updated) => {
    setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // ── Filtered ──
  const filtered = profiles.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.school.toLowerCase().includes(q) || p.bloodGroup.toLowerCase().includes(q);
    const matchBlood = bloodFilter === "Filter by Blood Group" || p.bloodGroup === bloodFilter;
    const matchVis = visFilter === "Filter by Visibility" || p.visibility === visFilter;
    return matchQ && matchBlood && matchVis;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);

  // ── Style helpers ──
  const card = { background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-card)" };
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

  // Dropdown component
  const DropSelect = ({ value, options, onChange, width = 170 }) => (
    <div style={{ position: "relative", width }}>
      <select value={value} onChange={e => { onChange(e.target.value); setPage(1); }} style={{ width: "100%", height: 32, appearance: "none", WebkitAppearance: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", color: value === options[0] ? "var(--text-muted)" : "var(--text-secondary)", fontFamily: "var(--font-body)", background: "#fff", padding: "0 26px 0 10px", outline: "none", cursor: "pointer" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}><ChevronDownIcon /></span>
    </div>
  );

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      {/* ── Page Body ── */}
      <div style={{ padding: "0rem 2rem" }} className="animate-fadeIn">
        <div style={card}>

          {/* ── Toolbar ── */}
          <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex" }}>
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search students..."
                style={{ width: "100%", paddingLeft: 30, paddingRight: 10, height: 32, border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", color: "var(--text-primary)", fontFamily: "var(--font-body)", background: "#fff", outline: "none" }}
              />
            </div>

            {/* Filters + button */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <DropSelect value={bloodFilter} options={BLOOD_GROUPS} onChange={setBloodFilter} width={180} />
              <DropSelect value={visFilter} options={VISIBILITY_OPTS} onChange={setVisFilter} width={175} />
              <button
                onClick={() => setShowResolve(true)}
                style={{ height: 32, padding: "0 16px", background: "var(--color-brand-600)", color: "#fff", border: "none", borderRadius: "var(--radius-lg)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", boxShadow: "var(--shadow-brand)" }}>
                <ShieldAlertIcon /> Resolve Anomaly
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thS}>Student</th>
                  <th style={thS}>Blood Group</th>
                  <th style={thS}>Allergies</th>
                  <th style={thS}>Conditions</th>
                  <th style={thS}>Contacts (Count)</th>
                  <th style={thS}>Visibility Status</th>
                  <th style={thS}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "3.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      No emergency profiles match your filters.
                    </td>
                  </tr>
                ) : rows.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      background: p.visibility === "HIDDEN"
                        ? (i % 2 === 0 ? "rgba(241,245,249,0.8)" : "rgba(226,232,240,0.5)")
                        : (i % 2 === 1 ? "var(--color-slate-50)" : "#fff"),
                    }}
                  >
                    {/* Student */}
                    <td style={tdS}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "var(--radius-md)", background: p.visibility === "HIDDEN" ? "var(--color-slate-200)" : "var(--color-slate-100)", color: p.visibility === "HIDDEN" ? "var(--color-slate-500)" : "var(--color-slate-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <UserIcon />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", margin: 0, fontSize: "0.8125rem" }}>{p.name}</p>
                          <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, display: "flex", alignItems: "center", gap: 3 }}>
                            <SchoolIcon /> {p.school}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Blood Group */}
                    <td style={{ ...tdS, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                      {p.bloodGroup}
                    </td>

                    {/* Allergies */}
                    <td style={{ ...tdS, color: p.allergies === "None" ? "var(--text-muted)" : "var(--text-primary)", fontStyle: p.allergies === "None" ? "italic" : "normal" }}>
                      {p.allergies}
                    </td>

                    {/* Conditions */}
                    <td style={{ ...tdS, color: p.conditions === "None" ? "var(--text-muted)" : "var(--text-primary)", fontStyle: p.conditions === "None" ? "italic" : "normal" }}>
                      {p.conditions}
                    </td>

                    {/* Contacts */}
                    <td style={{ ...tdS, fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-slate-600)" }}>
                      {p.contacts}
                    </td>

                    {/* Visibility */}
                    <td style={tdS}>
                      <VisibilityBadge v={p.visibility} />
                    </td>

                    {/* Actions */}
                    <td style={tdS}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          onClick={() => setEditItem(p)}
                          style={{ background: "none", border: "none", color: "var(--color-brand-600)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "var(--font-body)" }}>
                          [Edit]
                        </button>
                        <button
                          onClick={() => setAuditItem(p)}
                          style={{ background: "none", border: "none", color: "var(--color-slate-500)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "var(--font-body)" }}>
                          [Audit]
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pagination:</span>
              <div style={{ position: "relative" }}>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} style={{ height: 26, appearance: "none", WebkitAppearance: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-body)", background: "#fff", padding: "0 20px 0 7px", outline: "none", cursor: "pointer" }}>
                  {PER_PAGE_OPTS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}><ChevronDownIcon size={9} /></span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {[
                { Icon: ChevronsLeftIcon, action: () => setPage(1), disabled: page === 1 },
                { Icon: ChevronLeftIcon, action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
              ].map(({ Icon, action, disabled }, idx) => (
                <button key={idx} onClick={action} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: disabled ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: disabled ? 0.4 : 1 }}>
                  <Icon />
                </button>
              ))}

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", border: n === page ? "none" : "1px solid var(--border-default)", background: n === page ? "var(--color-brand-600)" : "transparent", color: n === page ? "#fff" : "var(--text-secondary)", fontSize: "0.75rem", fontWeight: n === page ? 600 : 400, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                  {n}
                </button>
              ))}

              {[
                { Icon: ChevronRightIcon, action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
                { Icon: ChevronsRightIcon, action: () => setPage(totalPages), disabled: page === totalPages },
              ].map(({ Icon, action, disabled }, idx) => (
                <button key={idx} onClick={action} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-default)", background: "transparent", cursor: disabled ? "not-allowed" : "pointer", color: "var(--text-muted)", opacity: disabled ? 0.4 : 1 }}>
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {editItem && <EditModal item={editItem} onClose={() => setEditItem(null)} onSave={handleSave} />}
      {auditItem && <AuditModal item={auditItem} onClose={() => setAuditItem(null)} />}
      {showResolve && <ResolveModal onClose={() => setShowResolve(false)} />}
    </div>
  );
}