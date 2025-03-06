import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar estado de autenticación al cargar
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/users/auth-status`, {
                    method: 'GET',
                    credentials: 'include', // Importante para enviar las cookies
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.authenticated) {
                    // Obtenemos datos completos del usuario si está autenticado
                    const userResponse = await fetch(`${API_URL}/users/profile`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUser(userData);
                    } else {
                        setUser(data.user); // Información básica del usuario (id y role)
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error al verificar autenticación:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',