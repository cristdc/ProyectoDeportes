import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkedAlt, 
  FaRunning, 
  FaTrophy, 
  FaUsers, 
  FaRoute, 
  FaMedal, 
  FaCalendarAlt, 
  FaArrowRight, 
  FaMapMarkerAlt,
  FaClock,
  FaMountain,
  FaChartLine
} from 'react-icons/fa';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Nuevos colores complementarios
const colors = {
  primary: '#8D9B6A',     // Verde oliva original
  secondary: '#A8B892',   // Verde claro original
  accent1: '#D4A373',     // Marrón cálido
  accent2: '#FAEDCD',     // Beige claro
  accent3: '#CCD5AE',     // Verde sage
  dark: '#5C6744',        // Verde oscuro
  light: '#FAF6F1'        // Fondo claro original
};

const Home = () => {
  const { user } = useAuth();
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRaces: 0,
    activeRaces: 0,
    totalRunners: 0
  });

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const data = await apiService.getAvailableRaces();
        setRaces(data.races || []);
        // Simulamos algunas estadísticas
        setStats({
          totalRaces: data.races?.length || 0,
          activeRaces: data.races?.filter(race => race.status === 'open')?.length || 0,
          totalRunners: data.races?.reduce((acc, race) => acc + (race.participants || 0), 0) || 0
        });
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar las carreras:', err);
        setError('Error al cargar las carreras');
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8D9B6A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6F1] to-white">
      {/* Hero Section Mejorado */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8D9B6A] via-[#D4A373] to-[#A8B892] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/path/to/running-pattern.png')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-32">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white drop-shadow-lg">
              Descubre Tu Próxima Carrera
            </h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-white/90 px-4">
              Únete a la comunidad de running más grande y encuentra las mejores carreras para desafiarte a ti mismo.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 px-4">
              <Link
                to="/available-races"
                className="bg-white text-[#8D9B6A] px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-[#FAEDCD] transition-all transform hover:scale-105 shadow-lg text-sm md:text-base w-full md:w-auto"
              >
                Ver Carreras Disponibles
                <FaArrowRight className="ml-2 inline" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="bg-[#D4A373] text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-[#c49366] transition-all transform hover:scale-105 shadow-lg text-sm md:text-base w-full md:w-auto"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas con Nuevos Colores */}
      <div className="bg-gradient-to-b from-white to-[#FAEDCD]/30 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="transform hover:scale-105 transition-all">
              <div className="text-center p-4 md:p-8 rounded-2xl bg-gradient-to-br from-white to-[#CCD5AE]/30 shadow-lg border border-[#8D9B6A]/10">
                <div className="text-3xl md:text-4xl font-bold text-[#8D9B6A] mb-2">{stats.totalRaces}</div>
                <div className="text-sm md:text-base text-gray-600">Carreras Totales</div>
              </div>
            </div>
            <div className="transform hover:scale-105 transition-all">
              <div className="text-center p-4 md:p-8 rounded-2xl bg-gradient-to-br from-white to-[#D4A373]/20 shadow-lg border border-[#D4A373]/10">
                <div className="text-3xl md:text-4xl font-bold text-[#D4A373] mb-2">{stats.activeRaces}</div>
                <div className="text-sm md:text-base text-gray-600">Carreras Activas</div>
              </div>
            </div>
            <div className="transform hover:scale-105 transition-all">
              <div className="text-center p-4 md:p-8 rounded-2xl bg-gradient-to-br from-white to-[#8D9B6A]/20 shadow-lg border border-[#8D9B6A]/10">
                <div className="text-3xl md:text-4xl font-bold text-[#5C6744] mb-2">{stats.totalRunners}</div>
                <div className="text-sm md:text-base text-gray-600">Corredores Registrados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Próximas Carreras con Diseño Mejorado */}
      <div className="py-8 md:py-16 bg-gradient-to-b from-[#FAEDCD]/30 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5C6744] mb-3 md:mb-4">Próximas Carreras Destacadas</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Descubre las carreras más emocionantes que están por venir y prepárate para tu próximo desafío
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {races.slice(0, 6).map((race) => (
              <Link
                key={race._id}
                to={`/races/${race._id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                  {/* Cabecera con gradiente mejorado */}
                  <div className="h-32 md:h-48 bg-gradient-to-r from-[#8D9B6A] via-[#CCD5AE] to-[#D4A373] relative">
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm bg-white/90 text-[#5C6744] font-medium shadow-md">
                        {new Date(race.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-[#5C6744] mb-3 group-hover:text-[#D4A373] transition-colors">
                      {race.name}
                    </h3>
                    
                    <div className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600">
                      <div className="flex items-center p-2 rounded-lg bg-[#FAEDCD]/30 group-hover:bg-[#FAEDCD]/50 transition-colors">
                        <FaMapMarkerAlt className="text-[#D4A373] mr-2" />
                        <span>{race.location}</span>
                      </div>
                      <div className="flex items-center p-2 rounded-lg bg-[#CCD5AE]/30 group-hover:bg-[#CCD5AE]/50 transition-colors">
                        <FaRoute className="text-[#8D9B6A] mr-2" />
                        <span>{race.distance} km</span>
                      </div>
                      <div className="flex items-center p-2 rounded-lg bg-[#FAEDCD]/30 group-hover:bg-[#FAEDCD]/50 transition-colors">
                        <FaMountain className="text-[#D4A373] mr-2" />
                        <span>{race.unevenness} m desnivel</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#CCD5AE]/30">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-[#5C6744]">
                          <FaUsers className="mr-2" />
                          <span>{race.maxParticipants} participantes</span>
                        </div>
                        <span className="text-[#D4A373] font-medium group-hover:translate-x-2 transition-transform inline-flex items-center">
                          Ver detalles
                          <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {races.length > 6 && (
            <div className="text-center mt-8 md:mt-12">
              <Link
                to="/available-races"
                className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#8D9B6A] to-[#D4A373] text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                Ver todas las carreras
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Características Mejorada */}
      <div className="bg-gradient-to-b from-white to-[#FAEDCD]/30 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5C6744] mb-3 md:mb-4">¿Por qué elegirnos?</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Descubre las ventajas de usar nuestra plataforma para gestionar tus carreras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                icon: FaRoute,
                title: "Rutas Verificadas",
                description: "Todas nuestras rutas están verificadas y medidas con precisión",
                color: "#8D9B6A",
                bgColor: "#CCD5AE"
              },
              {
                icon: FaChartLine,
                title: "Seguimiento en Vivo",
                description: "Monitorea tu progreso y comparte tus logros en tiempo real",
                color: "#D4A373",
                bgColor: "#FAEDCD"
              },
              {
                icon: FaUsers,
                title: "Comunidad Activa",
                description: "Únete a una comunidad apasionada por el running",
                color: "#5C6744",
                bgColor: "#CCD5AE"
              }
            ].map((feature, index) => (
              <div key={index} className="transform hover:scale-105 transition-all duration-300">
                <div className="text-center p-4 md:p-8 rounded-2xl bg-white shadow-lg border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                       style={{ background: `linear-gradient(135deg, ${feature.bgColor}40, ${feature.bgColor}20)` }}>
                    <feature.icon className="text-3xl" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#5C6744] mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final Mejorado */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8D9B6A] via-[#D4A373] to-[#A8B892]"></div>
        <div className="absolute inset-0 bg-[url('/path/to/pattern.png')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">¿Listo para empezar?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            No esperes más para unirte a la comunidad running más grande
          </p>
          <Link
            to="/available-races"
            className="inline-flex items-center px-8 py-4 bg-white text-[#5C6744] rounded-full font-semibold hover:bg-[#FAEDCD] transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Explorar Carreras
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;