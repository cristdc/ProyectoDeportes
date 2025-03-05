import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js"; // Asegúrate de tener el hook de autenticación
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const { checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    const auth = async() =>{
      const auth = await checkAuthStatus();
      setAuth(auth)
      setLoading(false);
    }
      auth();
  }, [])

  if(loading){
    return <div>Cargando...</div>
  }
  
  if (auth) {
    return children;
  }else{
    return <Navigate to="/" replace />;
  }

};

export default PrivateRoute;