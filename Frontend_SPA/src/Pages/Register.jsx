import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => !value)) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    setLoading(true);
    try {
      const success = await register(formData);
      if (success) {
        toast.success("Registro exitoso");
        setTimeout(() => navigate("/home"), 1500); // Esperar 1.5 segundos para que el usuario vea el toast
      } else {
        toast.error("Error en el registro. Intente nuevamente.");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error(error.message || "Error en el registro. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />

      {/* Botón de cambio de tema */}
      <button
        onClick={toggleTheme}
        className={`fixed top-8 right-8 w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center z-50 group ${
          isDark ? "bg-white/20 text-white" : "bg-[#333333]/20 text-[#333333]"
        }`}
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      >
        {isDark ? (
          <svg
            className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-colors duration-300 ${
          isDark
            ? "bg-gray-900 text-white border-gray-700"
            : "bg-white text-gray-900 border-gray-300"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#9b9d79] dark:text-[#b8ba96]">
            Registro
          </h2>
          <button
            onClick={() => navigate("/home")}
            className="flex items-center text-[#9b9d79] dark:text-[#b8ba96] hover:text-[#8a8c6a] dark:hover:text-[#a7a985] transition-colors"
          >
            <svg
              className="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "age", "password"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-[#9b9d79] dark:text-[#b8ba96] mb-1"
              >
                {field === "name"
                  ? "Nombre de usuario"
                  : field === "email"
                  ? "Email"
                  : field === "age"
                  ? "Edad"
                  : "Contraseña"}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "age"
                    ? "number"
                    : "text"
                }
                id={field}
                className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-white focus:ring-gray-500"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-gray-400"
                }`}
                placeholder={`Ingrese su ${field}`}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="gender"
              className="block text-[#9b9d79] dark:text-[#b8ba96] mb-1"
            >
              Género
            </label>
            <select
              id="gender"
              value={formData.gender}
              className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-600 text-white focus:ring-gray-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-gray-400"
              }`}
              onChange={handleChange}
            >
              <option value="">Seleccione su género</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9b9d79] dark:bg-[#b8ba96] text-white py-2 rounded-lg hover:bg-[#8a8c6a] dark:hover:bg-[#a7a985] transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registrando...
              </span>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>
      </div>

      <style jsx global>{`
        :root {
          --bg-primary: #fdf7ed;
          --text-primary: #333333;
          --text-secondary: #666666;
        }
        .dark {
          --bg-primary: #1a1a1a;
          --text-primary: #ffffff;
          --text-secondary: #cccccc;
        }
        * {
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
