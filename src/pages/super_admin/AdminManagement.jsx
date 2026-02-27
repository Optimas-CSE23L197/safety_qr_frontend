/**
 * SUPER ADMIN — ADMIN MANAGEMENT
 * List of all school admins + super admins. Create, deactivate, reset password.
 */

import { useState } from 'react';
import { Search, Plus, Users, Eye, ToggleLeft, ToggleRight, Mail, Shield, Building2, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce.js';
import { formatDate, formatRelativeTime, humanizeEnum, getInitials } from '../../utils/formatters.js';

const MOCK_ADMINS = Array.from({ length: 26 }, (_, i) => ({
    id: `adm-${i + 1}`,
    name: ['Rajesh Kumar', 'Priya Sharma', 'Anita Verma', 'Suresh Nair', 'Meera Iyer',
        'Arun Pillai', 'Kavitha Reddy', 'Deepak Singh', 'Lata Mehta', 'Rajan Patel',
        'Sunita Joshi', 'Vijay Bose', 'Anjali Das', 'Krishna Rao', 'Pooja Chopra',
        'Mahesh Kaur', 'Rekha Shetty', 'Santosh Nair', 'Uma Pillai', 'Vivek Menon',
        'Divya Gupta', 'Naveen Kumar', 'Swati Shah', 'Aditya Mehta', 'Pallavi Reddy', 'Manish Saxena'][i],
    email: `admin${i + 1}@school${i + 1}.edu.in`,
    role: i < 2 ? 'SUPER_ADMIN' : ['ADMIN', 'ADMIN', 'STAFF', 'ADMIN', 'VIEWER', 'ADMIN'][i % 6],
    school_name: i < 2 ? null : ['Delhi Public School', 'St. Mary\'s Convent', 'Kendriya Vidyalaya', 'Ryan International', 'Cambridge High'][i % 5],
    is_active: i % 8 !== 7,
    last_login_at: i % 4 !== 3 ? new Date(Date.now() - i * 3600000 * 24).toISOString() : null,
    created_at: new Date(Date.now() - i * 86400000 * 20).toISOString(),
}));

const ROLE_STYLE = {
    SUPER_ADMIN: { bg: '#FEF3C7', color: '#B45309', icon: Shield },
    ADMIN: { bg: '#EFF6FF', color: '#1D4ED8', icon: Users },
    STAFF: { bg: '#F5F3FF', color: '#6D28D9', icon: Users },
    VIEWER: { bg: '#F1F5F9', color: '#475569', icon: Eye },
};

const CreateAdminModal = ({ onClose }) => {
    const [form, setForm] = useState({ name: '', email: '', role: 'ADMIN', school_id: '' });
    const change = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                        Create Admin Account
                    </h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={18} />
                    </button>
                </div>
                {[
                    ['Full Name', 'name', 'text', 'e.g. Rajesh Kumar'],
                    ['Email Address', 'email', 'email', 'admin@school.edu.in'],
                ].map(([label, field, type, ph]) => (
                    <div key={field} style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>
                        <input type={type} value={form[field]} onChange={change(field)} placeholder={ph}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
                    </div>
                ))}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Role</label>
                    <select value={form.role} onChange={change('role')}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-default)', borderRadius: '8px', fontSize: '0.875rem', background: 'white', outline: 'none' }}>
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="VIEWER">Viewer</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-default)', background: 'white', cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }}>Cancel</button>
                    <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#2563EB,#1E40AF)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AdminManagement() {
    const [admins, setAdmins] = useState(MOCK_ADMINS);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 350);
    const PAGE_SIZE = 10;

    const filtered = admins.filter(a => {
        const matchSearch = !debouncedSearch ||
            a.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            a.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (a.school_name || '').toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchRole = roleFilter === 'ALL' || a.role === roleFilter;
        return matchSearch && matchRole;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleActive = (id) =>
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));

    const ROLES = ['ALL', 'SUPER_ADMIN', 'ADMIN', 'STAFF', 'VIEWER'];

    return (
        <div style={{ maxWidth: '1200px' }}>
            {showModal && <CreateAdminModal onClose={() => setShowModal(false)} />}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        Admin Management
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                        {filtered.length} administrators · {admins.filter(a => a.is_active).length} active
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 18px', borderRadius: '8px',
                        background: 'linear-gradient(135deg,#2563EB,#1E40AF)',
                        color: 'white', border: 'none', fontFamily: 'var(--font-display)',
                        fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                    }}
                >
                    <Plus size={16} /> Create Admin
                </button>
            </div>

            {/* Filter bar */}
            <div style={{
                background: 'white', borderRadius: '12px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-card)',
                padding: '16px', marginBottom: '16px',
                display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
            }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {ROLES.map(r => (
                        <button
                            key={r}
                            onClick={() => { setRoleFilter(r); setPage(1); }}
                            style={{
                                padding: '6px 13px', borderRadius: '7px', border: '1px solid',
                                borderColor: roleFilter === r ? 'var(--color-brand-500)' : 'var(--border-default)',
                                background: roleFilter === r ? 'var(--color-brand-600)' : 'white',
                                color: roleFilter === r ? 'white' : 'var(--text-secondary)',
                                fontWeight: roleFilter === r ? 700 : 400,
                                fontSize: '0.8125rem', cursor: 'pointer',
                            }}
                        >
                            {r === 'ALL' ? 'All Roles' : humanizeEnum(r)}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search name, email, school..."
                        style={{
                            padding: '7px 12px 7px 32px', border: '1px solid var(--border-default)',
                            borderRadius: '8px', fontSize: '0.875rem', outline: 'none', width: '240px',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-brand-500)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                    />
                </div>
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
                            {['Administrator', 'Role', 'School', 'Last Login', 'Status', 'Joined', ''].map(h => (
                                <th key={h} style={{
                                    padding: '11px 16px', textAlign: 'left',
                                    fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
                                    letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Users size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                    <div style={{ fontWeight: 500 }}>No administrators found</div>
                                </td>
                            </tr>
                        ) : paginated.map((admin, idx) => {
                            const role = ROLE_STYLE[admin.role] || ROLE_STYLE.ADMIN;
                            return (
                                <tr
                                    key={admin.id}
                                    style={{ borderBottom: idx < paginated.length - 1 ? '1px solid var(--border-default)' : 'none', transition: 'background 0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: admin.role === 'SUPER_ADMIN'
                                                    ? 'linear-gradient(135deg,#D97706,#F59E0B)'
                                                    : 'linear-gradient(135deg,#DBEAFE,#BFDBFE)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: 'var(--font-display)', fontWeight: 700,
                                                fontSize: '0.8125rem',
                                                color: admin.role === 'SUPER_ADMIN' ? 'white' : 'var(--color-brand-700)',
                                                flexShrink: 0,
                                            }}>
                                                {getInitials(admin.name)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{admin.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Mail size={11} /> {admin.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            padding: '3px 10px', borderRadius: '9999px',
                                            fontSize: '0.75rem', fontWeight: 600,
                                            background: role.bg, color: role.color,
                                        }}>
                                            <role.icon size={11} />
                                            {humanizeEnum(admin.role)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        {admin.school_name ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                <Building2 size={13} color="var(--text-muted)" />
                                                {admin.school_name}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Platform-wide</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '13px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                        {admin.last_login_at ? formatRelativeTime(admin.last_login_at) : 'Never'}
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: '9999px',
                                            fontSize: '0.75rem', fontWeight: 600,
                                            background: admin.is_active ? '#ECFDF5' : '#F1F5F9',
                                            color: admin.is_active ? '#047857' : '#475569',
                                        }}>
                                            {admin.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 16px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                        {formatDate(admin.created_at)}
                                    </td>
                                    <td style={{ padding: '13px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                title="Send password reset"
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '5px',
                                                    padding: '6px 10px', borderRadius: '6px',
                                                    border: '1px solid var(--border-default)',
                                                    background: 'white', color: 'var(--text-muted)',
                                                    fontSize: '0.8125rem', cursor: 'pointer',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                            >
                                                <Mail size={13} />
                                            </button>
                                            <button
                                                onClick={() => toggleActive(admin.id)}
                                                title={admin.is_active ? 'Deactivate' : 'Activate'}
                                                style={{
                                                    width: '32px', height: '32px', borderRadius: '6px',
                                                    border: '1px solid var(--border-default)',
                                                    background: 'white', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: admin.is_active ? 'var(--color-danger-600)' : 'var(--color-success-600)',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = admin.is_active ? '#FEF2F2' : '#ECFDF5'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                            >
                                                {admin.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div style={{
                        padding: '14px 16px', borderTop: '1px solid var(--border-default)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{
                                    width: '32px', height: '32px', borderRadius: '6px', border: '1px solid',
                                    borderColor: p === page ? 'var(--color-brand-500)' : 'var(--border-default)',
                                    background: p === page ? 'var(--color-brand-600)' : 'white',
                                    color: p === page ? 'white' : 'var(--text-secondary)',
                                    fontWeight: p === page ? 700 : 400, fontSize: '0.8125rem', cursor: 'pointer',
                                }}>
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