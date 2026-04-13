import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Filter, Building2, Eye, ToggleLeft,
    ToggleRight, ChevronDown, ChevronUp, X, MapPin, Users,
    Clock,
} from 'lucide-react';
import { useSchools } from '#hooks/super-admin/useSchools.js';
import useSchoolStore from '#store/super-admin/schoolStore.js';
import { formatDate, humanizeEnum } from '#utils/formatters.js';

const SUB_BADGE = {
    ACTIVE: 'bg-success-50 text-success-700',
    TRIALING: 'bg-info-50 text-info-700',
    PAST_DUE: 'bg-warning-50 text-warning-700',
    CANCELED: 'bg-danger-50 text-danger-700',
    EXPIRED: 'bg-slate-100 text-slate-600',
};

const SETUP_BADGE = {
    PENDING_SETUP: 'bg-warning-50 text-warning-700',
    ACTIVE: 'bg-success-50 text-success-700',
    SUSPENDED: 'bg-danger-50 text-danger-700',
    TERMINATED: 'bg-slate-100 text-slate-600',
};

const PLAN_BADGE = {
    BASIC: 'bg-slate-100 text-slate-700',
    PREMIUM: 'bg-brand-50 text-brand-700',
    CUSTOM: 'bg-purple-50 text-purple-700',
};

const SUB_FILTERS = ['All', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'EXPIRED'];
const SETUP_FILTERS = ['All', 'PENDING_SETUP', 'ACTIVE', 'SUSPENDED', 'TERMINATED'];
const PLAN_FILTERS = ['All', 'BASIC', 'PREMIUM', 'CUSTOM'];
const STATUS_FILTERS = ['All', 'active', 'inactive'];
const PAGE_SIZE = 10;

