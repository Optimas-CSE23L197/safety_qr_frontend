import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard, GraduationCap, ClipboardList, Cpu, Settings2,
    IdCard, QrCode, ScanLine, AlertTriangle, Bell, ScrollText, Settings,
    ChevronLeft, ChevronRight, LogOut, Building2, ChevronDown,
} from 'lucide-react';
import useUiStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import useNotificationStore from '../../store/notificationStore.js';
import { logout } from '../../services/authService.js';
import { ROUTES } from '../../config/routes.config.js';

const NAV = [
    {
        group: 'Overview', items: [
            { label: 'Dashboard', path: ROUTES.SCHOOL_ADMIN.DASHBOARD, Icon: LayoutDashboard },
        ]
    },
    {
        group: 'Students', items: [
            { label: 'All Students', path: ROUTES.SCHOOL_ADMIN.STUDENTS, Icon: GraduationCap },
            { label: 'Parent Requests', path: ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS, Icon: ClipboardList, badgeKey: 'pendingRequests' },
        ]
    },
    {
        group: 'ID Cards & Tokens', items: [
            { label: 'Token Inventory', path: ROUTES.SCHOOL_ADMIN.TOKEN_INVENTORY, Icon: Cpu },
            { label: 'Token Control', path: ROUTES.SCHOOL_ADMIN.TOKEN_CONTROL, Icon: Settings2, roles: ['ADMIN'] },
            { label: 'Card Template', path: ROUTES.SCHOOL_ADMIN.CARD_TEMPLATE, Icon: IdCard, roles: ['ADMIN'] },
            { label: 'QR Management', path: ROUTES.SCHOOL_ADMIN.QR_MANAGEMENT, Icon: QrCode },
        ]
    },
    {
        group: 'Monitoring', items: [
            { label: 'Scan Logs', path: ROUTES.SCHOOL_ADMIN.SCAN_LOGS, Icon: ScanLine },
            { label: 'Anomalies', path: ROUTES.SCHOOL_ADMIN.ANOMALIES, Icon: AlertTriangle, badgeKey: 'unresolvedAnomalies', badgeDanger: true },
            { label: 'Notifications', path: ROUTES.SCHOOL_ADMIN.NOTIFICATIONS, Icon: Bell, badgeKey: 'unreadNotifications' },
        ]
    },
    {
        group: 'System', items: [
            { label: 'Audit Logs', path: ROUTES.SCHOOL_ADMIN.AUDIT_LOGS, Icon: ScrollText, roles: ['ADMIN'] },
            { label: 'Settings', path: ROUTES.SCHOOL_ADMIN.SETTINGS, Icon: Settings, roles: ['ADMIN'] },
        ]
    },
];

const PAGE_TITLES = {
    // ── Overview ────────────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.DASHBOARD]: 'Dashboard',
    [ROUTES.SCHOOL_ADMIN.LIVE_SCANS]: 'Live Scan Monitor',

    // ── People ──────────────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.STUDENTS]: 'Students',
    [ROUTES.SCHOOL_ADMIN.STUDENT_CREATE]: 'Add New Student',
    [ROUTES.SCHOOL_ADMIN.PARENTS]: 'Parents',
    [ROUTES.SCHOOL_ADMIN.STAFF]: 'Staff Members',
    [ROUTES.SCHOOL_ADMIN.STAFF_INVITE]: 'Invite Staff Member',
    [ROUTES.SCHOOL_ADMIN.PARENT_REQUESTS]: 'Parent Update Requests',

    // ── Safety ──────────────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.EMERGENCY_PROFILES]: 'Emergency Profiles',
    [ROUTES.SCHOOL_ADMIN.LOCATION_TRACKING]: 'Location Tracking',
    [ROUTES.SCHOOL_ADMIN.SCAN_LOGS]: 'Scan Logs',
    [ROUTES.SCHOOL_ADMIN.ANOMALIES]: 'Scan Anomalies',

    // ── ID Cards & Tokens ────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.TOKEN_INVENTORY]: 'Token Inventory',
    [ROUTES.SCHOOL_ADMIN.TOKEN_CONTROL]: 'Token Control',
    [ROUTES.SCHOOL_ADMIN.TOKEN_ORDERS]: 'Order Tokens',
    [ROUTES.SCHOOL_ADMIN.QR_MANAGEMENT]: 'QR Management',
    [ROUTES.SCHOOL_ADMIN.CARD_TEMPLATE]: 'Card Template',

    // ── Communication ───────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.NOTIFICATIONS]: 'Notifications',
    [ROUTES.SCHOOL_ADMIN.DEVICES]: 'Parent Devices',

    // ── Analytics ───────────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.SCAN_ANALYTICS]: 'Scan Analytics',
    [ROUTES.SCHOOL_ADMIN.REPORTS]: 'Reports',

    // ── Billing ─────────────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.BILLING]: 'Subscription & Billing',
    [ROUTES.SCHOOL_ADMIN.BILLING_UPGRADE]: 'Upgrade Plan',

    // ── Settings ────────────────────────────────────────────────────────────
    [ROUTES.SCHOOL_ADMIN.SCHOOL_PROFILE]: 'School Profile',
    [ROUTES.SCHOOL_ADMIN.NOTIFICATION_PREFS]: 'Notification Preferences',
    [ROUTES.SCHOOL_ADMIN.AUDIT_LOGS]: 'Audit Logs',
    [ROUTES.SCHOOL_ADMIN.MY_PROFILE]: 'My Profile',
};


