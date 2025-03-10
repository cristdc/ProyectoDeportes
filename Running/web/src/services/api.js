const BASE_URL = 'http://localhost:3000/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Función auxiliar para manejar las peticiones
const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
    const token = localStorage.getItem('userToken');

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    };

    console.log('Fetching URL:', url); // Para debug
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // Para métodos que no devuelven datos (como DELETE)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

// Añadir una nueva función para gestionar el estado de inscripciones en localStorage
const updateLocalRegistrations = (raceId, isRegistered) => {
  try {
    let registrations = JSON.parse(localStorage.getItem('userRegistrations')) || {};
    if (isRegistered) {
      registrations[raceId] = true;
    } else {
      delete registrations[raceId];
    }
    localStorage.setItem('userRegistrations', JSON.stringify(registrations));
  } catch (error) {
    console.error('Error updating local registrations:', error);
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
      
      // Guardar datos de usuario y token en localStorage
      if (response.token) {
        localStorage.setItem('userToken', response.token);
        // Asegurarnos de guardar el usuario completo
        localStorage.setItem('user', JSON.stringify(response.user));
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
      
      if (response) {
        updateLocalRegistrations(raceId, true);
        return { 
          success: true, 
          isRegistered: true,
          message: 'Inscripción realizada con éxito' 
        };
      }

      throw new Error('Error en la inscripción');
    } catch (error) {
      console.error('Error registering for race:', error);
      if (error.message?.toLowerCase().includes('ya está inscrito')) {
        updateLocalRegistrations(raceId, true);
        return { 
          success: false, 
          isRegistered: true, 
          message: 'Ya estás inscrito en esta carrera' 
        };
      }
      return {
        success: false,
        isRegistered: false,
        message: error.message || 'Error al realizar la inscripción'
      };
    }
  },

  // Participaciones
  getParticipations: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const data = await fetchWithAuth(`/registrations/${user._id}`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error getting participations:', error);
      return [];
    }
  },

  // Perfil de usuario
  getUserProfile: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getUserProfile:', error);
      throw error;
    }
  },

  // Añadir estos métodos al servicio API
  downloadRaceGPX: async (raceId) => {
    const response = await fetch(`${BASE_URL}/races/${raceId}/gpx`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al descargar el archivo GPX');
    }
    
    return response.blob();
  },

  checkRegistrationStatus: async (raceId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const registrations = await fetchWithAuth(`/registrations/${user._id}`);
      
      const isRegistered = Array.isArray(registrations) && registrations.some(reg => 
        reg.raceId === raceId && reg.status === 'registered'
      );
      
      updateLocalRegistrations(raceId, isRegistered);
      return { isRegistered };
    } catch (error) {
      console.error('Error checking registration status:', error);
      return { isRegistered: false };
    }
  },

  // Método corregido para obtener el ID de inscripción
  getRegistrationId: async (raceId) => {
    try {
      const response = await fetchWithAuth('/registrations');
      const data = await response.json();
      
      // Asegurarnos de que tenemos un array de inscripciones
      const registrations = Array.isArray(data) ? data : 
                          Array.isArray(data.registrations) ? data.registrations : [];
      
      // Buscar la inscripción activa para esta carrera
      const registration = registrations.find(reg => 
        reg.race._id === raceId && reg.status === 'registered'
      );
      
      if (!registration) {
        throw new Error('No se encontró una inscripción activa para esta carrera');
      }
      
      return registration._id;
    } catch (error) {
      console.error('Error getting registration ID:', error);
      throw error;
    }
  },

  unregisterFromRace: async (registrationId) => {
    try {
      const response = await fetchWithAuth(`/registrations/${registrationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response) {
        return {
          success: true,
          isRegistered: false,
          message: 'Inscripción cancelada con éxito'
        };
      }

      throw new Error('Error al cancelar la inscripción');
    } catch (error) {
      console.error('Error unregistering from race:', error);
      return {
        success: false,
        isRegistered: true,
        message: error.message || 'Error al cancelar la inscripción'
      };
    }
  },

  downloadGpxFile: async (raceId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/races/${raceId}/gpx`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al descargar el archivo GPX');
      }

      return response.blob();
    } catch (error) {
      throw error;
    }
  },

  getUserStats: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las estadísticas del usuario');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  // Actualizar el perfil del usuario
  updateUserProfile: async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateUserProfile:', error);
      throw error;
    }
  },

  // Añadir esta función auxiliar para verificar la autenticación
  checkAuth: () => {
    const token = localStorage.getItem('userToken');
    const user = localStorage.getItem('user');
    return {
      isAuthenticated: !!token && !!user,
      token,
      user: user ? JSON.parse(user) : null
    };
  },

  getUserRegistrations: async () => {
    try {
      const data = await fetchWithAuth('/registrations/user');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error getting user registrations:', error);
      return [];
    }
  },

  toggleRaceRegistration: async (raceId) => {
    try {
      // Simplificamos la lógica para evitar múltiples llamadas a la API
      const response = await fetchWithAuth(`/registrations/${raceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Si la respuesta es exitosa, actualizamos el estado local
      if (response) {
        const isRegistered = response.status === 'registered';
        updateLocalRegistrations(raceId, isRegistered);
        
        return {
          success: true,
          isRegistered: isRegistered,
          message: isRegistered ? 
            'Inscripción realizada con éxito' : 
            'Inscripción cancelada con éxito'
        };
      }

      throw new Error('Error en la respuesta del servidor');
    } catch (error) {
      console.error('Error en toggleRaceRegistration:', error);
      return {
        success: false,
        isRegistered: null,
        message: error.message || 'Error al procesar la inscripción'
      };
    }
  },
};