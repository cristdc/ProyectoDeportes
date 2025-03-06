const BASE_URL = 'http://192.168.50.143:3000/api';

// Función auxiliar para manejar las peticiones
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('userToken');
  
  // Asegurarnos de que options.headers existe
  options.headers = options.headers || {};
  
  // Configuración base para todas las peticiones
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Solo añadir el token si existe
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    // Añadir credentials para manejar cookies si el servidor las usa
    credentials: 'include',
    mode: 'cors'
  };

  try {
    console.log('Haciendo petición a:', `${BASE_URL}${endpoint}`, config); // Debug
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Log para debug
    console.log('Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Si la respuesta no es ok, intentamos obtener el mensaje de error
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Error HTTP: ${response.status}`;
      } catch (e) {
        errorMessage = `Error HTTP: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Datos recibidos:', data); // Debug
    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

// API Service
export const apiService = {
  // Autenticación
  login: async (credentials) => {
    try {
      const response = await fetchWithAuth('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      // Guardar datos de usuario en localStorage
      if (response.token) {
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
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
  getUserProfile: async () => {
    try {
      const response = await fetchWithAuth('/users/profile');
      return response;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }
};

export default apiService;