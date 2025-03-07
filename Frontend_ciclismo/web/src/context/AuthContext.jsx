import { createContext, useContext, useState, useEffect } from "react";

const VITE_API_CICLISMO_URL = import.meta.env.VITE_API_CICLISMO_URL; 
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_CICLISMO_URL;
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true'
    });
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            localStorage.removeItem('isAuthenticated');
        }
        
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [isAuthenticated, user]);


    const login = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                body: JSON.stringify(userData),
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);   
                setUser(data.user);
                setError(null);
                return true;
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error en el inicio de sesión');
                return false;
            }
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${API_URL}/users/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                // Limpiamos el estado y el localStorage
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                setError(null);            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout, 
            error, 
            setError 
        }}>
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