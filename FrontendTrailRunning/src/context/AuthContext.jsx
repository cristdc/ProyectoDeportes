import { createContext, useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// OJO: el .env ya tiene el /api para que sea más cómodo 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/profile`, {
        method: 'GET',
        credentials: 'include' // Armando recuerda pa enviar cookies
      });
      
      if (response.ok) {
        const data = await response.json();

          setUser(data);
          if(data.name){
            return true;
          }else{
            return false;
          }

      }

    } catch (err) {
      console.error('Error al verificar autenticación:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Importante para recibir las cookies
      });
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      const data = await response.json();
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };


  // Función para cerrar sesión
  const logout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al cerrar sesión');
      }
      
      setUser(null);
      setIsAuth(false);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editUser = async (name, age) => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, age }),
        credentials: 'include' // Importante para recibir las cookies
      });
      
      if (!response.ok) {
        throw new Error('Error al editar el usuario');
      }

      return await response.json();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }
  const value = {
    user,
    loading,
    isAuth,
    error,
    login,
    logout,
    checkAuthStatus,
    editUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
