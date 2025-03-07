import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");  // Cambio setUsername -> setEmail
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const { login } = useAuth({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data?.user) {
        toast.success("Inicio de sesión exitoso.", { autoClose: 3000 });
        navigate("/home");
      } else {
        toast.error("Correo o contraseña incorrectos.", { autoClose: 3000 });
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.", error , { autoClose: 3000 });
    }
  };

  return (
    <div className="w-full flex justify-center items-center ">
      <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-lg rounded-xl p-6 m-3">
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-accent transition mb-5"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
