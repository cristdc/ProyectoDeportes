import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaRunning, 
  FaUsers, 
  FaMountain,
  FaClock, 
  FaDownload, 
  FaMapMarked,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaRoute,
  FaArrowRight,
  FaExclamationTriangle,
  FaUserCheck,
  FaUserMinus,
  FaUserPlus,
  FaUser
} from 'react-icons/fa';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PuffLoader } from 'react-spinners';

// Coordenadas por defecto (Madrid)
const DEFAULT_COORDINATES = [40.4168, -3.7038];

// Componente del mapa separado para mejor manejo
const RaceMap = ({ coordinates, location }) => {
  // Usar coordenadas proporcionadas o las predeterminadas
  const position = coordinates?.length === 2 ? coordinates : DEFAULT_COORDINATES;

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          <div className="text-center">
            <strong>Punto de inicio</strong>
            <p>{location}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

// Función para generar un recorrido GPX ficticio alrededor del punto de inicio
const generateGPXRoute = (centerPoint, raceName, distance = 5) => {
  const [lat, lng] = centerPoint;
  const date = new Date().toISOString();
  const points = [];
  
  // Crear un recorrido circular
  const numPoints = 100;
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radius = (distance / 20) / 111; // Convertir km a grados aproximadamente
    
    const newLat = lat + Math.sin(angle) * radius;
    const newLng = lng + Math.cos(angle) * radius;
    
    points.push(`
      <trkpt lat="${newLat}" lon="${newLng}">
        <ele>100</ele>
        <time>${date}</time>
      </trkpt>
    `);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Running App" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${raceName}</name>
    <time>${date}</time>
  </metadata>
  <trk>
    <name>${raceName}</name>
    <trkseg>
      ${points.join('')}
    </trkseg>
  </trk>
</gpx>`;
};

// Función para descargar el archivo GPX
const downloadGPXFile = (gpxContent, fileName) => {
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function RaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState(null);
  const [gpxTrack, setGpxTrack] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadRaceDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar detalles de la carrera
        const raceData = await apiService.getRaceDetails(id);
        setRace(raceData);

        // Si hay usuario autenticado, verificar inscripciones
        if (user) {
          const registrations = await apiService.getUserRegistrations();
          const isUserRegistered = registrations.some(
            reg => reg.race._id === id && reg.status === 'registered'
          );
          setIsRegistered(isUserRegistered);
        }
      } catch (err) {
        console.error('Error loading race details:', err);
        setError('Error al cargar los detalles de la carrera');
      } finally {
        setLoading(false);
      }
    };

    loadRaceDetails();
  }, [id, user]);

  const handleRegistrationToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      if (isRegistered) {
        // Si está registrado, primero obtenemos las inscripciones para encontrar el ID
        const registrations = await apiService.getParticipations();
        const registration = registrations.find(reg => 
          reg.raceId === id && reg.status === 'registered'
        );

        if (registration) {
          const response = await apiService.unregisterFromRace(registration._id);
          if (response.success) {
            setIsRegistered(false);
            setMessage('Inscripción cancelada con éxito');
          } else {
            setError(response.message);
          }
        } else {
          setError('No se encontró la inscripción activa');
        }
      } else {
        // Si no está registrado, crear nueva inscripción
        const response = await apiService.registerForRace(id);
        if (response.success) {
          setIsRegistered(true);
          setMessage('Inscripción realizada con éxito');
        } else {
          setError(response.message);
        }
      }
    } catch (err) {
      console.error('Error en la operación:', err);
      setError(err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGPX = async () => {
    if (!race || isDownloading) return;

    try {
      setIsDownloading(true);
      setError(null);

      const coordinates = race.coordinates || DEFAULT_COORDINATES;
      const gpxContent = generateGPXRoute(
        coordinates,
        race.name,
        race.distance || 5
      );
      const fileName = `${race.name.toLowerCase().replace(/\s+/g, '-')}-route.gpx`;

      await downloadGPXFile(gpxContent, fileName);
    } catch (error) {
      console.error('Error al generar el archivo GPX:', error);
      setError('Error al generar el archivo GPX');
    } finally {
      setIsDownloading(false);
    }
  };

  const renderRegistrationButton = () => {
    if (!user) {
      return (
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 px-6 bg-[#8D9B6A] text-white rounded-xl hover:bg-[#7A8759] transition-all flex items-center justify-center"
        >
          <FaUser className="mr-2" />
          Inicia sesión para inscribirte
        </button>
      );
    }

    if (loading) {
      return (
        <button
          disabled
          className="w-full py-3 px-6 bg-gray-400 text-white rounded-xl flex items-center justify-center"
        >
          <div className="animate-spin mr-2">⌛</div>
          Procesando...
        </button>
      );
    }

    return (
      <button
        onClick={handleRegistrationToggle}
        className={`w-full py-3 px-6 rounded-xl flex items-center justify-center transition-all
          ${isRegistered 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-[#8D9B6A] text-white hover:bg-[#7A8759]'
          }`}
      >
        {isRegistered ? (
          <>
            <FaUserMinus className="mr-2" />
            Cancelar inscripción
          </>
        ) : (
          <>
            <FaUserPlus className="mr-2" />
            Inscribirme en la carrera
          </>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center">
        <PuffLoader color="#8D9B6A" size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF6F1] to-white flex items-center justify-center">
        <div className="text-xl text-red-600 bg-red-50 p-6 rounded-xl shadow-sm">
          <FaExclamationTriangle className="inline-block mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!race) return null;

  // En la sección del mapa:
  const renderMap = () => (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-[#8D9B6A]" />
        Recorrido de la carrera
      </h2>
      
      <div className="w-full rounded-xl overflow-hidden shadow-sm">
        <RaceMap 
          coordinates={race.coordinates} 
          location={race.location}
        />
      </div>

      <button
        onClick={handleDownloadGPX}
        disabled={isDownloading}
        className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
          isDownloading 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-[#F3E9D9] text-[#8D9B6A] hover:bg-[#EAD5B7]'
        }`}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin mr-2">⌛</div>
            Generando archivo...
          </>
        ) : (
          <>
            <FaDownload className="mr-2" />
            Descargar recorrido (GPX)
          </>
        )}
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#FAF6F1] to-white py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-[#8D9B6A] via-[#CCD5AE] to-[#D4A373] px-8 py-12 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h1 className="text-4xl font-bold text-white mb-4">{race.name}</h1>
              <div className="flex items-center text-white/90 text-lg">
                <FaMapMarkerAlt className="mr-2" />
                <span>{race.location}</span>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-8"
          >
            {/* Estado de la carrera */}
            <div className="mb-8">
              <div className={`inline-flex items-center px-6 py-3 rounded-full font-medium text-lg
                ${race.status === 'open' ? 'bg-[#CCD5AE]/30 text-[#5C6744]' :
                 race.status === 'closed' ? 'bg-[#FAEDCD]/30 text-[#D4A373]' :
                 'bg-gray-100 text-gray-600'}`}>
                {race.status === 'open' ? <FaCheckCircle className="mr-2" /> :
                 race.status === 'closed' ? <FaTimesCircle className="mr-2" /> :
                 <FaInfoCircle className="mr-2" />}
                {race.status === 'open' ? 'Inscripciones abiertas' :
                 race.status === 'closed' ? 'Inscripciones cerradas' :
                 race.status === 'finished' ? 'Carrera finalizada' : race.status}
              </div>
            </div>

            {/* Grid de detalles */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-[#FAEDCD]/30 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center text-[#D4A373] mb-3">
                  <FaCalendarAlt className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Fecha y Hora</h3>
                </div>
                <p className="text-gray-700 text-lg">
                  {new Date(race.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="bg-[#CCD5AE]/30 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center text-[#8D9B6A] mb-3">
                  <FaRoute className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Distancia</h3>
                </div>
                <p className="text-gray-700 text-lg">{race.distance} kilómetros</p>
              </div>

              <div className="bg-[#FAEDCD]/30 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center text-[#D4A373] mb-3">
                  <FaUsers className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Participantes</h3>
                </div>
                <p className="text-gray-700 text-lg">Máximo {race.maxParticipants}</p>
              </div>

              <div className="bg-[#CCD5AE]/30 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center text-[#8D9B6A] mb-3">
                  <FaMountain className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Desnivel</h3>
                </div>
                <p className="text-gray-700 text-lg">{race.unevenness} metros</p>
              </div>

              <div className="bg-[#FAEDCD]/30 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center text-[#D4A373] mb-3">
                  <FaClock className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Tiempo clasificatorio</h3>
                </div>
                <p className="text-gray-700 text-lg">{race.qualifyingTime}</p>
              </div>

              <div className="bg-[#CCD5AE]/30 rounded-2xl p-6 transform hover:scale-105 transition-transform">
                <div className="flex items-center text-[#8D9B6A] mb-3">
                  <FaTrophy className="text-2xl mr-3" />
                  <h3 className="text-lg font-semibold">Categoría</h3>
                </div>
                <p className="text-gray-700 text-lg">{race.category || 'General'}</p>
              </div>
            </motion.div>

            {/* Mensajes de estado */}
            {message && (
              <div className="mb-4 p-4 bg-green-100 text-green-600 rounded-xl">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-xl">
                {error}
              </div>
            )}

            {/* Botón de inscripción */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8"
            >
              <div className="max-w-4xl mx-auto px-4">
                {renderRegistrationButton()}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Renderizar el mapa */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {renderMap()}
        </motion.div>

        {/* Descripción */}
        {race.description && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#5C6744] mb-6 flex items-center">
              <FaInfoCircle className="mr-3 text-[#8D9B6A]" />
              Descripción de la carrera
            </h2>
            <div className="prose max-w-none text-gray-600">
              <p className="whitespace-pre-line text-lg leading-relaxed">{race.description}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 
