import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";


export const useAuth = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const register = async (userData) => {
        const { email, password, name, age, gender } = userData;
        try {
            console.log("Enviando datos:", userData);

            const response = await fetch("http://192.168.50.143:3000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, name, age, gender})
            });
            
            
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Error al registrar el usuario");
            }
            
            const data = await response.json();
            console.log("Respuesta del servidor:", data);
            
            if (data.user) {
                login(data.user);
                navigate("/home")
                return true;
            }
            throw new Error("No se recibieron datos del usuario");
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("Tiempo de espera agotado. Por favor, verifica que el servidor esté funcionando.");
                throw new Error("No se pudo conectar al servidor. Por favor, inténtelo de nuevo.");
            }
            console.error("Error en registro:", error);
            throw error;
        }
    };

    return { register };

}

