const BASE_URL = 'http://192.168.50.143:3000/api';

// Función auxiliar para manejar las peticiones
// Función auxiliar para manejar las peticiones
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('userToken');
  console.log(`Usando token en fetchWithAuth:`, token); // Debug

  options.headers = options.headers || {};

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    credentials: 'include',  // Esto asegura que las cookies se envíen correctamente
    mode: 'cors'
  };  

  try {
    console.log('Haciendo petición a:', `${BASE_URL}${endpoint}`, config);
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

// API Service
export const apiService = {
  login: async (credentials) => {
    try {
      const response = await fetchWithAuth('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      console.log('Respuesta del login:', response); // Debug

      // Verificar si el token está en las cabeceras de la respuesta
      const token = response.headers.get('Authorization')?.split(' ')[1]; // Ejemplo: Bearer <token>
      if (token) {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        console.log('Token guardado en localStorage:', token); // Debug
      } else {
        console.error('Error: No se encontró el token en las cabeceras');
      }

      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },

  getUserProfile: async () => {
    return fetchWithAuth('/users/profile');
  },

  setAuthData: (token, user) => {
    console.log("Guardando en localStorage:", token, user); // 🔹 Debug
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log("Guardado en localStorage:", localStorage.getItem('userToken'), localStorage.getItem('userData'));
},


  getAuthData: () => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    return { token, user: userData ? JSON.parse(userData) : null };
  },

  // Carreras
  getAvailableRaces: async () => {
    try {
      const response = await fetchWithAuth('/races');
      return response;
    } catch (error) {
      console.error('Error obteniendo carreras:', error);
      throw error;
    }
  },

  getRaceDetails: async (id) => {
    try {
      const response = await fetchWithAuth(`/races/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo detalles de la carrera:', error);
      throw error;
    }
  },

  registerForRace: async (raceId) => {
    try {
      const response = await fetchWithAuth('/registrations', {
        method: 'POST',
        body: JSON.stringify({ raceId })
      });
      return response;
    } catch (error) {
      console.error('Error registrando en la carrera:', error);
      throw error;
    }
  },

  // Participaciones
  getParticipations: async () => {
    try {
      const response = await fetchWithAuth('/registrations');
      return response;
    } catch (error) {
      console.error('Error obteniendo participaciones:', error);
      throw error;
    }
  },

  // Perfil de usuario
  /*getUserProfile: async () => {
    try {
      const response = await fetchWithAuth('/users/profile');
      return response;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }*/
};

export default apiService;