/**
 * SUPER ADMIN — ADMIN MANAGEMENT
 * List of all school admins + super admins. Create, deactivate, reset password.
 */

import { useState } from 'react';
import {
    Search, Plus, Users, Eye, ToggleLeft, ToggleRight,
    Mail, Shield, Building2, X,
} from 'lucide-react';
import useDebounce from '../../hooks/useDebounce.js';
import { formatDate, formatRelativeTime, humanizeEnum, getInitials } from '../../utils/formatters.js';

const MOCK_ADMINS = Array.from({ length: 26 }, (_, i) => ({
    id: `adm-${i + 1}`,
    name: [
        'Rajesh Kumar', 'Priya Sharma', 'Anita Verma', 'Suresh Nair', 'Meera Iyer',
        'Arun Pillai', 'Kavitha Reddy', 'Deepak Singh', 'Lata Mehta', 'Rajan Patel',
        'Sunita Joshi', 'Vijay Bose', 'Anjali Das', 'Krishna Rao', 'Pooja Chopra',
        'Mahesh Kaur', 'Rekha Shetty', 'Santosh Nair', 'Uma Pillai', 'Vivek Menon',
        'Divya Gupta', 'Naveen Kumar', 'Swati Shah', 'Aditya Mehta', 'Pallavi Reddy', 'Manish Saxena',
    ][i],
    email: `admin${i + 1}@school${i + 1}.edu.in`,
    role: i < 2 ? 'SUPER_ADMIN' : ['ADMIN', 'ADMIN', 'STAFF', 'ADMIN', 'VIEWER', 'ADMIN'][i % 6],
    school_name: i < 2 ? null : ["Delhi Public School", "St. Mary's Convent", 'Kendriya Vidyalaya', 'Ryan International', 'Cambridge High'][i % 5],
    is_active: i % 8 !== 7,
    last_login_at: i % 4 !== 3 ? new Date(Date.now() - i * 3600000 * 24).toISOString() : null,
    created_at: new Date(Date.now() - i * 86400000 * 20).toISOString(),
}));

// Tailwind badge classes per role
const ROLE_BADGE = {
    SUPER_ADMIN: { badge: 'bg-warning-100 text-warning-700', icon: Shield },
    ADMIN:       { badge: 'bg-brand-50 text-brand-700',      icon: Users  },
    STAFF:       { badge: 'bg-violet-50 text-violet-700',    icon: Users  },
    VIEWER:      { badge: 'bg-slate-100 text-slate-600',     icon: Eye    },
};

const PAGE_SIZE = 10;
const ROLES = ['ALL', 'SUPER_ADMIN', 'ADMIN', 'STAFF', 'VIEWER'];

