import { useState, useEffect } from "react";

const Prueba = () => {
  // Estados para manejar los mensajes y respuestas
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loginResponse, setLoginResponse] = useState(null);

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerResponse, setRegisterResponse] = useState(null);

  const [cookiesError, setCookiesError] = useState("");
  const [cookiesSuccess, setCookiesSuccess] = useState("");
  const [cookiesResponse, setCookiesResponse] = useState(null);

  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileResponse, setProfileResponse] = useState(null);

  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    userData: null,
  });

  const [activeTab, setActiveTab] = useState("login");

  // Configuración de la API - utiliza una ruta relativa
  const API_URL = "/api";

  // Comprobar estado de autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Función para actualizar el estado de autenticación
  const updateAuthStatus = (isAuthenticated, userData = null) => {
    setAuthStatus({
      isAuthenticated,
      userData,
    });
  };

  // Comprobar estado de autenticación
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/users/auth-status`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.authenticated) {
        updateAuthStatus(true, { id: data.user.id, role: data.user.role });

        // Obtener más info del usuario
        try {
          const profileResponse = await fetch(`${API_URL}/users/profile`, {
            method: "GET",
            credentials: "include",
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            updateAuthStatus(true, profileData);
          }
        } catch (err) {
          console.error("Error al obtener perfil:", err);
        }
      } else {
        updateAuthStatus(false);
      }
    } catch (error) {
      console.error("Error al verificar estado de autenticación:", error);
      updateAuthStatus(false);
    }
  };

  // Login Form Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;

    setLoginError("");
    setLoginSuccess("");
    setLoginResponse(null);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setLoginSuccess("Login exitoso!");
        setLoginResponse(data);
        updateAuthStatus(true, data.user);
        e.target.reset();
      } else {
        setLoginError(`Error: ${data.message || "Credenciales incorrectas"}`);
        setLoginResponse(data);
      }
    } catch (error) {
      setLoginError(`Error: ${error.message}`);
      console.error("Login error:", error);
    }
  };

  // Register Form Handler
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.registerName.value;
    const email = e.target.registerEmail.value;
    const password = e.target.registerPassword.value;
    const gender = e.target.registerGender.value;

    setRegisterError("");
    setRegisterSuccess("");
    setRegisterResponse(null);

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, gender }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterSuccess("Registro exitoso!");
        setRegisterResponse(data);
        e.target.reset();
      } else {
        setRegisterError(
          `Error: ${data.message || "No se pudo completar el registro"}`
        );
        setRegisterResponse(data);
      }
    } catch (error) {
      setRegisterError(`Error: ${error.message}`);
      console.error("Register error:", error);
    }
  };

  // Test Cookies Button Handler
  const handleTestCookies = async () => {
    setCookiesError("");
    setCookiesSuccess("");
    setCookiesResponse(null);

    try {
      const response = await fetch(`${API_URL}/test-cookies`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      setCookiesSuccess("Prueba de cookies realizada");
      setCookiesResponse(data);
    } catch (error) {
      setCookiesError(`Error: ${error.message}`);
      console.error("Cookie test error:", error);
    }
  };

  // Get Profile Button Handler
  const handleGetProfile = async () => {
    setProfileError("");
    setProfileSuccess("");
    setProfileResponse(null);

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setProfileSuccess("Perfil obtenido correctamente");
        setProfileResponse(data);
        updateAuthStatus(true, data);
      } else {
        setProfileError(`Error: ${data.message || "No autorizado"}`);
        setProfileResponse(data);

        if (response.status === 401) {
          updateAuthStatus(false);
        }
      }
    } catch (error) {
      setProfileError(`Error: ${error.message}`);
      console.error("Profile error:", error);
    }
  };

  // Logout Button Handler
  const handleLogout = async () => {
    setProfileError("");
    setProfileSuccess("");
    setProfileResponse(null);

    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setProfileSuccess("Sesión cerrada correctamente");
        setProfileResponse(data);
        updateAuthStatus(false);
      } else {
        setProfileError(`Error: ${data.message || "Error al cerrar sesión"}`);
        setProfileResponse(data);
      }
    } catch (error) {
      setProfileError(`Error: ${error.message}`);
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Test de Autenticación API
      </h1>

      <div className="flex mb-4">
        <div
          className={`px-4 py-2 cursor-pointer rounded-t-lg mr-1 ${
            activeTab === "login"
              ? "bg-white border-b-2 border-green-500"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </div>
        <div
          className={`px-4 py-2 cursor-pointer rounded-t-lg mr-1 ${
            activeTab === "register"
              ? "bg-white border-b-2 border-green-500"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </div>
        <div
          className={`px-4 py-2 cursor-pointer rounded-t-lg mr-1 ${
            activeTab === "cookies"
              ? "bg-white border-b-2 border-green-500"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("cookies")}
        >
          Test Cookies
        </div>
        <div
          className={`px-4 py-2 cursor-pointer rounded-t-lg mr-1 ${
            activeTab === "profile"
              ? "bg-white border-b-2 border-green-500"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </div>
      </div>

      <div
        className={`p-3 mb-4 rounded-md ${
          authStatus.isAuthenticated
            ? "bg-green-100 border border-green-300"
            : "bg-red-100 border border-red-300"
        }`}
      >
        Estado:{" "}
        {authStatus.isAuthenticated
          ? `Autenticado como ${
              authStatus.userData?.name ||
              authStatus.userData?.email ||
              "Usuario"
            }`
          : "No autenticado"}
      </div>

      {/* Login Tab */}
      <div
        className={`bg-white p-6 rounded-md shadow-md mb-4 ${
          activeTab !== "login" && "hidden"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="block mb-1">
              Email:
            </label>
            <input
              type="email"
              id="loginEmail"
              name="loginEmail"
              placeholder="Email"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="block mb-1">
              Contraseña:
            </label>
            <input
              type="password"
              id="loginPassword"
              name="loginPassword"
              placeholder="Contraseña"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
          >
            Iniciar sesión
          </button>
        </form>
        {loginError && <div className="mt-2 text-red-500">{loginError}</div>}
        {loginSuccess && (
          <div className="mt-2 text-green-500">{loginSuccess}</div>
        )}
        {loginResponse && (
          <div className="mt-4">
            <h3 className="font-semibold">Respuesta API:</h3>
            <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
              {JSON.stringify(loginResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Register Tab */}
      <div
        className={`bg-white p-6 rounded-md shadow-md mb-4 ${
          activeTab !== "register" && "hidden"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Registro</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="registerName" className="block mb-1">
              Nombre:
            </label>
            <input
              type="text"
              id="registerName"
              name="registerName"
              placeholder="Nombre"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="registerEmail" className="block mb-1">
              Email:
            </label>
            <input
              type="email"
              id="registerEmail"
              name="registerEmail"
              placeholder="Email"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="registerPassword" className="block mb-1">
              Contraseña:
            </label>
            <input
              type="password"
              id="registerPassword"
              name="registerPassword"
              placeholder="Contraseña"
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="registerGender" className="block mb-1">
              Género:
            </label>
            <select
              id="registerGender"
              name="registerGender"
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
          >
            Registrarse
          </button>
        </form>
        {registerError && (
          <div className="mt-2 text-red-500">{registerError}</div>
        )}
        {registerSuccess && (
          <div className="mt-2 text-green-500">{registerSuccess}</div>
        )}
        {registerResponse && (
          <div className="mt-4">
            <h3 className="font-semibold">Respuesta API:</h3>
            <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
              {JSON.stringify(registerResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Test Cookies Tab */}
      <div
        className={`bg-white p-6 rounded-md shadow-md mb-4 ${
          activeTab !== "cookies" && "hidden"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Test de Cookies</h2>
        <button
          onClick={handleTestCookies}
          className="w-full p-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
        >
          Probar Cookies
        </button>
        {cookiesError && (
          <div className="mt-2 text-red-500">{cookiesError}</div>
        )}
        {cookiesSuccess && (
          <div className="mt-2 text-green-500">{cookiesSuccess}</div>
        )}
        {cookiesResponse && (
          <div className="mt-4">
            <h3 className="font-semibold">Respuesta API:</h3>
            <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
              {JSON.stringify(cookiesResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Profile Tab */}
      <div
        className={`bg-white p-6 rounded-md shadow-md mb-4 ${
          activeTab !== "profile" && "hidden"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Perfil de Usuario</h2>
        <button
          onClick={handleGetProfile}
          className="w-full p-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 mb-2"
        >
          Obtener Perfil
        </button>
        <button
          onClick={handleLogout}
          className="w-full p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
        {profileError && (
          <div className="mt-2 text-red-500">{profileError}</div>
        )}
        {profileSuccess && (
          <div className="mt-2 text-green-500">{profileSuccess}</div>
        )}
        {profileResponse && (
          <div className="mt-4">
            <h3 className="font-semibold">Respuesta API:</h3>
            <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
              {JSON.stringify(profileResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prueba;
