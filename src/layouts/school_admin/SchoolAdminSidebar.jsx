/**
 * SCHOOL ADMIN SIDEBAR
 * Professional dark navy sidebar with:
 * - School branding at top
 * - Grouped navigation with icons
 * - Badge counts for pending items
 * - Collapse toggle
 * - User profile at bottom
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, GraduationCap, ClipboardList, Cpu, Settings2,
    IdCard, QrCode, ScanLine, AlertTriangle, Bell, ScrollText, Settings,
    ChevronLeft, ChevronRight, LogOut, Building2, User,
} from 'lucide-react';
import useUiStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import { SCHOOL_ADMIN_NAV } from '../../config/sidebar.config.js';
import { logout } from '../../services/authService.js';
import { hasPermission } from '../../utils/rbac.js';

// Icon map — maps string names from config to components
const ICON_MAP = {
    LayoutDashboard, GraduationCap, ClipboardList, Cpu, Settings2,
    IdCard, QrCode, ScanLine, AlertTriangle, Bell, ScrollText, Settings,
    Building2, User,
};

const NavIcon = ({ name, size = 18 }) => {
    const Icon = ICON_MAP[name];
    return Icon ? <Icon size={size} /> : null;
};

const SchoolAdminSidebar = () => {
    const { sidebarCollapsed, toggleSidebar, badges } = useUiStore();
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    const handleLogout = () => logout(navigate);

    const initials = user?.name
        ? user.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
        : '?';

    return (
        <aside
            className="sidebar"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
                background: 'var(--bg-sidebar)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                zIndex: 100,
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* ── Logo / School Name ─────────────────────────────────────── */}
            <div style={{
                padding: sidebarCollapsed ? '20px 0' : '20px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minHeight: 'var(--header-height)',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
                }}>
                    <Building2 size={18} color="white" />
                </div>
                {!sidebarCollapsed && (
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            color: '#FFFFFF',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {user?.school_name || 'School Portal'}
                        </div>
                        <div style={{
                            fontSize: '0.6875rem',
                            color: 'rgba(255,255,255,0.45)',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}>
                            Admin Dashboard
                        </div>
                    </div>
                )}
            </div>

            {/* ── Navigation Groups ──────────────────────────────────────── */}
            <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
                {SCHOOL_ADMIN_NAV.map((group) => {
                    // Filter items by role permission
                    const visibleItems = group.items.filter((item) => {
                        if (!item.allowedRoles) return true;
                        return item.allowedRoles.includes(user?.role);
                    });

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.group} style={{ marginBottom: '4px' }}>
                            {/* Group label */}
                            {!sidebarCollapsed && (
                                <div style={{
                                    padding: '8px 20px 4px',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.3)',
                                }}>
                                    {group.group}
                                </div>
                            )}

                            {/* Nav Items */}
                            {visibleItems.map((item) => {
                                const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        title={sidebarCollapsed ? item.label : undefined}
                                        style={({ isActive }) => ({
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: sidebarCollapsed ? '10px 0' : '9px 20px',
                                            margin: '1px 8px',
                                            borderRadius: '8px',
                                            color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                                            background: isActive
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'transparent',
                                            fontWeight: isActive ? 600 : 400,
                                            fontSize: '0.875rem',
                                            textDecoration: 'none',
                                            transition: 'all 0.15s ease',
                                            whiteSpace: 'nowrap',
                                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                            position: 'relative',
                                        })}
                                        className="nav-item"
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {/* Active indicator bar */}
                                                {isActive && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '-8px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        width: '3px',
                                                        height: '20px',
                                                        borderRadius: '0 2px 2px 0',
                                                        background: '#3B82F6',
                                                    }} />
                                                )}
                                                <NavIcon name={item.icon} size={17} />
                                                {!sidebarCollapsed && (
                                                    <>
                                                        <span style={{ flex: 1 }}>{item.label}</span>
                                                        {badgeCount > 0 && (
                                                            <span style={{
                                                                background: item.badgeVariant === 'danger'
                                                                    ? '#EF4444'
                                                                    : '#2563EB',
                                                                color: 'white',
                                                                fontSize: '0.6875rem',
                                                                fontWeight: 700,
                                                                borderRadius: '9999px',
                                                                padding: '1px 7px',
                                                                minWidth: '20px',
                                                                textAlign: 'center',
                                                                lineHeight: '1.6',
                                                            }}>
                                                                {badgeCount > 99 ? '99+' : badgeCount}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                                {sidebarCollapsed && badgeCount > 0 && (
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '6px',
                                                        right: '6px',
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: '#EF4444',
                                                        border: '2px solid var(--bg-sidebar)',
                                                    }} />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>

            {/* ── Bottom: User + Collapse ────────────────────────────────── */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '12px 8px',
            }}>
                {/* User profile */}
                {!sidebarCollapsed && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        marginBottom: '4px',
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            color: 'white',
                        }}>
                            {initials}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                                color: 'rgba(255,255,255,0.9)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                                {user?.name || 'Admin'}
                            </div>
                            <div style={{
                                fontSize: '0.6875rem',
                                color: 'rgba(255,255,255,0.4)',
                                whiteSpace: 'nowrap',
                            }}>
                                {user?.role || 'School Admin'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title="Logout"
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
                        fontSize: '0.875rem',
                        transition: 'all 0.15s ease',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                        e.currentTarget.style.color = '#EF4444';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    }}
                >
                    <LogOut size={17} />
                    {!sidebarCollapsed && <span>Sign Out</span>}
                </button>

                {/* Collapse toggle */}
                <button
                    onClick={toggleSidebar}
                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
                        fontSize: '0.875rem',
                        transition: 'all 0.15s ease',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
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

export default SchoolAdminSidebar;