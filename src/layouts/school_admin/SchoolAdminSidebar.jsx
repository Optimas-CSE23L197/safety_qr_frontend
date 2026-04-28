/**
 * SCHOOL ADMIN SIDEBAR
 * src/layouts/school_admin/SchoolAdminSidebar.jsx
 *
 * Matches routes defined in AllRoutes.jsx and reflects plan (Basic/Premium)
 */

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Database,
  QrCode,
  ScanLine,
  AlertTriangle,
  Bell,
  Settings,
  User,
  Lock,
  ScrollText,
  Shield,
} from 'lucide-react';
import usePremiumStatus from '../../hooks/usePremiumStatus.js';

const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/school-admin/dashboard' },
    ],
  },
  {
    group: 'Students',
    items: [
      { label: 'All Students', icon: Users, path: '/school-admin/students' },
      { label: 'Card Requests', icon: CreditCard, path: '/school-admin/card-requests' },
    ],
  },
  {
    group: 'ID Cards & Tokens',
    items: [
      { label: 'Token Inventory', icon: Database, path: '/school-admin/tokens/inventory' },
      { label: 'QR Management', icon: QrCode, path: '/school-admin/qr' },
    ],
  },
  {
    group: 'Monitoring',
    items: [
      { label: 'Scan Logs', icon: ScanLine, path: '/school-admin/scan-logs', premium: true },
      { label: 'Anomalies', icon: AlertTriangle, path: '/school-admin/anomalies', premium: true },
      { label: 'Notifications', icon: Bell, path: '/school-admin/notifications' },
    ],
  },
  {
    group: 'Settings',
    items: [
      { label: 'Settings', icon: Settings, path: '/school-admin/settings' },
      { label: 'Audit Logs', icon: ScrollText, path: '/school-admin/audit-logs' },
      { label: 'My Profile', icon: User, path: '/school-admin/profile' },
    ],
  },
];

export default function SchoolAdminSidebar() {
  const isPremium = usePremiumStatus();
  const location = useLocation();

  return (
    <aside className="w-60 bg-white border-r border-[var(--border-default)] h-screen flex flex-col">
      {/* Header / Logo */}
      <div className="px-5 py-6 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-[var(--text-primary)] text-sm">School Portal</p>
            <p className="text-xs text-[var(--text-muted)]">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_ITEMS.map(group => (
          <div key={group.group}>
            <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map(item => {
                const isLocked = item.premium && !isPremium;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={isLocked ? '#' : item.path}
                      onClick={e => isLocked && e.preventDefault()}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive
                          ? 'bg-brand-50 text-brand-700'
                          : isLocked
                            ? 'text-slate-400 cursor-not-allowed'
                            : 'text-[var(--text-secondary)] hover:bg-slate-50'
                        }`}
                    >
                      <item.icon size={18} />
                      <span className="flex-1">{item.label}</span>
                      {isLocked && <Lock size={12} className="text-slate-400" />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer – plan indicator */}
      <div className="px-5 py-4 border-t border-[var(--border-default)]">
        <p className="text-xs text-[var(--text-muted)]">
          Plan: <span className={isPremium ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
            {isPremium ? 'Premium' : 'Basic'}
          </span>
        </p>
      </div>
    </aside>
  );
}