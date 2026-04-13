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
        <div className="space-y-8 max-w-4xl">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">
                    Manage your account and platform configuration.
                </p>
            </div>

            {/* Profile */}
            <Card title="Profile">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Name" value={profile.name} onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                    } />

                    <Input label="Email" value={profile.email} onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                    } />
                </div>

                <Button>Save Profile</Button>
            </Card>

            {/* Platform */}
            <Card title="Platform Settings">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Platform Name"
                        value={platform.platformName}
                        onChange={(e) =>
                            setPlatform({ ...platform, platformName: e.target.value })
                        }
                    />

                    <Input
                        label="Support Email"
                        value={platform.supportEmail}
                        onChange={(e) =>
                            setPlatform({ ...platform, supportEmail: e.target.value })
                        }
                    />

                    <Input
                        label="Timezone"
                        value={platform.timezone}
                        onChange={(e) =>
                            setPlatform({ ...platform, timezone: e.target.value })
                        }
                    />
                </div>

                <Button>Save Settings</Button>
            </Card>

            {/* Notifications */}
            <Card title="Notifications">
                <Toggle
                    label="Email Alerts"
                    checked={notifications.emailAlerts}
                    onChange={() =>
                        setNotifications({
                            ...notifications,
                            emailAlerts: !notifications.emailAlerts,
                        })
                    }
                />

                <Toggle
                    label="Contract Expiry Alerts"
                    checked={notifications.contractAlerts}
                    onChange={() =>
                        setNotifications({
                            ...notifications,
                            contractAlerts: !notifications.contractAlerts,
                        })
                    }
                />
            </Card>

            {/* Security */}
            <Card title="Security">
                <Button variant="secondary">Change Password</Button>
                <Button variant="secondary">Enable 2FA</Button>
            </Card>

            {/* Danger Zone */}
            <Card title="Danger Zone">
                <p className="text-sm text-gray-500 mb-4">
                    These actions are irreversible.
                </p>
                <Button variant="danger">Delete Account</Button>
            </Card>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            {children}
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm text-gray-700 mb-1">{label}</label>
            <input
                {...props}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200"
            />
        </div>
    );
}

function Button({ children, variant = "primary", ...props }) {
    const styles = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            {...props}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${styles[variant]}`}
        >
            {children}
        </button>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{label}</span>
            <button
                onClick={onChange}
                className={`w-10 h-5 rounded-full transition ${checked ? "bg-indigo-600" : "bg-gray-300"
                    }`}
            >
                <div
                    className={`h-5 w-5 bg-white rounded-full shadow transform transition ${checked ? "translate-x-5" : ""
                        }`}
                />
            </button>
        </div>
    );
}