export default function SchoolAdminLayout() {
    const { sidebarCollapsed, toggleSidebar, badges } = useUiStore();
    const user = useAuthStore((s) => s.user);
    const { unreadCount } = useNotificationStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const handleLogout = () => logout(navigate);
    const pageTitle = PAGE_TITLES[location.pathname] || 'School Portal';
    const initials = user?.name ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : '?';
    const sw = sidebarCollapsed ? '72px' : '260px';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
            {/* SIDEBAR */}
            <aside style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: sw, background: 'var(--bg-sidebar)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', zIndex: 100, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Logo */}
                <div style={{ padding: sidebarCollapsed ? '20px 0' : '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg,#2563EB,#1E40AF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                        <Building2 size={18} color="white" />
                    </div>
                    {!sidebarCollapsed && <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.school_name || 'School Portal'}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Dashboard</div>
                    </div>}
                </div>
                {/* Nav */}
                <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
                    {NAV.map(group => {
                        const visible = group.items.filter(item => !item.roles || item.roles.includes(user?.role));
                        if (!visible.length) return null;
                        return (
                            <div key={group.group} style={{ marginBottom: '4px' }}>
                                {!sidebarCollapsed && <div style={{ padding: '8px 20px 4px', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{group.group}</div>}
                                {visible.map(({ label, path, Icon, badgeKey, badgeDanger }) => {
                                    const badgeCount = badgeKey ? (badgeKey === 'unreadNotifications' ? unreadCount : (badges[badgeKey] || 0)) : 0;
                                    return (
                                        <NavLink key={path} to={path} title={sidebarCollapsed ? label : undefined}
                                            style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: sidebarCollapsed ? '10px 0' : '9px 20px', margin: '1px 8px', borderRadius: '8px', color: isActive ? '#fff' : 'rgba(255,255,255,0.6)', background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', fontWeight: isActive ? 600 : 400, fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', position: 'relative' })}>
                                            <Icon size={17} />
                                            {!sidebarCollapsed && <>
                                                <span style={{ flex: 1 }}>{label}</span>
                                                {badgeCount > 0 && <span style={{ background: badgeDanger ? '#EF4444' : '#2563EB', color: 'white', fontSize: '0.6875rem', fontWeight: 700, borderRadius: '9999px', padding: '1px 7px', minWidth: '20px', textAlign: 'center' }}>{badgeCount > 99 ? '99+' : badgeCount}</span>}
                                            </>}
                                            {sidebarCollapsed && badgeCount > 0 && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', border: '2px solid var(--bg-sidebar)' }} />}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>
                {/* Bottom */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 8px' }}>
                    {!sidebarCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '4px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#1E40AF,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8125rem', color: 'white', flexShrink: 0 }}>{initials}</div>
                            <div style={{ overflow: 'hidden', flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</div>
                                <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)' }}>{user?.role || 'ADMIN'}</div>
                            </div>
                        </div>
                    )}
                    <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#EF4444' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
                        <LogOut size={17} />{!sidebarCollapsed && <span>Sign Out</span>}
                    </button>
                    <button onClick={toggleSidebar} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', color: 'rgba(255,255,255,0.35)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}>
                        {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                        {!sidebarCollapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <div style={{ flex: 1, marginLeft: sw, minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s ease' }}>
                {/* Header */}
                <header style={{ position: 'sticky', top: 0, height: '64px', background: '#fff', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', zIndex: 50 }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{pageTitle}</h1>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>{user?.school_name || 'School Management Portal'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => navigate(ROUTES.SCHOOL_ADMIN.NOTIFICATIONS)} style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '8px', border: '1px solid var(--border-default)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Bell size={17} />
                            {unreadCount > 0 && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', border: '2px solid white' }} />}
                        </button>
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px 6px 6px', borderRadius: '8px', border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#1E40AF,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'white' }}>{initials}</div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{user?.name || 'Admin'}</div>
                                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user?.role}</div>
                                </div>
                                <ChevronDown size={14} color="var(--text-muted)" />
                            </button>
                            {dropdownOpen && (
                                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid var(--border-default)', borderRadius: '10px', padding: '6px', minWidth: '180px', boxShadow: 'var(--shadow-dropdown)', zIndex: 200 }}>
                                    <button onClick={() => { navigate(ROUTES.SCHOOL_ADMIN.SETTINGS); setDropdownOpen(false) }} style={{ display: 'block', width: '100%', padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-primary)', textAlign: 'left', fontWeight: 500 }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-slate-100)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Settings</button>
                                    <div style={{ height: '1px', background: 'var(--border-default)', margin: '4px 0' }} />
                                    <button onClick={() => { handleLogout(); setDropdownOpen(false) }} style={{ display: 'block', width: '100%', padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', color: '#DC2626', textAlign: 'left', fontWeight: 500 }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Sign Out</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main style={{ flex: 1, padding: '1.5rem 2rem' }}><Outlet /></main>
            </div>
        </div>
    );
}