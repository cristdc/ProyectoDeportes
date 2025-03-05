import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock } from 'react-icons/fa';

const AvailableRaces = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('Todas las ubicaciones');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');

  // Datos de ejemplo
  const races = [
    {
      id: 1,
      title: "Gran Fondo de Mont...",
      date: "31/12/2024",
      location: "Sierra Nevada",
      distance: "120 km",
      elevation: "2500 m",
      participants: "200",
      timeLimit: "180 min",
      status: "Activa"
    },
    {
      id: 2,
      title: "Vuelta al Valle",
      date: "15/11/2024",
      location: "Valle Central",
      distance: "80 km",
      elevation: "1200 m",
      participants: "150",
      timeLimit: "180 min",
      status: "Activa"
    },
    {
      id: 3,
      title: "Desafío Costero",
      date: "01/10/2024",
      location: "Costa del Sol",
      distance: "100 km",
      elevation: "800 m",
      participants: "300",
      timeLimit: "200 min",
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
      const matchesSearch = race.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter === 'all' || locationFilter === 'Todas las ubicaciones' || race.location === locationFilter;
      const matchesStatus = statusFilter === 'all' || statusFilter === 'Todos los estados' || race.status === statusFilter;
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [races, searchTerm, locationFilter, statusFilter]);

  // Función para manejar el clic en "Ver detalles"
  const handleViewDetails = (raceId) => {
    navigate(`/carrera/${raceId}`);
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Carreras Disponibles</h1>
          <p className="text-gray-600">Explora todas las carreras disponibles</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[var(--primary)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[var(--primary)]"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Todas las ubicaciones</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[var(--primary)]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>
        </div>

        {/* Lista de carreras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race) => (
            <div key={race.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{race.title}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    {race.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    {race.date}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2" />
                    {race.location}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-gray-600">Distancia</div>
                    <div className="font-bold">{race.distance}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Desnivel</div>
                    <div className="font-bold">{race.elevation}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Participantes</div>
                    <div className="font-bold">{race.participants}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Tiempo clasificatorio</div>
                    <div className="font-bold">{race.timeLimit}</div>
                  </div>
                </div>

                <Link
                  to={`/carrera/${race.id}`}
                  state={{ isHistory: false }}
                  className="block w-full text-center py-2 bg-[#8D9B6A] text-white rounded-md hover:bg-[#738055] transition-colors"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableRaces;