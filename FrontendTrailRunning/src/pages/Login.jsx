import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const { user, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(username, password, navigate);
    console.log(user);
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="min-w-xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700">Nombre de Usuario</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            className="w-full bg-rose-700 text-white p-3 rounded-lg font-semibold hover:bg-rose-500 transition mb-5"
          >
            Iniciar Sesión
          </button>
        </form>
        <Link to="/register" className="text-blue-600">
        ¡Registrate Ahora!
        </Link>
      </div>
    </div>
  );
};

export default Login;