/* ── Create Admin Modal ──────────────────────────────────────────────────── */
const CreateAdminModal = ({ onClose }) => {
    const [form, setForm] = useState({ name: '', email: '', role: 'ADMIN', school_id: '' });
    const change = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl p-7 w-full max-w-[440px] shadow-[var(--shadow-modal)]">

                {/* Modal header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0">
                        Create Admin Account
                    </h3>
                    <button
                        onClick={onClose}
                        className="border-none bg-transparent cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Text inputs */}
                {[
                    ['Full Name',      'name',  'text',  'e.g. Rajesh Kumar'     ],
                    ['Email Address',  'email', 'email', 'admin@school.edu.in'   ],
                ].map(([label, field, type, ph]) => (
                    <div key={field} className="mb-4">
                        <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                            {label}
                        </label>
                        <input
                            type={type}
                            value={form[field]}
                            onChange={change(field)}
                            placeholder={ph}
                            className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500 transition-colors box-border"
                        />
                    </div>
                ))}

                {/* Role select */}
                <div className="mb-4">
                    <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                        Role
                    </label>
                    <select
                        value={form.role}
                        onChange={change('role')}
                        className="w-full py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white outline-none cursor-pointer"
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="VIEWER">Viewer</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 justify-end mt-5">
                    <button
                        onClick={onClose}
                        className="py-2 px-[18px] rounded-lg border border-[var(--border-default)] bg-white cursor-pointer font-medium text-sm text-[var(--text-secondary)] hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="py-2 px-[18px] rounded-lg border-none bg-gradient-to-br from-brand-500 to-brand-600 text-white cursor-pointer font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function AdminManagement() {
    const [admins, setAdmins]         = useState(MOCK_ADMINS);
    const [search, setSearch]         = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showModal, setShowModal]   = useState(false);
    const [page, setPage]             = useState(1);
    const debouncedSearch = useDebounce(search, 350);

    const filtered = admins.filter(a => {
        const q = debouncedSearch.toLowerCase();
        const matchSearch = !q
            || a.name.toLowerCase().includes(q)
            || a.email.toLowerCase().includes(q)
            || (a.school_name || '').toLowerCase().includes(q);
        const matchRole = roleFilter === 'ALL' || a.role === roleFilter;
        return matchSearch && matchRole;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleActive = (id) =>
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));

    return (
        <div className="max-w-[1200px]">
            {showModal && <CreateAdminModal onClose={() => setShowModal(false)} />}

            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                        Admin Management
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                        {filtered.length} administrators · {admins.filter(a => a.is_active).length} active
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 py-[9px] px-[18px] rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none font-display font-semibold text-sm cursor-pointer shadow-[var(--shadow-brand)] hover:opacity-90 transition-opacity"
                >
                    <Plus size={16} /> Create Admin
                </button>
            </div>

            {/* ── Filter bar ────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] p-4 mb-4 flex gap-3 items-center flex-wrap">

                {/* Role pills */}
                <div className="flex gap-1.5 flex-wrap">
                    {ROLES.map(r => (
                        <button
                            key={r}
                            onClick={() => { setRoleFilter(r); setPage(1); }}
                            className={[
                                'py-1.5 px-[13px] rounded-[7px] border text-[0.8125rem] cursor-pointer transition-colors',
                                roleFilter === r
                                    ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                    : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {r === 'ALL' ? 'All Roles' : humanizeEnum(r)}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="ml-auto relative">
                    <Search
                        size={15}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                    />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search name, email, school..."
                        className="py-[7px] pr-3 pl-8 border border-[var(--border-default)] rounded-lg text-sm outline-none w-60 focus:border-brand-500 transition-colors"
                    />
                </div>
            </div>

            {/* ── Table ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] bg-slate-50">
                            {['Administrator', 'Role', 'School', 'Last Login', 'Status', 'Joined', ''].map(h => (
                                <th
                                    key={h}
                                    className="py-[11px] px-4 text-left text-xs font-semibold text-[var(--text-muted)] tracking-[0.05em] uppercase whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center text-[var(--text-muted)]">
                                    <Users size={36} className="mx-auto mb-3 opacity-30" />
                                    <div className="font-medium">No administrators found</div>
                                </td>
                            </tr>
                        ) : paginated.map((admin, idx) => {
                            const role = ROLE_BADGE[admin.role] ?? ROLE_BADGE.ADMIN;
                            const RoleIcon = role.icon;
                            const isSuperAdmin = admin.role === 'SUPER_ADMIN';

                            return (
                                <tr
                                    key={admin.id}
                                    className={[
                                        'transition-colors hover:bg-slate-50',
                                        idx < paginated.length - 1 ? 'border-b border-[var(--border-default)]' : '',
                                    ].join(' ')}
                                >
                                    {/* Name + email */}
                                    <td className="py-[13px] px-4">
                                        <div className="flex items-center gap-2.5">
                                            {/* Avatar */}
                                            <div className={[
                                                'w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[0.8125rem] shrink-0',
                                                isSuperAdmin
                                                    ? 'bg-gradient-to-br from-warning-600 to-warning-500 text-white'
                                                    : 'bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700',
                                            ].join(' ')}>
                                                {getInitials(admin.name)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-[var(--text-primary)]">
                                                    {admin.name}
                                                </div>
                                                <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                                                    <Mail size={11} /> {admin.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role badge */}
                                    <td className="py-[13px] px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${role.badge}`}>
                                            <RoleIcon size={11} />
                                            {humanizeEnum(admin.role)}
                                        </span>
                                    </td>

                                    {/* School */}
                                    <td className="py-[13px] px-4">
                                        {admin.school_name ? (
                                            <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                                                <Building2 size={13} className="text-[var(--text-muted)]" />
                                                {admin.school_name}
                                            </div>
                                        ) : (
                                            <span className="text-[0.8125rem] text-[var(--text-muted)]">Platform-wide</span>
                                        )}
                                    </td>

                                    {/* Last login */}
                                    <td className="py-[13px] px-4 text-[0.8125rem] text-[var(--text-muted)]">
                                        {admin.last_login_at ? formatRelativeTime(admin.last_login_at) : 'Never'}
                                    </td>

                                    {/* Active badge */}
                                    <td className="py-[13px] px-4">
                                        <span className={[
                                            'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold',
                                            admin.is_active
                                                ? 'bg-success-50 text-success-700'
                                                : 'bg-slate-100 text-slate-600',
                                        ].join(' ')}>
                                            {admin.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    {/* Joined date */}
                                    <td className="py-[13px] px-4 text-[0.8125rem] text-[var(--text-muted)]">
                                        {formatDate(admin.created_at)}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-[13px] px-4">
                                        <div className="flex gap-1.5">
                                            {/* Mail / reset password */}
                                            <button
                                                title="Send password reset"
                                                className="flex items-center justify-center py-1.5 px-2.5 rounded-md border border-[var(--border-default)] bg-white text-[var(--text-muted)] cursor-pointer hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300 transition-colors"
                                            >
                                                <Mail size={13} />
                                            </button>

                                            {/* Toggle active */}
                                            <button
                                                onClick={() => toggleActive(admin.id)}
                                                title={admin.is_active ? 'Deactivate' : 'Activate'}
                                                className={[
                                                    'w-8 h-8 rounded-md border border-[var(--border-default)] bg-white cursor-pointer flex items-center justify-center transition-colors',
                                                    admin.is_active
                                                        ? 'text-danger-600 hover:bg-danger-50'
                                                        : 'text-success-600 hover:bg-success-50',
                                                ].join(' ')}
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

                {/* ── Pagination ─────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="py-3.5 px-4 border-t border-[var(--border-default)] flex items-center justify-between">
                        <span className="text-[0.8125rem] text-[var(--text-muted)]">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map(p => (
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