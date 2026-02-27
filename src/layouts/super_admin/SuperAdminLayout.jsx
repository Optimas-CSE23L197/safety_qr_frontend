import { Outlet } from "react-router-dom";
import useUiStore from "../../store/uiStore.js";
import SuperAdminSidebar from "./SuperAdminSidebar.jsx";
import SuperAdminHeader from "./SuperAdminHeader.jsx";

export default function SuperAdminLayout() {
    const { sidebarCollapsed } = useUiStore();
    const sidebarWidth = sidebarCollapsed ? "72px" : "260px";

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-page)" }}>
            <SuperAdminSidebar />

            <div
                style={{
                    flex: 1,
                    marginLeft: sidebarWidth,
                    display: "flex",
                    flexDirection: "column",
                    transition: "margin-left 0.3s ease",
                }}
            >
                <SuperAdminHeader />

                <main style={{ flex: 1, padding: "1.5rem 2rem" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}