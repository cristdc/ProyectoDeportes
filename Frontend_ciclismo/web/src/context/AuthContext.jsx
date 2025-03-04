import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const register = async (userData) => {
        try{
            const response = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                body: JSON.stringify(userData),
                headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data);
        }
        } catch (error) {
            setError(error.message);
        }
    };

    const login = async (userData) => {
        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                body: JSON.stringify(userData),
                headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data);
        }
        } catch (error) {
            setError(error.message);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}; 