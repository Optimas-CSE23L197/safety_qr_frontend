/**
 * SCHOOL ADMIN — ADMIN PROFILE
 * Professional redesign with clickable avatar upload, unified tokens,
 * and refined interactions.
 */

import { useState } from 'react';
import {
    User, Save, Mail, Phone, Shield, Camera, Loader2, CheckCircle, Upload
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import usePremiumStatus from '../../hooks/usePremiumStatus.js';
import { toast } from '#utils/Toast.js';

// ─── Design Tokens (consistent across all pages) ──────────────────────────────
const COLORS = {
    brand: {
        50: 'var(--color-brand-50, #EEF2FF)',
        100: 'var(--color-brand-100, #E0E7FF)',
        500: 'var(--color-brand-500, #6366F1)',
        600: 'var(--color-brand-600, #4F46E5)',
        700: 'var(--color-brand-700, #4338CA)',
    },
    slate: {
        50: 'var(--color-slate-50, #F8FAFC)',
        100: 'var(--color-slate-100, #F1F5F9)',
        200: 'var(--color-slate-200, #E2E8F0)',
        300: 'var(--color-slate-300, #CBD5E1)',
        400: 'var(--color-slate-400, #94A3B8)',
        500: 'var(--color-slate-500, #64748B)',
        600: 'var(--color-slate-600, #475569)',
        700: 'var(--color-slate-700, #334155)',
        800: 'var(--color-slate-800, #1E293B)',
    },
    border: 'var(--border-default, #E2E8F0)',
    text: {
        primary: 'var(--text-primary, #0F172A)',
        secondary: 'var(--text-secondary, #475569)',
        muted: 'var(--text-muted, #94A3B8)',
    },
    success: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', icon: '#10B981' },
    warning: { bg: '#FFFBEB', text: '#92400E', border: '#FCD34D', icon: '#F59E0B' },
    danger:  { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', icon: '#EF4444' },
    info:    { bg: '#F0F9FF', text: '#075985', border: '#BAE6FD', icon: '#0EA5E9' },
};

export default function AdminProfile() {
    const { user } = useAuth();
    const isPremium = usePremiumStatus();

    const [profile, setProfile] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@greenvalley.edu.in',
        phone: '+91-9876543210',
        role: user?.role || 'SCHOOL_ADMIN',
        avatar: null,
        plan: user?.plan || 'basic',
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        toast.success('Profile updated successfully');
    };

    // Role label helper
    const roleLabels = {
        SUPER_ADMIN: 'Super Admin',
        SCHOOL_ADMIN: 'School Admin',
        SCHOOL_STAFF: 'Staff',
        SCHOOL_VIEWER: 'Viewer',
    };
    const roleLabel = roleLabels[profile.role] || profile.role;

    return (
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* ── Header ────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <User size={22} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Profile</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your personal account details.</p>
                </div>
            </div>

            {/* ── Profile Card ────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={18} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-900">Personal Information</h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Avatar Section – camera button now opens file picker */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-3xl font-bold text-brand-700 shadow-md overflow-hidden ring-4 ring-white">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    profile.name?.charAt(0)?.toUpperCase() || 'A'
                                )}
                            </div>
                            <button
                                onClick={() => document.getElementById('avatar-input')?.click()}
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
                                title="Upload photo"
                            >
                                <Camera size={14} className="text-slate-500" />
                            </button>
                            <input
                                id="avatar-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        setProfile(prev => ({ ...prev, avatar: previewUrl }));
                                        toast.success('Photo updated (preview)');
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                                    {roleLabel}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                    profile.plan === 'premium'
                                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                    {profile.plan === 'premium' ? '✦ Premium' : 'Basic'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Editable fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 bg-white transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 bg-white transition-all"
                                />
                            </div>
                        </div>
                        {/* Role – read‑only */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                            <div className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 select-none cursor-default">
                                {roleLabel}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-200">
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

            {/* ── Account Summary ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Shield size={18} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-900">Account Summary</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</p>
                        <p className="text-lg font-bold text-slate-900 capitalize">{profile.plan}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                        <p className="text-lg font-bold text-emerald-600">Active</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 space-y-1 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">School</p>
                        <p className="text-lg font-bold text-slate-900">Green Valley School</p>
                    </div>
                </div>
            </div>
        </div>
    );
}