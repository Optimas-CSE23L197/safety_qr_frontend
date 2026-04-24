import { useState, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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
const MegaphoneIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.044-2.61m7.5 0c1.542.216 3.126.216 4.668 0m-4.668 0a48.748 48.748 0 010-9.18m4.668 9.18c1.542-.216 3.126-.216 4.668 0m-4.668 0a48.748 48.748 0 010-9.18m4.668 0a48.748 48.748 0 01-4.668 0m0 0c-.742.104-1.494.156-2.25.156h-1.5c-1.242 0-2.46.138-3.624.398" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, recipient: "Rahul Sharma", recipientType: "PARENT", school: "Greenwood High", schoolCode: "GWH-001", type: "SCAN_ALERT", channel: "PUSH", status: "SENT", sentAt: "2026-03-07 10:30:15", retryCount: 0, error: null, payload: { token: "tok_abc", scan_result: "SUCCESS", location: "Main Gate" } },
  { id: 2, recipient: "Fatima Khan", recipientType: "PARENT", school: "Greenwood High", schoolCode: "GWH-001", type: "SCAN_ALERT", channel: "PUSH", status: "FAILED", sentAt: "2026-03-07 10:28:03", retryCount: 3, error: "Parent device token invalid", payload: { token: "tok_def", error: "invalid_token" } },
  { id: 3, recipient: "Admin", recipientType: "SCHOOL", school: "Central Public School", schoolCode: "CPS-002", type: "BILLING_ALERT", channel: "EMAIL", status: "SENT", sentAt: "2026-03-07 09:15:22", retryCount: 0, error: null, payload: { amount: 12999, due_date: "2026-04-01", invoice: "INV-001" } },
  { id: 4, recipient: "Akash Gupta", recipientType: "PARENT", school: "Central Public School", schoolCode: "CPS-002", type: "SCAN_ANOMALY", channel: "SMS", status: "QUEUED", sentAt: "2026-03-07 11:45:00", retryCount: 0, error: null, payload: { anomaly_type: "rapid_scan", count: 5, time_window: "5min" } },
  { id: 5, recipient: "Priya Das", recipientType: "PARENT", school: "Greenwood High", schoolCode: "GWH-001", type: "CARD_REPLACED", channel: "EMAIL", status: "SENT", sentAt: "2026-03-06 16:30:10", retryCount: 0, error: null, payload: { old_card: "CRD-001", new_card: "CRD-002", reason: "lost" } },
  { id: 6, recipient: "Arun Mehta", recipientType: "PARENT", school: "DPS Noida", schoolCode: "DPS-003", type: "CARD_EXPIRING", channel: "PUSH", status: "SENT", sentAt: "2026-03-06 14:10:00", retryCount: 0, error: null, payload: { expires_in_days: 7, card_number: "CRD-789" } },
  { id: 7, recipient: "Sunita Roy", recipientType: "PARENT", school: "Ryan International", schoolCode: "RYN-004", type: "SCAN_ALERT", channel: "SMS", status: "FAILED", sentAt: "2026-03-06 13:05:44", retryCount: 2, error: "SMS gateway timeout", payload: { token: "tok_ghi", timestamp: "2026-03-06T13:05:44Z" } },
  { id: 8, recipient: "Admin", recipientType: "SCHOOL", school: "Kendriya Vidyalaya", schoolCode: "KV-005", type: "CARD_REVOKED", channel: "EMAIL", status: "SENT", sentAt: "2026-03-06 11:22:30", retryCount: 0, error: null, payload: { reason: "lost", student_name: "Vikram Nair" } },
  { id: 9, recipient: "Meena Patel", recipientType: "PARENT", school: "Amity School", schoolCode: "AMT-006", type: "SCAN_ANOMALY", channel: "PUSH", status: "SUPPRESSED", sentAt: "2026-03-05 08:44:10", retryCount: 0, error: null, payload: { suppressed_reason: "cooldown", next_allowed: "2026-03-05 08:54:10" } },
  { id: 10, recipient: "Admin", recipientType: "SCHOOL", school: "Greenwood High", schoolCode: "GWH-001", type: "BILLING_ALERT", channel: "EMAIL", status: "QUEUED", sentAt: "2026-03-05 07:00:00", retryCount: 0, error: null, payload: { amount: 5999, due_date: "2026-03-15" } },
];

