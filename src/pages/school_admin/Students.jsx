import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, ChevronDown, ChevronUp, Eye, MoreHorizontal, GraduationCap, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useDebounce from '../../hooks/useDebounce.js';
import { buildPath, ROUTES } from '../../config/routes.config.js';
import { getFullName, getInitials, formatDate } from '../../utils/formatters.js';

// ── Mock data (replace with API call) ────────────────────────────────────────
const MOCK_STUDENTS = Array.from({ length: 28 }, (_, i) => ({
    id: `stu-${i + 1}`,
    first_name: ['Aarav', 'Priya', 'Rohit', 'Sneha', 'Karan', 'Divya', 'Arjun', 'Meera', 'Vikram', 'Ananya', 'Raj', 'Pooja', 'Dev', 'Riya', 'Aditya', 'Nisha', 'Saurav', 'Kavya', 'Harsh', 'Tanya', 'Amit', 'Shruti', 'Nikhil', 'Pallavi', 'Varun', 'Simran', 'Rahul', 'Neha'][i],
    last_name: ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Joshi', 'Verma', 'Shah', 'Mehta', 'Reddy', 'Nair', 'Iyer', 'Chopra', 'Bansal', 'Malhotra', 'Kapoor', 'Bose', 'Das', 'Pillai', 'Menon', 'Shetty', 'Kaur', 'Rao', 'Desai', 'Saxena', 'Agarwal', 'Tiwari', 'Pandey'][i],
    class: `Class ${Math.floor(i / 4) + 6}`,
    section: ['A', 'B', 'C', 'D'][i % 4],
    is_active: i % 7 !== 6,
    token_status: ['ACTIVE', 'ACTIVE', 'UNASSIGNED', 'EXPIRED', 'ACTIVE', 'ACTIVE', 'REVOKED'][i % 7],
    parent_linked: i % 3 !== 2,
    created_at: new Date(Date.now() - i * 86400000 * 15).toISOString(),
    photo_url: null,
}));

const TOKEN_BADGE = {
    ACTIVE: { bg: '#ECFDF5', color: '#047857', label: 'Active' },
    UNASSIGNED: { bg: '#F1F5F9', color: '#475569', label: 'Unassigned' },
    EXPIRED: { bg: '#FFFBEB', color: '#B45309', label: 'Expired' },
    REVOKED: { bg: '#FEF2F2', color: '#B91C1C', label: 'Revoked' },
    ISSUED: { bg: '#E0F2FE', color: '#0369A1', label: 'Issued' },
};

