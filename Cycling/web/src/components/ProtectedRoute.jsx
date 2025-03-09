import { Navigate, useLocation } from "react-router-dom"; // Añadir useLocation
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Obtener la ubicación actual

  // Determinar si estamos en la ruta con prefijo /cycling
  const isCyclingRoute = location.pathname.startsWith("/cycling");

  if (!isAuthenticated) {
    // Redirigir a /login o /cycling/login según corresponda
    return (
      <Navigate to={isCyclingRoute ? "/cycling/login" : "/login"} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
