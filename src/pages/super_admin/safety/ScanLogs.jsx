import { useState } from "react";
import { formatDateTime, formatRelativeTime, maskTokenHash } from '../../../utils/formatters.js';

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const ChevronDownIcon = ({ size = 12 }) => (
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
const MapPinIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const DeviceIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
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
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CodeIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
const AlertIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
);

// ─── Mock Data (Matches Prisma Schema) ────────────────────────────────────────
const SCAN_LOGS = [
  {
    id: "scan-001",
    token_id: "tok-001",
    token_hash: "A1B2C3D4E5F6",
    school_id: "sch-001",
    school_name: "Greenwood High",
    student_id: "stu-001",
    student_name: "Aarav Sharma",
    result: "SUCCESS",
    ip_address: "182.74.1.22",
    ip_city: "Jaipur",
    ip_country: "IN",
    ip_region: "Rajasthan",
    location_derived: true,
    latitude: 26.9124,
    longitude: 75.7873,
    device_hash: "dev_hash_abc123",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
    response_time_ms: 42,
    scan_type: "CHECK_IN",
    scanned_at: "2026-03-07T10:28:03Z",
    scanned_by: "Gate Security",
    scan_purpose: "ENTRY",
    created_at: "2026-03-07T10:28:03Z",
    emergency_dispatched: false,
    dispatched_at: null,
    dispatched_channels: [],
    device_info: { device_name: "iPhone 15 Pro", os: "iOS 17.2", browser: "Safari" }
  },
  {
    id: "scan-002",
    token_id: "tok-001",
    token_hash: "A1B2C3D4E5F6",
    school_id: "sch-001",
    school_name: "Greenwood High",
    student_id: "stu-001",
    student_name: "Aarav Sharma",
    result: "SUCCESS",
    ip_address: "182.74.1.22",
    ip_city: "Jaipur",
    ip_country: "IN",
    ip_region: "Rajasthan",
    location_derived: true,
    latitude: 26.9124,
    longitude: 75.7873,
    device_hash: "dev_hash_abc123",
    user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)",
    response_time_ms: 38,
    scan_type: "EXIT",
    scanned_at: "2026-03-07T16:30:15Z",
    scanned_by: "Gate Security",
    scan_purpose: "EXIT",
    created_at: "2026-03-07T16:30:15Z",
    emergency_dispatched: false,
    dispatched_at: null,
    dispatched_channels: [],
    device_info: { device_name: "iPhone 15 Pro", os: "iOS 17.2", browser: "Safari" }
  },
  {
    id: "scan-003",
    token_id: "tok-002",
    token_hash: "G7H8I9J0K1L2",
    school_id: "sch-001",
    school_name: "Greenwood High",
    student_id: "stu-002",
    student_name: "Priya Patel",
    result: "INVALID",
    ip_address: "192.168.19.230",
    ip_city: "Delhi",
    ip_country: "IN",
    ip_region: "Delhi",
    location_derived: false,
    latitude: null,
    longitude: null,
    device_hash: "dev_hash_def456",
    user_agent: "Mozilla/5.0 (Linux; Android 13; SM-S23)",
    response_time_ms: 55,
    scan_type: "ATTENDANCE",
    scanned_at: "2026-03-07T09:15:22Z",
    scanned_by: "Class Teacher",
    scan_purpose: "ATTENDANCE",
    created_at: "2026-03-07T09:15:22Z",
    emergency_dispatched: false,
    dispatched_at: null,
    dispatched_channels: [],
    device_info: { device_name: "Samsung S23", os: "Android 13", browser: "Chrome" }
  },
  {
    id: "scan-004",
    token_id: "tok-003",
    token_hash: "M3N4O5P6Q7R8",
    school_id: "sch-002",
    school_name: "Central Public School",
    student_id: "stu-003",
    student_name: "Rohit Singh",
    result: "RATE_LIMITED",
    ip_address: "192.168.19.230",
    ip_city: "Mumbai",
    ip_country: "IN",
    ip_region: "Maharashtra",
    location_derived: true,
    latitude: 19.0760,
    longitude: 72.8777,
    device_hash: "dev_hash_ghi789",
    user_agent: "Mozilla/5.0 (Linux; Android 13; SM-S23)",
    response_time_ms: 15,
    scan_type: "CHECK_IN",
    scanned_at: "2026-03-07T01:05:44Z",
    scanned_by: null,
    scan_purpose: "ENTRY",
    created_at: "2026-03-07T01:05:44Z",
    emergency_dispatched: false,
    dispatched_at: null,
    dispatched_channels: [],
    device_info: { device_name: "Samsung S23", os: "Android 13", browser: "Chrome" }
  },
  {
    id: "scan-005",
    token_id: "tok-004",
    token_hash: "S9T0U1V2W3X4",
    school_id: "sch-003",
    school_name: "DPS Noida",
    student_id: "stu-004",
    student_name: "Sneha Gupta",
    result: "EXPIRED",
    ip_address: "59.160.31.7",
    ip_city: "Noida",
    ip_country: "IN",
    ip_region: "Uttar Pradesh",
    location_derived: true,
    latitude: 28.5355,
    longitude: 77.3910,
    device_hash: "dev_hash_jkl012",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    response_time_ms: 33,
    scan_type: "CHECK_IN",
    scanned_at: "2026-03-06T15:15:00Z",
    scanned_by: "Gate Security",
    scan_purpose: "ENTRY",
    created_at: "2026-03-06T15:15:00Z",
    emergency_dispatched: false,
    dispatched_at: null,
    dispatched_channels: [],
    device_info: { device_name: "Dell Laptop", os: "Windows 11", browser: "Chrome" }
  },
  {
    id: "scan-006",
    token_id: "tok-005",
    token_hash: "Y5Z6A7B8C9D0",
    school_id: "sch-001",
    school_name: "Greenwood High",
    student_id: "stu-005",
    student_name: "Karan Kumar",
    result: "REVOKED",
    ip_address: "103.21.58.14",
    ip_city: "Chennai",
    ip_country: "IN",
    ip_region: "Tamil Nadu",
    location_derived: true,
    latitude: 13.0827,
    longitude: 80.2707,
    device_hash: "dev_hash_mno345",
    user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    response_time_ms: 19,
    scan_type: "EMERGENCY",
    scanned_at: "2026-03-06T13:44:00Z",
    scanned_by: "Emergency Contact",
    scan_purpose: "EMERGENCY",
    created_at: "2026-03-06T13:44:00Z",
    emergency_dispatched: true,
    dispatched_at: "2026-03-06T13:44:05Z",
    dispatched_channels: ["SMS", "EMAIL", "PUSH"],
    device_info: { device_name: "iPhone 14", os: "iOS 16.0", browser: "Safari" }
  },
  {
    id: "scan-007",
    token_id: null,
    token_hash: "UNREGISTERED",
    school_id: "sch-001",
    school_name: "Greenwood High",
    student_id: null,
    student_name: "Unregistered Token",
    result: "UNREGISTERED",
    ip_address: "45.67.89.10",
    ip_city: "Pune",
    ip_country: "IN",
    ip_region: "Maharashtra",
    location_derived: true,
    latitude: 18.5204,
    longitude: 73.8567,
    device_hash: "dev_hash_pqr678",
    user_agent: "Unknown",
    response_time_ms: 8,
    scan_type: "OTHER",
    scanned_at: "2026-03-05T22:30:00Z",
    scanned_by: null,
    scan_purpose: "QR_SCAN",
    created_at: "2026-03-05T22:30:00Z",
    emergency_dispatched: false,
    dispatched_at: null,
    dispatched_channels: [],
    device_info: { device_name: "Unknown", os: "Unknown", browser: "Unknown" }
  }
];

