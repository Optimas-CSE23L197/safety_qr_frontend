<<<<<<< HEAD
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, ChevronDown, ChevronUp, Eye, GraduationCap, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';
import { buildPath, ROUTES } from '../../config/routes.config.js';
import { getFullName, getInitials, formatDate } from '../../utils/formatters.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const CLASSES        = ['All Classes',  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SECTIONS       = ['All Sections', 'A', 'B', 'C', 'D'];
const TOKEN_FILTERS  = ['All Tokens',   'ACTIVE', 'UNASSIGNED', 'EXPIRED', 'REVOKED'];
const PAGE_SIZE      = 10;

const TOKEN_BADGE = {
    ACTIVE:     { badgeClass: 'bg-emerald-50 text-emerald-700', label: 'Active' },
    UNASSIGNED: { badgeClass: 'bg-slate-100 text-slate-600',    label: 'Unassigned' },
    EXPIRED:    { badgeClass: 'bg-amber-50 text-amber-700',     label: 'Expired' },
    REVOKED:    { badgeClass: 'bg-red-50 text-red-700',         label: 'Revoked' },
    ISSUED:     { badgeClass: 'bg-sky-100 text-sky-700',        label: 'Issued' },
};

const TABLE_COLS = [
    { label: 'Student',      field: 'first_name' },
    { label: 'Class',        field: 'class' },
    { label: 'Token Status', field: null },
    { label: 'Parent',       field: null },
    { label: 'Joined',       field: 'created_at' },
    { label: '',             field: null },
];

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = Array.from({ length: 28 }, (_, i) => ({
    id: `stu-${i + 1}`,
    first_name:    ['Aarav','Priya','Rohit','Sneha','Karan','Divya','Arjun','Meera','Vikram','Ananya','Raj','Pooja','Dev','Riya','Aditya','Nisha','Saurav','Kavya','Harsh','Tanya','Amit','Shruti','Nikhil','Pallavi','Varun','Simran','Rahul','Neha'][i],
    last_name:     ['Sharma','Patel','Singh','Gupta','Kumar','Joshi','Verma','Shah','Mehta','Reddy','Nair','Iyer','Chopra','Bansal','Malhotra','Kapoor','Bose','Das','Pillai','Menon','Shetty','Kaur','Rao','Desai','Saxena','Agarwal','Tiwari','Pandey'][i],
    class:         `Class ${Math.floor(i / 4) + 6}`,
    section:       ['A','B','C','D'][i % 4],
    is_active:     i % 7 !== 6,
    token_status:  ['ACTIVE','ACTIVE','UNASSIGNED','EXPIRED','ACTIVE','ACTIVE','REVOKED'][i % 7],
    parent_linked: i % 3 !== 2,
    created_at:    new Date(Date.now() - i * 86400000 * 15).toISOString(),
    photo_url:     null,
}));

// ── Sort icon helper ──────────────────────────────────────────────────────────
const SortIcon = ({ field, sortField, sortDir }) => {
    if (sortField !== field) return <ChevronDown size={13} className="opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
};

