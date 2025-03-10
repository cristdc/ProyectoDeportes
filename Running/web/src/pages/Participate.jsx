import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaMedal, FaRunning, FaClock, FaTimes, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { PuffLoader } from 'react-spinners';

export default function Participate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    sport: '',
    date: '',
    search: ''
  });

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.getParticipations();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Error al cargar las participaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  // Prevenir el comportamiento por defecto del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para navegar a los detalles de la carrera
  const handleViewRaceDetails = (raceId) => {
    navigate(`/races/${raceId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'registered':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">Inscrito</span>;
      case 'finished':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Completada</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">Cancelada</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center">
        <PuffLoader color="#8D9B6A" size={60} />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-[#FAF6F1] to-white py-8"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header con animación */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-[#8D9B6A] to-[#D4A373] rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold mb-3 flex items-center">
                <FaRunning className="mr-4 text-2xl" />
                Mi Historial de Participaciones
              </h1>
              <p className="text-white/80">
                Consulta y gestiona tus inscripciones en carreras
              </p>
            </div>
          </motion.div>

          {/* Panel de filtros mejorado */}
          <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-[#5C6744] flex items-center">
                <FaFilter className="mr-2 text-[#8D9B6A]" />
                Filtros de búsqueda
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Búsqueda */}
                <div>
                  <label className="block text-sm font-medium text-[#5C6744] mb-2">
                    Buscar carrera
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Nombre de la carrera..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-[#CCD5AE] rounded-xl focus:ring-2 focus:ring-[#8D9B6A] focus:border-[#8D9B6A] transition-all placeholder-gray-400"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D9B6A]" />
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-[#5C6744] mb-2">Estado</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full py-3 px-4 border-2 border-[#CCD5AE] rounded-xl focus:ring-2 focus:ring-[#8D9B6A] focus:border-[#8D9B6A] transition-all appearance-none bg-white"
                    >
                      <option value="">Todos los estados</option>
                      <option value="registered">Inscrito</option>
                      <option value="finished">Completada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-[#8D9B6A]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Deporte */}
                <div>
                  <label className="block text-sm font-medium text-[#5C6744] mb-2">Deporte</label>
                  <div className="relative">
                    <select
                      name="sport"
                      value={filters.sport}
                      onChange={handleFilterChange}
                      className="w-full py-3 px-4 border-2 border-[#CCD5AE] rounded-xl focus:ring-2 focus:ring-[#8D9B6A] focus:border-[#8D9B6A] transition-all appearance-none bg-white"
                    >
                      <option value="">Todos los deportes</option>
                      <option value="running">Running</option>
                      <option value="cycling">Ciclismo</option>
                      <option value="swimming">Natación</option>
                      <option value="triathlon">Triatlón</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-[#8D9B6A]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-[#5C6744] mb-2">Fecha</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className="w-full py-3 px-4 border-2 border-[#CCD5AE] rounded-xl focus:ring-2 focus:ring-[#8D9B6A] focus:border-[#8D9B6A] transition-all"
                    />
                    <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D9B6A]" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Lista de participaciones con animaciones */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {registrations.map((registration, index) => (
              <motion.div
                key={registration._id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center mb-4">
                          {getStatusBadge(registration.status)}
                          <span className="ml-3 text-sm text-[#8D9B6A] bg-[#F3E9D9] px-3 py-1 rounded-full">
                            Dorsal: {registration.dorsal || 'No asignado'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#5C6744] mb-3 group-hover:text-[#8D9B6A] transition-colors">
                          {registration.race.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-[#8D9B6A] flex items-center">
                              <FaCalendarAlt className="mr-2" />
                              {new Date(registration.race.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-gray-600 flex items-center">
                              <FaMapMarkerAlt className="mr-2 text-[#D4A373]" />
                              {registration.race.location}
                            </p>
                          </div>
                          {(registration.time || registration.position) && (
                            <div className="space-y-2">
                              {registration.time && (
                                <p className="text-gray-600 flex items-center">
                                  <FaClock className="mr-2 text-[#D4A373]" />
                                  Tiempo: {registration.time}
                                </p>
                              )}
                              {registration.position && (
                                <p className="text-gray-600 flex items-center">
                                  <FaMedal className="mr-2 text-[#D4A373]" />
                                  Posición: {registration.position}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewRaceDetails(registration.race._id)}
                        className="flex items-center px-6 py-3 text-white bg-[#8D9B6A] rounded-xl hover:bg-[#7A8759] transition-all duration-300 shadow-sm hover:shadow group-hover:scale-105"
                      >
                        <FaEye className="mr-2" />
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mensaje de no participaciones con animación */}
          {registrations.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">
                Aún no te has inscrito en ninguna carrera
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}