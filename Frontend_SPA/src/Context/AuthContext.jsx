import { createContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api"; 

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

      const response = await apiRequest(`${BACKEND_URL}/users/profile`, {
        method: "GET",
      });

      console.log("Respuesta de verificación:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Autenticación exitosa, datos:", data);
        setUser(data);
        setIsAuth(true);
        setUsingLocalStorage(false);
        return true;
      } else {
        // Si falla, limpiamos el estado
        setUser(null);
        setIsAuth(false);
        return false;
      }
    } catch (err) {
      console.error("Error al verificar autenticación:", err);
      setUser(null);
      setIsAuth(false);
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

      const response = await apiRequest(`${BACKEND_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      if (data.user.role !== "admin") {
        throw new Error(
          "Acceso denegado. Esta página es solo para administradores."
        );
      }

      // Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        console.log("Token guardado en localStorage");
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

      const response = await apiRequest(`${BACKEND_URL}/users/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, name, gender, age }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      // Guardar el token en localStorage si está disponible
      if (data.token) {
        localStorage.setItem("authToken", data.token);
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

      const response = await apiRequest(`${BACKEND_URL}/users/logout`, {
        method: "POST",
      });

      if (!response.ok) {
        console.warn("Error en logout, limpiando estado local de todos modos");
      }

      // Siempre limpiamos el estado local y eliminamos el token
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuth(false);
      setUsingLocalStorage(false);

      // Redirigir al login después de cerrar sesión
      window.location.href = "/admin";
    } catch (err) {
      console.error("Error en logout:", err);
      // Incluso si hay error, limpiamos el estado
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuth(false);
      window.location.href = "/admin";
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