// ─── Result Badge (Matches ScanResult Enum) ───────────────────────────────────
const RESULT_MAP = {
  SUCCESS: { bg: "#ECFDF5", color: "#047857", border: "#D1FAE5", label: "Success" },
  INVALID: { bg: "#FEF2F2", color: "#B91C1C", border: "#FEE2E2", label: "Invalid" },
  REVOKED: { bg: "#FEF2F2", color: "#DC2626", border: "#FEE2E2", label: "Revoked" },
  EXPIRED: { bg: "#F1F5F9", color: "#64748B", border: "#E2E8F0", label: "Expired" },
  INACTIVE: { bg: "#F1F5F9", color: "#475569", border: "#E2E8F0", label: "Inactive" },
  UNREGISTERED: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A", label: "Unregistered" },
  ISSUED: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Issued" },
  RATE_LIMITED: { bg: "#FEF3C7", color: "#B45309", border: "#FDE68A", label: "Rate Limited" },
  ERROR: { bg: "#FEF2F2", color: "#991B1B", border: "#FEE2E2", label: "Error" }
};

const ResultBadge = ({ result }) => {
  const style = RESULT_MAP[result] || RESULT_MAP.ERROR;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ background: style.bg, color: style.color, borderColor: style.border }}>
      {result === "RATE_LIMITED" && <AlertIcon />}
      {style.label}
    </span>
  );
};

