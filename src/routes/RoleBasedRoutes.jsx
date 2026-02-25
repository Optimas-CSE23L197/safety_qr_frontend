import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleBasedRoutes({ allowedRoles, children }) {
    const { role } = useAuthStore();

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}