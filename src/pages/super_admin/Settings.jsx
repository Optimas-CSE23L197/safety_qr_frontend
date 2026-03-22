import { useState } from "react";

export default function Settings() {
    const [profile, setProfile] = useState({
        name: "Admin",
        email: "admin@example.com",
    });

    const [platform, setPlatform] = useState({
        platformName: "QR Safe",
        supportEmail: "support@qrsafe.com",
        timezone: "Asia/Kolkata",
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        contractAlerts: true,
    });

    return (
        <div className="space-y-6 max-w-4xl">

            {/* Header */}
            <div>
                <h1 className="font-display text-[1.375rem] font-bold text-[var(--text-primary)] m-0 leading-tight">
                    Settings
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1 m-0">
                    Manage your account and platform configuration.
                </p>
            </div>

            {/* Profile */}
            <Card title="Profile">
                <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Name" value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })} />
                    <Field label="Email" value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <SaveButton>Save Profile</SaveButton>
            </Card>

            {/* Platform Settings */}
            <Card title="Platform Settings">
                <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Platform Name" value={platform.platformName}
                        onChange={e => setPlatform({ ...platform, platformName: e.target.value })} />
                    <Field label="Support Email" value={platform.supportEmail}
                        onChange={e => setPlatform({ ...platform, supportEmail: e.target.value })} />
                    <Field label="Timezone" value={platform.timezone}
                        onChange={e => setPlatform({ ...platform, timezone: e.target.value })} />
                </div>
                <SaveButton>Save Settings</SaveButton>
            </Card>

            {/* Notifications */}
            <Card title="Notifications">
                <Toggle
                    label="Email Alerts"
                    checked={notifications.emailAlerts}
                    onChange={() => setNotifications(n => ({ ...n, emailAlerts: !n.emailAlerts }))}
                />
                <Toggle
                    label="Contract Expiry Alerts"
                    checked={notifications.contractAlerts}
                    onChange={() => setNotifications(n => ({ ...n, contractAlerts: !n.contractAlerts }))}
                />
            </Card>

            {/* Security */}
            <Card title="Security">
                <div className="flex gap-2 flex-wrap">
                    <ActionButton>Change Password</ActionButton>
                    <ActionButton>Enable 2FA</ActionButton>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card title="Danger Zone">
                <p className="text-sm text-[var(--text-muted)] m-0 mb-4">
                    These actions are irreversible.
                </p>
                <ActionButton variant="danger">Delete Account</ActionButton>
            </Card>
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ title, children }) {
    return (
        <div className="card p-6 space-y-4">
            <h2 className="font-display text-sm font-semibold text-[var(--text-primary)] m-0">
                {title}
            </h2>
            {children}
        </div>
    );
}

// ─── Field (labelled input) ───────────────────────────────────────────────────
function Field({ label, ...props }) {
    return (
        <div>
            <label className="block text-[0.8125rem] font-medium text-[var(--text-secondary)] mb-1.5">
                {label}
            </label>
            <input
                {...props}
                className="w-full border border-[var(--border-default)] rounded-lg px-3 py-[9px] text-sm text-[var(--text-primary)] bg-white outline-none focus:border-brand-500 transition-colors"
            />
        </div>
    );
}

// ─── Save button (primary gradient) ──────────────────────────────────────────
function SaveButton({ children, ...props }) {
    return (
        <button
            {...props}
            className="py-2 px-4 rounded-lg text-sm font-semibold bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none cursor-pointer hover:opacity-90 transition-opacity"
        >
            {children}
        </button>
    );
}

// ─── Action button (secondary / danger) ──────────────────────────────────────
function ActionButton({ children, variant = "secondary", ...props }) {
    const cls = {
        secondary: "bg-slate-100 text-[var(--text-secondary)] hover:bg-slate-200 border-none",
        danger:    "bg-danger-600 text-white hover:bg-danger-700 border-none",
    };
    return (
        <button
            {...props}
            className={`py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-colors ${cls[variant]}`}
        >
            {children}
        </button>
    );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">{label}</span>
            <button
                onClick={onChange}
                className={[
                    "relative w-9 h-5 rounded-full border-none cursor-pointer transition-colors duration-200 p-0 shrink-0",
                    checked ? "bg-brand-500" : "bg-slate-300",
                ].join(" ")}
            >
                <span
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-200"
                    style={{
                        left: checked ? "18px" : "2px",
                        transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                />
            </button>
        </div>
    );
}