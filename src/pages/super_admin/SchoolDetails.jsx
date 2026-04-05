import {
    Building2, Users, Key, CreditCard,
    Settings, Shield, Activity, MoreVertical, Cpu,
    Mail, Phone, MapPin, Globe, Calendar, CheckCircle,
    XCircle, Clock, AlertCircle, UserCheck, TrendingUp,
    Smartphone, FileText, Bell, Link, Download,
} from "lucide-react";

export default function SchoolDetailsPage() {
    const school = {
        id: "sch-001",
        name: "Green Valley School",
        code: "GVS001",
        serial_number: 42,
        city: "Kolkata",
        state: "West Bengal",
        country: "IN",
        pincode: "700001",
        address: "123, Green Avenue, Salt Lake City",
        email: "contact@greenvalley.edu.in",
        phone: "+91 33 1234 5678",
        timezone: "Asia/Kolkata",
        school_type: "PRIVATE",
        setup_status: "ACTIVE",
        is_active: true,
        activated_at: "2024-01-15T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
        contract_expires_at: "2025-12-31T00:00:00Z",
    };

    const subscription = {
        plan: "PREMIUM",
        status: "ACTIVE",
        unit_price_snapshot: 19900,
        renewal_price_snapshot: 19900,
        student_count: 1245,
        active_card_count: 980,
        grand_total: 24775500,
        total_invoiced: 18500000,
        total_received: 18500000,
        balance_due: 6275500,
        current_period_start: "2025-01-01",
        current_period_end: "2025-12-31",
        is_pilot: false,
    };

    const stats = {
        students: 1245,
        active_tokens: 980,
        total_tokens: 1100,
        admins: 5,
        pending_invites: 2,
        monthly_scans: 12540,
        monthly_anomalies: 23,
    };

    const admins = [
        { id: 1, name: "Rajesh Kumar", email: "rajesh@greenvalley.edu.in", is_primary: true, is_active: true, last_login: "2025-03-28" },
        { id: 2, name: "Priya Sharma", email: "priya@greenvalley.edu.in", is_primary: false, is_active: true, last_login: "2025-03-27" },
        { id: 3, name: "Amit Verma", email: "amit@greenvalley.edu.in", is_primary: false, is_active: true, last_login: "2025-03-26" },
        { id: 4, name: "Neha Gupta", email: "neha@greenvalley.edu.in", is_primary: false, is_active: false, last_login: "2025-02-15" },
        { id: 5, name: "Suresh Nair", email: "suresh@greenvalley.edu.in", is_primary: false, is_active: true, last_login: "2025-03-28" },
    ];

    const recentActivity = [
        { id: 1, action: "Card order #ORD-2025-001 completed", user: "Rajesh Kumar", timestamp: "2025-03-28 14:32", type: "order" },
        { id: 2, action: "Subscription renewed for 2025-2026", user: "System", timestamp: "2025-03-28 10:15", type: "subscription" },
        { id: 3, action: "New admin invited: Neha Gupta", user: "Rajesh Kumar", timestamp: "2025-03-27 16:45", type: "user" },
        { id: 4, action: "Bulk token generation completed (250 tokens)", user: "System", timestamp: "2025-03-26 09:30", type: "token" },
        { id: 5, action: "Invoice #INV-2025-042 paid", user: "Priya Sharma", timestamp: "2025-03-25 11:20", type: "payment" },
    ];

    const formatCurrency = (amount) => `₹${(amount / 100).toLocaleString('en-IN')}`;

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-[var(--border-default)] shadow-sm mb-6 overflow-hidden">
                <div className="p-6 border-b border-[var(--border-default)] bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                                    <Building2 size={20} className="text-white" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                                    {school.name}
                                </h2>
                                {school.is_active ? (
                                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-success-50 text-success-700">
                                        <CheckCircle size={10} /> Active
                                    </span>
                                ) : (
                                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-danger-50 text-danger-700">
                                        <XCircle size={10} /> Inactive
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                                <span className="flex items-center gap-1"><Code size={12} /> {school.code} #{school.serial_number}</span>
                                <span className="flex items-center gap-1"><MapPin size={12} /> {school.city}, {school.state}</span>
                                <span className="flex items-center gap-1"><Globe size={12} /> {school.timezone}</span>
                                <span className="flex items-center gap-1"><Calendar size={12} /> Created: {new Date(school.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button className="p-2 rounded-lg border border-[var(--border-default)] bg-white cursor-pointer text-[var(--text-muted)] hover:bg-slate-50 transition-colors">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Quick info bar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-5 bg-white">
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-secondary)] truncate">{school.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-secondary)]">{school.phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield size={14} className="text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-secondary)]">{school.school_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-secondary)]">Setup: {school.setup_status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-secondary)]">Contract: {new Date(school.contract_expires_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 text-center">
                    <Users size={18} className="text-brand-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-[var(--text-primary)]">{stats.students}</div>
                    <div className="text-xs text-[var(--text-muted)]">Students</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 text-center">
                    <Smartphone size={18} className="text-success-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-[var(--text-primary)]">{stats.active_tokens}</div>
                    <div className="text-xs text-[var(--text-muted)]">Active Tokens</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 text-center">
                    <Key size={18} className="text-warning-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-[var(--text-primary)]">{stats.total_tokens}</div>
                    <div className="text-xs text-[var(--text-muted)]">Total Tokens</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 text-center">
                    <UserCheck size={18} className="text-info-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-[var(--text-primary)]">{stats.admins}</div>
                    <div className="text-xs text-[var(--text-muted)]">Admins</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 text-center">
                    <Activity size={18} className="text-purple-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-[var(--text-primary)]">{stats.monthly_scans.toLocaleString()}</div>
                    <div className="text-xs text-[var(--text-muted)]">Monthly Scans</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 text-center">
                    <AlertCircle size={18} className="text-danger-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-[var(--text-primary)]">{stats.monthly_anomalies}</div>
                    <div className="text-xs text-[var(--text-muted)]">Anomalies</div>
                </div>
                <div className="bg-white rounded-xl border border-[var(--border-default)] p-4 text-center">
                    <TrendingUp size={18} className="text-emerald-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-[var(--text-primary)]">{formatCurrency(subscription.grand_total)}</div>
                    <div className="text-xs text-[var(--text-muted)]">Annual Value</div>
                </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Admins Table */}
                    <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50">
                            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <Users size={16} /> School Admins
                                <span className="text-xs text-[var(--text-muted)] font-normal ml-2">({stats.admins} total)</span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white border-b border-[var(--border-default)]">
                                    <tr className="text-left text-xs text-[var(--text-muted)]">
                                        <th className="px-5 py-3 font-semibold">Name</th>
                                        <th className="px-5 py-3 font-semibold">Email</th>
                                        <th className="px-5 py-3 font-semibold">Role</th>
                                        <th className="px-5 py-3 font-semibold">Last Login</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin, idx) => (
                                        <tr key={admin.id} className={idx < admins.length - 1 ? 'border-b border-[var(--border-default)]' : ''}>
                                            <td className="px-5 py-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    {admin.name}
                                                    {admin.is_primary && (
                                                        <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">Primary</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">{admin.email}</td>
                                            <td className="px-5 py-3 text-sm">
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">ADMIN</span>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-[var(--text-muted)]">{admin.last_login || 'Never'}</td>
                                            <td className="px-5 py-3">
                                                {admin.is_active ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-success-700"><CheckCircle size={10} /> Active</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-danger-700"><XCircle size={10} /> Inactive</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 border-t border-[var(--border-default)] bg-slate-50">
                            <button className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
                                <UserCheck size={14} /> Manage Admins
                            </button>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50">
                            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <CreditCard size={16} /> Subscription & Billing
                            </h3>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Plan</div>
                                    <div className="text-lg font-bold text-[var(--text-primary)]">{subscription.plan}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Status</div>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-success-50 text-success-700 mt-1">
                                        <CheckCircle size={10} /> {subscription.status}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Unit Price</div>
                                    <div className="font-semibold">{formatCurrency(subscription.unit_price_snapshot)}/year</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Renewal Price</div>
                                    <div className="font-semibold">{formatCurrency(subscription.renewal_price_snapshot)}/year</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--border-default)]">
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Student Count</div>
                                    <div className="font-semibold">{subscription.student_count.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Active Cards</div>
                                    <div className="font-semibold">{subscription.active_card_count.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Period Start</div>
                                    <div className="text-sm">{new Date(subscription.current_period_start).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Period End</div>
                                    <div className="text-sm">{new Date(subscription.current_period_end).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-[var(--text-muted)]">Balance Due</div>
                                    <div className="text-xl font-bold text-danger-600">{formatCurrency(subscription.balance_due)}</div>
                                </div>
                                <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">
                                    Manage Subscription
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column - 1/3 width */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50">
                            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <Activity size={16} /> Recent Activity
                            </h3>
                        </div>
                        <div className="divide-y divide-[var(--border-default)]">
                            {recentActivity.map(activity => (
                                <div key={activity.id} className="px-5 py-3">
                                    <div className="text-sm text-[var(--text-primary)]">{activity.action}</div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-[var(--text-muted)]">{activity.user}</span>
                                        <span className="text-xs text-[var(--text-muted)]">{activity.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-5 py-3 border-t border-[var(--border-default)] bg-slate-50">
                            <button className="text-sm text-brand-600 font-medium flex items-center gap-1">
                                <FileText size={14} /> View All Logs
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-[var(--border-default)] overflow-hidden">
                        <div className="px-5 py-4 border-b border-[var(--border-default)] bg-slate-50">
                            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <Settings size={16} /> Quick Actions
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                                <Key size={14} /> Generate Bulk Tokens
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                                <CreditCard size={14} /> Create Card Order
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                                <Mail size={14} /> Resend Invite to Pending Admins ({stats.pending_invites})
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                                <Download size={14} /> Export Activity Report
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                                <Bell size={14} /> Configure Alerts
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
                                <Link size={14} /> API Keys & Webhooks
                            </button>
                        </div>
                    </div>

                    {/* Contract Info */}
                    <div className="bg-white rounded-xl border border-[var(--border-default)] p-5">
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                            <FileText size={16} /> Agreement
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Signed:</span>
                                <span className="text-[var(--text-primary)]">15 Jan 2024</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Expires:</span>
                                <span className="text-[var(--text-primary)]">31 Dec 2025</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--text-muted)]">Pilot:</span>
                                <span className={subscription.is_pilot ? "text-warning-600" : "text-success-600"}>
                                    {subscription.is_pilot ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 rounded-lg border border-[var(--border-default)] text-sm font-medium hover:bg-slate-50">
                            View Agreement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for code icon
function Code({ size, className }) {
    return <span className={className} style={{ fontSize: size }}>#</span>;
}