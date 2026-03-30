import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Bell: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  ExternalLink: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Check: ({ size = 14 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-success-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ size = 13 }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-slate-300">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Cancel: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Warning: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const PLANS = {
  Starter: { price: 1999 },
  Growth: { price: 5999 },
  Enterprise: { price: 12999 },
};

const MATRIX_ROWS = [
  { label: "Students",          Starter: "Up to 100",  Growth: "Up to 500",  Enterprise: "Unlimited"  },
  { label: "QR Tokens",         Starter: "100 tokens", Growth: "Unlimited",  Enterprise: "Unlimited"  },
  { label: "Analytics",         Starter: false,        Growth: "Basic",      Enterprise: "Full"       },
  { label: "Support",           Starter: "Email",      Growth: "Priority",   Enterprise: "Dedicated"  },
  { label: "Parent Edit",       Starter: false,        Growth: true,         Enterprise: true         },
  { label: "Parent Edit Audit", Starter: false,        Growth: false,        Enterprise: true         },
  { label: "Custom Branding",   Starter: false,        Growth: false,        Enterprise: true         },
];

const SUBSCRIPTION_HISTORY = [
  { id: "SUB123", date: "15 Feb 2026", action: "Growth to Enterprise", price: "₹5,999 → ₹12,999", admin: "Admin User 1", status: "Applied" },
  { id: "SUB124", date: "15 Feb 2026", action: "Growth to Enterprise", price: "₹5,999 → ₹12,999", admin: "Admin User 1", status: "Applied" },
];

const INVOICE_HISTORY = [
  { date: "01 Feb 2026", amount: "₹12,999/mo" },
  { date: "29 Mar 2026", amount: "₹5,999/mo" },
  { date: "17 Mar 2026", amount: "₹5,999/mo" },
];

// ─── Shared small components ──────────────────────────────────────────────────
const STATUS_BADGE_CLS = {
  Trialing: "bg-warning-100 text-warning-700",
  Active:   "bg-success-100 text-success-700",
  Applied:  "bg-success-100 text-success-700",
  Canceled: "bg-danger-100 text-danger-700",
  Past_Due: "bg-danger-100 text-danger-600",
};
const STATUS_DOT_CLS = {
  Trialing: "bg-warning-700",
  Active:   "bg-success-700",
  Applied:  "bg-success-700",
  Canceled: "bg-danger-700",
  Past_Due: "bg-danger-600",
};

const StatusBadge = ({ status }) => {
  const map = {
    Trialing: ["var(--color-warning-100)",  "var(--color-warning-700)"],
    Active:   ["var(--color-success-100)",  "var(--color-success-700)"],
    Applied:  ["var(--color-success-100)",  "var(--color-success-700)"],
    Canceled: ["var(--color-danger-100)",   "var(--color-danger-700)"],
    Past_Due: ["var(--color-danger-100)",   "var(--color-danger-600)"],
  };
  const [bg, fg] = map[status] || map.Active;
  return (
    <span style={{
      background: bg, color: fg, fontSize: "0.6875rem", fontWeight: 600,
      padding: "2px 8px", borderRadius: 9999,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: fg }} />
      {status}
    </span>
  );
};

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    style={{
      position: "relative", width: 36, height: 20, borderRadius: 10,
      border: "none", cursor: "pointer", flexShrink: 0,
      background: enabled ? "var(--color-brand-500)" : "var(--color-slate-300)",
      transition: "background 0.2s ease", padding: 0,
    }}
  >
    <span
      className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-200"
      style={{
        left: enabled ? "18px" : "2px",
        transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
      }}
    />
  </button>
);

