import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const BellIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1,  recipient: "Rahul Sharma (Student)",  school: "Greenwood High",       type: "SCAN_ALERT",    channel: "PUSH",  status: "SENT",       sentAt: "2026-03-07 10:30:15 AM", error: null,                           payload: { token: "tok_abc", scan_result: "SUCCESS" } },
  { id: 2,  recipient: "Fatima Khan (Student)",   school: "Greenwood High",       type: "SCAN_ALERT",    channel: "PUSH",  status: "FAILED",     sentAt: "2026-03-07 10:28:03 AM", error: '"Parent device token invalid"', payload: { token: "tok_def", error: "invalid_token" } },
  { id: 3,  recipient: "Central Public School",   school: "School",               type: "BILLING_ALERT", channel: "EMAIL", status: "SENT",       sentAt: "2026-03-07 09:15:22 AM", error: null,                           payload: { amount: 12999, due_date: "2026-04-01" } },
  { id: 4,  recipient: "Akash Gupta (Student)",   school: "Central Public School",type: "SCAN_ANOMALY",  channel: "SMS",   status: "QUEUED",     sentAt: "2026-03-07 11:45:00 AM", error: null,                           payload: { anomaly_type: "rapid_scan", count: 5 } },
  { id: 5,  recipient: "Priya Das (Student)",     school: "Greenwood High",       type: "CARD_REPLACED", channel: "EMAIL", status: "SENT",       sentAt: "2026-03-06 04:30:10 PM", error: null,                           payload: { old_card: "CRD-001", new_card: "CRD-002" } },
  { id: 6,  recipient: "Arun Mehta (Student)",    school: "DPS Noida",            type: "CARD_EXPIRING", channel: "PUSH",  status: "SENT",       sentAt: "2026-03-06 02:10:00 PM", error: null,                           payload: { expires_in_days: 7 } },
  { id: 7,  recipient: "Sunita Roy (Student)",    school: "Ryan International",   type: "SCAN_ALERT",    channel: "SMS",   status: "FAILED",     sentAt: "2026-03-06 01:05:44 PM", error: '"SMS gateway timeout"',         payload: { token: "tok_ghi" } },
  { id: 8,  recipient: "Vikram Nair (Student)",   school: "Kendriya Vidyalaya",   type: "CARD_REVOKED",  channel: "EMAIL", status: "SENT",       sentAt: "2026-03-06 11:22:30 AM", error: null,                           payload: { reason: "lost" } },
  { id: 9,  recipient: "Meena Patel (Student)",   school: "Amity School",         type: "SCAN_ANOMALY",  channel: "PUSH",  status: "SUPPRESSED", sentAt: "2026-03-05 08:44:10 AM", error: null,                           payload: { suppressed_reason: "cooldown" } },
  { id: 10, recipient: "Deepak Sharma (Student)", school: "Greenwood High",       type: "BILLING_ALERT", channel: "EMAIL", status: "QUEUED",     sentAt: "2026-03-05 07:00:00 AM", error: null,                           payload: { amount: 5999 } },
  { id: 11, recipient: "Kavya Singh (Student)",   school: "DPS Noida",            type: "SCAN_ALERT",    channel: "PUSH",  status: "SENT",       sentAt: "2026-03-04 03:15:00 PM", error: null,                           payload: { token: "tok_jkl" } },
  { id: 12, recipient: "Ravi Kumar (Student)",    school: "Central Public School",type: "CARD_REPLACED", channel: "SMS",   status: "FAILED",     sentAt: "2026-03-04 12:50:00 PM", error: '"Number unreachable"',          payload: { old_card: "CRD-003" } },
];

