import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js"; // Asegúrate de tener el hook de autenticación

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();


  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;