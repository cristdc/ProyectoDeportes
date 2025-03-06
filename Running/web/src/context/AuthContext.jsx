import React, { createContext, useState, useContext } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Función para obtener el usuario autenticado manualmente
    const fetchUser = () => {
        setLoading(true);
        fetch(`${API_URL}/users/profile`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => response.ok ? response.json() : Promise.reject("No autenticado"))
        .then(data => setUser(data))
        .catch(error => {
            console.error("Error obteniendo perfil:", error);
            setUser(null);
        })
        .finally(() => setLoading(false));
    };

    // Función para iniciar sesión
    const login = (formData) => {
        setLoading(true);
        setError(null);

        return fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: 'include',
        })
        .then(response => response.text())  // Primero obtenemos el texto
        .then(text => {
            try {
                const data = JSON.parse(text);
                setUser(data.user);
                return data;
            } catch {
                throw new Error("Respuesta no válida del servidor");
            }
        })
        .catch(error => {
            setError(error.message);
            throw error;
        })
        .finally(() => setLoading(false));
    };

    // Función para cerrar sesión
    const logout = () => {
        fetch(`${API_URL}/users/logout`, {
            method: "POST",
            credentials: "include",
        })
        .then(() => {
            setUser(null);
        })
        .catch(error => {
            console.error("Error en logout:", error);
        });
    };

    const value = {
        user,
        login,
        logout,
        loading,
        error,
        fetchUser, // Se expone para que pueda ser llamado manualmente
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe estar dentro del proveedor AuthProvider");
    }
    return context;
};
