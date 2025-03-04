import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);


    const login = async (userData) => {
        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                body: JSON.stringify(userData),
                credentials: "include",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userData.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                setUser(data.user);
                return true;
            }
            return false;
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, error, setError }}>
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