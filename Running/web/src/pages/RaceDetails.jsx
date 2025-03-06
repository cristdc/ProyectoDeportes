import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaRunning, FaUsers, FaMountain, FaClock } from 'react-icons/fa';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchRaceDetails = async () => {
      try {
        console.log('Fetching race details for ID:', id); // Debug
        const data = await apiService.getRaceDetails(id);
        console.log('Race details received:', data); // Debug
        setRace(data);
      } catch (err) {
        console.error('Error fetching race details:', err);
        setError('No se pudieron cargar los detalles de la carrera');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRaceDetails();
    }
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      await apiService.registerForRace(id);
      navigate('/historial');
    } catch (err) {
      console.error('Error registering for race:', err);
      setError('Error al registrarse en la carrera');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando detalles de la carrera...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Carrera no encontrada</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">{race.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-3 text-blue-600" />
                <span className="font-medium">Ubicación:</span>
                <span className="ml-2">{race.location}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-3 text-blue-600" />
                <span className="font-medium">Fecha:</span>
                <span className="ml-2">{new Date(race.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaRunning className="mr-3 text-blue-600" />
                <span className="font-medium">Distancia:</span>
                <span className="ml-2">{race.distance} km</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaUsers className="mr-3 text-blue-600" />
                <span className="font-medium">Participantes:</span>
                <span className="ml-2">Máximo {race.maxParticipants}</span>
              </div>

              {race.unevenness && (
                <div className="flex items-center text-gray-600">
                  <FaMountain className="mr-3 text-blue-600" />
                  <span className="font-medium">Desnivel:</span>
                  <span className="ml-2">{race.unevenness} metros</span>
                </div>
              )}

              {race.qualifyingTime && (
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-3 text-blue-600" />
                  <span className="font-medium">Tiempo clasificatorio:</span>
                  <span className="ml-2">{race.qualifyingTime}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Estado de la carrera</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                  race.status === 'open' ? 'bg-green-100 text-green-800' :
                  race.status === 'closed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  <span className="text-sm font-medium">
                    {race.status === 'open' ? 'Inscripciones abiertas' :
                     race.status === 'closed' ? 'Inscripciones cerradas' :
                     race.status === 'finished' ? 'Carrera finalizada' :
                     race.status}
                  </span>
                </div>
              </div>

              {race.status === 'open' && (
                <div className="mt-6">
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                             transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {registering ? 'Procesando inscripción...' : 'Inscribirse en la carrera'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 