/**
 * SUPER ADMIN HEADER
 * Fixed top bar — mirrors SchoolAdminHeader structure exactly.
 * Adds notification bell. Amber avatar distinguishes super admin.
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useUiStore from '../../store/uiStore.js';
import useNotificationStore from '../../store/notificationStore.js';
import { logout } from '../../services/authService.js';
import { ROUTES } from '../../config/routes.config.js';

const getBreadcrumb = (pathname) => {
    const map = {
        [ROUTES.SUPER_ADMIN.DASHBOARD]: 'Dashboard',
        [ROUTES.SUPER_ADMIN.ALL_SCHOOLS]: 'All Schools',
        [ROUTES.SUPER_ADMIN.REGISTER_SCHOOL]: 'Register School',
        [ROUTES.SUPER_ADMIN.ADMIN_MANAGEMENT]: 'Admin Management',
        [ROUTES.SUPER_ADMIN.SUBSCRIPTIONS]: 'Subscriptions',
        [ROUTES.SUPER_ADMIN.FEATURE_FLAGS]: 'Feature Flags',
        [ROUTES.SUPER_ADMIN.AUDIT_LOGS]: 'Audit Logs',
        [ROUTES.SUPER_ADMIN.REPORTS]: 'Reports',
        [ROUTES.SUPER_ADMIN.API_KEYS]: 'API Keys',
        [ROUTES.SUPER_ADMIN.WEBHOOKS]: 'Webhooks',
        [ROUTES.SUPER_ADMIN.TOKEN_INVENTORY]: 'Token Inventory',
        [ROUTES.SUPER_ADMIN.TOKEN_CONTROL]: 'Token Control',
        [ROUTES.SUPER_ADMIN.HEALTH_MONITOR]: 'Health Monitor',
        [ROUTES.SUPER_ADMIN.SETTINGS]: 'Settings',
    };
    return map[pathname] || 'Platform Control';
};

const dropdownItemStyle = {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    textAlign: 'left',
    fontWeight: 500,
    transition: 'background 0.1s ease',
};

export default function SuperAdminHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((s) => s.user);
    const { unreadCount } = useNotificationStore();
    const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => logout(navigate);
    const pageTitle = getBreadcrumb(location.pathname);

    const initials = user?.name
        ? user.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
        : 'SA';

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
            right: 0,
            height: 'var(--header-height)',
            background: 'var(--bg-header)',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 50,
            transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
        }}>
            {/* ── Left: Page Title ──────────────────────────────────────── */}
            <div>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: 0,
                }}>
                    {pageTitle}
                </h1>
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '1px',
                }}>
                    Platform Control Center
                </div>
            </div>

            {/* ── Right: Actions ─────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                {/* Notification Bell */}
                <button
                    onClick={() => navigate(ROUTES.SUPER_ADMIN.DASHBOARD)}
                    style={{
                        position: 'relative',
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--bg-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        transition: 'var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-brand-400)';
                        e.currentTarget.style.color = 'var(--color-brand-600)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#EF4444',
                            border: '2px solid white',
                        }} />
                    )}
                </button>

                {/* User Menu */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 10px 6px 6px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-default)',
                            background: 'var(--bg-card)',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-brand-400)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-default)';
                        }}
                    >
                        {/* Amber avatar for super admin */}
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: 'white',
                            flexShrink: 0,
                        }}>
                            {initials}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                            }}>
                                {user?.name || 'Super Admin'}
                            </div>
                            <div style={{
                                fontSize: '0.6875rem',
                                color: 'var(--text-muted)',
                            }}>
                                {user?.role || 'SUPER_ADMIN'}
                            </div>
                        </div>
                        <ChevronDown
                            size={14}
                            color="var(--text-muted)"
                            style={{
                                transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.15s',
                            }}
                        />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-default)',
                                borderRadius: '10px',
                                padding: '6px',
                                minWidth: '180px',
                                boxShadow: 'var(--shadow-dropdown)',
                                zIndex: 200,
                                animation: 'fadeIn 0.15s ease',
                            }}
                        >
                            <button
                                onClick={() => { navigate(ROUTES.SUPER_ADMIN.SETTINGS); setDropdownOpen(false); }}
                                style={dropdownItemStyle}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-slate-100)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Settings
                            </button>
                            <div style={{ height: '1px', background: 'var(--border-default)', margin: '4px 0' }} />
                            <button
                                onClick={() => { handleLogout(); setDropdownOpen(false); }}
                                style={{ ...dropdownItemStyle, color: 'var(--color-danger-600)' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-50)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
