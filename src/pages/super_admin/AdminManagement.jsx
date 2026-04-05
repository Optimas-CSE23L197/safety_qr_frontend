/**
 * SUPER ADMIN — ADMIN MANAGEMENT
 * List of all school admins. Create, deactivate, reset password.
 * School selection via search by name or unique code.
 */

import { useState, useRef, useEffect } from 'react';
import {
    Search, Plus, Users, Eye, ToggleLeft, ToggleRight,
    Mail, Shield, Building2, X, Key, CheckCircle, XCircle,
    Clock, Filter, UserCog, School, Hash,
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
    role: 'ADMIN',
    school_id: `sch-${(i % 5) + 1}`,
    school_name: ["Delhi Public School, Noida", "St. Mary's Convent, Pune", 'Kendriya Vidyalaya, Bhopal', 'Ryan International, Mumbai', 'Cambridge High School, Hyderabad'][i % 5],
    school_code: ["DPS-NOIDA", "SMC-PUNE", "KV-BHOPAL", "RYN-MUMBAI", "CAM-HYD"][i % 5],
    is_active: i % 8 !== 7,
    is_primary: i % 5 === 0,
    must_change_password: i % 7 === 3,
    invite_sent_at: i % 3 !== 0 ? new Date(Date.now() - i * 3600000 * 24).toISOString() : null,
    invite_accepted_at: i % 4 !== 0 ? new Date(Date.now() - i * 3600000 * 23).toISOString() : null,
    last_login_at: i % 4 !== 2 ? new Date(Date.now() - i * 3600000 * 24).toISOString() : null,
    created_at: new Date(Date.now() - i * 86400000 * 20).toISOString(),
}));

const MOCK_SCHOOLS = [
    { id: 'sch-1', name: 'Delhi Public School, Noida', code: 'DPS-NOIDA', city: 'Noida', students: 1245 },
    { id: 'sch-2', name: "St. Mary's Convent, Pune", code: 'SMC-PUNE', city: 'Pune', students: 890 },
    { id: 'sch-3', name: 'Kendriya Vidyalaya, Bhopal', code: 'KV-BHOPAL', city: 'Bhopal', students: 567 },
    { id: 'sch-4', name: 'Ryan International, Mumbai', code: 'RYN-MUMBAI', city: 'Mumbai', students: 2340 },
    { id: 'sch-5', name: 'Cambridge High School, Hyderabad', code: 'CAM-HYD', city: 'Hyderabad', students: 1123 },
    { id: 'sch-6', name: 'DAV Public School, Kolkata', code: 'DAV-KOL', city: 'Kolkata', students: 987 },
    { id: 'sch-7', name: 'Army Public School, Chandigarh', code: 'APS-CHD', city: 'Chandigarh', students: 654 },
];

const PAGE_SIZE = 10;

