/**
 * SUPER ADMIN — ALL SCHOOLS
 * Full school list with search, filters, pagination, status badges,
 * and action buttons to view/suspend/activate schools.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Filter, Building2, Eye, ToggleLeft,
    ToggleRight, ChevronDown, ChevronUp, X, MapPin, Users, CreditCard,
} from 'lucide-react';
import useDebounce from '../../hooks/useDebounce.js';
import { buildPath, ROUTES } from '../../config/routes.config.js';
import { formatDate, formatCompact, humanizeEnum } from '../../utils/formatters.js';

const MOCK_SCHOOLS = Array.from({ length: 38 }, (_, i) => ({
    id: `sch-${i + 1}`,
    name: [
        'Delhi Public School, Noida', 'St. Mary\'s Convent, Pune', 'Kendriya Vidyalaya, Bhopal',
        'Ryan International, Mumbai', 'Cambridge High School, Hyderabad', 'DAV Public School, Kolkata',
        'La Martiniere, Lucknow', 'Army Public School, Chandigarh', 'Amity International, Gurgaon',
        'The Doon School, Dehradun', 'Loreto Convent, Ranchi', 'Presentation Convent, Srinagar',
        'Bishops School, Pune', 'Cathedral & John Connon, Mumbai', 'Frank Anthony Public, Bangalore',
        'Bhavan\'s Vidyashram, Chennai', 'Sunshine International, Ahmedabad', 'Apeejay School, Delhi',
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

const SUB_STYLE = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857' },
    TRIALING: { bg: '#E0F2FE', color: '#0369A1' },
    PAST_DUE: { bg: '#FFFBEB', color: '#B45309' },
    CANCELED: { bg: '#FEF2F2', color: '#B91C1C' },
    EXPIRED: { bg: '#F1F5F9', color: '#475569' },
};

const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
const SUB_FILTERS = ['All', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'EXPIRED'];

export default function AllSchools() {
    const navigate = useNavigate();
    const [schools, setSchools] = useState(MOCK_SCHOOLS);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('All Cities');
    const [subFilter, setSubFilter] = useState('All');
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortField, setSortField] = useState('created_at');
    const [sortDir, setSortDir] = useState('desc');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const debouncedSearch = useDebounce(search, 350);
    const PAGE_SIZE = 10;

    const filtered = schools.filter(s => {
        const matchSearch = !debouncedSearch ||
            s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            s.city.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchCity = cityFilter === 'All Cities' || s.city === cityFilter;
        const matchSub = subFilter === 'All' || s.subscription_status === subFilter;
        const matchActive = activeFilter === 'All' || (activeFilter === 'Active' ? s.is_active : !s.is_active);
        return matchSearch && matchCity && matchSub && matchActive;
    }).sort((a, b) => {
        const av = a[sortField] ?? '';
        const bv = b[sortField] ?? '';
        if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };
    const SortIcon = ({ field }) =>
        sortField === field
            ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
            : <ChevronDown size={13} style={{ opacity: 0.3 }} />;

    const toggleActive = (id) => {
        setSchools(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
    };

    const activeFilters = [
        cityFilter !== 'All Cities' && cityFilter,
        subFilter !== 'All' && subFilter,
        activeFilter !== 'All' && activeFilter,
    ].filter(Boolean);

    return (
        <div style={{ maxWidth: '1300px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        All Schools
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                        {filtered.length} schools found · {schools.filter(s => s.is_active).length} active
                    </p>
                </div>
                <button
                    onClick={() => navigate(ROUTES.SUPER_ADMIN.REGISTER_SCHOOL)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 18px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                        color: 'white', border: 'none',
                        fontFamily: 'var(--font-display)', fontWeight: 600,
                        fontSize: '0.875rem', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                    }}
                >
                    <Plus size={16} /> Register School
                </button>
            </div>

            {/* Search + Filter bar */}
            <div style={{
                background: 'white', borderRadius: '12px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-card)', marginBottom: '16px', overflow: 'hidden',
            }}>
                <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, code, city..."
                            style={{
                                width: '100%', padding: '9px 12px 9px 38px',
                                border: '1px solid var(--border-default)', borderRadius: '8px',
                                fontSize: '0.875rem', color: 'var(--text-primary)',
                                outline: 'none', background: 'var(--color-slate-50)',
                                fontFamily: 'var(--font-body)',
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '9px 16px', borderRadius: '8px',
                            border: '1px solid var(--border-default)',
                            background: showFilters ? 'var(--color-brand-50)' : 'white',
                            color: showFilters ? 'var(--color-brand-600)' : 'var(--text-secondary)',
                            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                        }}
                    >
                        <Filter size={15} /> Filters
                        {activeFilters.length > 0 && (
                            <span style={{
                                background: 'var(--color-brand-600)', color: 'white',
                                borderRadius: '9999px', padding: '0 6px',
                                fontSize: '0.75rem', fontWeight: 700,
                            }}>
                                {activeFilters.length}
                            </span>
                        )}
                    </button>
                </div>
                {showFilters && (
                    <div style={{
                        padding: '0 16px 16px', display: 'flex', gap: '12px',
                        borderTop: '1px solid var(--border-default)', paddingTop: '16px', flexWrap: 'wrap',
                    }}>
                        {[
                            ['City', CITIES, cityFilter, setCityFilter],
                            ['Subscription', SUB_FILTERS, subFilter, setSubFilter],
                            ['Status', ['All', 'Active', 'Inactive'], activeFilter, setActiveFilter],
                        ].map(([label, opts, val, setter]) => (
                            <div key={label}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{label}</label>
                                <select
                                    value={val}
                                    onChange={e => { setter(e.target.value); setPage(1); }}
                                    style={{
                                        padding: '7px 12px', border: '1px solid var(--border-default)',
                                        borderRadius: '7px', fontSize: '0.875rem',
                                        color: 'var(--text-primary)', background: 'white', cursor: 'pointer', outline: 'none',
                                    }}
                                >
                                    {opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                        {activeFilters.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button
                                    onClick={() => { setCityFilter('All Cities'); setSubFilter('All'); setActiveFilter('All'); setPage(1); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        padding: '7px 12px', borderRadius: '7px',
                                        border: '1px solid var(--border-default)', background: 'white',
                                        color: 'var(--color-danger-600)', fontSize: '0.875rem', cursor: 'pointer',
                                    }}
                                >
                                    <X size={14} /> Clear all
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{
                background: 'white', borderRadius: '12px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-card)', overflow: 'hidden',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                            {[
                                ['School', 'name'], ['Code', null], ['City', 'city'],
                                ['Students', 'students'], ['Subscription', null],
                                ['Status', null], ['Registered', 'created_at'], ['', null],
                            ].map(([label, field]) => (
                                <th
                                    key={label}
                                    onClick={field ? () => toggleSort(field) : undefined}
                                    style={{
                                        padding: '11px 16px', textAlign: 'left',
                                        fontSize: '0.75rem', fontWeight: 600,
                                        color: 'var(--text-muted)', letterSpacing: '0.05em',
                                        textTransform: 'uppercase', cursor: field ? 'pointer' : 'default',
                                        userSelect: 'none', whiteSpace: 'nowrap',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {label}
                                        {field && <SortIcon field={field} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Building2 size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                    <div style={{ fontWeight: 500 }}>No schools found</div>
                                    <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>Try adjusting your search or filters</div>
                                </td>
                            </tr>
                        ) : paginated.map((school, idx) => {
                            const sub = SUB_STYLE[school.subscription_status] || SUB_STYLE.ACTIVE;
                            return (
                                <tr
                                    key={school.id}
                                    style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none', transition: 'background 0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '8px',
                                                background: '#EFF6FF', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <Building2 size={16} color="#2563EB" />
                                            </div>
                                            <div style={{
                                                fontWeight: 600, fontSize: '0.875rem',
                                                color: 'var(--text-primary)',
                                                maxWidth: '200px', overflow: 'hidden',
                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            }}>
                                                {school.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <code style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                                            background: 'var(--color-slate-100)',
                                            padding: '2px 7px', borderRadius: '4px',
                                            color: 'var(--text-muted)',
                                        }}>
                                            {school.code}
                                        </code>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={13} color="var(--text-muted)" />
                                            {school.city}
                                        </div>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            <Users size={13} color="var(--text-muted)" />
                                            {school.students.toLocaleString('en-IN')}
                                        </div>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '9999px',
                                            fontSize: '0.75rem', fontWeight: 600,
                                            background: sub.bg, color: sub.color,
                                        }}>
                                            {humanizeEnum(school.subscription_status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '9999px',
                                            fontSize: '0.75rem', fontWeight: 600,
                                            background: school.is_active ? '#ECFDF5' : '#F1F5F9',
                                            color: school.is_active ? '#047857' : '#475569',
                                        }}>
                                            {school.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                        {formatDate(school.created_at)}
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                onClick={() => navigate(`/super/schools/${school.id}`)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '5px',
                                                    padding: '6px 12px', borderRadius: '6px',
                                                    border: '1px solid var(--border-default)',
                                                    background: 'white', color: 'var(--color-brand-600)',
                                                    fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand-50)'; e.currentTarget.style.borderColor = 'var(--color-brand-300)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                                            >
                                                <Eye size={13} /> View
                                            </button>
                                            <button
                                                onClick={() => toggleActive(school.id)}
                                                title={school.is_active ? 'Deactivate' : 'Activate'}
                                                style={{
                                                    width: '32px', height: '32px', borderRadius: '6px',
                                                    border: '1px solid var(--border-default)',
                                                    background: 'white', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: school.is_active ? 'var(--color-danger-600)' : 'var(--color-success-600)',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = school.is_active ? '#FEF2F2' : '#ECFDF5'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                            >
                                                {school.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        padding: '14px 16px', borderTop: '1px solid var(--border-default)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '6px',
                                        border: '1px solid',
                                        borderColor: p === page ? 'var(--color-brand-500)' : 'var(--border-default)',
                                        background: p === page ? 'var(--color-brand-600)' : 'white',
                                        color: p === page ? 'white' : 'var(--text-secondary)',
                                        fontWeight: p === page ? 700 : 400,
                                        fontSize: '0.8125rem', cursor: 'pointer',
                                    }}
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