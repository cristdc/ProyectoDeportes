import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { token, user } = apiService.getAuthData();
        console.log('Token encontrado en localStorage al iniciar AuthProvider:', token);

        if (!token) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const userData = await apiService.getUserProfile();
                setUser(userData);
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            setUser(user);
            setLoading(false);
        } else {
            checkAuth();
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await apiService.login(credentials);
            if (response.user) {
                setUser(response.user);
            }
            return response;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
