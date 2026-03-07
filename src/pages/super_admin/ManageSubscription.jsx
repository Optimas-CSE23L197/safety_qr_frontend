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
  Check: ({ size = 14, color = "var(--color-success-500)" }) => (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ size = 13 }) => (
    <svg width={size} height={size} fill="none" stroke="var(--color-slate-300)" strokeWidth="2.5" viewBox="0 0 24 24">
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
  Starter:    { price: 1999  },
  Growth:     { price: 5999  },
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
  { date: "29 Mar 2026", amount: "₹5,999/mo"  },
  { date: "17 Mar 2026", amount: "₹5,999/mo"  },
];

// ─── Shared small components ──────────────────────────────────────────────────
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
    <span style={{
      position: "absolute", top: 2,
      left: enabled ? 18 : 2, width: 16, height: 16,
      background: "#fff", borderRadius: "50%",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      transition: "left 0.2s cubic-bezier(0.34,1.56,0.64,1)",
    }} />
  </button>
);

const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: "0.6875rem", fontWeight: 600, color: "var(--color-slate-400)",
    letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.875rem",
  }}>
    {children}
  </p>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageSubscription() {
  const [showChangePlan,  setShowChangePlan]  = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan,    setSelectedPlan]    = useState("Enterprise");
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
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

      {/* ── Header ── */}
      <div style={{
        background: "var(--bg-header)", borderBottom: "1px solid var(--border-default)",
        height: "var(--header-height)", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 2rem",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Manage Subscription: {school.name}
          </h1>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            Platform Control / Subscriptions /{" "}
            <span style={{ color: "var(--color-brand-600)" }}>Manage</span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
            <Icon.Bell />
          </button>
          <div style={{ width: 1, height: 28, background: "var(--border-default)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-brand-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>SA</div>
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
        <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "1rem" }}>

          {/* School Profile */}
          <div style={card} className="animate-fadeIn">
            <SectionLabel>School Profile Header</SectionLabel>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-slate-900)", margin: "0 0 2px" }}>{school.name}</h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 10px" }}>{school.location}</p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 12px" }}>
              School Contact email:{" "}
              <a href={`mailto:${school.email}`} style={{ color: "var(--color-brand-600)", fontWeight: 500 }}>{school.email}</a>
            </p>
            <button style={{ background: "none", border: "none", color: "var(--color-brand-600)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, padding: 0 }}>
              View School <Icon.ExternalLink />
            </button>
          </div>

          {/* Current Plan Overview */}
          <div style={card} className="animate-fadeIn">
            <SectionLabel>Current Plan Overview</SectionLabel>
            <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              {[
                { label: "Plan",         node: <p style={{ ...val, fontWeight: 700 }}>{school.plan}</p> },
                { label: "Students",     node: <p style={val}>{school.students}</p> },
                { label: "Status",       node: <StatusBadge status={school.status} /> },
                { label: "Amount",       node: <p style={{ ...val, fontWeight: 700 }}>{school.amount}</p> },
                { label: "Next Billing", node: <p style={val}>{school.nextBilling}</p> },
              ].map(({ label, node }) => (
                <div key={label}>
                  <p style={lbl}>{label}</p>
                  {node}
                </div>
              ))}
              <div>
                <p style={lbl}>Features</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
                  {school.features.map(f => (
                    <span key={f} style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
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
        <div style={card} className="animate-fadeIn">
          <SectionLabel>Billing and History</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>

            {/* Subscription History Table */}
            <div style={inner}>
              <p style={{ ...lbl, marginBottom: 10, fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Subscription History Table</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                <thead>
                  <tr>
                    {["ID", "Date", "Action", "Admin", "Status"].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUBSCRIPTION_HISTORY.map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--color-slate-100)" }}>
                      <td style={{ padding: "7px 0", fontFamily: "var(--font-mono)", color: "var(--color-brand-600)", fontSize: "0.6875rem" }}>{row.id}</td>
                      <td style={{ padding: "7px 6px 7px 0", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{row.date}</td>
                      <td style={{ padding: "7px 6px 7px 0" }}>
                        <span style={{ display: "block", fontWeight: 500, color: "var(--text-primary)" }}>{row.action}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: "var(--text-muted)" }}>{row.price}</span>
                      </td>
                      <td style={{ padding: "7px 6px 7px 0", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{row.admin}</td>
                      <td style={{ padding: "7px 0" }}><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--color-slate-100)" }}>
                <button style={{ background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "3px 8px", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><Icon.ChevronLeft /></button>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Page 1</span>
                <button style={{ background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "3px 8px", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><Icon.ChevronRight /></button>
              </div>
            </div>

            {/* Invoice History */}
            <div style={inner}>
              <p style={{ ...lbl, marginBottom: 10, fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Invoice History Card</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                <thead>
                  <tr>
                    {["Date", "Amount", ""].map((h, i) => (
                      <th key={i} style={{ ...thStyle, textAlign: i === 2 ? "right" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INVOICE_HISTORY.map((inv, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--color-slate-100)" }}>
                      <td style={{ padding: "7px 0", color: "var(--text-secondary)" }}>{inv.date}</td>
                      <td style={{ padding: "7px 6px 7px 0", fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{inv.amount}</td>
                      <td style={{ padding: "7px 0", textAlign: "right" }}>
                        <button style={{ background: "none", border: "none", color: "var(--color-brand-500)", cursor: "pointer", display: "inline-flex" }}><Icon.Download /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button style={{
                display: "inline-flex", alignItems: "center", gap: 5, marginTop: 12,
                background: "none", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)", padding: "6px 12px",
                fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}>
                <Icon.Download /> Download PDF
              </button>
            </div>

            {/* Right column: Payment + Constraints */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Payment Methods */}
              <div style={inner}>
                <p style={{ ...lbl, marginBottom: 10, fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Payment Methods Card</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ background: "#1a1f71", color: "#fff", fontSize: "0.5625rem", fontWeight: 800, padding: "2px 5px", borderRadius: 3, letterSpacing: "0.05em" }}>VISA</div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-primary)" }}>Visa **** 4567</span>
                </div>
                <button style={{ width: "100%", padding: "8px", background: "var(--color-slate-800)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                  Update Payment Method
                </button>
                <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>
                  Note: The payment aer held an update Payment method.
                </p>
              </div>

              {/* Constraints & Usage */}
              <div style={inner}>
                <p style={{ ...lbl, marginBottom: 10, fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Constraints and Usage</p>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)" }}>Token Usage</span>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>329/Unlimited</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 9999, background: "var(--color-slate-200)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "33%", background: "var(--color-brand-500)", borderRadius: 9999 }} />
                  </div>
                </div>
                {[
                  { label: "Parent Edit",       key: "parentEdit"         },
                  { label: "Parent Edit Audit",  key: "parentEditAudit"    },
                  { label: "Parent Edit Appr.",  key: "parentEditApproval" },
                ].map(({ label, key }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid var(--color-slate-100)" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{label}</span>
                    <Toggle enabled={constraints[key]} onChange={v => setConstraints(p => ({ ...p, [key]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Plan Comparison Matrix ── */}
        <div style={card} className="animate-fadeIn">
          <SectionLabel>Plan Comparison Matrix</SectionLabel>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px 10px 0", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", width: "28%" }}>Features</th>
                {Object.keys(PLANS).map(plan => (
                  <th key={plan} style={{
                    textAlign: "center", padding: "12px 20px",
                    background: plan === "Enterprise" ? "var(--color-slate-800)" : "var(--color-slate-50)",
                    color: plan === "Enterprise" ? "#fff" : "var(--text-primary)",
                    borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                    fontFamily: "var(--font-display)",
                  }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{plan}</div>
                    <div style={{ fontWeight: 400, fontSize: "0.8125rem", opacity: 0.6, fontFamily: "var(--font-body)", marginTop: 2 }}>
                      ₹{PLANS[plan].price.toLocaleString()}/mo
                    </div>
                    {plan === school.plan && (
                      <span style={{ display: "inline-block", marginTop: 5, background: "var(--color-brand-500)", color: "#fff", fontSize: "0.625rem", fontWeight: 700, padding: "2px 8px", borderRadius: 9999, letterSpacing: "0.05em" }}>CURRENT</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 1 ? "var(--color-slate-50)" : "transparent" }}>
                  <td style={{ padding: "10px 12px 10px 0", color: "var(--text-secondary)", fontWeight: 500 }}>{row.label}</td>
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
                  <td key={plan} style={{
                    textAlign: "center", padding: "12px 20px",
                    background: plan === "Enterprise" ? "rgba(15,32,68,0.03)" : "transparent",
                    borderRadius: plan === "Enterprise" ? "0 0 var(--radius-lg) var(--radius-lg)" : 0,
                  }}>
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
      </div>

      {/* ── Change Plan Modal ── */}
      {showChangePlan && (
        <div
          onClick={() => setShowChangePlan(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
        >
          <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", padding: "1.75rem", width: 420, boxShadow: "var(--shadow-modal)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>Change Plan</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 1.25rem" }}>Select a new subscription plan for <strong>{school.name}</strong></p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.keys(PLANS).map(plan => (
                <div
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", borderRadius: "var(--radius-lg)", cursor: "pointer",
                    border: `2px solid ${selectedPlan === plan ? "var(--color-brand-500)" : "var(--border-default)"}`,
                    background: selectedPlan === plan ? "var(--color-brand-50)" : "#fff",
                    transition: "var(--transition-fast)",
                  }}>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{plan}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>₹{PLANS[plan].price.toLocaleString()}/mo</p>
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `2px solid ${selectedPlan === plan ? "var(--color-brand-500)" : "var(--border-default)"}`,
                    background: selectedPlan === plan ? "var(--color-brand-500)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {selectedPlan === plan && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
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
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
        >
          <div onClick={e => e.stopPropagation()} className="animate-fadeIn" style={{ background: "#fff", borderRadius: "var(--radius-2xl)", padding: "1.75rem", width: 380, boxShadow: "var(--shadow-modal)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-danger-100)", color: "var(--color-danger-600)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Icon.Warning />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>Cancel Subscription?</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              This will cancel the <strong style={{ color: "var(--text-primary)" }}>{school.plan}</strong> plan for{" "}
              <strong style={{ color: "var(--text-primary)" }}>{school.name}</strong>. Access continues until the billing period ends.
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