const SYSTEM_NOTIFICATIONS = [
  { id: 101, title: "System Maintenance", message: "Scheduled downtime on March 15, 2:00 AM IST", type: "MAINTENANCE", sentTo: "ALL_SCHOOLS", sentAt: "2026-03-10 10:00:00", status: "SENT" },
  { id: 102, title: "New Feature Release", message: "Bulk token generation now available", type: "FEATURE_UPDATE", sentTo: "ALL_ADMINS", sentAt: "2026-03-08 09:30:00", status: "SENT" },
  { id: 103, title: "Security Update", message: "Please update your API keys by March 20", type: "SECURITY", sentTo: "ALL_SCHOOLS", sentAt: "2026-03-05 14:00:00", status: "SENT" },
];

const SCHOOLS = ["All Schools", "Greenwood High", "DPS Noida", "Ryan International", "Kendriya Vidyalaya", "Amity School", "Central Public School"];
const TYPES = ["All Types", "SCAN_ALERT", "SCAN_ANOMALY", "BILLING_ALERT", "CARD_EXPIRING", "CARD_REVOKED", "CARD_REPLACED", "SYSTEM_MAINTENANCE", "FEATURE_UPDATE"];
const CHANNELS = ["All Channels", "PUSH", "EMAIL", "SMS", "WHATSAPP"];
const STATUSES = ["All Status", "SENT", "FAILED", "QUEUED", "SUPPRESSED"];
const RECIPIENT_TYPES = ["All", "PARENT", "SCHOOL_ADMIN"];

