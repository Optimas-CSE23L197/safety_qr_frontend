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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}