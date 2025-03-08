import { createContext, useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
      console.log("Verificando autenticación...");

      const response = await fetch(`${BACKEND_URL}/users/profile`, {
        method: "GET",
        credentials: "include", // Importante para enviar cookies
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Respuesta de autenticación:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Datos de usuario:", data);

        setUser(data);
        setIsAuth(true);
        return true;
      } else {
        // Intentar analizar el error
        let errorText = "";
        try {
          const errorData = await response.text();
          console.error("Error de autenticación:", errorData);
          errorText = errorData;
        } catch (e) {
          console.error("No se pudo leer la respuesta de error");
        }

        console.error(
          `Error de autenticación: ${response.status} - ${errorText}`
        );
      }

      setUser(null);
      setIsAuth(false);
      return false;
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

      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      console.log("Respuesta de login:", response.status);
      let responseText;

      try {
        responseText = await response.text();
        console.log("Texto de respuesta:", responseText);

        // Intentar convertir a JSON solo si es válido
        const data = JSON.parse(responseText);

        if (!response.ok) {
          throw new Error(data.message || "Error al iniciar sesión");
        }

        if (data.user.role !== "admin") {
          throw new Error(
            "Acceso denegado. Esta página es solo para administradores."
          );
        }

        setUser(data.user);
        setIsAuth(true);

        return data;
      } catch (parseError) {
        console.error("Error al procesar respuesta:", parseError);
        console.error("Texto de respuesta recibido:", responseText);
        throw new Error("Error al procesar la respuesta del servidor");
      }
    } catch (err) {
      console.error("Error en loginAdmin:", err);
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
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar el usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
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
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al cerrar sesión");
      }

      setUser(null);
      setIsAuth(false);
      // Redirigir al login después de cerrar sesión
      window.location.href = "/admin";
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
    login,
    logout,
    register,
    clearError,
    checkAuthStatus,
    isAdmin: true, // Siempre será true si el usuario está autenticado
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
