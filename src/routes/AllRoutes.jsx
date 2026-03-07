import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.config.js';

// protected roues
import ProtectedRoute from "./ProtectedRoutes.jsx"
import RoleBasedRoute from "./RoleBasedRoutes.jsx"

// Layouts (NOT lazy — needed immediately on first render)
import AuthLayout from '../layouts/AuthLayout.jsx';
import SuperAdminLayout from '../layouts/super_admin/SuperAdminLayout.jsx';
import SchoolAdminLayout from '../layouts/school_admin/SchoolAdminLayout.jsx';

// ── Auth Pages ────────────────────────────────────────────────────────────────
const SuperAdminLogin = lazy(() => import('../pages/super_admin/auth/Login.jsx'));
const SchoolAdminLogin = lazy(() => import('../pages/school_admin/auth/Login.jsx'));

// ── Super Admin Pages ─────────────────────────────────────────────────────────
const SuperDashboard = lazy(() => import('../pages/super_admin/Dashboard.jsx'));
const AllSchools = lazy(() => import('../pages/super_admin/AllSchools.jsx'));
const SchoolDetails = lazy(() => import('../pages/super_admin/SchoolDetails.jsx'));
const RegisterSchool = lazy(() => import('../pages/super_admin/RegisterSchool.jsx'));
const AdminManagement = lazy(() => import('../pages/super_admin/AdminManagement.jsx'));
const Subscription = lazy(() => import('../pages/super_admin/Subscription.jsx'));
const FeatureFlagsPage = lazy(() => import('../pages/super_admin/FeatureFlagsPage.jsx'));
const SuperAuditLogs = lazy(() => import('../pages/super_admin/AuditLogs.jsx'));
const HealthMonitor = lazy(() => import('../pages/super_admin/HealthMonitor.jsx'));
const Report = lazy(() => import('../pages/super_admin/Report.jsx'));
const ApiKey = lazy(() => import('../pages/super_admin/apikey/ApiKey.jsx'));
const Webhook = lazy(() => import('../pages/super_admin/webhook/Webhook.jsx'));
const SuperTokenInventory = lazy(() => import('../pages/super_admin/token/TokenInventoryPage.jsx'));
const SuperTokenControl = lazy(() => import('../pages/super_admin/token/TokenControlPage.jsx'));
const SuperTokenOrder = lazy(() => import('../pages/super_admin/token/TokenOrder.jsx'))
const SuperPaymentPage = lazy(() => import('../pages/super_admin/payment/Paymentspage.jsx'));
const SuperRevenuePage = lazy(() => import('../pages/super_admin/payment/Revenuepage.jsx'));

// ── School Admin Pages ────────────────────────────────────────────────────────
const SchoolDashboard = lazy(() => import('../pages/school_admin/Dashboard.jsx'));
const Students = lazy(() => import('../pages/school_admin/Students.jsx'));
const StudentDetail = lazy(() => import('../pages/school_admin/StudentDetail.jsx'));
const ScanLogs = lazy(() => import('../pages/school_admin/ScanLogs.jsx'));
const Anomalies = lazy(() => import('../pages/school_admin/Anomalies.jsx'));
const ParentRequests = lazy(() => import('../pages/school_admin/ParentRequests.jsx'));
const CardTemplate = lazy(() => import('../pages/school_admin/CardTemplate.jsx'));
const SchoolAuditLogs = lazy(() => import('../pages/school_admin/AuditLogs.jsx'));
const Notifications = lazy(() => import('../pages/school_admin/notifications/Notifications.jsx'));
const SchoolSettings = lazy(() => import('../pages/school_admin/Settings.jsx'));
const QRManagement = lazy(() => import('../pages/school_admin/qr/QRManagement.jsx'));
const TokenInventory = lazy(() => import('../pages/school_admin/tokens/TokenInventory.jsx'));
const TokenControl = lazy(() => import('../pages/school_admin/tokens/TokenControl.jsx'));
const EmergencyDetails = lazy(() => import('../pages/school_admin/emergency/StudentDetails.jsx'));

// ── Page Loader ───────────────────────────────────────────────────────────────
const PageLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
    }}>
        <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--color-slate-200)',
            borderTopColor: 'var(--color-brand-500)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
        }} />
    </div>
);

// ── Dev bypass helpers ────────────────────────────────────────────────────────
const DEV_BYPASS = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true' && import.meta.env.DEV;
const DEV_ROLE = import.meta.env.VITE_DEV_ROLE || 'ADMIN';

