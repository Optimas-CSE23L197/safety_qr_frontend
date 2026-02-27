/**
 * SUPER ADMIN SIDEBAR
 * Enterprise control panel sidebar with:
 * - Platform branding
 * - Grouped navigation
 * - Active route indicator
 * - Collapse toggle
 * - User profile
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Activity, Building2, PlusCircle, Users,
    CreditCard, ToggleLeft, ScrollText, BarChart3, Key, Cpu,
    Settings2, ChevronLeft, ChevronRight, LogOut, Shield,
} from 'lucide-react';

import useUiStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import { SUPER_ADMIN_NAV } from '../../config/sidebar.config.js';
import { logout } from '../../services/authService.js';

// Icon map (string → component)
const ICON_MAP = {
    LayoutDashboard,
    Activity,
    Building2,
    PlusCircle,
    Users,
    CreditCard,
    ToggleLeft,
    ScrollText,
    BarChart3,
    Key,
    Cpu,
    Settings2,
};

const NavIcon = ({ name, size = 18 }) => {
    const Icon = ICON_MAP[name];
    return Icon ? <Icon size={size} /> : null;
};

const SuperAdminSidebar = () => {
    const { sidebarCollapsed, toggleSidebar, badges } = useUiStore();
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    const handleLogout = () => logout(navigate);

    const initials = user?.name
        ? user.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
        : 'SA';

    return (
        <aside
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
                background: 'var(--bg-sidebar)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
                overflow: 'hidden',
                zIndex: 100,
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* ── Platform Branding ───────────────────────── */}
            <div
                style={{
                    padding: sidebarCollapsed ? '20px 0' : '20px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minHeight: 'var(--header-height)',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg,#F59E0B,#D97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                    }}
                >
                    <Shield size={18} color="white" />
                </div>

                {!sidebarCollapsed && (
                    <div style={{ overflow: 'hidden' }}>
                        <div
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                color: '#fff',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            Platform Control
                        </div>
                        <div
                            style={{
                                fontSize: '0.6875rem',
                                color: 'rgba(255,255,255,0.45)',
                                fontWeight: 500,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Super Admin
                        </div>
                    </div>
                )}
            </div>

            {/* ── Navigation ─────────────────────────────── */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                {SUPER_ADMIN_NAV.map((group) => (
                    <div key={group.group} style={{ marginBottom: '4px' }}>
                        {!sidebarCollapsed && (
                            <div
                                style={{
                                    padding: '8px 20px 4px',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.3)',
                                }}
                            >
                                {group.group}
                            </div>
                        )}

                        {group.items.map((item) => {
                            const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    title={sidebarCollapsed ? item.label : undefined}
                                    className="nav-item"
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: sidebarCollapsed ? '10px 0' : '9px 20px',
                                        margin: '1px 8px',
                                        borderRadius: '8px',
                                        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                        background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap',
                                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                        position: 'relative',
                                    })}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        left: '-8px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        width: '3px',
                                                        height: '20px',
                                                        borderRadius: '0 2px 2px 0',
                                                        background: '#F59E0B',
                                                    }}
                                                />
                                            )}

                                            <NavIcon name={item.icon} size={17} />

                                            {!sidebarCollapsed && (
                                                <span style={{ flex: 1 }}>{item.label}</span>
                                            )}

                                            {badgeCount > 0 && !sidebarCollapsed && (
                                                <span
                                                    style={{
                                                        background: '#F59E0B',
                                                        color: 'white',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 700,
                                                        borderRadius: '9999px',
                                                        padding: '1px 7px',
                                                        minWidth: '20px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {badgeCount}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* ── Bottom Section ─────────────────────────── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 8px' }}>
                {!sidebarCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: 4 }}>
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg,#D97706,#F59E0B)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                            }}
                        >
                            {initials}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.9)' }}>
                                {user?.name || 'Super Admin'}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)' }}>
                                {user?.role || 'SUPER_ADMIN'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        color: 'rgba(255,255,255,0.5)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    }}
                >
                    <LogOut size={17} />
                    {!sidebarCollapsed && <span>Sign Out</span>}
                </button>

                {/* Collapse */}
                <button
                    onClick={toggleSidebar}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        color: 'rgba(255,255,255,0.35)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    }}
                >
                    {sidebarCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                    {!sidebarCollapsed && <span>Collapse</span>}
                </button>
            </div>

            <style>{`
        .nav-item:hover {
          background: rgba(255,255,255,0.07) !important;
          color: rgba(255,255,255,0.9) !important;
        }
      `}</style>
        </aside>
    );
};

export default SuperAdminSidebar;