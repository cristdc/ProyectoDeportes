import { createContext, useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log("Verificando autenticación...");
      
      // Primer intento: usar cookies
      let response = await fetch(`${BACKEND_URL}/users/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      // Si las cookies fallan, intentar con localStorage
      if (!response.ok) {
        console.log("Cookies fallaron, intentando con localStorage");
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
          response = await fetch(`${BACKEND_URL}/users/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            setUsingLocalStorage(true);
            console.log("Autenticación exitosa usando localStorage");
          }
        }
      } else {
        setUsingLocalStorage(false);
        console.log("Autenticación exitosa usando cookies");
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Datos de usuario:", data);
        setUser(data);
        setIsAuth(true);
        return true;
      } else {
        // Si ambos métodos fallaron, limpiar todo
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuth(false);
        setUsingLocalStorage(false);
        return false;
      }
    } catch (err) {
      console.error("Error al verificar autenticación:", err);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuth(false);
      setUsingLocalStorage(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log("Intentando login con:", email);

      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      if (data.user.role !== "admin") {
        throw new Error("Acceso denegado. Esta página es solo para administradores.");
      }

      // Guardar el token en localStorage solo si las cookies no funcionan
      if (!document.cookie.includes('token=')) {
        console.log("Cookies no disponibles, usando localStorage como respaldo");
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          setUsingLocalStorage(true);
        }
      } else {
        setUsingLocalStorage(false);
      }

      setUser(data.user);
      setIsAuth(true);
      return data;
    } catch (err) {
      console.error("Error en login:", err);
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password, name, gender, age }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

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
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
      };

      // Si estamos usando localStorage, incluir el token en los headers
      if (usingLocalStorage) {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          headers.Authorization = `Bearer ${storedToken}`;
        }
      }

      const response = await fetch(`${BACKEND_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
        headers
      });

      if (!response.ok) {
        console.warn("Error en logout, limpiando estado local de todos modos");
      }
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      // Limpiar todo independientemente del resultado
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuth(false);
      setUsingLocalStorage(false);
      setLoading(false);
      window.location.href = "/admin";
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
    login,
    logout,
    register,
    clearError,
    checkAuthStatus,
    isAdmin: true,
    usingLocalStorage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
