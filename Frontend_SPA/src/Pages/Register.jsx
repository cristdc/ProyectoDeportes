import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isRegistererd, setIsRegistererd] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: "",
    age: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData); // Para debug

    if (
      !formData.name ||
      !formData.email ||
      !formData.age ||
      !formData.password ||
      !formData.gender
    ) {
      console.log("Faltan campos por completar");
      return;
    }

    try {
      const success = await register(formData);
      console.log("Resultado del registro:", success); // Para debug
      if (success) {
        setIsRegistererd(true);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#9b9d79] text-center mb-6">
          Registro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-[#9b9d79] mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
              placeholder="Ingrese su nombre de usuario"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#9b9d79] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
              placeholder="Ingrese su email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-[#9b9d79] mb-1">
              Edad
            </label>
            <input
              type="number"
              id="age"
              className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
              placeholder="Ingrese su edad"
              value={formData.age}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#9b9d79] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
              placeholder="Ingrese su contraseña"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-[#9b9d79] mb-1">
              Género
            </label>
            <select
              id="gender"
              value={formData.gender}
              className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
              onChange={handleChange}
            >
              <option value="">Seleccione su género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#9b9d79] text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