export default function AllSchools() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('All');
    const [subFilter, setSubFilter] = useState('All');
    const [planFilter, setPlanFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const { cities, stats, pagination, loading, toggleStatus, refetch } = useSchools({
        page,
        limit: PAGE_SIZE,
        search,
        city: cityFilter !== 'All' ? cityFilter : '',
        subscription_status: subFilter !== 'All' ? subFilter : '',
        status: statusFilter !== 'All' ? statusFilter : '',
        sort_field: sortField,
        sort_dir: sortDir,
    });

    const schools = useSchoolStore((state) => state.schools);

    useEffect(() => {
        refetch();
    }, [page, search, cityFilter, subFilter, planFilter, statusFilter, sortField, sortDir]);

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
        setPage(1);
    };

    const SortIcon = ({ field }) =>
        sortField === field
            ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
            : <ChevronDown size={13} className="opacity-30" />;

    const handleToggleStatus = (id, currentStatus) => {
        if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this school?`)) {
            toggleStatus({ id, is_active: !currentStatus });
        }
    };

    const activeFilterCount = [
        cityFilter !== 'All' && cityFilter,
        subFilter !== 'All' && subFilter,
        planFilter !== 'All' && planFilter,
        statusFilter !== 'All' && statusFilter,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setCityFilter('All');
        setSubFilter('All');
        setPlanFilter('All');
        setStatusFilter('All');
        setPage(1);
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                        All Schools
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                        {stats.total} schools total · {stats.active} active · {stats.inactive} inactive
                    </p>
                </div>

                <button
                    onClick={() => navigate('/super/schools/register')}
                    className="flex items-center justify-center gap-2 px-[18px] py-[9px] rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none font-display font-semibold text-sm cursor-pointer shadow-[var(--shadow-brand)] hover:opacity-90 transition-opacity"
                >
                    <Plus size={16} /> Register School
                </button>
            </div>

            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] mb-4 overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row gap-3">
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
                        className={`flex items-center justify-center gap-1.5 px-4 py-[9px] rounded-lg border text-sm font-medium cursor-pointer transition-colors shrink-0 ${showFilters
                            ? 'border-[var(--border-default)] bg-brand-50 text-brand-600'
                            : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)]'
                            }`}
                    >
                        <Filter size={15} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-brand-600 text-white rounded-full px-1.5 text-xs font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {showFilters && (
                    <div className="px-4 pt-4 pb-4 border-t border-[var(--border-default)]">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">City</label>
                                <select
                                    value={cityFilter}
                                    onChange={e => { setCityFilter(e.target.value); setPage(1); }}
                                    className="w-full py-[7px] px-3 border border-[var(--border-default)] rounded-[7px] text-sm text-[var(--text-primary)] bg-white cursor-pointer outline-none"
                                >
                                    <option>All</option>
                                    {cities.map(city => <option key={city}>{city}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Subscription</label>
                                <select
                                    value={subFilter}
                                    onChange={e => { setSubFilter(e.target.value); setPage(1); }}
                                    className="w-full py-[7px] px-3 border border-[var(--border-default)] rounded-[7px] text-sm text-[var(--text-primary)] bg-white cursor-pointer outline-none"
                                >
                                    {SUB_FILTERS.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Plan</label>
                                <select
                                    value={planFilter}
                                    onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
                                    className="w-full py-[7px] px-3 border border-[var(--border-default)] rounded-[7px] text-sm text-[var(--text-primary)] bg-white cursor-pointer outline-none"
                                >
                                    {PLAN_FILTERS.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                                    className="w-full py-[7px] px-3 border border-[var(--border-default)] rounded-[7px] text-sm text-[var(--text-primary)] bg-white cursor-pointer outline-none"
                                >
                                    {STATUS_FILTERS.map(o => <option key={o}>{o === 'active' ? 'Active' : o === 'inactive' ? 'Inactive' : 'All'}</option>)}
                                </select>
                            </div>
                        </div>

                        {activeFilterCount > 0 && (
                            <div className="mt-3 flex justify-end">
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

            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                        <thead>
                            <tr className="border-b border-[var(--border-default)] bg-slate-50">
                                <th className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap">
                                    School
                                </th>
                                <th className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap">
                                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('city')}>
                                        Location <SortIcon field="city" />
                                    </div>
                                </th>
                                <th className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap">
                                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('students')}>
                                        Students <SortIcon field="students" />
                                    </div>
                                </th>
                                <th className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap">
                                    Plan
                                </th>
                                <th className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap">
                                    Subscription
                                </th>
                                <th className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap">
                                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('created_at')}>
                                        Registered <SortIcon field="created_at" />
                                    </div>
                                </th>
                                <th className="py-[11px] px-4 text-center text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-[var(--text-muted)]">
                                        <div className="animate-pulse">Loading...</div>
                                    </td>
                                </tr>
                            ) : schools.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-[var(--text-muted)]">
                                        <Building2 size={36} className="mx-auto mb-3 opacity-30" />
                                        <div className="font-medium">No schools found</div>
                                        <div className="text-[0.8125rem] mt-1">Try adjusting your search or filters</div>
                                    </td>
                                </tr>
                            ) : (
                                schools.map((school, idx) => {
                                    const subBadge = SUB_BADGE[school.subscription_status] || SUB_BADGE.ACTIVE;
                                    const planBadge = PLAN_BADGE[school.subscription_plan] || PLAN_BADGE.BASIC;

                                    return (
                                        <tr
                                            key={school.id}
                                            className={`transition-colors hover:bg-slate-50 ${idx < schools.length - 1 ? 'border-b border-[var(--border-default)]' : ''}`}
                                        >
                                            <td className="py-[13px] px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                                                        <Building2 size={16} className="text-brand-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-[var(--text-primary)] max-w-[200px] truncate">
                                                            {school.name}
                                                        </div>
                                                        <code className="font-mono text-xs text-[var(--text-muted)]">
                                                            {school.code}
                                                        </code>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-[13px] px-4">
                                                <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                                                    <MapPin size={13} className="text-[var(--text-muted)] shrink-0" />
                                                    <span className="truncate">{school.city || '—'}</span>
                                                </div>
                                            </td>

                                            <td className="py-[13px] px-4">
                                                <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                                                    <Users size={13} className="text-[var(--text-muted)] shrink-0" />
                                                    <span>{school.students?.toLocaleString('en-IN') || 0}</span>
                                                </div>
                                                <div className="text-[0.625rem] text-[var(--text-muted)] mt-0.5">
                                                    {school.admins || 0} admin{school.admins !== 1 ? 's' : ''}
                                                </div>
                                            </td>

                                            <td className="py-[13px] px-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${planBadge} whitespace-nowrap`}>
                                                    {school.subscription_plan || '—'}
                                                </span>
                                            </td>

                                            <td className="py-[13px] px-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${subBadge} whitespace-nowrap`}>
                                                    {humanizeEnum(school.subscription_status) || '—'}
                                                </span>
                                            </td>

                                            <td className="py-[13px] px-4">
                                                <div className="text-[0.8125rem] text-[var(--text-muted)] whitespace-nowrap">
                                                    {formatDate(school.created_at)}
                                                </div>
                                            </td>

                                            <td className="py-[13px] px-4">
                                                <div className="flex gap-1.5 justify-center">
                                                    <button
                                                        onClick={() => navigate(`/super/schools/${school.id}`)}
                                                        className="p-1.5 rounded-md border border-[var(--border-default)] bg-white text-brand-600 cursor-pointer hover:bg-brand-50 hover:border-brand-300 transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleStatus(school.id, school.is_active)}
                                                        title={school.is_active ? 'Deactivate' : 'Activate'}
                                                        className={`p-1.5 rounded-md border border-[var(--border-default)] bg-white cursor-pointer transition-colors ${school.is_active
                                                            ? 'text-danger-600 hover:bg-danger-50'
                                                            : 'text-success-600 hover:bg-success-50'
                                                            }`}
                                                    >
                                                        {school.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="py-3.5 px-4 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-[0.8125rem] text-[var(--text-muted)]">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} of {pagination.total}
                        </span>

                        <div className="flex gap-1 flex-wrap justify-center">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                let p = page;
                                if (pagination.totalPages <= 5) p = i + 1;
                                else if (page <= 3) p = i + 1;
                                else if (page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                                else p = page - 2 + i;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 rounded-md border text-[0.8125rem] cursor-pointer transition-colors ${p === page
                                            ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                            : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white text-[var(--text-secondary)] text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
