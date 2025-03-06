import { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaRunning, FaCalendarAlt, FaMountain } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Participate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Datos de ejemplo de carreras completadas
  const races = [
    {
      id: 1,
      name: "Clásica de Primavera",
      date: "2024-03-15",
      location: "Ruta del Sol",
      distance: 150,
      elevation: 3000,
      participants: 250,
      maxParticipants: 300,
      time: 300,
      status: "Completada",
      position: 45,
      finalTime: "3h 15min",
      description: "Una carrera clásica de primavera con un recorrido exigente por la Ruta del Sol.",
      requirements: [
        "Ser mayor de 18 años",
        "Certificado médico vigente",
        "Equipo de seguridad obligatorio"
      ],
      checkpoints: [
        {
          name: "Salida",
          distance: 0,
          elevation: 800,
          services: ["Agua", "Baños", "Asistencia médica"]
        },
        {
          name: "Meta",
          distance: 150,
          elevation: 800,
          services: ["Agua", "Comida", "Asistencia médica", "Masajes"]
        }
      ],
      route: {
        difficulty: "Alta",
        surface: "Asfalto",
        terrain: "Montañoso"
      },
      personalStats: {
        position: 45,
        totalParticipants: 250,
        finalTime: "3h 15min",
        averageSpeed: "28.5 km/h",
        maxSpeed: "45 km/h",
        calories: "2500 kcal"
      }
    },
    {
      id: 2,
      name: "Reto de Montaña",
      date: "2024-02-28",
      location: "Alpes Locales",
      distance: 50,
      elevation: 2200,
      participants: 180,
      maxParticipants: 200,
      time: 240,
      status: "Completada",
      position: 23,
      finalTime: "2h 45min",
      description: "Un desafiante reto de montaña con vistas espectaculares.",
      requirements: [
        "Ser mayor de 18 años",
        "Certificado médico vigente",
        "Equipo de montaña obligatorio"
      ],
      checkpoints: [
        {
          name: "Salida",
          distance: 0,
          elevation: 1200,
          services: ["Agua", "Baños"]
        },
        {
          name: "Meta",
          distance: 50,
          elevation: 2200,
          services: ["Agua", "Comida", "Asistencia médica"]
        }
      ],
      route: {
        difficulty: "Muy Alta",
        surface: "Montaña",
        terrain: "Técnico"
      },
      personalStats: {
        position: 23,
        totalParticipants: 180,
        finalTime: "2h 45min",
        averageSpeed: "18.2 km/h",
        maxSpeed: "35 km/h",
        calories: "3200 kcal"
      }
    },
    {
      id: 3,
      name: "Maratón Urbana",
      date: "2024-04-10",
      location: "Centro Ciudad",
      distance: 42,
      elevation: 100,
      participants: 500,
      time: 180,
      status: "Inactiva",
      type: "Urbana"
    }
  ];

  // Función para calcular estadísticas
  const stats = useMemo(() => {
    return {
      totalRaces: races.length,
      totalKm: races.reduce((acc, race) => acc + race.distance, 0)
    };
  }, [races]);

  // Función para filtrar y ordenar carreras
  const filteredAndSortedRaces = useMemo(() => {
    return races
      .filter(race => 
        race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(b.date) - new Date(a.date);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'distance':
            return b.distance - a.distance;
          case 'participants':
            return b.participants - a.participants;
          case 'type':
            return a.type.localeCompare(b.type);
          default:
            return 0;
        }
      });
  }, [races, searchTerm, sortBy]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Historial de Carreras</h1>
        <p className="text-gray-600 mt-2">Revisa todas las carreras completadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de Filtros */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, ubicación o tipo..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Ordenar por fecha</option>
                  <option value="name">Ordenar por nombre</option>
                  <option value="distance">Ordenar por distancia</option>
                  <option value="participants">Ordenar por participantes</option>
                  <option value="type">Ordenar por tipo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          <div className="mb-4 text-gray-600">
            {filteredAndSortedRaces.length} carreras encontradas
          </div>

          {/* Tarjetas de Carreras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAndSortedRaces.map((race) => (
              <div key={race.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{race.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm mb-2">
                        {race.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        Posición: {race.position}º
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{formatDate(race.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt />
                      <span>{race.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMountain />
                      <span>{race.type}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Distancia</div>
                      <div className="font-semibold">{race.distance} km</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Desnivel</div>
                      <div className="font-semibold">{race.elevation} m</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Participantes</div>
                      <div className="font-semibold">{race.participants}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Tiempo</div>
                      <div className="font-semibold">{race.time} min</div>
                    </div>
                  </div>

                  <Link 
                    to={`/carrera/${race.id}`}
                    state={{ isHistory: true }}
                    className="block w-full text-center py-2 bg-[#8D9B6A] text-white rounded-md hover:bg-[#738055] transition-colors"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de Estadísticas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[var(--primary)]">{stats.totalRaces}</div>
                <div className="text-sm text-gray-600">Total Carreras</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[var(--primary)]">{stats.totalKm}</div>
                <div className="text-sm text-gray-600">Km Totales</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Participate;