import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Dashboard from "../pages/Dashboard";
import QRManagement from "../pages/qr/QRManagement";
import StudentEmergencyProfile from "../pages/emergency/StudentDetails";
import CreateSchool from "../pages/RegisterSchool";
import AllSchools from "../pages/AllSchools";
import Settings from "../pages/Settings";
import AdminLoginPage from "../pages/auth/Login";
import SchoolDetails from "../pages/SchoolDetails";
import TokenControlPage from "../pages/token/TokenControlPage";
import AdminManagementPage from "../pages/AdminManagement";
import AuditLogsPage from "../pages/AuditLogs";
import HealthMonitorPage from "../pages/HealthMonitor";
import ScanLogsPage from "../pages/ScanLogs";
import SubscriptionPage from "../pages/Subscription";
import ReportsPage from "../pages/Report";
import CardTemplatesPage from "../pages/CardTemplate";

import ProtectedRoutes from "./ProtectedRoutes";
import RoleBasedRoutes from "./RoleBasedRoutes";
import FeatureFlagsPage from "../pages/feature_flag/FeatureFlagsPage";
import WebhooksPage from "../pages/webhook/Webhook";
import ApiKeysPage from "../pages/apikey/ApiKey";
import TokenInventoryPage from "../pages/token/TokenInventoryPage";

export default function AllRoutes() {
    return (
        <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/scan/id" element={<StudentEmergencyProfile />} />

            {/* 🔐 Protected App */}
            <Route
                element={
                    // <ProtectedRoutes>
                    <MainLayout />
                    // </ProtectedRoutes>
                }
            >
                {/* 🧑‍💼 Admin + Super Admin */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/qr" element={<QRManagement />} />
                <Route path="/schools" element={<CreateSchool />} />
                <Route path="/school-lookup" element={<AllSchools />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/school/id" element={<SchoolDetails />} />
                <Route path="/subscriptions" element={<SubscriptionPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/templates" element={<CardTemplatesPage />} />
                <Route path="/scan-logs" element={<ScanLogsPage />} />
                <Route path="/feature-flags" element={<FeatureFlagsPage />} />
                <Route path="/webhooks" element={<WebhooksPage />} />
                <Route path="/api-keys" element={<ApiKeysPage />} />
                <Route path="/token-inventory" element={<TokenInventoryPage />} />

                {/* 🛡 Super Admin Only */}
                <Route
                    path="/token"
                    element={
                        // <RoleBasedRoutes allowedRoles={["SUPER_ADMIN"]}>
                        <TokenControlPage />
                        // </RoleBasedRoutes>
                    }
                />

                <Route
                    path="/admins"
                    element={
                        // <RoleBasedRoutes allowedRoles={["SUPER_ADMIN"]}>
                        <AdminManagementPage />
                        // {/* </RoleBasedRoutes> */}
                    }
                />

                <Route
                    path="/audit-logs"
                    element={
                        // <RoleBasedRoutes allowedRoles={["SUPER_ADMIN"]}>
                        <AuditLogsPage />
                        // </RoleBasedRoutes>
                    }
                />

                <Route
                    path="/health"
                    element={
                        // <RoleBasedRoutes allowedRoles={["SUPER_ADMIN"]}>
                        <HealthMonitorPage />
                        // </RoleBasedRoutes>
                    }
                />
            </Route>

            {/* ❌ Unauthorized */}
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />

            {/* ❌ 404 */}
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    );
}