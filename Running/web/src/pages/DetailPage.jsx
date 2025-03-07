import { useParams, useLocation, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaMedal, FaRunning, FaMountain, FaRoute, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

const DetailPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const isHistory = state?.isHistory;

  // Datos de ejemplo - normalmente vendrían de una API
  const raceDetails = {
    id: id, 
    title: "Gran Fondo de Montaña",
    date: "31/12/2024",
    time: "08:00",
    location: "Sierra Nevada",
    distance: "120 km",
    elevation: "2500 m",
    participants: 200,
    maxParticipants: 300,
    price: "50€",
    status: "Activa",
    description: "Una emocionante carrera de montaña que recorre los paisajes más espectaculares de Sierra Nevada. Prepárate para un desafío único con vistas impresionantes y un recorrido técnico que pondrá a prueba tus habilidades.",
    requirements: [
      "Mayoría de edad",
      "Certificado médico",
      "Equipo obligatorio de montaña",
      "Experiencia previa en carreras similares"
    ],
    checkpoints: [
      { km: "0", location: "Salida - Plaza Central", services: ["Agua", "Baños", "Guardarropa"] },
      { km: "30", location: "Mirador del Valle", services: ["Agua", "Isotónico", "Fruta", "Asistencia médica"] },
      { km: "60", location: "Refugio de Montaña", services: ["Agua", "Isotónico", "Comida", "Asistencia médica", "Área de descanso"] },
      { km: "90", location: "Paso de la Sierra", services: ["Agua", "Isotónico", "Fruta"] },
      { km: "120", location: "Meta - Plaza Central", services: ["Agua", "Isotónico", "Comida", "Medalla", "Asistencia médica"] }
    ],
    // Campos específicos para el historial
    position: isHistory ? 156 : null,
    finishTime: isHistory ? "4h 25m" : null,
    pace: isHistory ? "6:15 min/km" : null,
    certificate: isHistory ? "https://example.com/certificate" : null
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Encabezado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{raceDetails.title}</h1>
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-semibold">
                  {raceDetails.status}
                </span>
              </div>
            </div>
            {!isHistory && (
              <div className="text-xl font-bold text-[var(--primary)]">
                {raceDetails.price}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="md:col-span-2 space-y-6">
            {/* Detalles básicos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Información General</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[var(--primary)]" />
                  <span>Fecha: {raceDetails.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-[var(--primary)]" />
                  <span>Hora: {raceDetails.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[var(--primary)]" />
                  <span>Ubicación: {raceDetails.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaRoute className="text-[var(--primary)]" />
                  <span>Distancia: {raceDetails.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMountain className="text-[var(--primary)]" />
                  <span>Desnivel: {raceDetails.elevation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-[var(--primary)]" />
                  <span>Participantes: {raceDetails.participants}/{raceDetails.maxParticipants}</span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">{raceDetails.description}</p>
            </div>

            {/* Puntos de control */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Puntos de Control</h2>
              <div className="space-y-4">
                {raceDetails.checkpoints.map((checkpoint, index) => (
                  <div key={index} className="border-l-4 border-[var(--primary)] pl-4">
                    <div className="font-semibold">KM {checkpoint.km} - {checkpoint.location}</div>
                    <div className="text-sm text-gray-600">
                      Servicios: {checkpoint.services.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resultados (solo en vista historial) */}
            {isHistory ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Tus Resultados</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FaMedal className="text-[var(--primary)]" />
                    <span>Posición: {raceDetails.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[var(--primary)]" />
                    <span>Tiempo: {raceDetails.finishTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRunning className="text-[var(--primary)]" />
                    <span>Ritmo: {raceDetails.pace}</span>
                  </div>
                  <a 
                    href={raceDetails.certificate}
                    className="block text-center bg-[var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[var(--accent)] transition-colors mt-4"
                  >
                    Descargar Certificado
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Inscripción</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-[var(--primary)]" />
                    <span>Precio: {raceDetails.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-[var(--primary)]" />
                    <span>Plazas disponibles: {raceDetails.maxParticipants - raceDetails.participants}</span>
                  </div>
                  <button className="w-full bg-[var(--primary)] text-white py-3 px-6 rounded-md hover:bg-[var(--accent)] transition-colors flex items-center justify-center gap-2">
                    <FaCheckCircle />
                    Inscribirse
                  </button>
                </div>
              </div>
            )}

            {/* Requisitos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Requisitos</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {raceDetails.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end gap-4">
          <Link 
            to={isHistory ? "/historial" : "/carreras-disponibles"} 
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;