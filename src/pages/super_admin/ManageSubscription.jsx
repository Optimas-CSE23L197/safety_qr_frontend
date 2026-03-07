import { useState } from "react";

const PLAN_FEATURES = {
  Starter: ["50 Students", "Basic QR Tokens", "Email Notifications", "Standard Support"],
  Growth: ["300 Students", "Unlimited Tokens", "SMS + Email Alerts", "Priority Support", "Parent Edit"],
  Enterprise: ["Unlimited Students", "Unlimited Tokens", "Full Analytics", "Parent Edit Audit", "Dedicated Support", "Custom Branding"],
};

const PLAN_PRICES = { Starter: "₹1,999", Growth: "₹5,999", Enterprise: "₹12,999" };

const StatusBadge = ({ status }) => {
  const colors = {
    Trialing: "bg-amber-100 text-amber-700 border border-amber-200",
    Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Canceled: "bg-red-100 text-red-700 border border-red-200",
    Past_Due: "bg-orange-100 text-orange-700 border border-orange-200",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[status] || colors.Active}`}>
      {status}
    </span>
  );
};

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-indigo-600" : "bg-gray-300"}`}
  >
    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-4" : ""}`} />
  </button>
);

export default function ManageSubscription() {
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [constraints, setConstraints] = useState({
    parentEdit: true,
    parentEditAudit: false,
    parentEditApproval: true,
  });

  const school = {
    name: "Ryan International",
    location: "New Delhi, India",
    email: "ryanannnt@gmail.com",
    plan: "Enterprise",
    students: 329,
    status: "Trialing",
    amount: "₹12,999/mo",
    nextBilling: "01 Apr 2026",
    features: ["Unlimited Tokens", "Full Analytics", "Parent Edit Audit"],
    tokenUsage: 329,
    tokenLimit: "Unlimited",
  };

  const subscriptionHistory = [
    { id: "SUB123", date: "15 Feb 2026", action: "Growth to Enterprise", price: "₹5,999 to ₹12,999", admin: "Admin User 1", status: "Applied" },
    { id: "SUB123", date: "15 Feb 2026", action: "Growth to Enterprise", price: "₹5,999 to ₹12,999", admin: "Admin User 1", status: "Applied" },
  ];

  const invoiceHistory = [
    { date: "01 Feb 2026", amount: "₹12,999/mo" },
    { date: "29 Mar 2026", amount: "₹5,999/mo" },
    { date: "17 Mar 2026", amount: "₹5,999/mo" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-800">Manage Subscription: {school.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Platform Control / Subscriptions / Manage</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">SA</div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-700">Super Admin</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Super Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Row 1: School Header + Current Plan */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {/* School Profile Header */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">School Profile Header</p>
            <h2 className="text-xl font-bold text-slate-800">{school.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{school.location}</p>
            <p className="text-sm text-slate-500 mt-2">School Contact email: <span className="text-indigo-600">{school.email}</span></p>
            <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
              View School
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          </div>

          {/* Current Plan Overview */}
          <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Current Plan Overview</p>
            <div className="flex items-start gap-8 mb-4">
              {[
                { label: "Plan", value: school.plan, bold: true },
                { label: "Students", value: school.students },
                { label: "Status", value: <StatusBadge status={school.status} /> },
                { label: "Amount", value: school.amount, bold: true },
                { label: "Next Billing", value: school.nextBilling },
              ].map(({ label, value, bold }) => (
                <div key={label}>
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  {typeof value === "string" ? (
                    <p className={`text-sm ${bold ? "font-bold text-slate-800" : "text-slate-700"}`}>{value}</p>
                  ) : value}
                </div>
              ))}
              <div>
                <p className="text-xs text-slate-400 mb-1">Features</p>
                <ul className="space-y-0.5">
                  {school.features.map(f => (
                    <li key={f} className="flex items-center gap-1 text-xs text-slate-600">
                      <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChangePlan(true)}
                className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Change Plan
              </button>
              <button className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                Modify Student Limit
              </button>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Billing History */}
        <div className="mb-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Billing and History</p>
            <div className="grid grid-cols-3 gap-4">
              {/* Subscription History Table */}
              <div className="col-span-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-3">Subscription History Table</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] tracking-wide">
                      <th className="text-left pb-2">ID</th>
                      <th className="text-left pb-2">Date</th>
                      <th className="text-left pb-2">Action</th>
                      <th className="text-left pb-2">Status</th>
                      <th className="text-left pb-2">Admin</th>
                      <th className="text-left pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscriptionHistory.map((row, i) => (
                      <tr key={i} className="text-slate-600">
                        <td className="py-2 font-mono text-indigo-600">{row.id}</td>
                        <td className="py-2">{row.date}</td>
                        <td className="py-2">
                          <div>{row.action}</div>
                          <div className="text-slate-400">{row.price}</div>
                        </td>
                        <td className="py-2">
                          <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">{row.status}</span>
                        </td>
                        <td className="py-2">{row.admin}</td>
                        <td className="py-2">
                          <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between mt-3 text-slate-400 text-xs">
                  <button className="p-1 hover:text-slate-600">‹</button>
                  <span>Page 1</span>
                  <button className="p-1 hover:text-slate-600">›</button>
                </div>
              </div>

              {/* Invoice History */}
              <div className="col-span-1 bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-3">Invoice History Card</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] tracking-wide">
                      <th className="text-left pb-2">Date</th>
                      <th className="text-left pb-2">Amount</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoiceHistory.map((inv, i) => (
                      <tr key={i} className="text-slate-600">
                        <td className="py-2">{inv.date}</td>
                        <td className="py-2 font-semibold">{inv.amount}</td>
                        <td className="py-2">
                          <button className="text-indigo-500 hover:text-indigo-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="mt-3 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF
                </button>
              </div>

              {/* Payment Methods + Constraints */}
              <div className="col-span-1 space-y-4">
                {/* Payment Methods */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-3">Payment Methods Card</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">VISA</div>
                    <span className="text-sm text-slate-700 font-medium">Visa **** 4567</span>
                  </div>
                  <button className="w-full py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                    Update Payment Method
                  </button>
                  <p className="text-[10px] text-slate-400 mt-2">Note: The payment aer held an update Payment method.</p>
                </div>

                {/* Constraints and Usage */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-3">Constraints and Usage</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Token Usage</span>
                      <span className="text-slate-500">{school.tokenUsage}/{school.tokenLimit}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "40%" }} />
                    </div>
                  </div>
                  {[
                    { label: "Parent Edit", key: "parentEdit" },
                    { label: "Parent Edit Audit", key: "parentEditAudit" },
                    { label: "Parent Edit Appr.", key: "parentEditApproval" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between py-1.5 border-t border-slate-100">
                      <span className="text-xs text-slate-600">{label}</span>
                      <Toggle
                        enabled={constraints[key]}
                        onChange={(v) => setConstraints(prev => ({ ...prev, [key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Plan Comparison Matrix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Plan Comparison Matrix</p>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-slate-500 font-semibold py-2 w-1/4">Features</th>
                {Object.keys(PLAN_FEATURES).map(plan => (
                  <th key={plan} className={`text-center py-2 font-semibold ${plan === "Enterprise" ? "bg-slate-800 text-white rounded-t-lg" : "text-slate-700"}`}>
                    <div>{plan}</div>
                    <div className={`text-xs font-normal mt-0.5 ${plan === "Enterprise" ? "text-slate-300" : "text-slate-400"}`}>{PLAN_PRICES[plan]}/mo</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Students", "Tokens", "Analytics", "Support", "Parent Edit", "Parent Edit Audit", "Custom Branding"].map((feat, i) => {
                const availability = {
                  Starter: [true, false, false, false, false, false, false],
                  Growth:  [true, true,  false, true,  true,  false, false],
                  Enterprise: [true, true, true, true, true, true, true],
                };
                return (
                  <tr key={feat} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                    <td className="py-2 px-2 text-slate-600 text-xs">{feat}</td>
                    {Object.keys(PLAN_FEATURES).map(plan => (
                      <td key={plan} className={`py-2 text-center ${plan === "Enterprise" ? "bg-slate-800/5" : ""}`}>
                        {availability[plan][i] ? (
                          <svg className="w-4 h-4 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg className="w-4 h-4 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <td />
                {Object.keys(PLAN_FEATURES).map(plan => (
                  <td key={plan} className={`py-3 text-center ${plan === "Enterprise" ? "bg-slate-800/5 rounded-b-lg" : ""}`}>
                    <button className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${plan === school.plan ? "bg-indigo-600 text-white" : "border border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"}`}>
                      {plan === school.plan ? "Current Plan" : `Switch to ${plan}`}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Plan Modal */}
      {showChangePlan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Change Plan</h3>
            <p className="text-sm text-slate-500 mb-5">Select a new plan for {school.name}</p>
            <div className="space-y-3">
              {Object.keys(PLAN_FEATURES).map(plan => (
                <div key={plan} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${plan === school.plan ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"}`}>
                  <div>
                    <p className="font-semibold text-slate-800">{plan}</p>
                    <p className="text-xs text-slate-500">{PLAN_PRICES[plan]}/mo</p>
                  </div>
                  {plan === school.plan && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Current</span>}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowChangePlan(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => setShowChangePlan(false)} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Confirm Change</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-1">Cancel Subscription?</h3>
            <p className="text-sm text-slate-500 text-center mb-5">This will cancel the subscription for <strong>{school.name}</strong>. The school will lose access at the end of the billing period.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Keep Active</button>
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}