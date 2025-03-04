import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Asegúrate de tener el hook de autenticación

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;