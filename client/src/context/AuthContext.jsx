import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            refreshUser();
        }
        setLoading(false);
    }, []);

    const refreshUser = async () => {
        try {
            const { data } = await API.get("/posts/profile");
            const updatedUser = { ...JSON.parse(localStorage.getItem("userInfo")), ...data.user };
            setUser(updatedUser);
            localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Failed to refresh user profile", error);
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    const login = async (email, password) => {
        const { data } = await API.post("/auth/login", { email, password });
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
    };

    const register = async (name, email, password) => {
        const { data } = await API.post("/auth/register", { name, email, password });
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
