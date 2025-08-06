import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const getToken = () => localStorage.getItem("token");

    const isTokenExpired = (token) => {
        try {
            const [, payloadBase64] = token.split(".");
            const payload = JSON.parse(atob(payloadBase64));
            const expiry = payload.exp * 1000;
            return Date.now() > expiry;
        } catch (err) {
            return true;
        }
    };

    const initialToken = getToken();
    const [token, setToken] = useState(initialToken && !isTokenExpired(initialToken) ? initialToken : null);
    const [role, setRole] = useState(localStorage.getItem("role") || null);
    const [name, setName] = useState(localStorage.getItem("name") || null);
    const [id, setId] = useState(localStorage.getItem("id") || null);


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
        setName(null);
        setId(null);
        localStorage.clear();
    };

    const isLoggedIn = !!token;

    useEffect(() => {
        if (initialToken && isTokenExpired(initialToken)) {
            logout();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, role, name, login, logout, isLoggedIn, id }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