const SectionLabel = ({ children }) => (
  <p className="text-[0.6875rem] font-semibold text-slate-400 tracking-[0.07em] uppercase mb-[0.875rem]">
    {children}
  </p>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageSubscription() {
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Enterprise");
  const [constraints, setConstraints] = useState({
    parentEdit: true, parentEditAudit: false, parentEditApproval: true,
  });

  const school = {
    name: "Ryan International", location: "New Delhi, India",
    email: "ryanannnt@gmail.com", plan: "Enterprise",
    students: 329, status: "Trialing",
    amount: "₹12,999/mo", nextBilling: "01 Apr 2026",
    features: ["Unlimited Tokens", "Full Analytics", "Parent Edit Audit"],
    tokenUsage: 329,
  };

  // ── Style helpers ──
  const card  = { background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-card)", padding: "1.25rem" };
  const inner = { background: "var(--color-slate-50)", border: "1px solid var(--color-slate-100)", borderRadius: "var(--radius-lg)", padding: "1rem" };
  const lbl   = { fontSize: "0.6875rem", color: "var(--color-slate-400)", fontWeight: 500, margin: "0 0 3px" };
  const val   = { fontSize: "0.875rem",  fontWeight: 600, color: "var(--color-slate-800)", margin: 0 };
  const thStyle = { textAlign: "left", paddingBottom: 8, fontWeight: 600, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-slate-400)" };

  return (
    <div className="bg-[var(--bg-page)] min-h-screen font-body">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-header)] border-b border-[var(--border-default)] h-[var(--header-height)] flex items-center justify-between px-8 sticky top-0 z-40">
        <div>
          <h1 className="font-display text-[0.9375rem] font-semibold text-[var(--text-primary)] m-0">
            Manage Subscription: {school.name}
          </h1>
          <p className="text-xs text-[var(--text-muted)] m-0">
            Platform Control / Subscriptions /{" "}
            <span className="text-brand-600">Manage</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex">
            <Icon.Bell />
          </button>
          <div className="w-px h-7 bg-[var(--border-default)]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
              SA
            </div>
            <div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>Super Admin</p>
              <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }} className="animate-fadeIn stagger-children">

        {/* ── Row 1: School Header + Current Plan ── */}
        <div className="grid grid-cols-[2fr_3fr] gap-4">

          {/* School Profile */}
          <div className="card p-5 animate-fadeIn">
            <SectionLabel>School Profile Header</SectionLabel>
            <h2 className="font-display text-xl font-bold text-slate-900 m-0 mb-0.5">{school.name}</h2>
            <p className="text-[0.8125rem] text-[var(--text-muted)] m-0 mb-2.5">{school.location}</p>
            <p className="text-[0.8125rem] text-[var(--text-secondary)] m-0 mb-3">
              School Contact email:{" "}
              <a href={`mailto:${school.email}`} className="text-brand-600 font-medium">{school.email}</a>
            </p>
            <button className="bg-transparent border-none text-brand-600 text-[0.8125rem] font-semibold cursor-pointer inline-flex items-center gap-1 p-0 hover:opacity-80 transition-opacity">
              View School <Icon.ExternalLink />
            </button>
          </div>

          {/* Current Plan Overview */}
          <div style={card} className="animate-fadeIn">
            <SectionLabel>Current Plan Overview</SectionLabel>
            <div className="flex gap-7 items-start mb-5 flex-wrap">
              {[
                { label: "Plan",         node: <p style={{ ...val, fontWeight: 700 }}>{school.plan}</p> },
                { label: "Students",     node: <p style={val}>{school.students}</p> },
                { label: "Status",       node: <StatusBadge status={school.status} /> },
                { label: "Amount",       node: <p style={{ ...val, fontWeight: 700 }}>{school.amount}</p> },
                { label: "Next Billing", node: <p style={val}>{school.nextBilling}</p> },
              ].map(({ label, node }) => (
                <div key={label}>
                  <p className="text-[0.6875rem] text-slate-400 font-medium m-0 mb-[3px]">{label}</p>
                  {node}
                </div>
              ))}
              <div>
                <p className="text-[0.6875rem] text-slate-400 font-medium m-0 mb-[3px]">Features</p>
                <div className="flex flex-col gap-1 mt-0.5">
                  {school.features.map(f => (
                    <span key={f} className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Icon.Check size={12} /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "Change Plan",         variant: "dark",   onClick: () => setShowChangePlan(true) },
                { label: "Modify Student Limit", variant: "dark",  onClick: () => {} },
                { label: "Cancel Subscription", variant: "danger", onClick: () => setShowCancelModal(true), icon: <Icon.Cancel /> },
              ].map(({ label, variant, onClick, icon }) => (
                <button key={label} onClick={onClick} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "8px 14px", borderRadius: "var(--radius-lg)",
                  fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  ...(variant === "dark"   ? { background: "var(--color-slate-800)", color: "#fff", border: "none" } : {}),
                  ...(variant === "danger" ? { background: "transparent", color: "var(--color-danger-600)", border: "1px solid var(--color-danger-200)" } : {}),
                }}>
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 2: Billing & History ── */}
        <div className="card p-5 animate-fadeIn">
          <SectionLabel>Billing and History</SectionLabel>
          <div className="grid grid-cols-3 gap-4">

            {/* Subscription History */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
              <p className="text-xs text-[var(--text-secondary)] font-semibold mb-2.5">Subscription History Table</p>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    {["ID", "Date", "Action", "Admin", "Status"].map(h => (
                      <th key={h} className="text-left pb-2 font-semibold text-[0.6875rem] uppercase tracking-[0.05em] text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUBSCRIPTION_HISTORY.map((row, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-[7px] font-mono text-brand-600 text-[0.6875rem]">{row.id}</td>
                      <td className="py-[7px] pr-1.5 text-[var(--text-secondary)] whitespace-nowrap">{row.date}</td>
                      <td className="py-[7px] pr-1.5">
                        <span className="block font-medium text-[var(--text-primary)]">{row.action}</span>
                        <span className="font-mono text-[0.6875rem] text-[var(--text-muted)]">{row.price}</span>
                      </td>
                      <td className="py-[7px] pr-1.5 text-[var(--text-secondary)] whitespace-nowrap">{row.admin}</td>
                      <td className="py-[7px]"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                <button className="bg-transparent border border-[var(--border-default)] rounded-md px-2 py-[3px] cursor-pointer text-[var(--text-muted)] flex hover:bg-slate-100 transition-colors">
                  <Icon.ChevronLeft />
                </button>
                <span className="text-xs text-[var(--text-muted)]">Page 1</span>
                <button className="bg-transparent border border-[var(--border-default)] rounded-md px-2 py-[3px] cursor-pointer text-[var(--text-muted)] flex hover:bg-slate-100 transition-colors">
                  <Icon.ChevronRight />
                </button>
              </div>
            </div>

            {/* Invoice History */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
              <p className="text-xs text-[var(--text-secondary)] font-semibold mb-2.5">Invoice History Card</p>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    {["Date", "Amount", ""].map((h, i) => (
                      <th key={i} className={`pb-2 font-semibold text-[0.6875rem] uppercase tracking-[0.05em] text-slate-400 ${i === 2 ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INVOICE_HISTORY.map((inv, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-[7px] text-[var(--text-secondary)]">{inv.date}</td>
                      <td className="py-[7px] pr-1.5 font-semibold text-[var(--text-primary)] font-mono">{inv.amount}</td>
                      <td className="py-[7px] text-right">
                        <button className="bg-transparent border-none text-brand-500 cursor-pointer inline-flex hover:text-brand-600 transition-colors">
                          <Icon.Download />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="inline-flex items-center gap-1.5 mt-3 bg-transparent border border-[var(--border-default)] rounded-md px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer font-body hover:bg-white transition-colors">
                <Icon.Download /> Download PDF
              </button>
            </div>

            {/* Payment Methods + Constraints */}
            <div className="flex flex-col gap-2.5">

              {/* Payment Methods */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                <p className="text-xs text-[var(--text-secondary)] font-semibold mb-2.5">Payment Methods Card</p>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="bg-[#1a1f71] text-white text-[0.5625rem] font-extrabold px-[5px] py-0.5 rounded-[3px] tracking-[0.05em]">
                    VISA
                  </div>
                  <span className="text-[0.8125rem] font-medium text-[var(--text-primary)]">Visa **** 4567</span>
                </div>
                <button className="w-full py-2 bg-slate-800 text-white border-none rounded-md text-[0.8125rem] font-semibold cursor-pointer font-body hover:bg-slate-700 transition-colors">
                  Update Payment Method
                </button>
                <p className="text-[0.6875rem] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Note: The payment aer held an update Payment method.
                </p>
              </div>

              {/* Constraints & Usage */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                <p className="text-xs text-[var(--text-secondary)] font-semibold mb-2.5">Constraints and Usage</p>

                {/* Token progress bar */}
                <div className="mb-2.5">
                  <div className="flex justify-between mb-[5px]">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Token Usage</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">329/Unlimited</span>
                  </div>
                  <div className="h-[5px] rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[33%] bg-brand-500 rounded-full" />
                  </div>
                </div>

                {[
                  { label: "Parent Edit", key: "parentEdit" },
                  { label: "Parent Edit Audit", key: "parentEditAudit" },
                  { label: "Parent Edit Appr.", key: "parentEditApproval" },
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between py-[7px] border-t border-slate-100">
                    <span className="text-xs text-[var(--text-secondary)]">{label}</span>
                    <Toggle enabled={constraints[key]} onChange={v => setConstraints(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Plan Comparison Matrix ── */}
        <div className="card p-5 animate-fadeIn">
          <SectionLabel>Plan Comparison Matrix</SectionLabel>
          <table className="w-full border-collapse text-[0.8125rem]">
            <thead>
              <tr>
                <th className="text-left py-2.5 pr-3 text-[var(--text-muted)] font-semibold text-xs uppercase tracking-[0.05em] w-[28%]">
                  Features
                </th>
                {Object.keys(PLANS).map(plan => (
                  <th
                    key={plan}
                    className={[
                      "text-center px-5 py-3 rounded-t-lg font-display",
                      plan === "Enterprise"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-50 text-[var(--text-primary)]",
                    ].join(" ")}
                  >
                    <div className="font-bold text-[0.9375rem]">{plan}</div>
                    <div className="font-normal text-[0.8125rem] opacity-60 font-body mt-0.5">
                      ₹{PLANS[plan].price.toLocaleString()}/mo
                    </div>
                    {plan === school.plan && (
                      <span className="inline-block mt-[5px] bg-brand-500 text-white text-[0.625rem] font-bold px-2 py-0.5 rounded-full tracking-[0.05em]">
                        CURRENT
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
=======
              {MATRIX_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 1 ? "bg-slate-50" : ""}>
                  <td className="py-2.5 pr-3 text-[var(--text-secondary)] font-medium">{row.label}</td>
                  {["Starter", "Growth", "Enterprise"].map(plan => {
                    const v = row[plan];
                    return (
                      <td key={plan} style={{
                        textAlign: "center", padding: "10px 20px",
                        background: plan === "Enterprise" ? "rgba(15,32,68,0.03)" : "transparent",
                      }}>
                        {v === true  ? <span style={{ display: "inline-flex", justifyContent: "center" }}><Icon.Check size={15} /></span>
                        : v === false ? <span style={{ display: "inline-flex", justifyContent: "center" }}><Icon.X size={13} /></span>
                        : <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>{v}</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td />
                {["Starter", "Growth", "Enterprise"].map(plan => (
                  <td
                    key={plan}
                    className={[
                      "text-center px-5 py-3",
                      plan === "Enterprise" ? "bg-[rgba(15,32,68,0.03)] rounded-b-lg" : "",
                    ].join(" ")}
                  >
                    <button
                      onClick={() => { setSelectedPlan(plan); if (plan !== school.plan) setShowChangePlan(true); }}
                      style={{
                        padding: "6px 16px", borderRadius: "var(--radius-md)", fontSize: "0.75rem",
                        fontWeight: 600, cursor: plan === school.plan ? "default" : "pointer",
                        border: plan === school.plan ? "none" : "1px solid var(--border-default)",
                        background: plan === school.plan ? "var(--color-brand-600)" : "transparent",
                        color: plan === school.plan ? "#fff" : "var(--text-secondary)",
                        fontFamily: "var(--font-body)",
                      }}>
                      {plan === school.plan ? "Current Plan" : `Switch to ${plan}`}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div >

      {/* ── Change Plan Modal ── */}
      {showChangePlan && (
        <div
          onClick={() => setShowChangePlan(false)}
          className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100]"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-fadeIn bg-white rounded-2xl p-7 w-[420px] shadow-[var(--shadow-modal)]"
          >
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-1">Change Plan</h3>
            <p className="text-[0.8125rem] text-[var(--text-muted)] m-0 mb-5">
              Select a new subscription plan for <strong>{school.name}</strong>
            </p>

            <div className="flex flex-col gap-2">
              {Object.keys(PLANS).map(plan => (
                <div
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={[
                    "flex items-center justify-between px-3.5 py-3 rounded-lg cursor-pointer border-2 transition-[var(--transition-fast)]",
                    selectedPlan === plan
                      ? "border-brand-500 bg-brand-50"
                      : "border-[var(--border-default)] bg-white",
                  ].join(" ")}
                >
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] m-0">{plan}</p>
                    <p className="text-xs text-[var(--text-muted)] m-0">₹{PLANS[plan].price.toLocaleString()}/mo</p>
                  </div>
                  {/* Radio dot */}
                  <div className={[
                    "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0",
                    selectedPlan === plan
                      ? "border-brand-500 bg-brand-500"
                      : "border-[var(--border-default)] bg-transparent",
                  ].join(" ")}>
                    {selectedPlan === plan && (
                      <span className="w-[7px] h-[7px] rounded-full bg-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: "1.25rem" }}>
              <button onClick={() => setShowChangePlan(false)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", background: "transparent", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
              <button onClick={() => setShowChangePlan(false)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-lg)", background: "var(--color-brand-600)", fontSize: "0.875rem", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)" }}>Confirm Change</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Subscription Modal ── */}
      {showCancelModal && (
        <div
          onClick={() => setShowCancelModal(false)}
          className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100]"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-fadeIn bg-white rounded-2xl p-7 w-[380px] shadow-[var(--shadow-modal)] text-center"
          >
            <div className="w-12 h-12 rounded-full bg-danger-100 text-danger-600 flex items-center justify-center mx-auto mb-4">
              <Icon.Warning />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0 mb-1.5">
              Cancel Subscription?
            </h3>
            <p className="text-[0.8125rem] text-[var(--text-muted)] m-0 mb-6 leading-relaxed">
              This will cancel the{" "}
              <strong className="text-[var(--text-primary)]">{school.plan}</strong> plan for{" "}
              <strong className="text-[var(--text-primary)]">{school.name}</strong>.{" "}
              Access continues until the billing period ends.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowCancelModal(false)} style={{ flex: 1, padding: "10px", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", background: "transparent", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)" }}>Keep Active</button>
              <button onClick={() => setShowCancelModal(false)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-lg)", background: "var(--color-danger-600)", fontSize: "0.875rem", fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)" }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}