const SCHOOLS      = ["All Schools", "Greenwood High", "DPS Noida", "Ryan International", "Kendriya Vidyalaya", "Amity School", "Central Public School"];
const TYPES        = ["All Types",   "SCAN_ALERT", "SCAN_ANOMALY", "BILLING_ALERT", "CARD_EXPIRING", "CARD_REVOKED", "CARD_REPLACED"];
const CHANNELS     = ["All Channels","PUSH", "EMAIL", "SMS"];
const STATUSES     = ["All Status",  "SENT", "FAILED", "QUEUED", "SUPPRESSED"];
const DATE_RANGES  = ["Last 30 Days", "Last 7 Days", "Last 24h", "This Month", "Custom"];
const PER_PAGE_OPTS = [10, 25, 50];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_BADGE = {
  SENT:       "bg-success-100 text-success-700",
  FAILED:     "bg-danger-100  text-danger-700",
  QUEUED:     "bg-warning-100 text-warning-700",
  SUPPRESSED: "bg-slate-100   text-slate-500",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block text-[0.6875rem] font-semibold px-2.5 py-[3px] rounded-full ${STATUS_BADGE[status] ?? STATUS_BADGE.SUPPRESSED}`}>
    {status}
  </span>
);

// ─── Channel Cell ─────────────────────────────────────────────────────────────
const ChannelCell = ({ channel }) => {
  const icons = { PUSH: <PushIcon />, EMAIL: <EmailIcon />, SMS: <SmsIcon /> };
  return (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] text-[0.8125rem]">
      <span className="text-[var(--text-muted)]">{icons[channel]}</span>
      {channel.charAt(0) + channel.slice(1).toLowerCase()}
    </span>
  );
};

// ─── Dropdown Select ──────────────────────────────────────────────────────────
const DropSelect = ({ value, options, onChange, width = 160 }) => (
  <div className="relative" style={{ width }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-[34px] appearance-none border border-[var(--border-default)] rounded-lg text-[0.8125rem] text-[var(--text-secondary)] font-body bg-white pl-2.5 pr-8 outline-none cursor-pointer"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <span className="absolute right-[9px] top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
      <ChevronDownIcon size={12} />
    </span>
  </div>
);

// ─── Payload Modal ────────────────────────────────────────────────────────────
const PayloadModal = ({ item, onClose }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100]"
  >
    <div
      onClick={e => e.stopPropagation()}
      className="animate-fadeIn bg-white rounded-2xl w-[480px] shadow-[var(--shadow-modal)] overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-default)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[30px] h-[30px] rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
            <CodeIcon />
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)] m-0 text-sm">Notification Payload</p>
            <p className="text-[0.6875rem] text-[var(--text-muted)] m-0">{item.recipient} · {item.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex p-1 hover:text-[var(--text-secondary)] transition-colors"
        >
          <XIcon />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {item.error && (
          <div className="bg-danger-50 border border-danger-100 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-danger-700 m-0 font-medium">Error: {item.error}</p>
          </div>
        )}
        <pre className="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs font-mono leading-[1.7] overflow-x-auto m-0 max-h-[300px]">
          {JSON.stringify(item.payload, null, 2)}
        </pre>
        <div className="mt-2.5 flex gap-1.5 flex-wrap items-center">
          <span className="text-[0.6875rem] text-[var(--text-muted)]">
            Channel: <strong className="text-[var(--text-secondary)]">{item.channel}</strong>
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[0.6875rem] text-[var(--text-muted)]">
            Sent: <strong className="text-[var(--text-secondary)]">{item.sentAt}</strong>
          </span>
          <span className="text-slate-300">·</span>
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border-default)] flex justify-end">
        <button
          onClick={onClose}
          className="py-[7px] px-4 bg-slate-800 text-white border-none rounded-lg text-[0.8125rem] font-semibold cursor-pointer font-body hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// ─── Pagination Button ────────────────────────────────────────────────────────
const PageBtn = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center w-7 h-7 rounded border border-[var(--border-default)] bg-transparent text-[var(--text-muted)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50 transition-colors"
  >
    {children}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Notifications() {
  const [school,    setSchool]    = useState("All Schools");
  const [type,      setType]      = useState("All Types");
  const [channel,   setChannel]   = useState("All Channels");
  const [status,    setStatus]    = useState("All Status");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [perPage,   setPerPage]   = useState(10);
  const [page,      setPage]      = useState(1);
  const [payload,   setPayload]   = useState(null);

  const filtered = NOTIFICATIONS.filter(n => {
    const matchSchool  = school  === "All Schools"  || n.school  === school  || n.school.toLowerCase().includes(school.toLowerCase());
    const matchType    = type    === "All Types"    || n.type    === type;
    const matchChannel = channel === "All Channels" || n.channel === channel;
    const matchStatus  = status  === "All Status"   || n.status  === status;
    return matchSchool && matchType && matchChannel && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const rows       = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-[var(--bg-page)] min-h-screen font-body">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="bg-[var(--bg-header)] border-b border-[var(--border-default)] h-[var(--header-height)] flex items-center justify-between px-8 sticky top-0 z-40">
        <div>
          <h1 className="font-display text-[0.9375rem] font-semibold text-[var(--text-primary)] m-0">
            Notifications
          </h1>
          <p className="text-xs text-[var(--text-muted)] m-0">Platform-wide delivery logs</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date range */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="h-8 appearance-none border border-[var(--border-default)] rounded-lg text-[0.8125rem] text-[var(--text-secondary)] font-body bg-white pl-2.5 pr-7 outline-none cursor-pointer"
            >
              {DATE_RANGES.map(d => <option key={d}>{d}</option>)}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
              <ChevronDownIcon size={11} />
            </span>
          </div>

          <div className="w-px h-7 bg-[var(--border-default)]" />

          <button className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex">
            <BellIcon />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
              SA
            </div>
            <div>
              <p className="text-[0.8125rem] font-semibold text-[var(--text-primary)] m-0 leading-tight">Super Admin</p>
              <p className="text-[0.6875rem] text-[var(--text-muted)] m-0 uppercase tracking-[0.06em]">SUPER_ADMIN</p>
            </div>
            <ChevronDownIcon size={12} />
          </div>
        </div>
      </div>

      {/* ── Page Body ────────────────────────────────────────────────────── */}
      <div className="px-8 py-6 flex flex-col gap-5 animate-fadeIn">

        {/* ── Stat Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 stagger-children">
          <div className="card px-7 py-6 animate-fadeIn">
            <p className="text-sm text-[var(--text-muted)] m-0 mb-2 font-medium">Total Notifications</p>
            <p className="font-display text-[2.25rem] font-bold text-[var(--text-primary)] m-0 leading-none">450.2K</p>
          </div>
          <div className="card px-7 py-6 animate-fadeIn">
            <p className="text-sm text-[var(--text-muted)] m-0 mb-2 font-medium">Avg. Delivery Rate</p>
            <p className="font-display text-[2.25rem] font-bold text-success-600 m-0 leading-none">98.7%</p>
          </div>
          <div className="card px-7 py-6 animate-fadeIn">
            <p className="text-sm text-[var(--text-muted)] m-0 mb-2 font-medium">Total Failed</p>
            <p className="font-display text-[2.25rem] font-bold text-danger-600 m-0 leading-none">5.8K</p>
          </div>
        </div>

        {/* ── Notification Logs Table ───────────────────────────────────── */}
        <div className="card animate-fadeIn">

          {/* Table toolbar */}
          <div className="px-5 py-4 border-b border-[var(--border-default)] flex items-center justify-between gap-2.5 flex-wrap">
            <h2 className="font-display text-[0.9375rem] font-semibold text-[var(--text-primary)] m-0">
              Notification Logs
            </h2>
            <div className="flex items-center gap-2">
              <DropSelect value={school}  options={SCHOOLS}  onChange={v => { setSchool(v);  setPage(1); }} width={170} />
              <DropSelect value={type}    options={TYPES}    onChange={v => { setType(v);    setPage(1); }} width={160} />
              <DropSelect value={channel} options={CHANNELS} onChange={v => { setChannel(v); setPage(1); }} width={145} />
              <DropSelect value={status}  options={STATUSES} onChange={v => { setStatus(v);  setPage(1); }} width={140} />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {[
                    { label: "Recipient/Entity", sortable: true  },
                    { label: "Type",             sortable: false },
                    { label: "Channel",          sortable: true  },
                    { label: "Status",           sortable: false },
                    { label: "Sent At",          sortable: false },
                    { label: "Error/Payload",    sortable: false },
                  ].map(({ label, sortable }) => (
                    <th
                      key={label}
                      className="text-left px-3.5 py-[11px] text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-[0.06em] border-b border-[var(--border-default)] whitespace-nowrap bg-slate-50"
                    >
                      <span className={`inline-flex items-center gap-1.5 ${sortable ? "cursor-pointer" : ""}`}>
                        {label} {sortable && <SortIcon />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-[var(--text-muted)] text-sm">
                      No notifications match the selected filters.
                    </td>
                  </tr>
                ) : rows.map((n, i) => (
                  <tr
                    key={n.id}
                    className={i % 2 === 1 ? "bg-slate-50" : "bg-white"}
                  >
                    {/* Recipient */}
                    <td className="px-3.5 py-[11px] text-[0.8125rem] text-[var(--text-secondary)] align-middle border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[30px] h-[30px] rounded-md bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                          <SchoolBuildingIcon />
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)] m-0 text-[0.8125rem]">{n.recipient}</p>
                          <p className="text-[0.6875rem] text-[var(--text-muted)] m-0 flex items-center gap-[3px]">
                            <SchoolBuildingIcon /> {n.school}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-3.5 py-[11px] align-middle border-b border-slate-100 font-mono text-xs text-brand-600 font-medium">
                      {n.type}
                    </td>

                    {/* Channel */}
                    <td className="px-3.5 py-[11px] text-[0.8125rem] text-[var(--text-secondary)] align-middle border-b border-slate-100">
                      <ChannelCell channel={n.channel} />
                    </td>

                    {/* Status */}
                    <td className="px-3.5 py-[11px] text-[0.8125rem] text-[var(--text-secondary)] align-middle border-b border-slate-100">
                      <StatusBadge status={n.status} />
                    </td>

                    {/* Sent At */}
                    <td className="px-3.5 py-[11px] align-middle border-b border-slate-100 font-mono text-xs whitespace-nowrap text-[var(--text-secondary)]">
                      {n.sentAt}
                    </td>

                    {/* Error / Payload */}
                    <td className="px-3.5 py-[11px] text-[0.8125rem] text-[var(--text-secondary)] align-middle border-b border-slate-100">
                      <div className="flex flex-col gap-[3px]">
                        {n.error && (
                          <p className="text-[0.6875rem] text-danger-600 m-0 font-mono max-w-[200px] truncate">
                            {n.error}
                          </p>
                        )}
                        <button
                          onClick={() => setPayload(n)}
                          className="bg-transparent border-none text-brand-600 text-xs font-semibold cursor-pointer p-0 text-left font-body hover:text-brand-700 transition-colors"
                        >
                          [View Payload]
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ────────────────────────────────────────────────── */}
          <div className="px-5 py-3 border-t border-[var(--border-default)] flex items-center justify-between flex-wrap gap-2">

            {/* Left: per-page + count */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-[var(--text-muted)]">Pagination:</span>
              <div className="relative">
                <select
                  value={perPage}
                  onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="h-7 appearance-none border border-[var(--border-default)] rounded-md text-xs text-[var(--text-secondary)] font-body bg-white pl-2 pr-[22px] outline-none cursor-pointer"
                >
                  {PER_PAGE_OPTS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="absolute right-[5px] top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                  <ChevronDownIcon size={10} />
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </span>
            </div>

            {/* Right: page controls */}
            <div className="flex items-center gap-[3px]">
              <PageBtn onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeftIcon /></PageBtn>
              <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeftIcon /></PageBtn>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={[
                    "w-7 h-7 rounded border text-xs cursor-pointer font-body transition-colors",
                    n === page
                      ? "border-transparent bg-brand-600 text-white font-semibold"
                      : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-slate-50",
                  ].join(" ")}
                >
                  {n}
                </button>
              ))}

              <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRightIcon /></PageBtn>
              <PageBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRightIcon /></PageBtn>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payload Modal ────────────────────────────────────────────────── */}
      {payload && <PayloadModal item={payload} onClose={() => setPayload(null)} />}
    </div>
  );
}