import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

// Función auxiliar para validar y convertir tipos
const sanitizeUserData = (data) => {
    console.log('Sanitizing user data:', data);
    
    const sanitized = {
        id: String(data.id),
        name: String(data.name || ''),
        email: String(data.email || ''),
        role: String(data.role || 'user'),
        height: data.height !== undefined && data.height !== null ? Number(data.height) : null,
        weight: data.weight !== undefined && data.weight !== null ? Number(data.weight) : null,
        age: data.age !== undefined && data.age !== null ? Number(data.age) : null,
        gender: String(data.gender || ''),
        profileImage: data.profileImage || null,
        stats: {
            totalRaces: Number(data.stats?.totalRaces || 0),
            completedRaces: Number(data.stats?.completedRaces || 0),
            totalKilometers: Number(data.stats?.totalKilometers || 0)
        }
    };

    console.log('Sanitized user data:', sanitized);
    return sanitized;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                return sanitizeUserData(parsedUser);
            }
            return null;
        } catch (error) {
            console.error('Error loading stored user data:', error);
            return null;
        }
    });

    const login = async (email, password) => {
        try {
            console.log('Login attempt for:', email);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }

            const sanitizedUserData = sanitizeUserData(data.user);
            setUser(sanitizedUserData);
            localStorage.setItem('user', JSON.stringify(sanitizedUserData));
            
            return sanitizedUserData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            console.log('Logging out...');
            setUser(null);
            localStorage.removeItem('user');

            await fetch(`${import.meta.env.VITE_API_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (userData) => {
        try {
            console.log('Updating user data:', userData);
            const sanitizedUserData = sanitizeUserData(userData);
            setUser(sanitizedUserData);
            localStorage.setItem('user', JSON.stringify(sanitizedUserData));
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