// ─── Scan Type Badge ──────────────────────────────────────────────────────────
const SCAN_TYPE_MAP = {
  EMERGENCY: { bg: "#FEF2F2", color: "#DC2626", label: "🚨 Emergency" },
  CHECK_IN: { bg: "#ECFDF5", color: "#047857", label: "✅ Check In" },
  ATTENDANCE: { bg: "#EFF6FF", color: "#1D4ED8", label: "📋 Attendance" },
  OTHER: { bg: "#F1F5F9", color: "#64748B", label: "🔍 Other" }
};

const ScanTypeBadge = ({ type }) => {
  const style = SCAN_TYPE_MAP[type] || SCAN_TYPE_MAP.OTHER;
  return <span className="text-xs font-medium">{style.label}</span>;
};

// ─── Metadata Modal ───────────────────────────────────────────────────────────
const MetadataModal = ({ scan, onClose }) => {
  const metadata = {
    scan_id: scan.id,
    token_hash: maskTokenHash(scan.token_hash),
    device_hash: scan.device_hash,
    user_agent: scan.user_agent,
    location_derived: scan.location_derived,
    coordinates: scan.latitude && scan.longitude ? `${scan.latitude}, ${scan.longitude}` : null,
    response_time_ms: scan.response_time_ms,
    scanned_by: scan.scanned_by || "System",
    scan_purpose: scan.scan_purpose,
    emergency_dispatched: scan.emergency_dispatched,
    dispatched_channels: scan.dispatched_channels,
    dispatched_at: scan.dispatched_at,
    created_at: scan.created_at
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-[var(--border-default)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <CodeIcon />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] m-0">Scan Metadata</h3>
              <p className="text-xs text-[var(--text-muted)] m-0">{scan.student_name} · {formatDateTime(scan.scanned_at)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Result & Type */}
          <div className="flex gap-3 flex-wrap">
            <ResultBadge result={scan.result} />
            <ScanTypeBadge type={scan.scan_type} />
            {scan.emergency_dispatched && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">🚨 Emergency Dispatched</span>
            )}
          </div>

          {/* Location */}
          <div className="p-3 rounded-lg bg-slate-50">
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">📍 Location</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-[var(--text-muted)]">City:</span> {scan.ip_city}</div>
              <div><span className="text-[var(--text-muted)]">Region:</span> {scan.ip_region}</div>
              <div><span className="text-[var(--text-muted)]">Country:</span> {scan.ip_country}</div>
              <div><span className="text-[var(--text-muted)]">IP:</span> <code className="text-xs">{scan.ip_address}</code></div>
              {scan.latitude && (
                <div className="col-span-2"><span className="text-[var(--text-muted)]">Coordinates:</span> {scan.latitude}, {scan.longitude}</div>
              )}
            </div>
          </div>

          {/* Device Info */}
          <div className="p-3 rounded-lg bg-slate-50">
            <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">📱 Device</p>
            <div className="space-y-1 text-sm">
              <div><span className="text-[var(--text-muted)]">Device Hash:</span> <code className="text-xs">{scan.device_hash}</code></div>
              <div><span className="text-[var(--text-muted)]">User Agent:</span> <span className="text-xs break-all">{scan.user_agent}</span></div>
              {scan.device_info && (
                <div><span className="text-[var(--text-muted)]">Device:</span> {scan.device_info.device_name} · {scan.device_info.os}</div>
              )}
            </div>
          </div>

          {/* Full Metadata JSON */}
          <details className="mt-2">
            <summary className="text-xs font-semibold text-brand-600 cursor-pointer">View Full Metadata</summary>
            <pre className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto max-h-64">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </details>
        </div>

        <div className="px-6 py-3 border-t border-[var(--border-default)] flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Dropdown Select ──────────────────────────────────────────────────────────
const DropSelect = ({ value, options, onChange, width = 150 }) => (
  <div className="relative" style={{ width }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-8 appearance-none border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-secondary)] bg-white px-2.5 pr-7 outline-none cursor-pointer"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
      <ChevronDownIcon size={11} />
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScanLogs() {
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("All Schools");
  const [resultFilter, setResultFilter] = useState("All Results");
  const [scanTypeFilter, setScanTypeFilter] = useState("All Types");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedScan, setSelectedScan] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const SCHOOLS = ["All Schools", ...new Set(SCAN_LOGS.map(s => s.school_name))];
  const RESULTS = ["All Results", "SUCCESS", "INVALID", "REVOKED", "EXPIRED", "INACTIVE", "UNREGISTERED", "ISSUED", "RATE_LIMITED", "ERROR"];
  const SCAN_TYPES = ["All Types", "EMERGENCY", "CHECK_IN", "ATTENDANCE", "OTHER"];

  const filtered = SCAN_LOGS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      s.student_name?.toLowerCase().includes(q) ||
      s.token_hash.toLowerCase().includes(q) ||
      s.ip_address.includes(q);
    const matchSchool = schoolFilter === "All Schools" || s.school_name === schoolFilter;
    const matchResult = resultFilter === "All Results" || s.result === resultFilter;
    const matchType = scanTypeFilter === "All Types" || s.scan_type === scanTypeFilter;
    return matchSearch && matchSchool && matchResult && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setRefreshing(false);
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Student", "School", "Token", "Result", "Scan Type", "Location", "IP", "Device Hash", "Scanned At", "Emergency"],
      ...filtered.map(s => [
        s.id, s.student_name, s.school_name, maskTokenHash(s.token_hash), s.result, s.scan_type,
        `${s.ip_city}, ${s.ip_region}`, s.ip_address, s.device_hash, formatDateTime(s.scanned_at), s.emergency_dispatched ? "Yes" : "No"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scan_logs_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: SCAN_LOGS.length,
    success: SCAN_LOGS.filter(s => s.result === "SUCCESS").length,
    failed: SCAN_LOGS.filter(s => ["INVALID", "REVOKED", "EXPIRED", "ERROR"].includes(s.result)).length,
    rateLimited: SCAN_LOGS.filter(s => s.result === "RATE_LIMITED").length,
    emergency: SCAN_LOGS.filter(s => s.emergency_dispatched).length
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {selectedScan && <MetadataModal scan={selectedScan} onClose={() => setSelectedScan(null)} />}

      {/* Header */}
      <div className="bg-white border-b border-[var(--border-default)] sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-[var(--text-primary)] m-0">Scan Logs</h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">Real-time scan activity across all schools</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-white text-sm font-medium hover:bg-slate-50">
                <DownloadIcon /> Export
              </button>
              <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50">
                <RefreshIcon className={refreshing ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</div>
              <div className="text-xs text-[var(--text-muted)]">Total Scans</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-700">{stats.success}</div>
              <div className="text-xs text-emerald-600">Successful</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
              <div className="text-xs text-red-600">Failed</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-700">{stats.rateLimited}</div>
              <div className="text-xs text-amber-600">Rate Limited</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-700">{stats.emergency}</div>
              <div className="text-xs text-purple-600">Emergency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><SearchIcon /></span>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by student, token hash, or IP..."
                className="w-full py-2 pl-9 pr-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500"
              />
            </div>
            <DropSelect value={schoolFilter} options={SCHOOLS} onChange={v => { setSchoolFilter(v); setPage(1); }} width={160} />
            <DropSelect value={resultFilter} options={RESULTS} onChange={v => { setResultFilter(v); setPage(1); }} width={140} />
            <DropSelect value={scanTypeFilter} options={SCAN_TYPES} onChange={v => { setScanTypeFilter(v); setPage(1); }} width={140} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-[var(--border-default)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">School</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Token</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Result</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-[var(--text-muted)]">
                      No scan logs match your filters
                    </td>
                  </tr>
                ) : (
                  paginated.map((scan, idx) => (
                    <tr key={scan.id} className={`border-b border-[var(--border-default)] hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <UserIcon />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[var(--text-primary)]">{scan.student_name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{scan.scan_purpose}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <SchoolIcon />
                          <span className="text-sm text-[var(--text-secondary)]">{scan.school_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{maskTokenHash(scan.token_hash)}</code>
                      </td>
                      <td className="px-4 py-3"><ResultBadge result={scan.result} /></td>
                      <td className="px-4 py-3"><ScanTypeBadge type={scan.scan_type} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                          <MapPinIcon />
                          <span>{scan.ip_city}</span>
                        </div>
                        <code className="text-xs text-[var(--text-muted)]">{scan.ip_address}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-muted)] whitespace-nowrap">
                        {formatRelativeTime(scan.scanned_at)}
                        <div className="text-xs">{formatDateTime(scan.scanned_at)}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedScan(scan)}
                          className="text-brand-600 text-xs font-semibold hover:underline"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--border-default)] flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--text-muted)]">Rows per page:</span>
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="py-1 px-2 border rounded-md text-sm">
                  {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
                </select>
                <span className="text-sm text-[var(--text-muted)]">
                  {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                </span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setPage(1)} disabled={page === 1} className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white disabled:opacity-40 hover:bg-slate-50"><ChevronsLeftIcon /></button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white disabled:opacity-40 hover:bg-slate-50"><ChevronLeftIcon /></button>
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
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white disabled:opacity-40 hover:bg-slate-50"><ChevronRightIcon /></button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white disabled:opacity-40 hover:bg-slate-50"><ChevronsRightIcon /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}