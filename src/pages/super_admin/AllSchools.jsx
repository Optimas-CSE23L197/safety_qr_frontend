/**
 * SUPER ADMIN — ALL SCHOOLS
 * Full school list with search, filters, pagination, status badges,
 * and action buttons to view/suspend/activate schools.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Filter, Building2, Eye, ToggleLeft,
    ToggleRight, ChevronDown, ChevronUp, X, MapPin, Users,
} from 'lucide-react';
import useDebounce from '../../hooks/useDebounce.js';
import { ROUTES } from '../../config/routes.config.js';
import { formatDate, humanizeEnum } from '../../utils/formatters.js';

const MOCK_SCHOOLS = Array.from({ length: 38 }, (_, i) => ({
    id: `sch-${i + 1}`,
    name: [
        'Delhi Public School, Noida', "St. Mary's Convent, Pune", 'Kendriya Vidyalaya, Bhopal',
        'Ryan International, Mumbai', 'Cambridge High School, Hyderabad', 'DAV Public School, Kolkata',
        'La Martiniere, Lucknow', 'Army Public School, Chandigarh', 'Amity International, Gurgaon',
        'The Doon School, Dehradun', 'Loreto Convent, Ranchi', 'Presentation Convent, Srinagar',
        'Bishops School, Pune', 'Cathedral & John Connon, Mumbai', 'Frank Anthony Public, Bangalore',
        "Bhavan's Vidyashram, Chennai", 'Sunshine International, Ahmedabad', 'Apeejay School, Delhi',
        'Modern School, Delhi', 'Springdales School, Delhi',
    ][i % 20],
    code: `SCH${String(i + 1).padStart(4, '0')}`,
    city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'][i % 8],
    is_active: i % 9 !== 8,
    students: Math.floor(Math.random() * 800) + 50,
    admins: (i % 3) + 1,
    subscription_status: ['ACTIVE', 'ACTIVE', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'ACTIVE', 'ACTIVE', 'EXPIRED'][i % 9],
    created_at: new Date(Date.now() - i * 86400000 * 25).toISOString(),
}));

// Tailwind classes per subscription status
const SUB_BADGE = {
    ACTIVE:   'bg-success-50 text-success-700',
    TRIALING: 'bg-info-50 text-info-700',
    PAST_DUE: 'bg-warning-50 text-warning-700',
    CANCELED: 'bg-danger-50 text-danger-700',
    EXPIRED:  'bg-slate-100 text-slate-600',
};

const CITIES      = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
const SUB_FILTERS = ['All', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'EXPIRED'];
const PAGE_SIZE   = 10;

export default function AllSchools() {
    const navigate = useNavigate();
    const [schools, setSchools]           = useState(MOCK_SCHOOLS);
    const [search, setSearch]             = useState('');
    const [cityFilter, setCityFilter]     = useState('All Cities');
    const [subFilter, setSubFilter]       = useState('All');
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortField, setSortField]       = useState('created_at');
    const [sortDir, setSortDir]           = useState('desc');
    const [page, setPage]                 = useState(1);
    const [showFilters, setShowFilters]   = useState(false);
    const debouncedSearch = useDebounce(search, 350);

    /* ── Derived data ──────────────────────────────────────────────────── */
    const filtered = schools
        .filter(s => {
            const q = debouncedSearch.toLowerCase();
            const matchSearch = !q
                || s.name.toLowerCase().includes(q)
                || s.code.toLowerCase().includes(q)
                || s.city.toLowerCase().includes(q);
            const matchCity   = cityFilter === 'All Cities' || s.city === cityFilter;
            const matchSub    = subFilter === 'All' || s.subscription_status === subFilter;
            const matchActive = activeFilter === 'All' || (activeFilter === 'Active' ? s.is_active : !s.is_active);
            return matchSearch && matchCity && matchSub && matchActive;
        })
        .sort((a, b) => {
            const av = a[sortField] ?? '';
            const bv = b[sortField] ?? '';
            if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
            return sortDir === 'asc'
                ? String(av).localeCompare(String(bv))
                : String(bv).localeCompare(String(av));
        });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* ── Helpers ───────────────────────────────────────────────────────── */
    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const SortIcon = ({ field }) =>
        sortField === field
            ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
            : <ChevronDown size={13} className="opacity-30" />;

    const toggleActive = (id) =>
        setSchools(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));

    const activeFilters = [
        cityFilter   !== 'All Cities' && cityFilter,
        subFilter    !== 'All'        && subFilter,
        activeFilter !== 'All'        && activeFilter,
    ].filter(Boolean);

    const clearFilters = () => {
        setCityFilter('All Cities');
        setSubFilter('All');
        setActiveFilter('All');
        setPage(1);
    };

    const COLUMNS = [
        { label: 'School',       field: 'name'       },
        { label: 'Code',         field: null          },
        { label: 'City',         field: 'city'        },
        { label: 'Students',     field: 'students'    },
        { label: 'Subscription', field: null          },
        { label: 'Status',       field: null          },
        { label: 'Registered',   field: 'created_at'  },
        { label: '',             field: null          },
    ];

    /* ── Render ────────────────────────────────────────────────────────── */
    return (
        <div className="max-w-[1300px]">

            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                        All Schools
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                        {filtered.length} schools found · {schools.filter(s => s.is_active).length} active
                    </p>
                </div>

                <button
                    onClick={() => navigate(ROUTES.SUPER_ADMIN.REGISTER_SCHOOL)}
                    className="flex items-center gap-2 px-[18px] py-[9px] rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none font-display font-semibold text-sm cursor-pointer shadow-[var(--shadow-brand)] hover:opacity-90 transition-opacity"
                >
                    <Plus size={16} /> Register School
                </button>
            </div>

            {/* ── Search + filter bar ──────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] mb-4 overflow-hidden">

                {/* Search row */}
                <div className="p-4 flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                        />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, code, city..."
                            className="w-full py-[9px] pr-3 pl-[38px] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] bg-slate-50 font-body outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={[
                            'flex items-center gap-1.5 px-4 py-[9px] rounded-lg border text-sm font-medium cursor-pointer transition-colors',
                            showFilters
                                ? 'border-[var(--border-default)] bg-brand-50 text-brand-600'
                                : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)]',
                        ].join(' ')}
                    >
                        <Filter size={15} />
                        Filters
                        {activeFilters.length > 0 && (
                            <span className="bg-brand-600 text-white rounded-full px-1.5 text-xs font-bold">
                                {activeFilters.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter panel */}
                {showFilters && (
                    <div className="px-4 pt-4 pb-4 flex gap-3 border-t border-[var(--border-default)] flex-wrap">
                        {[
                            ['City',         CITIES,                        cityFilter,   setCityFilter  ],
                            ['Subscription', SUB_FILTERS,                   subFilter,    setSubFilter   ],
                            ['Status',       ['All', 'Active', 'Inactive'], activeFilter, setActiveFilter],
                        ].map(([label, opts, val, setter]) => (
                            <div key={label}>
                                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">
                                    {label}
                                </label>
                                <select
                                    value={val}
                                    onChange={e => { setter(e.target.value); setPage(1); }}
                                    className="py-[7px] px-3 border border-[var(--border-default)] rounded-[7px] text-sm text-[var(--text-primary)] bg-white cursor-pointer outline-none"
                                >
                                    {opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}

                        {activeFilters.length > 0 && (
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 py-[7px] px-3 rounded-[7px] border border-[var(--border-default)] bg-white text-danger-600 text-sm cursor-pointer hover:bg-danger-50 transition-colors"
                                >
                                    <X size={14} /> Clear all
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Table ───────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                <table className="w-full border-collapse">

                    {/* Head */}
                    <thead>
                        <tr className="border-b border-[var(--border-default)] bg-slate-50">
                            {COLUMNS.map(({ label, field }) => (
                                <th
                                    key={label}
                                    onClick={field ? () => toggleSort(field) : undefined}
                                    className={[
                                        'py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap select-none',
                                        field ? 'cursor-pointer hover:text-[var(--text-secondary)]' : 'cursor-default',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center gap-1">
                                        {label}
                                        {field && <SortIcon field={field} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-16 text-center text-[var(--text-muted)]">
                                    <Building2 size={36} className="mx-auto mb-3 opacity-30" />
                                    <div className="font-medium">No schools found</div>
                                    <div className="text-[0.8125rem] mt-1">Try adjusting your search or filters</div>
                                </td>
                            </tr>
                        ) : paginated.map((school, idx) => {
                            const subBadge = SUB_BADGE[school.subscription_status] ?? SUB_BADGE.ACTIVE;

                            return (
                                <tr
                                    key={school.id}
                                    className={[
                                        'transition-colors hover:bg-slate-50',
                                        idx < paginated.length - 1
                                            ? 'border-b border-[var(--border-default)]'
                                            : '',
                                    ].join(' ')}
                                >
                                    {/* School name */}
                                    <td className="py-[13px] px-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                                                <Building2 size={16} className="text-brand-500" />
                                            </div>
                                            <span className="font-semibold text-sm text-[var(--text-primary)] max-w-[200px] truncate">
                                                {school.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Code */}
                                    <td className="py-[13px] px-4">
                                        <code className="font-mono text-xs bg-slate-100 text-[var(--text-muted)] px-[7px] py-0.5 rounded">
                                            {school.code}
                                        </code>
                                    </td>

                                    {/* City */}
                                    <td className="py-[13px] px-4">
                                        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                                            <MapPin size={13} className="text-[var(--text-muted)]" />
                                            {school.city}
                                        </div>
                                    </td>

                                    {/* Students */}
                                    <td className="py-[13px] px-4">
                                        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                                            <Users size={13} className="text-[var(--text-muted)]" />
                                            {school.students.toLocaleString('en-IN')}
                                        </div>
                                    </td>

                                    {/* Subscription badge */}
                                    <td className="py-[13px] px-4">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${subBadge}`}>
                                            {humanizeEnum(school.subscription_status)}
                                        </span>
                                    </td>

                                    {/* Active / Inactive badge */}
                                    <td className="py-[13px] px-4">
                                        <span className={[
                                            'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold',
                                            school.is_active
                                                ? 'bg-success-50 text-success-700'
                                                : 'bg-slate-100 text-slate-600',
                                        ].join(' ')}>
                                            {school.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    {/* Registered date */}
                                    <td className="py-[13px] px-4 text-[0.8125rem] text-[var(--text-muted)]">
                                        {formatDate(school.created_at)}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-[13px] px-4">
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => navigate(`/super/schools/${school.id}`)}
                                                className="flex items-center gap-1.5 py-1.5 px-3 rounded-md border border-[var(--border-default)] bg-white text-brand-600 text-[0.8125rem] font-medium cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-colors"
                                            >
                                                <Eye size={13} /> View
                                            </button>

                                            <button
                                                onClick={() => toggleActive(school.id)}
                                                title={school.is_active ? 'Deactivate' : 'Activate'}
                                                className={[
                                                    'w-8 h-8 rounded-md border border-[var(--border-default)] bg-white cursor-pointer flex items-center justify-center transition-colors',
                                                    school.is_active
                                                        ? 'text-danger-600 hover:bg-danger-50'
                                                        : 'text-success-600 hover:bg-success-50',
                                                ].join(' ')}
                                            >
                                                {school.is_active
                                                    ? <ToggleRight size={14} />
                                                    : <ToggleLeft  size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* ── Pagination ─────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="py-3.5 px-4 border-t border-[var(--border-default)] flex items-center justify-between">
                        <span className="text-[0.8125rem] text-[var(--text-muted)]">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={[
                                        'w-8 h-8 rounded-md border text-[0.8125rem] cursor-pointer transition-colors',
                                        p === page
                                            ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                            : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                                    ].join(' ')}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}