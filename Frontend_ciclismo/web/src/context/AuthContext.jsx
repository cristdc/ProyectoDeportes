import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [userRegistrations, setUserRegistrations] = useState([]);

    // Verificar autenticación al cargar o cuando cambie el estado
    const checkAuth = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_CICLISMO_URL}/users/check-auth`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                await logout();
                return;
            }

            const data = await response.json();
            setIsAuthenticated(true);
            setUser(data.user);
            setError(null);
        } catch (error) {
            console.error("Error durante la verificación de autenticación:", error);
            await logout();
        }
    };

    useEffect(() => {
        checkAuth();
        fetchRegistrations();
    }, []);

    const login = async (userData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_CICLISMO_URL}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                setUser(data.user);
                setError(null);
                return true;
            }
            
            const errorData = await response.json();
            setError(errorData.message || 'Error en el inicio de sesión');
            return false;
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_CICLISMO_URL}/users/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error durante el logout:", error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setError(null);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_CICLISMO_URL}/registrations/user`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener las inscripciones');
            }
            
            const data = await response.json();
            setUserRegistrations(data);
        } catch (error) {
            console.error("Error en fetchRegistrations:", error);
            setError(error.message);
            return false;
        }
    }

    const registerToRace = async (raceId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_CICLISMO_URL}/registrations`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ raceId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al inscribirse');
            }

            const data = await response.json();
            setUserRegistrations([...userRegistrations, raceId]);
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const unregisterFromRace = async (raceId) => {
        try {
            const response = await fetch(`/api/races/${raceId}/unregister`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al desinscribirse');
            }

            const data = await response.json();
            setUserRegistrations(userRegistrations.filter(id => id !== raceId));
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout, 
            error, 
            setError,
            checkAuth,
            registerToRace,
            unregisterFromRace,
            userRegistrations
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