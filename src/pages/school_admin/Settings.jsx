/**
 * SCHOOL ADMIN — SETTINGS
 * Professional redesign with unified tokens, refined spacing,
 * consistent premium‑gated placeholders, and a clickable logo upload.
 */

import { useState } from 'react';
import {
    Settings as SettingsIcon, Save, Building2, Bell, Shield,
    Link2, Lock, Eye, EyeOff, Upload,
    Mail, Phone, MapPin, Globe, Smartphone, Megaphone, X, Loader2,
    Users, UserPlus, ChevronRight, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import usePremiumStatus from '../../hooks/usePremiumStatus.js';
import { toast } from '#utils/Toast.js';
import { ROUTES } from '../../config/routes.config.js';

// ─── Design Tokens (shared across all pages) ──────────────────────────────────
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

// ─── Premium Locked Section Wrapper (refined) ─────────────────────────────────
const PremiumSection = ({ isPremium, icon, title, description, children }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {icon}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{title}</h3>
                </div>
                {!isPremium && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Lock size={11} /> Premium
                    </span>
                )}
            </div>
            <div className="p-6">
                {isPremium ? (
                    <div>
                        {description && (
                            <p className="text-sm text-slate-500 mb-5">{description}</p>
                        )}
                        {children}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 ring-1 ring-slate-200">
                            <Lock size={26} className="text-slate-400" />
                        </div>
                        <h4 className="font-bold text-base text-slate-800 mb-1">{title}</h4>
                        <p className="text-sm text-slate-500 max-w-xs">
                            {description || 'Available on the Premium plan.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Settings() {
    const { user } = useAuth();
    const isPremium = usePremiumStatus();
    const navigate = useNavigate();

    // ── School Profile ──────────────────────────────────────────────────────
    const [profile, setProfile] = useState({
        schoolName: 'Green Valley School',
        address: '123 Education Lane, Sector 5',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '+91-11-2345-6789',
        email: 'admin@greenvalley.edu.in',
        logo: null,
    });
    const [savingProfile, setSavingProfile] = useState(false);

    const handleProfileSave = async () => {
        setSavingProfile(true);
        await new Promise(r => setTimeout(r, 800));
        setSavingProfile(false);
        toast.success('School profile updated successfully');
    };

    // ── Notification Preferences (Premium) ──────────────────────────────────
    const [notifPrefs, setNotifPrefs] = useState({
        scanAlerts: { push: true, email: true, sms: false },
        anomalies: { push: true, email: true, sms: false },
        cardExpiry: { push: true, email: true, sms: false },
        announcements: { push: true, email: false, sms: false },
    });

    const toggleNotif = (section, channel) => {
        setNotifPrefs(prev => ({
            ...prev,
            [section]: { ...prev[section], [channel]: !prev[section][channel] },
        }));
    };

    // ── Emergency Helplines (Premium) ───────────────────────────────────────
    const [helplines, setHelplines] = useState([
        { id: 1, name: 'School Clinic', number: '+91-11-1111-1111' },
        { id: 2, name: 'Local Police Station', number: '+91-11-100' },
    ]);

    const addHelpline = () => {
        setHelplines(prev => [...prev, { id: Date.now(), name: '', number: '' }]);
    };
    const updateHelpline = (id, field, value) => {
        setHelplines(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
    };
    const removeHelpline = (id) => {
        setHelplines(prev => prev.filter(h => h.id !== id));
    };

    // ── Multi-Branch Setup (Premium) ────────────────────────────────────────
    const [branches, setBranches] = useState(isPremium ? [
        { id: 1, name: 'Main Campus', code: 'GV-001', address: 'Sector 5, New Delhi' },
    ] : []);

    const addBranch = () => {
        setBranches(prev => [...prev, { id: Date.now(), name: '', code: '', address: '' }]);
    };
    const updateBranch = (id, field, value) => {
        setBranches(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };
    const removeBranch = (id) => {
        setBranches(prev => prev.filter(b => b.id !== id));
    };

    // ── Password Change ─────────────────────────────────────────────────────
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const handlePasswordChange = async () => {
        if (passwordForm.new !== passwordForm.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        setChangingPassword(true);
        await new Promise(r => setTimeout(r, 800));
        setChangingPassword(false);
        toast.success('Password changed successfully');
        setPasswordForm({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md shadow-slate-500/20">
                        <SettingsIcon size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage your school profile, preferences, and security.</p>
                    </div>
                </div>
            </div>

            {/* ── School Profile ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Building2 size={18} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-900">School Profile</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">School Name</label>
                            <input
                                type="text"
                                value={profile.schoolName}
                                onChange={e => setProfile({ ...profile, schoolName: e.target.value })}
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={profile.address}
                                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 bg-white transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                            <input
                                type="text"
                                value={profile.city}
                                onChange={e => setProfile({ ...profile, city: e.target.value })}
                                className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                            <input
                                type="text"
                                value={profile.state}
                                onChange={e => setProfile({ ...profile, state: e.target.value })}
                                className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pincode</label>
                            <input
                                type="text"
                                value={profile.pincode}
                                onChange={e => setProfile({ ...profile, pincode: e.target.value })}
                                className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
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
                    </div>

                    {/* Logo Upload – now clickable */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">School Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                {profile.logo ? (
                                    <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload size={20} className="text-slate-400" />
                                )}
                            </div>
                            <button
                                onClick={() => document.getElementById('logo-input')?.click()}
                                className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Upload Logo
                            </button>
                            <input
                                id="logo-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        setProfile(prev => ({ ...prev, logo: previewUrl }));
                                        toast.success('Logo updated (preview only – upload not implemented)');
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-200">
                        <button
                            onClick={handleProfileSave}
                            disabled={savingProfile}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Notification Preferences (Premium) ──────────────────────────── */}
            <PremiumSection
                isPremium={isPremium}
                icon={<Bell size={18} />}
                title="Notification Preferences"
                description="Choose how you receive alerts about scans, anomalies, and announcements."
            >
                <div className="space-y-4">
                    {Object.entries(notifPrefs).map(([key, channels]) => (
                        <div key={key} className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                                    {key === 'scanAlerts' ? 'S' : key === 'anomalies' ? 'A' : key === 'cardExpiry' ? 'C' : 'M'}
                                </div>
                                <h4 className="font-semibold text-sm text-slate-800 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                            </div>
                            <div className="flex gap-6 ml-11">
                                {['push', 'email', 'sms'].map(ch => (
                                    <label key={ch} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={channels[ch]}
                                            onChange={() => toggleNotif(key, ch)}
                                            className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500/30 accent-brand-500"
                                        />
                                        {ch === 'push' ? 'Push' : ch === 'email' ? 'Email' : 'SMS'}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </PremiumSection>

            {/* ── Emergency Helplines (Premium) ───────────────────────────────── */}
            <PremiumSection
                isPremium={isPremium}
                icon={<Phone size={18} />}
                title="Emergency Helplines"
                description="Customise the emergency numbers displayed on student QR profiles."
            >
                <div className="space-y-3">
                    {helplines.map(line => (
                        <div key={line.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex-1">
                                <input
                                    placeholder="Service Name"
                                    value={line.name}
                                    onChange={e => updateHelpline(line.id, 'name', e.target.value)}
                                    className="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm bg-white focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex-1 relative">
                                <Phone size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    placeholder="Phone Number"
                                    value={line.number}
                                    onChange={e => updateHelpline(line.id, 'number', e.target.value)}
                                    className="w-full py-2 pl-9 pr-4 border border-slate-200 rounded-lg text-sm bg-white focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                                />
                            </div>
                            <button onClick={() => removeHelpline(line.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    <button onClick={addHelpline} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors shadow-sm">
                        <UserPlus size={14} /> Add Helpline
                    </button>
                </div>
            </PremiumSection>

            {/* ── Multi-Branch Setup (Premium) ────────────────────────────────── */}
            <PremiumSection
                isPremium={isPremium}
                icon={<Link2 size={18} />}
                title="Multi-Branch Setup"
                description="Register and manage multiple campuses under a single school account."
            >
                <div className="space-y-3">
                    {branches.map(branch => (
                        <div key={branch.id} className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <input
                                placeholder="Branch Name"
                                value={branch.name}
                                onChange={e => updateBranch(branch.id, 'name', e.target.value)}
                                className="flex-1 min-w-[180px] py-2 px-4 border border-slate-200 rounded-lg text-sm bg-white focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                            />
                            <input
                                placeholder="Code (e.g. GV-001)"
                                value={branch.code}
                                onChange={e => updateBranch(branch.id, 'code', e.target.value)}
                                className="w-32 py-2 px-4 border border-slate-200 rounded-lg text-sm font-mono bg-white focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                            />
                            <input
                                placeholder="Address"
                                value={branch.address}
                                onChange={e => updateBranch(branch.id, 'address', e.target.value)}
                                className="flex-1 min-w-[200px] py-2 px-4 border border-slate-200 rounded-lg text-sm bg-white focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                            />
                            <button onClick={() => removeBranch(branch.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    <button onClick={addBranch} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors shadow-sm">
                        <UserPlus size={14} /> Add Branch
                    </button>
                </div>
            </PremiumSection>

            {/* ── Security / Password ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Shield size={18} />
                    </div>
                    <h2 className="font-bold text-lg text-slate-900">Security</h2>
                </div>
                <div className="p-6 max-w-lg">
                    <p className="text-sm text-slate-500 mb-6">Update your admin password. Use a strong, unique password you don't use elsewhere.</p>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Current Password"
                                value={passwordForm.current}
                                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                className="w-full py-2.5 px-4 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-slate-300/20 focus:border-slate-400 bg-white transition-all"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors" type="button">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={passwordForm.new}
                            onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-slate-300/20 focus:border-slate-400 bg-white transition-all"
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm New Password"
                            value={passwordForm.confirm}
                            onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full py-2.5 px-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-slate-300/20 focus:border-slate-400 bg-white transition-all"
                        />
                        <button
                            onClick={handlePasswordChange}
                            disabled={changingPassword || !passwordForm.current || !passwordForm.new || !passwordForm.confirm}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-600 text-white font-semibold text-sm shadow-md hover:bg-slate-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}