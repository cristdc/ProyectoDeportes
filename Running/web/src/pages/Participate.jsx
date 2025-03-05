import { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaRunning, FaCalendarAlt, FaMountain } from 'react-icons/fa';

const Participate = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Datos de ejemplo (después los conectaremos con una API/backend)
  const races = [
    {
      id: 1,
      name: "Clásica de Primavera",
      date: "2024-03-15",
      location: "Ruta del Sol",
      distance: 150,
      elevation: 3000,
      participants: 250,
      time: 300,
      status: "Inactiva",
      type: "Carretera"
    },
    {
      id: 2,
      name: "Reto de Montaña",
      date: "2024-02-28",
      location: "Alpes Locales",
      distance: 50,
      elevation: 2200,
      participants: 180,
      time: 240,
      status: "Inactiva",
      type: "Montaña"
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
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                      {race.status}
                    </span>
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

                  <button className="w-full mt-6 bg-[var(--primary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--accent)] transition-colors">
                    Ver detalles
                  </button>
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