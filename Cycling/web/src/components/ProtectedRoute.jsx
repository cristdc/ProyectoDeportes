import { Navigate, useLocation } from "react-router-dom"; // Añadir useLocation
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
   
    return (
      <Navigate to={ "/cycling/login"} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
