import { createContext, useContext, useState, useEffect } from "react";

const VITE_API_CICLISMO_URL = import.meta.env.VITE_API_CICLISMO_URL; 
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_CICLISMO_URL;
export const AuthProvider = ({ children }) => {
    // Inicializar estados con valores del localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [error, setError] = useState(null);
    const [userRegistrations, setUserRegistrations] = useState(() => {
        const savedRegistrations = localStorage.getItem('userRegistrations');
        return savedRegistrations ? JSON.parse(savedRegistrations) : [];
    });

    // Verificar autenticación al cargar o cuando cambie el estado
    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token');
            }

            const response = await fetch(`${API_URL}/users/check-auth`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error('No autenticado');
            }

            const data = await response.json();
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            if (data.user) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            setError(null);
            await fetchRegistrations(); // Cargar inscripciones después de verificar autenticación
        } catch (error) {
            console.error("Error durante la verificación de autenticación:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('userRegistrations');
            setIsAuthenticated(false);
            setUser(null);
            setUserRegistrations([]);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        }
    }, []);

    const login = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                // Veamos qué contiene la respuesta
                console.log('Respuesta completa:', data);
                console.log('Cookies disponibles:', document.cookie);

                setIsAuthenticated(true);   
                setUser(data.user);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                setError(null);
                await fetchRegistrations();
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
            const response = await fetch(`${API_URL}/users/logout`, {   
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error durante el logout:", error);
        } finally {
            // Limpiar todo el localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('userRegistrations');
            setIsAuthenticated(false);
            setUser(null);
            setError(null);
            setUserRegistrations([]);
        }
    };

    const fetchWithToken = async (url, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(url, {
            ...options,
            credentials: 'include',
            headers
        });
    };

    const fetchRegistrations = async () => {
        try {
            const response = await fetchWithToken(`${API_URL}/registrations/user`);
            
            if (!response.ok) {
                throw new Error('Error al obtener las inscripciones');
            }
            
            const data = await response.json();
            const registrations = data.registrations || [];
            setUserRegistrations(registrations);
            localStorage.setItem('userRegistrations', JSON.stringify(registrations));
        } catch (error) {
            console.error("Error en fetchRegistrations:", error);
            setError(error.message);
            return false;
        }
    }

    const registerToRace = async (raceId) => {
        try {
            const response = await fetchWithToken(`${API_URL}/registrations`, {
                method: "POST",
                body: JSON.stringify({ raceId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al inscribirse');
            }

            await fetchRegistrations();
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const unregisterFromRace = async (registrationId) => {
        try {
            const response = await fetchWithToken(`${API_URL}/registrations/${registrationId}/cancel`, {
                method: "PUT"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al desinscribirse');
            }

            await fetchRegistrations();
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const updateUserData = async (updatedUser) => {
        try {
            console.log("Actualizando usuario con:", updatedUser);
            
            // Normalizar los datos del usuario
            const normalizedUser = {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                age: updatedUser.age
            };

            console.log("Datos normalizados:", normalizedUser);
            
            // Actualizar estado y localStorage
            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            
            console.log("Usuario guardado en estado:", normalizedUser);
            return true;
        } catch (error) {
            console.error("Error actualizando datos del usuario:", error);
            return false;
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
            userRegistrations,
            updateUserData
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