// Searchable School Select Component
const SearchableSchoolSelect = ({ value, onChange, error }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);
    const debouncedSearch = useDebounce(search, 300);

    // Mock API call - replace with actual API
    useEffect(() => {
        const searchSchools = async () => {
            if (!debouncedSearch || debouncedSearch.length < 2) {
                setSchools([]);
                return;
            }
            setLoading(true);
            // Simulate API call
            await new Promise(r => setTimeout(r, 300));
            const filtered = MOCK_SCHOOLS.filter(s =>
                s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                s.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                s.city.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
            setSchools(filtered);
            setLoading(false);
        };
        searchSchools();
    }, [debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (school) => {
        onChange(school);
        setSearch('');
        setIsOpen(false);
    };

    return (
        <div className="mb-4" ref={wrapperRef}>
            <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                School <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
                {/* Selected school display */}
                {value ? (
                    <div className="flex items-center justify-between p-3 border border-[var(--border-default)] rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2">
                            <School size={14} className="text-brand-500" />
                            <div>
                                <div className="text-sm font-medium text-[var(--text-primary)]">{value.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">Code: {value.code} · {value.city}</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="p-1 rounded-md hover:bg-slate-200 transition-colors"
                        >
                            <X size={14} className="text-[var(--text-muted)]" />
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setIsOpen(true);
                            }}
                            onFocus={() => setIsOpen(true)}
                            placeholder="Search by school name, code, or city..."
                            className="w-full py-[9px] pl-9 pr-3 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>
                )}

                {/* Dropdown */}
                {isOpen && !value && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border-default)] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                                <div className="animate-spin inline-block w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full mr-2" />
                                Searching...
                            </div>
                        ) : schools.length > 0 ? (
                            schools.map(school => (
                                <button
                                    key={school.id}
                                    type="button"
                                    onClick={() => handleSelect(school)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-[var(--border-default)] last:border-none"
                                >
                                    <div className="font-medium text-sm text-[var(--text-primary)]">{school.name}</div>
                                    <div className="flex gap-3 mt-1 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1"><Hash size={10} /> {school.code}</span>
                                        <span>{school.city}</span>
                                        <span>{school.students} students</span>
                                    </div>
                                </button>
                            ))
                        ) : debouncedSearch && debouncedSearch.length >= 2 ? (
                            <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                                No schools found. Try a different search term.
                            </div>
                        ) : (
                            <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                                Type at least 2 characters to search
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
        </div>
    );
};

// Create Admin Modal
const CreateAdminModal = ({ onClose, onCreate }) => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors] = useState({});

    const change = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    const validate = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = 'Name is required';
        if (!form.email) newErrors.email = 'Email is required';
        if (!form.email.includes('@')) newErrors.email = 'Valid email required';
        if (!form.password) newErrors.password = 'Password is required';
        if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!selectedSchool) newErrors.school = 'School is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onCreate({
            ...form,
            school_id: selectedSchool.id,
            school_name: selectedSchool.name,
            school_code: selectedSchool.code,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl p-7 w-full max-w-[500px] shadow-[var(--shadow-modal)] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-bold text-[var(--text-primary)] m-0">
                        Create School Admin
                    </h3>
                    <button
                        onClick={onClose}
                        className="border-none bg-transparent cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                        Full Name <span className="text-danger-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={change('name')}
                        placeholder="e.g. Rajesh Kumar"
                        className={`w-full py-[9px] px-3 border rounded-lg text-sm outline-none focus:border-brand-500 transition-colors ${errors.name ? 'border-danger-500' : 'border-[var(--border-default)]'
                            }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-danger-500">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                        Email Address <span className="text-danger-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={change('email')}
                        placeholder="admin@school.edu.in"
                        className={`w-full py-[9px] px-3 border rounded-lg text-sm outline-none focus:border-brand-500 transition-colors ${errors.email ? 'border-danger-500' : 'border-[var(--border-default)]'
                            }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-danger-500">{errors.email}</p>}
                </div>

                <SearchableSchoolSelect
                    value={selectedSchool}
                    onChange={setSelectedSchool}
                    error={errors.school}
                />

                <div className="mb-4">
                    <label className="block text-[0.8125rem] font-semibold text-[var(--text-secondary)] mb-1.5">
                        Temporary Password <span className="text-danger-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPass ? 'text' : 'password'}
                            value={form.password}
                            onChange={change('password')}
                            placeholder="Min. 8 characters"
                            className={`w-full py-[9px] px-3 border rounded-lg text-sm outline-none focus:border-brand-500 transition-colors pr-10 ${errors.password ? 'border-danger-500' : 'border-[var(--border-default)]'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        >
                            {showPass ? <Eye size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-danger-500">{errors.password}</p>}
                    <p className="text-xs text-[var(--text-muted)] mt-1">Admin must change password on first login</p>
                </div>

                <div className="flex gap-2.5 justify-end mt-5">
                    <button
                        onClick={onClose}
                        className="py-2 px-[18px] rounded-lg border border-[var(--border-default)] bg-white cursor-pointer font-medium text-sm text-[var(--text-secondary)] hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="py-2 px-[18px] rounded-lg border-none bg-gradient-to-br from-brand-500 to-brand-600 text-white cursor-pointer font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        Create Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Page
export default function AdminManagement() {
    const [admins, setAdmins] = useState(MOCK_ADMINS);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [setupFilter, setSetupFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 350);

    const filtered = admins.filter(a => {
        const q = debouncedSearch.toLowerCase();
        const matchSearch = !q
            || a.name.toLowerCase().includes(q)
            || a.email.toLowerCase().includes(q)
            || (a.school_name || '').toLowerCase().includes(q)
            || (a.school_code || '').toLowerCase().includes(q);

        const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? a.is_active : !a.is_active);

        const inviteStatus = a.invite_accepted_at ? 'ACCEPTED' : (a.invite_sent_at ? 'PENDING' : 'NOT_SENT');
        const matchSetup = setupFilter === 'ALL' || inviteStatus === setupFilter;

        return matchSearch && matchStatus && matchSetup;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const toggleActive = (id) =>
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));

    const resendInvite = (id) => {
        setAdmins(prev => prev.map(a => a.id === id ? { ...a, invite_sent_at: new Date().toISOString() } : a));
    };

    const handleCreateAdmin = (newAdmin) => {
        const newId = `adm-${admins.length + 1}`;
        setAdmins(prev => [{
            id: newId,
            name: newAdmin.name,
            email: newAdmin.email,
            role: 'ADMIN',
            school_id: newAdmin.school_id,
            school_name: newAdmin.school_name,
            school_code: newAdmin.school_code,
            is_active: true,
            is_primary: false,
            must_change_password: true,
            invite_sent_at: new Date().toISOString(),
            invite_accepted_at: null,
            last_login_at: null,
            created_at: new Date().toISOString(),
        }, ...prev]);
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
            {showModal && <CreateAdminModal onClose={() => setShowModal(false)} onCreate={handleCreateAdmin} />}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                        Admin Management
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 m-0">
                        {filtered.length} school administrators · {admins.filter(a => a.is_active).length} active
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 py-[9px] px-[18px] rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none font-display font-semibold text-sm cursor-pointer shadow-[var(--shadow-brand)] hover:opacity-90 transition-opacity"
                >
                    <Plus size={16} /> Create Admin
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex-1 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                        <input
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name, email, school name, or school code..."
                            className="w-full py-[9px] pr-3 pl-9 border border-[var(--border-default)] rounded-lg text-sm outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white cursor-pointer outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>

                    <select
                        value={setupFilter}
                        onChange={e => { setSetupFilter(e.target.value); setPage(1); }}
                        className="py-[9px] px-3 border border-[var(--border-default)] rounded-lg text-sm bg-white cursor-pointer outline-none"
                    >
                        <option value="ALL">All Invites</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="PENDING">Pending</option>
                        <option value="NOT_SENT">Not Sent</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-card)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-[var(--border-default)] bg-slate-50">
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Admin</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">School</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Invite Status</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Last Login</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Joined</th>
                                <th className="py-3 px-4 text-center text-xs font-semibold text-[var(--text-muted)] uppercase">Actions</th>
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
                            ) : (
                                paginated.map((admin, idx) => {
                                    const isPending = admin.invite_sent_at && !admin.invite_accepted_at;
                                    const isAccepted = admin.invite_accepted_at;
                                    const isNotSent = !admin.invite_sent_at;

                                    return (
                                        <tr
                                            key={admin.id}
                                            className={[
                                                'transition-colors hover:bg-slate-50',
                                                idx < paginated.length - 1 ? 'border-b border-[var(--border-default)]' : '',
                                            ].join(' ')}
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center font-display font-bold text-sm text-brand-700">
                                                        {getInitials(admin.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                                                            {admin.name}
                                                            {admin.is_primary && (
                                                                <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 font-medium">Primary</span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                                                            <Mail size={11} /> {admin.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                                                        <Building2 size={13} className="text-[var(--text-muted)]" />
                                                        {admin.school_name}
                                                    </div>
                                                    <div className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                                                        {admin.school_code}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                {isPending && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-50 text-warning-700 w-fit">
                                                            <Clock size={10} /> Pending
                                                        </span>
                                                        <span className="text-[0.6rem] text-[var(--text-muted)]">
                                                            Sent {formatRelativeTime(admin.invite_sent_at)}
                                                        </span>
                                                    </div>
                                                )}
                                                {isAccepted && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-success-50 text-success-700 w-fit">
                                                            <CheckCircle size={10} /> Accepted
                                                        </span>
                                                        <span className="text-[0.6rem] text-[var(--text-muted)]">
                                                            {formatRelativeTime(admin.invite_accepted_at)}
                                                        </span>
                                                    </div>
                                                )}
                                                {isNotSent && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                                        <XCircle size={10} /> Not Sent
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3 px-4 text-sm text-[var(--text-muted)]">
                                                {admin.last_login_at ? formatRelativeTime(admin.last_login_at) : 'Never'}
                                            </td>

                                            <td className="py-3 px-4">
                                                <span className={[
                                                    'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold',
                                                    admin.is_active
                                                        ? 'bg-success-50 text-success-700'
                                                        : 'bg-slate-100 text-slate-600',
                                                ].join(' ')}>
                                                    {admin.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-sm text-[var(--text-muted)]">
                                                {formatDate(admin.created_at)}
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="flex gap-1.5 justify-center">
                                                    <button
                                                        title="Reset Password"
                                                        className="p-1.5 rounded-md border border-[var(--border-default)] bg-white text-[var(--text-muted)] cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                    >
                                                        <Key size={13} />
                                                    </button>

                                                    {isPending && (
                                                        <button
                                                            onClick={() => resendInvite(admin.id)}
                                                            title="Resend Invite"
                                                            className="p-1.5 rounded-md border border-[var(--border-default)] bg-white text-[var(--text-muted)] cursor-pointer hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                        >
                                                            <Mail size={13} />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => toggleActive(admin.id)}
                                                        title={admin.is_active ? 'Deactivate' : 'Activate'}
                                                        className={[
                                                            'p-1.5 rounded-md border border-[var(--border-default)] bg-white cursor-pointer transition-colors',
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
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="py-3.5 px-4 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-sm text-[var(--text-muted)]">
                            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                &lt;
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let p = page;
                                if (totalPages <= 5) p = i + 1;
                                else if (page <= 3) p = i + 1;
                                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                                else p = page - 2 + i;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={[
                                            'w-8 h-8 rounded-md border text-sm transition-colors',
                                            p === page
                                                ? 'border-brand-500 bg-brand-600 text-white font-bold'
                                                : 'border-[var(--border-default)] bg-white text-[var(--text-secondary)] hover:bg-slate-50',
                                        ].join(' ')}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-8 h-8 rounded-md border border-[var(--border-default)] bg-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
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