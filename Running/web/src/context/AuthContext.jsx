import { createContext, useContext, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    const handleSetUser = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
        setUser(userData);
    };

    const login = async (formData) => {
        const { email, password } = formData;
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error en login");
            }
            
            const data = await response.json();
            handleSetUser(data.user);
            return { success: true };
        } catch (error) {
            setError(error);
            console.error("Error en login:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const value = {
        user,
        error,
        loading,
        login,
        logout,
        
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe estar dentro del proveedor AuthProvider");
    }
    return context;
};