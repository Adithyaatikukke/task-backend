import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const handleAutoLogout = () => {
            setUser(null);
        };

        window.addEventListener("auth-logout", handleAutoLogout);

        return () => {
            window.removeEventListener("auth-logout", handleAutoLogout);
        };
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/api/auth/login", { email, password });
        const { token, user: loggedInUser } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);

        return loggedInUser;
    };

    const register = async (name, email, password) => {
        const response = await api.post("/api/auth/register", { name, email, password });
        const { token, user: registeredUser } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(registeredUser));
        setUser(registeredUser);

        return registeredUser;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const value = { user, loading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}