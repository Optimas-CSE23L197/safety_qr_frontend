import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // 🔹 Load user from localStorage
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error("Failed to parse user", err);
            localStorage.removeItem("user");
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const handleLogin = (role = "user") => {
        const loggedInUser = {
            name: role === "admin" ? "Admin" : "User",
            role,
        };

        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const value = {
        user,
        isLoggedIn: !!user,
        authLoading,
        handleLogin,
        handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);