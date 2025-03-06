import { createContext, useContext, useState, useEffect } from "react";

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
            console.log("Verificando autenticación...");
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
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('userRegistrations');
            setIsAuthenticated(false);
            setUser(null);
            setUserRegistrations([]);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchRegistrations();
        }
    }, [isAuthenticated]);

    const login = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            })
            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);   
                setUser(data.user);
                // Guardar en localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(data.user));
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
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('userRegistrations');
            setIsAuthenticated(false);
            setUser(null);
            setError(null);
            setUserRegistrations([]);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const response = await fetch(`${API_URL}/registrations/user`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al obtener las inscripciones');
            }
            
            const data = await response.json();
            const registrations = data.registrations || [];
            setUserRegistrations(registrations);
            // Guardar en localStorage
            localStorage.setItem('userRegistrations', JSON.stringify(registrations));
        } catch (error) {
            console.error("Error en fetchRegistrations:", error);
            setError(error.message);
            return false;
        }
    }

    const registerToRace = async (raceId) => {
        try {
            // Asegurarnos de que la URL es correcta
            const response = await fetch(`${API_URL}/registrations`, {
                method: "POST",
                credentials: "include",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ raceId })
            });

            // Primero obtenemos la respuesta en JSON
            const data = await response.json();

            if (!response.ok) {
                // Si la respuesta no es ok, lanzamos el error con el mensaje del servidor
                throw new Error(data.message || 'Error al inscribirse');
            }

            // Si todo va bien, actualizamos las inscripciones
            await fetchRegistrations(); // Actualizamos la lista completa de inscripciones
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error al registrarse:", error);
            return { success: false, message: error.message };
        }
    };

    const unregisterFromRace = async (registrationId) => {
        try {
            // Verificar si la inscripción existe y está activa
            const registration = userRegistrations.find(reg => reg._id === registrationId);
            
            if (!registration) {
                throw new Error('Inscripción no encontrada');
            }

            if (registration.status === 'cancelled') {
                throw new Error('Esta inscripción ya está cancelada');
            }

            if (registration.status === 'finished') {
                throw new Error('No se puede cancelar una inscripción finalizada');
            }

            const response = await fetch(`${API_URL}/registrations/${registrationId}/cancel`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al desinscribirse');
            }

            // Actualizamos la lista de inscripciones
            await fetchRegistrations();
            return { success: true, message: 'Inscripción cancelada correctamente' };
        } catch (error) {
            console.error("Error al desinscribirse:", error);
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