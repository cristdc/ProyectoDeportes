import { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock } from 'react-icons/fa';

const AvailableRaces = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Datos de ejemplo
  const races = [
    {
      id: 1,
      name: "Gran Fondo de Mont...",
      date: "2024-12-31",
      location: "Sierra Nevada",
      distance: 120,
      elevation: 2500,
      participants: 200,
      time: 180,
      status: "Activa"
    },
    {
      id: 2,
      name: "Vuelta al Valle",
      date: "2024-11-15",
      location: "Valle Central",
      distance: 80,
      elevation: 1200,
      participants: 150,
      time: 180,
      status: "Activa"
    },
    {
      id: 3,
      name: "Desafío Costero",
      date: "2024-10-01",
      location: "Costa del Sol",
      distance: 100,
      elevation: 800,
      participants: 300,
      time: 200,
      status: "Activa"
    }
  ];

  // Lista de ubicaciones únicas para el filtro
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(races.map(race => race.location))];
    return ['Todas las ubicaciones', ...uniqueLocations];
  }, [races]);

  // Filtrar carreras
  const filteredRaces = useMemo(() => {
    return races.filter(race => {
      const matchesSearch = race.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'all' || locationFilter === 'Todas las ubicaciones' || race.location === locationFilter;
      const matchesStatus = statusFilter === 'all' || statusFilter === 'Todos los estados' || race.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [races, searchTerm, locationFilter, statusFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Carreras Disponibles</h1>
        <p className="text-gray-600 mt-2">Explora todas las carreras disponibles</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
          </select>
        </div>
      </div>

      {/* Grid de Carreras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRaces.map((race) => (
          <div key={race.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{race.name}</h3>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  {race.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>{new Date(race.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <span>{race.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <div className="text-sm text-gray-600">Tiempo clasificatorio</div>
                  <div className="font-semibold">{race.time} min</div>
                </div>
              </div>

              <button className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[var(--accent)] transition-colors">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableRaces;