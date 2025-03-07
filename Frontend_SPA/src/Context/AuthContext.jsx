import { createContext, useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Intentar recuperar el usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(() => {
    // Verificar si hay un usuario guardado
    return localStorage.getItem('user') !== null;
  });

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

  const register = async ({ email, password, name, gender, age }) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password, name, gender, age }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar el usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuth(true);

      return data;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al cerrar sesión');
      }
      
      localStorage.removeItem('user');
      setUser(null);
      setIsAuth(false);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    isAuth,
    error,
    loginAdmin,
    logout,
    register,
    clearError,
    checkAuthStatus,
    isAdmin: true // Siempre será true si el usuario está autenticado
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
