import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [role, setRole] = useState(localStorage.getItem("role") || null);
    const [name, setName] = useState(localStorage.getItem("name") || null);
    const [id, setId] = useState(localStorage.getItem("id") || null);

    let parsedUser = null;
    try {
        parsedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    } catch (err) {
        console.error("Error parsing user from localStorage", err);
        localStorage.removeItem("user");
    }

    const [user, setUser] = useState(parsedUser);

    const login = ({ token, role, name, id }) => {
        setToken(token);
        setRole(role);
        setName(name);
        setId(id);

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
        localStorage.setItem("id", id);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setUser(null);
        setName(null);
        setId(null);
        localStorage.clear();
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, role, name, login, logout, isLoggedIn, id }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
