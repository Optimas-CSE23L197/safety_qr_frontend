import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoutes({ children }) {
    const { accessToken, isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (!accessToken || !isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}