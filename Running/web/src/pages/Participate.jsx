import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { FaMedal, FaRunning, FaClock, FaSearch, FaFilter } from 'react-icons/fa';

export default function Participate() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mantenemos los estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await apiService.getParticipations();
        console.log('Datos recibidos:', data);
        setRegistrations(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el historial:', err);
        setError('Error al cargar el historial de carreras');
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // Función de filtrado
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.raceId?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || registration.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Función de ordenamiento
  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return sortOrder === 'asc' 
          ? new Date(a.registeredAt) - new Date(b.registeredAt)
          : new Date(b.registeredAt) - new Date(a.registeredAt);
      case 'name':
        return sortOrder === 'asc'
          ? a.raceId?.name.localeCompare(b.raceId?.name)
          : b.raceId?.name.localeCompare(a.raceId?.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando historial...</div>
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
      <h2 className="text-2xl font-bold mb-6">Historial de Carreras</h2>

      {/* Controles de búsqueda y filtrado */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre de carrera..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="registered">Inscritos</option>
            <option value="finished">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Ordenar por fecha</option>
            <option value="name">Ordenar por nombre</option>
          </select>

          <button
            className="px-4 py-2 border rounded-lg"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Lista de registros */}
      {sortedRegistrations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No se encontraron registros que coincidan con los filtros</p>
          {registrations.length === 0 && (
            <Link
              to="/races"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver carreras disponibles
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRegistrations.map((registration) => (
            <div 
              key={registration._id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {registration.raceId?.name || 'Carrera no disponible'}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <FaRunning className="mr-2" />
                    Estado: {registration.status === 'finished' ? 'Completada' : 
                            registration.status === 'registered' ? 'Inscrito' : 
                            registration.status === 'cancelled' ? 'Cancelada' : 
                            registration.status}
                  </p>
                  {registration.dorsal && (
                    <p className="flex items-center">
                      <span className="mr-2">#</span>
                      Dorsal: {registration.dorsal}
                    </p>
                  )}
                  {registration.time && (
                    <p className="flex items-center">
                      <FaClock className="mr-2" />
                      Tiempo: {registration.time}
                    </p>
                  )}
                  {registration.position && (
                    <p className="flex items-center">
                      <FaMedal className="mr-2" />
                      Posición: {registration.position}º
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Fecha de inscripción: {new Date(registration.registeredAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {registration.raceId && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <Link
                    to={`/races/${registration.raceId._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver detalles de la carrera →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}