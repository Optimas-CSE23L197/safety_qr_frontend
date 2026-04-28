/**
 * SCHOOL ADMIN — SETTINGS
 * Configure school profile, preferences, security, and premium features.
 *
 * Plan gating: Basic vs Premium
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

// ─── Reusable Premium Section Wrapper (enhanced) ──────────────────────────────
const PremiumSection = ({ isPremium, icon, title, description, children }) => {
    return (
        <div className="bg-white rounded-2xl border border-[var(--border-default)] shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="px-6 py-5 border-b border-[var(--border-default)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {icon}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
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
                            <p className="text-sm text-[var(--text-muted)] mb-5">{description}</p>
                        )}
                        {children}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 ring-1 ring-slate-200">
                            <Lock size={26} className="text-slate-400" />
                        </div>
                        <h4 className="font-display text-base font-bold text-[var(--text-primary)] mb-1">{title}</h4>
                        <p className="text-sm text-[var(--text-muted)] max-w-xs">
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
        <div className="max-w-[1280px] mx-auto px-4 py-8 space-y-8">
            {/* ── Header ────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md shadow-slate-500/20">
                        <SettingsIcon size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your school profile, preferences, and security.</p>
                    </div>
                </div>
                {/* Quick Save Profile Button – can be placed here if desired */}
            </div>

            {/* ── School Profile ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[var(--border-default)] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-[var(--border-default)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Building2 size={18} />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">School Profile</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">School Name</label>
                            <input type="text" value={profile.schoolName} onChange={e => setProfile({ ...profile, schoolName: e.target.value })}
                                className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-shadow bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Address</label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input type="text" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">City</label>
                            <input type="text" value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })}
                                className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">State</label>
                            <input type="text" value={profile.state} onChange={e => setProfile({ ...profile, state: e.target.value })}
                                className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Pincode</label>
                            <input type="text" value={profile.pincode} onChange={e => setProfile({ ...profile, pincode: e.target.value })}
                                className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Phone</label>
                            <div className="relative">
                                <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    className="w-full py-2.5 pl-10 pr-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">School Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                                {profile.logo ? (
                                    <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload size={20} className="text-slate-400" />
                                )}
                            </div>
                            <button className="px-5 py-2 rounded-xl bg-white border border-[var(--border-default)] text-sm font-medium text-[var(--text-secondary)] hover:bg-slate-50 transition-colors">
                                Upload Logo
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-[var(--border-default)]">
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
                        <div key={key} className="p-5 rounded-xl border border-[var(--border-default)] bg-slate-50/50 hover:bg-white transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-[var(--border-default)] flex items-center justify-center text-xs font-bold text-slate-500">
                                    {key === 'scanAlerts' ? 'S' : key === 'anomalies' ? 'A' : key === 'cardExpiry' ? 'C' : 'M'}
                                </div>
                                <h4 className="font-semibold text-sm text-[var(--text-primary)] capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                            </div>
                            <div className="flex gap-6 ml-11">
                                {['push', 'email', 'sms'].map(ch => (
                                    <label key={ch} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={channels[ch]}
                                            onChange={() => toggleNotif(key, ch)}
                                            className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500/30"
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
                        <div key={line.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                            <div className="flex-1 relative">
                                <input
                                    placeholder="Service Name"
                                    value={line.name}
                                    onChange={e => updateHelpline(line.id, 'name', e.target.value)}
                                    className="w-full py-2 pl-4 pr-4 border border-[var(--border-default)] rounded-lg text-sm bg-white"
                                />
                            </div>
                            <div className="flex-1 relative">
                                <Phone size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    placeholder="Phone Number"
                                    value={line.number}
                                    onChange={e => updateHelpline(line.id, 'number', e.target.value)}
                                    className="w-full py-2 pl-9 pr-4 border border-[var(--border-default)] rounded-lg text-sm bg-white"
                                />
                            </div>
                            <button onClick={() => removeHelpline(line.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    <button onClick={addHelpline} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[var(--border-default)] text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors">
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
                        <div key={branch.id} className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <input
                                placeholder="Branch Name"
                                value={branch.name}
                                onChange={e => updateBranch(branch.id, 'name', e.target.value)}
                                className="flex-1 min-w-[180px] py-2 px-4 border border-[var(--border-default)] rounded-lg text-sm bg-white"
                            />
                            <input
                                placeholder="Code (e.g. GV-001)"
                                value={branch.code}
                                onChange={e => updateBranch(branch.id, 'code', e.target.value)}
                                className="w-32 py-2 px-4 border border-[var(--border-default)] rounded-lg text-sm font-mono bg-white"
                            />
                            <input
                                placeholder="Address"
                                value={branch.address}
                                onChange={e => updateBranch(branch.id, 'address', e.target.value)}
                                className="flex-1 min-w-[200px] py-2 px-4 border border-[var(--border-default)] rounded-lg text-sm bg-white"
                            />
                            <button onClick={() => removeBranch(branch.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    <button onClick={addBranch} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[var(--border-default)] text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors">
                        <UserPlus size={14} /> Add Branch
                    </button>
                </div>
            </PremiumSection>

            {/* ── Security / Password ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-[var(--border-default)] shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="px-6 py-5 border-b border-[var(--border-default)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Shield size={18} />
                    </div>
                    <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">Security</h2>
                </div>
                <div className="p-6 max-w-lg">
                    <p className="text-sm text-[var(--text-muted)] mb-5">Update your admin password. Use a strong, unique password you don't use elsewhere.</p>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Current Password"
                                value={passwordForm.current}
                                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                className="w-full py-2.5 px-4 pr-10 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-300/20 focus:border-slate-400 bg-white"
                            />
                            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600" type="button">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={passwordForm.new}
                            onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-300/20 focus:border-slate-400 bg-white"
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm New Password"
                            value={passwordForm.confirm}
                            onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full py-2.5 px-4 border border-[var(--border-default)] rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-300/20 focus:border-slate-400 bg-white"
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