const homeRoute = DEV_BYPASS
    ? (DEV_ROLE === 'SUPER_ADMIN' ? ROUTES.SUPER_ADMIN.DASHBOARD : ROUTES.SCHOOL_ADMIN.DASHBOARD)
    : ROUTES.AUTH.LOGIN;

// =============================================================================
// Route Tree
// =============================================================================
export default function AllRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>

                {/* ── Public: Login Pages ─────────────────────────────────────────── */}
                <Route element={<AuthLayout />}>
                    {/* School Admin login  →  /login        */}
                    <Route path={ROUTES.AUTH.LOGIN} element={<SchoolAdminLogin />} />
                    {/* Super Admin login   →  /super-admin  */}
                    <Route path={ROUTES.SUPER_ADMIN.LOGIN} element={<SuperAdminLogin />} />
                </Route>

                {/* ── Super Admin ─────────────────────────────────────────────────── */}
                {/* Protection commented out during development — uncomment before go-live */}
                <Route
                    path={ROUTES.SUPER_ADMIN.ROOT}
                    element={
                        // <ProtectedRoute>
                        // <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
                        <SuperAdminLayout />
                        // </RoleBasedRoute>
                        // </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to={ROUTES.SUPER_ADMIN.DASHBOARD} replace />} />
                    <Route path="dashboard" element={<SuperDashboard />} />
                    <Route path="schools" element={<AllSchools />} />
                    <Route path="schools/register" element={<RegisterSchool />} />
                    <Route path="schools/:schoolId" element={<SchoolDetails />} />
                    <Route path="admins" element={<AdminManagement />} />
                    <Route path="subscriptions" element={<Subscription />} />
                    <Route path="feature-flags" element={<FeatureFlagsPage />} />
                    <Route path="audit-logs" element={<SuperAuditLogs />} />
                    <Route path="health" element={<HealthMonitor />} />
                    <Route path="reports" element={<Report />} />
                    <Route path="api-keys" element={<ApiKey />} />
                    <Route path="webhooks" element={<Webhook />} />
                    <Route path="tokens/inventory" element={<SuperTokenInventory />} />
                    <Route path="tokens/control" element={<SuperTokenControl />} />
                    <Route path='tokens/orders' element={<SuperTokenOrder />} />
                    <Route path='/super/payments' element={<SuperPaymentPage />} />
                    <Route path='/super/revenue' element={<SuperRevenuePage />} />
                </Route>

                {/* ── School Admin ─────────────────────────────────────────────────── */}
                {/* Protection commented out during development — uncomment before go-live */}
                <Route
                    path={ROUTES.SCHOOL_ADMIN.ROOT}
                    element={
                        // <ProtectedRoute>
                        // <RoleBasedRoute allowedRoles={['ADMIN', 'STAFF', 'VIEWER']}>
                        <SchoolAdminLayout />
                        // </RoleBasedRoute>
                        // </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to={ROUTES.SCHOOL_ADMIN.DASHBOARD} replace />} />
                    <Route path="dashboard" element={<SchoolDashboard />} />
                    <Route path="students" element={<Students />} />
                    <Route path="students/:studentId" element={<StudentDetail />} />
                    <Route path="scan-logs" element={<ScanLogs />} />
                    <Route path="anomalies" element={<Anomalies />} />
                    <Route path="parent-requests" element={<ParentRequests />} />
                    <Route path="card-template" element={<CardTemplate />} />
                    <Route path="audit-logs" element={<SchoolAuditLogs />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="qr" element={<QRManagement />} />
                    <Route path="tokens/inventory" element={<TokenInventory />} />
                    <Route path="emergency/:studentId" element={<EmergencyDetails />} />

                    {/* ADMIN-only routes — role restriction commented out for dev */}
                    <Route
                        path="tokens/control"
                        element={
                            // <RoleBasedRoute allowedRoles={['ADMIN']}>
                            <TokenControl />
                            // </RoleBasedRoute>
                        }
                    />
                    <Route
                        path="settings"
                        element={
                            // <RoleBasedRoute allowedRoles={['ADMIN']}>
                            <SchoolSettings />
                            // </RoleBasedRoute>
                        }
                    />
                </Route>

                {/* ── Fallback ─────────────────────────────────────────────────────── */}
                <Route path="/" element={<Navigate to={homeRoute} replace />} />
                <Route path="*" element={<Navigate to={homeRoute} replace />} />

            </Routes>
        </Suspense>
    );
}