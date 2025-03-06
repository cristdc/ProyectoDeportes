import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaRunning } from 'react-icons/fa';

export default function AvailableRaces() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await apiService.getAvailableRaces();
        console.log('Respuesta de la API:', response); // Para debug
        
        // Extraemos el array de carreras de la respuesta
        const racesData = response.races || [];
        
        setRaces(racesData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar las carreras:', err);
        setError('Error al cargar las carreras disponibles');
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Asegurarnos de que races es un array antes de filtrar
  const filteredRaces = Array.isArray(races) ? races.filter(race => {
    if (!race) return false; // Validación adicional
    const matchesSearch = race.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || race.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesDate = !dateFilter || (race.date && new Date(race.date).toLocaleDateString().includes(dateFilter));
    return matchesSearch && matchesLocation && matchesDate;
  }) : [];

  // Asegurarnos de que filteredRaces es un array antes de ordenar
  const sortedRaces = [...filteredRaces].sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'date':
        return (new Date(a.date || '') - new Date(b.date || '')) * order;
      case 'name':
        return (a.name || '').localeCompare(b.name || '') * order;
      case 'distance':
        return ((a.distance || 0) - (b.distance || 0)) * order;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando carreras disponibles...</div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Carreras Disponibles</h2>

      {/* Filtros y búsqueda */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por ubicación..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por fecha..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          <select
            className="px-4 py-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Ordenar por fecha</option>
            <option value="name">Ordenar por nombre</option>
            <option value="distance">Ordenar por distancia</option>
          </select>

          <button
            className="px-4 py-2 border rounded-lg"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Lista de carreras */}
      {sortedRaces.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No se encontraron carreras que coincidan con los filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRaces.map((race) => (
            <div key={race._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{race.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {race.location}
                  </p>
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {race.date ? new Date(race.date).toLocaleDateString() : 'Fecha no disponible'}
                  </p>
                  <p className="flex items-center">
                    <FaRunning className="mr-2" />
                    {race.distance ? `${race.distance} km` : 'Distancia no disponible'}
                  </p>
                  <p className="text-sm">
                    Participantes máximos: {race.maxParticipants || 'No especificado'}
                  </p>
                  {race.unevenness && (
                    <p className="text-sm">
                      Desnivel: {race.unevenness}m
                    </p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t">
                <Link
                  to={`/races/${race._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver detalles →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}