const STATUS_BADGE = {
  SENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
  QUEUED: "bg-amber-50 text-amber-700 border-amber-200",
  SUPPRESSED: "bg-slate-100 text-slate-600 border-slate-200",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block text-[0.6875rem] font-semibold px-2.5 py-[3px] rounded-full border ${STATUS_BADGE[status] ?? STATUS_BADGE.SUPPRESSED}`}>
    {status}
  </span>
);

const ChannelCell = ({ channel }) => {
  const icons = { PUSH: <PushIcon />, EMAIL: <EmailIcon />, SMS: <SmsIcon />, WHATSAPP: <SmsIcon /> };
  return (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] text-[0.8125rem]">
      <span className="text-[var(--text-muted)]">{icons[channel] || icons.PUSH}</span>
      {channel.charAt(0) + channel.slice(1).toLowerCase()}
    </span>
  );
};

// ─── Send Notification Modal ─────────────────────────────────────────────────
const SendNotificationModal = ({ onClose, onSend }) => {
  const [form, setForm] = useState({
    type: "SYSTEM_MAINTENANCE",
    channel: "EMAIL",
    recipientType: "ALL_SCHOOLS",
    schoolId: "ALL",
    title: "",
    message: "",
    scheduledAt: "",
  });

  const [selectedSchools, setSelectedSchools] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.title || !form.message) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    onSend(form);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-[var(--border-default)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <MegaphoneIcon />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0">Send Notification</h3>
              <p className="text-xs text-[var(--text-muted)] m-0">Broadcast to schools or specific recipients</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Notification Type */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Notification Type</label>
            <select
              value={form.type}
              onChange={e => updateForm("type", e.target.value)}
              className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
            >
              <option value="SYSTEM_MAINTENANCE">🔧 System Maintenance</option>
              <option value="FEATURE_UPDATE">✨ Feature Update</option>
              <option value="SECURITY">🔒 Security Advisory</option>
              <option value="BILLING_ALERT">💰 Billing Alert</option>
              <option value="GENERAL_ANNOUNCEMENT">📢 General Announcement</option>
            </select>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Delivery Channel</label>
            <div className="flex gap-3">
              {["EMAIL", "SMS", "PUSH", "WHATSAPP"].map(ch => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => updateForm("channel", ch)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${form.channel === ch
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50"
                    }`}
                >
                  {ch.charAt(0) + ch.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Type */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Send To</label>
            <div className="flex gap-3">
              {[
                { value: "ALL_SCHOOLS", label: "All Schools", icon: "🏫" },
                { value: "ALL_ADMINS", label: "All Admins", icon: "👨‍💼" },
                { value: "SPECIFIC_SCHOOL", label: "Specific Schools", icon: "🎯" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateForm("recipientType", opt.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${form.recipientType === opt.value
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50"
                    }`}
                >
                  <span className="mr-1">{opt.icon}</span> {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* School Selector (if specific schools) */}
          {form.recipientType === "SPECIFIC_SCHOOL" && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Select Schools</label>
              <select
                multiple
                value={selectedSchools}
                onChange={e => setSelectedSchools(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm min-h-[120px]"
              >
                {SCHOOLS.filter(s => s !== "All Schools").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-muted)] mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Title <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => updateForm("title", e.target.value)}
              placeholder="e.g., Scheduled Maintenance on March 15"
              className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Message <span className="text-rose-500">*</span></label>
            <textarea
              value={form.message}
              onChange={e => updateForm("message", e.target.value)}
              placeholder="Write your notification message here..."
              rows={4}
              className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* Schedule (optional) */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">Schedule (Optional)</label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={e => updateForm("scheduledAt", e.target.value)}
              className="w-full py-2.5 px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[var(--border-default)] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-medium hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.title || !form.message}
            className="px-5 py-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {submitting ? "Sending..." : <><SendIcon /> Send Notification</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Payload Modal ────────────────────────────────────────────────────────────
const PayloadModal = ({ item, onClose }) => (
  <div onClick={onClose} className="fixed inset-0 bg-black/45 flex items-center justify-center z-[200] p-4">
    <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl w-[520px] shadow-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border-default)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
            <CodeIcon />
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)] m-0 text-sm">Notification Payload</p>
            <p className="text-[0.6875rem] text-[var(--text-muted)] m-0">{item.recipient} · {item.type}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><XIcon /></button>
      </div>
      <div className="p-6">
        {item.error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-rose-700 m-0 font-medium">Error: {item.error}</p>
          </div>
        )}
        <pre className="bg-slate-900 text-slate-200 rounded-xl p-4 text-xs font-mono leading-[1.6] overflow-x-auto m-0 max-h-[350px]">
          {JSON.stringify(item.payload, null, 2)}
        </pre>
        <div className="mt-4 flex gap-3 flex-wrap items-center text-xs text-[var(--text-muted)]">
          <span>Channel: <strong className="text-[var(--text-secondary)]">{item.channel}</strong></span>
          <span>·</span>
          <span>Sent: <strong className="text-[var(--text-secondary)]">{item.sentAt}</strong></span>
          <span>·</span>
          <span>Retries: <strong className="text-[var(--text-secondary)]">{item.retryCount || 0}</strong></span>
        </div>
      </div>
      <div className="px-6 py-3 border-t border-[var(--border-default)] flex justify-end">
        <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">Close</button>
      </div>
    </div>
  </div>
);

// ─── Pagination Button ────────────────────────────────────────────────────────
const PageBtn = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border-default)] bg-white text-[var(--text-muted)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
  >
    {children}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Notifications() {
  const [activeTab, setActiveTab] = useState("logs");
  const [school, setSchool] = useState("All Schools");
  const [type, setType] = useState("All Types");
  const [channel, setChannel] = useState("All Channels");
  const [status, setStatus] = useState("All Status");
  const [recipientType, setRecipientType] = useState("All");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [systemNotifs, setSystemNotifs] = useState(SYSTEM_NOTIFICATIONS);

  const filtered = NOTIFICATIONS.filter(n => {
    const matchSchool = school === "All Schools" || n.school === school;
    const matchType = type === "All Types" || n.type === type;
    const matchChannel = channel === "All Channels" || n.channel === channel;
    const matchStatus = status === "All Status" || n.status === status;
    const matchRecipient = recipientType === "All" || n.recipientType === recipientType;
    return matchSchool && matchType && matchChannel && matchStatus && matchRecipient;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = {
    total: NOTIFICATIONS.length,
    sent: NOTIFICATIONS.filter(n => n.status === "SENT").length,
    failed: NOTIFICATIONS.filter(n => n.status === "FAILED").length,
    successRate: ((NOTIFICATIONS.filter(n => n.status === "SENT").length / NOTIFICATIONS.length) * 100).toFixed(1),
  };

  const handleSendNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      channel: notification.channel,
      sentTo: notification.recipientType,
      sentAt: new Date().toLocaleString(),
      status: "SENT",
    };
    setSystemNotifs(prev => [newNotif, ...prev]);
  };

  return (
    <div className="bg-[var(--bg-page)] min-h-screen">
      {showSendModal && <SendNotificationModal onClose={() => setShowSendModal(false)} onSend={handleSendNotification} />}
      {payload && <PayloadModal item={payload} onClose={() => setPayload(null)} />}

      {/* Header */}
      <div className="bg-white border-b border-[var(--border-default)] sticky top-0 z-40">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] m-0 flex items-center gap-3">
                <BellIcon /> Notifications
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">Platform-wide delivery logs and broadcast system</p>
            </div>
            <button
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-lg hover:opacity-90 transition-all"
            >
              <MegaphoneIcon /> Send Notification
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-[var(--border-default)]">
            {[
              { id: "logs", label: "📋 Delivery Logs", count: NOTIFICATIONS.length },
              { id: "broadcast", label: "📢 Broadcast History", count: systemNotifs.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${activeTab === tab.id
                  ? "bg-brand-50 text-brand-700 border-b-2 border-brand-600"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
              >
                {tab.label} <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-xs">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[var(--border-default)] p-5">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Total Notifications</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.total.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border-default)] p-5">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Delivery Rate</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.successRate}%</p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border-default)] p-5">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Failed</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{stats.failed.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border-default)] p-5">
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wide">Avg. Retry Count</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">0.8</p>
          </div>
        </div>

        {activeTab === "logs" ? (
          <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50">
              <div className="flex flex-wrap gap-3 items-center">
                <select value={school} onChange={e => { setSchool(e.target.value); setPage(1); }} className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white">
                  {SCHOOLS.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={channel} onChange={e => { setChannel(e.target.value); setPage(1); }} className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white">
                  {CHANNELS.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={recipientType} onChange={e => { setRecipientType(e.target.value); setPage(1); }} className="py-2 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white">
                  {RECIPIENT_TYPES.map(r => <option key={r}>{r === "All" ? "All Recipients" : r === "PARENT" ? "Parents" : "School Admins"}</option>)}
                </select>
                <button className="ml-auto text-xs text-brand-600 font-medium">Export Logs</button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[var(--border-default)]">
                    {["Recipient", "Type", "Channel", "Status", "Sent At", "Retries", "Details"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center text-[var(--text-muted)]">No notifications found</td></tr>
                  ) : rows.map((n, i) => (
                    <tr key={n.id} className={`border-b border-[var(--border-default)] ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><SchoolBuildingIcon /></div>
                          <div>
                            <p className="font-semibold text-sm text-[var(--text-primary)]">{n.recipient}</p>
                            <p className="text-xs text-[var(--text-muted)]">{n.school}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs font-mono text-brand-600 font-medium">{n.type}</span></td>
                      <td className="px-4 py-3"><ChannelCell channel={n.channel} /></td>
                      <td className="px-4 py-3"><StatusBadge status={n.status} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{n.sentAt}</td>
                      <td className="px-4 py-3 text-xs text-center">
                        {n.retryCount > 0 ? <span className="text-amber-600 font-medium">{n.retryCount}</span> : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setPayload(n)} className="text-brand-600 text-xs font-semibold hover:underline">View →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-[var(--border-default)] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">Rows per page:</span>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="py-1.5 px-2 border rounded-md text-sm">
                  {[10, 25, 50].map(n => <option key={n}>{n}</option>)}
                </select>
                <span className="text-xs text-[var(--text-muted)]">{Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
              </div>
              <div className="flex gap-1">
                <PageBtn onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeftIcon /></PageBtn>
                <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeftIcon /></PageBtn>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p = page;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-md border text-sm ${p === page ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border-default)] bg-white hover:bg-slate-50"}`}>
                      {p}
                    </button>
                  );
                })}
                <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRightIcon /></PageBtn>
                <PageBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRightIcon /></PageBtn>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50">
              <h3 className="font-semibold text-[var(--text-primary)]">Broadcast History</h3>
            </div>
            <div className="divide-y divide-[var(--border-default)]">
              {systemNotifs.map(notif => (
                <div key={notif.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">{notif.type}</span>
                        <span className="text-xs text-[var(--text-muted)]">{notif.sentAt}</span>
                      </div>
                      <h4 className="font-semibold text-[var(--text-primary)] mb-1">{notif.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{notif.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-[var(--text-muted)]">Sent to: <strong>{notif.sentTo}</strong></span>
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckIcon /> {notif.status}</span>
                      </div>
                    </div>
                    <button className="text-brand-600 text-sm font-medium">View Details →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

