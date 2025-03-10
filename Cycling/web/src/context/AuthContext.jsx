import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_CICLISMO_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Intentar recuperar el usuario del localStorage al iniciar
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRegistrations, setUserRegistrations] = useState(() => {
        const savedRegistrations = localStorage.getItem('userRegistrations');
        return savedRegistrations ? JSON.parse(savedRegistrations) : [];
    });

    // Efecto para persistir el usuario en localStorage cuando cambie
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    const checkLogin = async () => {
        const token = Cookies.get("token");
        
        if (!token) {
            setIsAuthenticated(false);
            setUser(null); // Limpiar usuario si no hay token
            setLoading(false);
            return;
        }

        try {
            const res = await verifyTokenRequest(token);
            if (!res.data) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            // Mantener todos los datos del usuario almacenados en localStorage
            const savedUser = localStorage.getItem("user");
            const userData = savedUser ? JSON.parse(savedUser) : res.data;
            
            setIsAuthenticated(true);
            setUser(userData);
            setLoading(false);
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    };

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            
            // Guardar el usuario completo en el estado y localStorage
            setUser(res.data.user);
            setIsAuthenticated(true);
            
            // Guardar el token en una cookie
            Cookies.set("token", res.data.token);
            
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    const logout = () => {
        Cookies.remove("token");
        localStorage.removeItem("user"); // Limpiar usuario del localStorage
        setIsAuthenticated(false);
        setUser(null);
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
            setErrors(error.message);
            return false;
        }
    }

    const registerToRace = async (raceId) => {
        try {
            // Buscar cualquier registro previo para esta carrera (incluso los cancelados)
            const existingRegistration = userRegistrations.find(reg => 
                reg.race._id === raceId
            );
            
            if (existingRegistration) {
                console.log("Encontrado registro existente:", existingRegistration);
                
                // Si existe un registro previo, actualizarlo a 'registered'
                const response = await fetch(`${API_URL}/registrations/${existingRegistration._id}/cancel`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 'registered' })
                });

                const data = await response.json();
                console.log("Respuesta de actualización:", data);

                if (!response.ok) {
                    throw new Error(data.message || 'Error al actualizar la inscripción');
                }

                // Actualizar el estado local
                await fetchRegistrations();
                return { success: true, message: 'Inscripción actualizada correctamente' };
            } else {
                // Solo si no existe ningún registro previo, crear uno nuevo
                const response = await fetch(`${API_URL}/registrations`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ raceId })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error al inscribirse');
                }

                await fetchRegistrations();
                return { success: true, message: data.message };
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            return { success: false, message: error.message };
        }
    };

    const unregisterFromRace = async (registrationId) => {
        try {
            const response = await fetch(`${API_URL}/registrations/${registrationId}/cancel`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al cancelar la inscripción');
            }

            setUserRegistrations(prevRegistrations => 
                prevRegistrations.map(reg => 
                    reg._id === registrationId 
                        ? { ...reg, status: 'cancelled' }
                        : reg
                )
            );

            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error al cancelar inscripción:", error);
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
            signin,
            logout,
            user,
            isAuthenticated,
            errors,
            loading,
            userRegistrations,
            updateUserData,
            registerToRace,
            unregisterFromRace,
            fetchRegistrations
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};