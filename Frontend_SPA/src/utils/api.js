export const apiRequest = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  // Añadir token de localStorage si existe
  const storedToken = localStorage.getItem("authToken");
  if (storedToken) {
    headers["Authorization"] = `Bearer ${storedToken}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // Para siempre incluir cookies
  });
};
