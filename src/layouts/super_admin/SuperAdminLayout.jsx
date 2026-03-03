/**
 * SUPER ADMIN LAYOUT
 * Composes sidebar + sticky header + page outlet.
 * Mirrors SchoolAdminLayout structure exactly.
 */

import { Outlet } from 'react-router-dom';
import useUiStore from '../../store/uiStore.js';
import SuperAdminSidebar from './SuperAdminSidebar.jsx';
import SuperAdminHeader from './SuperAdminHeader.jsx';

export default function SuperAdminLayout() {
    const { sidebarCollapsed } = useUiStore();
    const sidebarWidth = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
            <SuperAdminSidebar />

            <div style={{
                flex: 1,
                marginLeft: sidebarWidth,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}>
                <SuperAdminHeader />

                <main style={{
                    flex: 1,
                    padding: '1.5rem 2rem',
                    marginTop: 'var(--header-height)',
                }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}