import { createContext, useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  useEffect(() => {
    if (localStorage.getItem('user')) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.role === 'admin') {
          setUser(data);
          setIsAuth(true);
          localStorage.setItem('user', JSON.stringify(data));
          return true;
        }
      }
      
      // Si no hay usuario válido o no es admin, limpiar todo
      localStorage.removeItem('user');
      setUser(null);
      setIsAuth(false);
      return false;

    } catch (err) {
      console.error('Error al verificar autenticación:', err);
      localStorage.removeItem('user');
      setUser(null);
      setIsAuth(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Acceso denegado. Esta página es solo para administradores.');
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
