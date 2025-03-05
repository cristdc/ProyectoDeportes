import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock, FaMountain, FaArrowLeft } from 'react-icons/fa';

const RaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [race, setRace] = useState(null);

  useEffect(() => {
    // Simular la obtención de datos (después vendrá de una API)
    const fetchRaceDetails = () => {
      // Aquí usaríamos los datos reales de la carrera basados en el ID
      // Por ahora, usamos datos de ejemplo
      const raceData = {
        id: 1,
        name: "Gran Fondo de Montaña",
        date: "2024-12-31",
        location: "Sierra Nevada",
        distance: 120,
        elevation: 2500,
        participants: 200,
        maxParticipants: 300,
        time: 180,
        status: "Activa",
        description: "Una emocionante carrera de montaña que te llevará por los paisajes más espectaculares de Sierra Nevada. Prepárate para un desafío único con vistas impresionantes y un recorrido técnicamente exigente.",
        requirements: [
          "Ser mayor de 18 años",
          "Certificado médico vigente",
          "Equipo de seguridad obligatorio",
          "Experiencia previa en carreras de montaña"
        ],
        checkpoints: [
          {
            name: "Salida",
            distance: 0,
            elevation: 1200,
            services: ["Agua", "Baños", "Asistencia médica"]
          },
          {
            name: "Punto de Control 1",
            distance: 30,
            elevation: 1800,
            services: ["Agua", "Isotónico", "Fruta"]
          },
          {
            name: "Punto de Control 2",
            distance: 60,
            elevation: 2200,
            services: ["Agua", "Isotónico", "Comida", "Asistencia médica"]
          },
          {
            name: "Meta",
            distance: 120,
            elevation: 1200,
            services: ["Agua", "Comida", "Asistencia médica", "Masajes"]
          }
        ],
        route: {
          difficulty: "Alta",
          surface: "Montaña",
          terrain: "Técnico"
        },
        personalStats: {
          position: 45,
          totalParticipants: 250,
          finalTime: "3h 15min",
          averageSpeed: "28.5 km/h",
          maxSpeed: "45 km/h",
          calories: "2500 kcal"
        }
      };
      setRace(raceData);
    };

    fetchRaceDetails();
  }, [id]);

  if (!race) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] mb-6"
      >
        <FaArrowLeft /> Volver
      </button>

      {/* Encabezado */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{race.name}</h1>
          <span className={`px-4 py-2 rounded-full text-sm ${
            race.status === 'Activa' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {race.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendarAlt />
            <span>{new Date(race.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt />
            <span>{race.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaUsers />
            <span>{race.participants}/{race.maxParticipants} participantes</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock />
            <span>Tiempo estimado: {race.time} min</span>
          </div>
        </div>
      </div>

      {/* Detalles principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Estadísticas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Distancia total</div>
              <div className="text-2xl font-bold text-[var(--primary)]">{race.distance} km</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Desnivel acumulado</div>
              <div className="text-2xl font-bold text-[var(--primary)]">{race.elevation} m</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Dificultad</div>
              <div className="text-2xl font-bold text-[var(--primary)]">{race.route.difficulty}</div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Descripción</h2>
          <p className="text-gray-600 mb-6">{race.description}</p>
          
          <h3 className="text-lg font-semibold mb-3">Requisitos</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {race.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Puntos de control */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Puntos de control</h2>
        <div className="space-y-6">
          {race.checkpoints.map((checkpoint, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{checkpoint.name}</h3>
                <div className="text-sm text-gray-600">Km {checkpoint.distance}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Altitud</div>
                <div className="font-semibold">{checkpoint.elevation}m</div>
              </div>
              <div className="flex-2">
                <div className="text-sm text-gray-600">Servicios</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {checkpoint.services.map((service, serviceIndex) => (
                    <span key={serviceIndex} className="px-2 py-1 bg-white rounded-full text-sm text-gray-600">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas Personales */}
      {race.personalStats && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Estadísticas Personales</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Posición</div>
              <div className="text-xl font-bold text-[var(--primary)]">
                {race.personalStats.position}º de {race.personalStats.totalParticipants}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Tiempo Final</div>
              <div className="text-xl font-bold text-[var(--primary)]">
                {race.personalStats.finalTime}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Velocidad Media</div>
              <div className="text-xl font-bold text-[var(--primary)]">
                {race.personalStats.averageSpeed}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Velocidad Máxima</div>
              <div className="text-xl font-bold text-[var(--primary)]">
                {race.personalStats.maxSpeed}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Calorías</div>
              <div className="text-xl font-bold text-[var(--primary)]">
                {race.personalStats.calories}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón de inscripción */}
      <div className="flex justify-center">
        <button className="bg-[var(--primary)] text-white py-3 px-8 rounded-lg hover:bg-[var(--accent)] transition-colors text-lg font-semibold">
          Inscribirse en la carrera
        </button>
      </div>
    </div>
  );
};

export default RaceDetails; 