// ── Main component ────────────────────────────────────────────────────────────
export default function Students() {
    const navigate = useNavigate();
    const { can }  = useAuth();

    const [search,        setSearch]        = useState('');
    const [classFilter,   setClassFilter]   = useState('All Classes');
    const [sectionFilter, setSectionFilter] = useState('All Sections');
    const [tokenFilter,   setTokenFilter]   = useState('All Tokens');
    const [sortField,     setSortField]     = useState('first_name');
    const [sortDir,       setSortDir]       = useState('asc');
    const [page,          setPage]          = useState(1);
    const [showFilters,   setShowFilters]   = useState(false);

    const debouncedSearch = useDebounce(search, 350);

    const filtered = MOCK_STUDENTS.filter(s => {
        const name = getFullName(s.first_name, s.last_name).toLowerCase();
        return (
            (!debouncedSearch || name.includes(debouncedSearch.toLowerCase())) &&
            (classFilter   === 'All Classes'   || s.class          === classFilter) &&
            (sectionFilter === 'All Sections'  || s.section        === sectionFilter) &&
            (tokenFilter   === 'All Tokens'    || s.token_status   === tokenFilter)
        );
    }).sort((a, b) => {
        const av = sortField === 'first_name' ? getFullName(a.first_name, a.last_name) : a[sortField] || '';
        const bv = sortField === 'first_name' ? getFullName(b.first_name, b.last_name) : b[sortField] || '';
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    const totalPages    = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated     = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const activeFilters = [
        classFilter   !== 'All Classes'   && classFilter,
        sectionFilter !== 'All Sections'  && sectionFilter,
        tokenFilter   !== 'All Tokens'    && tokenFilter,
    ].filter(Boolean);

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const clearFilters = () => {
        setClassFilter('All Classes');
        setSectionFilter('All Sections');
        setTokenFilter('All Tokens');
        setPage(1);
    };

    const FILTER_ROWS = [
        { label: 'Class',        opts: CLASSES,       val: classFilter,   setter: setClassFilter },
        { label: 'Section',      opts: SECTIONS,      val: sectionFilter, setter: setSectionFilter },
        { label: 'Token Status', opts: TOKEN_FILTERS, val: tokenFilter,   setter: setTokenFilter },
    ];

    return (
        <div className="max-w-[1200px]">

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-slate-900 m-0">
                        Students
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} students found
                    </p>
                </div>
                {can('students.create') && (
                    <button
                        onClick={() => {}}
                        className="flex items-center gap-2 px-[18px] py-[9px] rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 font-display font-semibold text-sm cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:from-blue-700 hover:to-blue-800 transition-all duration-100"
                    >
                        <Plus size={16} /> Add Student
                    </button>
                )}
            </div>

            {/* ── Search + Filter bar ───────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[var(--shadow-card)] mb-4 overflow-hidden">
                <div className="p-4 flex gap-3 items-center">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name..."
                            className="w-full pl-[38px] pr-3 py-[9px] border border-slate-200 rounded-lg text-sm text-slate-900 outline-none bg-slate-50 font-body focus:border-blue-500 transition-colors duration-100"
                        />
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={[
                            'flex items-center gap-1.5 px-4 py-[9px] rounded-lg border text-sm font-medium cursor-pointer transition-colors duration-100',
                            showFilters
                                ? 'border-blue-300 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                    >
                        <Filter size={15} /> Filters
                        {activeFilters.length > 0 && (
                            <span className="bg-blue-700 text-white rounded-full px-1.5 text-xs font-bold">
                                {activeFilters.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Expanded filters */}
                {showFilters && (
                    <div className="px-4 pb-4 pt-4 flex gap-3 border-t border-slate-200 flex-wrap items-end">
                        {FILTER_ROWS.map(({ label, opts, val, setter }) => (
                            <div key={label}>
                                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                                    {label}
                                </label>
                                <select
                                    value={val}
                                    onChange={e => { setter(e.target.value); setPage(1); }}
                                    className="px-3 py-[7px] border border-slate-200 rounded-[7px] text-sm text-slate-900 bg-white cursor-pointer outline-none focus:border-blue-500 transition-colors duration-100"
                                >
                                    {opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                        {activeFilters.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-3 py-[7px] rounded-[7px] border border-slate-200 bg-white text-red-600 text-sm cursor-pointer hover:bg-red-50 transition-colors duration-100"
                            >
                                <X size={14} /> Clear all
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Table ─────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-[var(--shadow-card)] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {TABLE_COLS.map(({ label, field }) => (
                                <th
                                    key={label}
                                    onClick={field ? () => toggleSort(field) : undefined}
                                    className={[
                                        'px-4 py-[11px] text-left text-xs font-semibold text-slate-400 tracking-[0.05em] uppercase whitespace-nowrap select-none',
                                        field ? 'cursor-pointer hover:text-slate-600' : 'cursor-default',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center gap-1">
                                        {label}
                                        {field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-[60px] text-center text-slate-400">
                                    <GraduationCap size={36} className="opacity-30 mx-auto mb-3" />
                                    <div className="font-medium">No students found</div>
                                    <div className="text-[0.8125rem] mt-1">Try adjusting your search or filters</div>
                                </td>
                            </tr>
                        ) : paginated.map((student, idx) => {
                            const badge = TOKEN_BADGE[student.token_status] || TOKEN_BADGE.UNASSIGNED;
                            const name  = getFullName(student.first_name, student.last_name);
                            return (
                                <tr
                                    key={student.id}
                                    className={[
                                        'transition-colors duration-100 hover:bg-slate-50',
                                        idx < paginated.length - 1 ? 'border-b border-slate-200' : '',
                                    ].join(' ')}
                                >
                                    {/* Student */}
                                    <td className="px-4 py-[13px]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center font-display font-bold text-[0.8125rem] text-blue-800 shrink-0">
                                                {getInitials(name)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-slate-900">{name}</div>
                                                <div className="text-xs text-slate-400">ID: {student.id.slice(-6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Class */}
                                    <td className="px-4 py-[13px] text-sm text-slate-600">
                                        {student.class} – {student.section}
                                    </td>

                                    {/* Token status */}
                                    <td className="px-4 py-[13px]">
                                        <span className={`px-2.5 py-[3px] rounded-full text-xs font-semibold ${badge.badgeClass}`}>
                                            {badge.label}
                                        </span>
                                    </td>

                                    {/* Parent linked */}
                                    <td className="px-4 py-[13px]">
                                        <span className={`text-[0.8125rem] px-2.5 py-[3px] rounded-full font-semibold ${student.parent_linked ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {student.parent_linked ? 'Linked' : 'Not linked'}
                                        </span>
                                    </td>

                                    {/* Joined date */}
                                    <td className="px-4 py-[13px] text-[0.8125rem] text-slate-400">
                                        {formatDate(student.created_at)}
                                    </td>

                                    {/* View action */}
                                    <td className="px-4 py-[13px]">
                                        <button
                                            onClick={() => navigate(buildPath(ROUTES.SCHOOL_ADMIN.STUDENT_DETAIL, { studentId: student.id }))}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-blue-700 text-[0.8125rem] font-medium cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-100"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* ── Pagination ───────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="px-4 py-3.5 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[0.8125rem] text-slate-400">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                                const active = p === page;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={[
                                            'w-8 h-8 rounded-md border text-[0.8125rem] cursor-pointer transition-colors duration-100',
                                            active
                                                ? 'border-blue-500 bg-blue-700 text-white font-bold'
                                                : 'border-slate-200 bg-white text-slate-600 font-normal hover:bg-slate-50',
                                        ].join(' ')}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
=======
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    Calendar,
    Activity,
    Droplet,
    AlertCircle,
    MapPin,
    Clock,
    QrCode,
    CreditCard,
    Shield,
} from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import useStudentStore from "../../store/student.store.js";
import { formatDate } from "../../utils/formatters.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { useToast } from "../../hooks/useToast.js";

export default function StudentDetail() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const schoolId = user?.school_id;

    const { currentStudent, loading, fetchStudentById, clearCurrentStudent } = useStudentStore();
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (schoolId && studentId) {
            fetchStudentById(schoolId, studentId).catch((error) => {
                console.error("Failed to fetch student:", error);
                showToast("Failed to load student details", "error");
            });
        }

        return () => {
            clearCurrentStudent();
        };
    }, [schoolId, studentId, fetchStudentById, clearCurrentStudent, showToast]);

    if (loading.detail) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <Spinner size={48} />
            </div>
        );
    }

    if (!currentStudent) {
        return (
            <div style={{ textAlign: "center", padding: "60px" }}>
                <AlertCircle size={48} style={{ marginBottom: "16px", color: "var(--color-danger-500)" }} />
                <h3>Student not found</h3>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginTop: "16px",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-default)",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    Go back
                </button>
            </div>
        );
    }

    const tokenBadge = currentStudent.current_token?.status_badge || {
        bg: "#F1F5F9",
        color: "#475569",
        label: "Unassigned",
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Header with back button */}
            <div style={{ marginBottom: "24px" }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "8px 0",
                        marginBottom: "16px",
                    }}
                >
                    <ArrowLeft size={20} /> Back to Students
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {currentStudent.photo_url ? (
                        <img
                            src={currentStudent.photo_url}
                            alt={currentStudent.full_name}
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                fontWeight: 700,
                                color: "var(--color-brand-700)",
                            }}
                        >
                            {currentStudent.full_name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
                            {currentStudent.full_name}
                        </h1>
                        <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                            {currentStudent.class && `${currentStudent.class} - ${currentStudent.section}`}
                            {currentStudent.roll_number && ` • Roll No: ${currentStudent.roll_number}`}
                            {currentStudent.admission_number && ` • Admission: ${currentStudent.admission_number}`}
                        </p>
                        <div style={{ marginTop: "8px" }}>
                            <Badge style={{ background: tokenBadge.bg, color: tokenBadge.color }}>
                                {tokenBadge.label}
                            </Badge>
>>>>>>> d02717592a8c96a5d5b29a573dc01e0280842ee3
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: "4px",
                    borderBottom: "1px solid var(--border-default)",
                    marginBottom: "24px",
                }}
            >
                {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "emergency", label: "Emergency", icon: AlertCircle },
                    { id: "scans", label: "Scan History", icon: Activity },
                    { id: "token", label: "Token & Card", icon: QrCode },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 20px",
                            background: "none",
                            border: "none",
                            borderBottom:
                                activeTab === tab.id ? "2px solid var(--color-brand-600)" : "2px solid transparent",
                            color: activeTab === tab.id ? "var(--color-brand-600)" : "var(--text-secondary)",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
                <div style={{ display: "grid", gap: "24px" }}>
                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Basic Information</h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Admission Number
                                </label>
                                <p>{currentStudent.admission_number || "Not assigned"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Roll Number
                                </label>
                                <p>{currentStudent.roll_number || "Not assigned"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Enrolled On
                                </label>
                                <p>{currentStudent.created_at_formatted}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Linked Parents</h3>
                        {currentStudent.parent_details?.length > 0 ? (
                            <div style={{ display: "grid", gap: "16px" }}>
                                {currentStudent.parent_details.map((parent, idx) => (
                                    <div
                                        key={parent.id}
                                        style={{
                                            padding: "16px",
                                            background: "var(--color-slate-50)",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    background: "var(--color-brand-100)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <User size={20} style={{ color: "var(--color-brand-600)" }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600 }}>{parent.name || "Parent"}</div>
                                                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                                                    {parent.relationship}
                                                    {parent.is_primary && (
                                                        <Badge
                                                            style={{
                                                                marginLeft: "8px",
                                                                background: "#ECFDF5",
                                                                color: "#047857",
                                                            }}
                                                        >
                                                            Primary
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                {parent.phone && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <Phone size={12} style={{ color: "var(--text-muted)" }} />
                                                        <span style={{ fontSize: "0.875rem" }}>{parent.phone_formatted}</span>
                                                    </div>
                                                )}
                                                {parent.email && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <Mail size={12} style={{ color: "var(--text-muted)" }} />
                                                        <span style={{ fontSize: "0.875rem" }}>{parent.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)" }}>No parents linked to this student</p>
                        )}
                    </Card>
                </div>
            )}

            {activeTab === "emergency" && currentStudent.emergency_profile && (
                <div style={{ display: "grid", gap: "24px" }}>
                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Medical Information</h3>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    <Droplet size={12} style={{ display: "inline", marginRight: "4px" }} />
                                    Blood Group
                                </label>
                                <p>{currentStudent.emergency_profile.blood_group_label || "Unknown"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Allergies
                                </label>
                                <p>{currentStudent.emergency_profile.allergies || "None reported"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Medical Conditions
                                </label>
                                <p>{currentStudent.emergency_profile.conditions || "None reported"}</p>
                            </div>
                            <div>
                                <label
                                    style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "var(--text-muted)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Medications
                                </label>
                                <p>{currentStudent.emergency_profile.medications || "None reported"}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Emergency Contacts</h3>
                        {currentStudent.emergency_profile.contacts?.length > 0 ? (
                            <div style={{ display: "grid", gap: "12px" }}>
                                {currentStudent.emergency_profile.contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "12px",
                                            background: "var(--color-slate-50)",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{contact.name}</div>
                                            <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                                                {contact.relationship}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Phone size={12} style={{ color: "var(--text-muted)" }} />
                                                <span>{contact.phone_encrypted?.replace(/^(\+91)(\d{5})(\d{5})$/, "$1 $2 $3") || "Not provided"}</span>
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                                Priority: {contact.priority}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)" }}>No emergency contacts added</p>
                        )}
                    </Card>
                </div>
            )}

            {activeTab === "scans" && (
                <Card>
                    <h3 style={{ marginBottom: "16px" }}>Recent Scan Activity</h3>
                    {currentStudent.recent_scans?.length > 0 ? (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
                                        <th style={{ textAlign: "left", padding: "12px" }}>Date & Time</th>
                                        <th style={{ textAlign: "left", padding: "12px" }}>Result</th>
                                        <th style={{ textAlign: "left", padding: "12px" }}>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStudent.recent_scans.map((scan) => (
                                        <tr key={scan.id} style={{ borderBottom: "1px solid var(--border-default)" }}>
                                            <td style={{ padding: "12px" }}>{formatDate(scan.created_at)}</td>
                                            <td style={{ padding: "12px" }}>
                                                <Badge
                                                    style={{
                                                        background:
                                                            scan.result === "SUCCESS" ? "#ECFDF5" : "#FEF2F2",
                                                        color: scan.result === "SUCCESS" ? "#047857" : "#B91C1C",
                                                    }}
                                                >
                                                    {scan.result}
                                                </Badge>
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                                {scan.latitude && scan.longitude ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                        <MapPin size={12} />
                                                        <span>
                                                            {scan.latitude.toFixed(4)}, {scan.longitude.toFixed(4)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    "Not available"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: "var(--text-muted)" }}>No scan records found</p>
                    )}
                </Card>
            )}

            {activeTab === "token" && (
                <div style={{ display: "grid", gap: "24px" }}>
                    <Card>
                        <h3 style={{ marginBottom: "16px" }}>Token Details</h3>
                        {currentStudent.current_token ? (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "16px",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <QrCode size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Token ID
                                    </label>
                                    <p style={{ fontFamily: "monospace" }}>
                                        {currentStudent.current_token.id.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Status
                                    </label>
                                    <Badge
                                        style={{
                                            background: currentStudent.current_token.status_badge.bg,
                                            color: currentStudent.current_token.status_badge.color,
                                        }}
                                    >
                                        {currentStudent.current_token.status_badge.label}
                                    </Badge>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Assigned On
                                    </label>
                                    <p>{formatDate(currentStudent.current_token.assigned_at)}</p>
                                </div>
                                {currentStudent.current_token.expires_at && (
                                    <div>
                                        <label
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                color: "var(--text-muted)",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Expires On
                                        </label>
                                        <p>{formatDate(currentStudent.current_token.expires_at)}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p style={{ color: "var(--text-muted)" }}>No active token assigned</p>
                        )}
                    </Card>

                    {currentStudent.current_card && (
                        <Card>
                            <h3 style={{ marginBottom: "16px" }}>Card Details</h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "16px",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <CreditCard size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Card Number
                                    </label>
                                    <p style={{ fontFamily: "monospace" }}>{currentStudent.current_card.card_number}</p>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Print Status
                                    </label>
                                    <Badge
                                        style={{
                                            background: currentStudent.current_card.print_status === "PRINTED" ? "#ECFDF5" : "#FEF3C7",
                                            color: currentStudent.current_card.print_status === "PRINTED" ? "#047857" : "#B45309",
                                        }}
                                    >
                                        {currentStudent.current_card.print_status}
                                    </Badge>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        <Shield size={12} style={{ display: "inline", marginRight: "4px" }} />
                                        Token Status
                                    </label>
                                    <p>{currentStudent.current_card.token?.status || "Unknown"}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}