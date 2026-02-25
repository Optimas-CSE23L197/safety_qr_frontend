// MainLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex flex-col flex-1">
                <Header onToggle={() => setCollapsed(!collapsed)} />
                <main className="p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}