/**
 * SCHOOL ADMIN — ADMIN PROFILE
 * View and edit the logged-in admin's personal profile.
 */

import { useState } from 'react';
import {
    User, Save, Mail, Phone, Shield, Camera, Loader2, CheckCircle, Upload
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import usePremiumStatus from '../../hooks/usePremiumStatus.js';
import { toast } from '#utils/Toast.js';

export default function AdminProfile() {
    const { user } = useAuth();
    const isPremium = usePremiumStatus();

    const [profile, setProfile] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@greenvalley.edu.in',
        phone: '+91-9876543210',
        role: user?.role || 'SCHOOL_ADMIN',
        avatar: null,
        plan: user?.plan || 'basic', // plan from store, fallback basic
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        toast.success('Profile updated successfully');
    };

    // Helper for role label
    const roleLabels = {
        SUPER_ADMIN: 'Super Admin',
        SCHOOL_ADMIN: 'School Admin',
        SCHOOL_STAFF: 'Staff',
        SCHOOL_VIEWER: 'Viewer',
    };
    const roleLabel = roleLabels[profile.role] || profile.role;

    return (
        <div className="max-w-[900px] mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <User size={22} className="text-white" />
                </div>
                <div>
                    <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Admin Profile</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your personal account details.</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-[var(--border-default)] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-[var(--border-default)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={18} />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Personal Information</h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-3xl font-bold text-brand-700 shadow-md overflow-hidden">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    profile.name?.charAt(0)?.toUpperCase() || 'A'
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-[var(--border-default)] flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                                <Camera size={14} className="text-slate-500" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{profile.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                    {roleLabel}
                                </span>
                                {/* Plan badge */}
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    profile.plan === 'premium'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {profile.plan === 'premium' ? '✦ Premium' : 'Basic'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Editable fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                                />
                            </div>
                        </div>
                        {/* Role is read-only */}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Role</label>
                            <div className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm bg-slate-50 text-[var(--text-muted)]">
                                {roleLabel}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-[var(--border-default)]">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-2xl border border-[var(--border-default)] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-[var(--border-default)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Shield size={18} />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Account Summary</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Plan</p>
                        <p className="text-lg font-bold text-[var(--text-primary)] capitalize">{profile.plan}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Status</p>
                        <p className="text-lg font-bold text-emerald-600">Active</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">School</p>
                        <p className="text-lg font-bold text-[var(--text-primary)]">Green Valley School</p>
                    </div>
                </div>
            </div>
        </div>
    );
}