const CLASSES = ['All Classes', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const SECTIONS = ['All Sections', 'A', 'B', 'C', 'D'];
const TOKEN_FILTERS = ['All Tokens', 'ACTIVE', 'UNASSIGNED', 'EXPIRED', 'REVOKED'];

export default function Students() {
    const navigate = useNavigate();
    const { can } = useAuth();
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('All Classes');
    const [sectionFilter, setSectionFilter] = useState('All Sections');
    const [tokenFilter, setTokenFilter] = useState('All Tokens');
    const [sortField, setSortField] = useState('first_name');
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const debouncedSearch = useDebounce(search, 350);
    const PAGE_SIZE = 10;

    const filtered = MOCK_STUDENTS.filter(s => {
        const name = getFullName(s.first_name, s.last_name).toLowerCase();
        const matchSearch = !debouncedSearch || name.includes(debouncedSearch.toLowerCase());
        const matchClass = classFilter === 'All Classes' || s.class === classFilter;
        const matchSection = sectionFilter === 'All Sections' || s.section === sectionFilter;
        const matchToken = tokenFilter === 'All Tokens' || s.token_status === tokenFilter;
        return matchSearch && matchClass && matchSection && matchToken;
    }).sort((a, b) => {
        const av = sortField === 'first_name' ? getFullName(a.first_name, a.last_name) : a[sortField] || '';
        const bv = sortField === 'first_name' ? getFullName(b.first_name, b.last_name) : b[sortField] || '';
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const activeFilters = [classFilter !== 'All Classes' && classFilter, sectionFilter !== 'All Sections' && sectionFilter, tokenFilter !== 'All Tokens' && tokenFilter].filter(Boolean);

    const toggleSort = (field) => { if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortField(field); setSortDir('asc'); } };
    const SortIcon = ({ field }) => sortField === field ? (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ChevronDown size={13} style={{ opacity: 0.3 }} />;

    return (
        <div style={{ maxWidth: '1200px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Students</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>{filtered.length} students found</p>
                </div>
                {can('students.create') && (
                    <button onClick={() => { }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '8px', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                        <Plus size={16} /> Add Student
                    </button>
                )}
            </div>

            {/* Search + Filter Bar */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name..." style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none', background: 'var(--color-slate-50)', fontFamily: 'var(--font-body)' }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--border-default)', background: showFilters ? 'var(--color-brand-50)' : 'white', color: showFilters ? 'var(--color-brand-600)' : 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>
                        <Filter size={15} /> Filters {activeFilters.length > 0 && <span style={{ background: 'var(--color-brand-600)', color: 'white', borderRadius: '9999px', padding: '0 6px', fontSize: '0.75rem', fontWeight: 700 }}>{activeFilters.length}</span>}
                    </button>
                </div>
                {showFilters && (
                    <div style={{ padding: '0 16px 16px', display: 'flex', gap: '12px', borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
                        {[['Class', CLASSES, classFilter, setClassFilter], ['Section', SECTIONS, sectionFilter, setSectionFilter], ['Token Status', TOKEN_FILTERS, tokenFilter, setTokenFilter]].map(([label, opts, val, setter]) => (
                            <div key={label}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{label}</label>
                                <select value={val} onChange={e => { setter(e.target.value); setPage(1); }} style={{ padding: '7px 12px', border: '1px solid var(--border-default)', borderRadius: '7px', fontSize: '0.875rem', color: 'var(--text-primary)', background: 'white', cursor: 'pointer', outline: 'none' }}>
                                    {opts.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                        {activeFilters.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button onClick={() => { setClassFilter('All Classes'); setSectionFilter('All Sections'); setTokenFilter('All Tokens'); setPage(1); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 12px', borderRadius: '7px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--color-danger-600)', fontSize: '0.875rem', cursor: 'pointer' }}>
                                    <X size={14} /> Clear all
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--color-slate-50)' }}>
                            {[['Student', 'first_name'], ['Class', 'class'], ['Token Status', null], ['Parent', null], ['Joined', 'created_at'], ['', null]].map(([label, field]) => (
                                <th key={label} onClick={field ? () => toggleSort(field) : undefined} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: field ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{label}{field && <SortIcon field={field} />}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <GraduationCap size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                <div style={{ fontWeight: 500 }}>No students found</div>
                                <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>Try adjusting your search or filters</div>
                            </td></tr>
                        ) : paginated.map((student, idx) => {
                            const badge = TOKEN_BADGE[student.token_status] || TOKEN_BADGE.UNASSIGNED;
                            const name = getFullName(student.first_name, student.last_name);
                            return (
                                <tr key={student.id} style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none', transition: 'background 0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--color-brand-700)', flexShrink: 0 }}>
                                                {getInitials(name)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {student.id.slice(-6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{student.class} – {student.section}</span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: badge.bg, color: badge.color }}>{badge.label}</span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{ fontSize: '0.8125rem', padding: '3px 10px', borderRadius: '9999px', background: student.parent_linked ? '#ECFDF5' : '#F1F5F9', color: student.parent_linked ? '#047857' : '#64748B', fontWeight: 600 }}>
                                            {student.parent_linked ? 'Linked' : 'Not linked'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{formatDate(student.created_at)}</td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <button onClick={() => navigate(buildPath(ROUTES.SCHOOL_ADMIN.STUDENT_DETAIL, { studentId: student.id }))}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-default)', background: 'white', color: 'var(--color-brand-600)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand-50)'; e.currentTarget.style.borderColor = 'var(--color-brand-300)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid', borderColor: p === page ? 'var(--color-brand-500)' : 'var(--border-default)', background: p === page ? 'var(--color-brand-600)' : 'white', color: p === page ? 'white' : 'var(--text-secondary)', fontWeight: p === page ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer' }}>{p}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}