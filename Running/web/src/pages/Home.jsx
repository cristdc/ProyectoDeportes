import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaRunning, FaTrophy, FaUsers, FaRoute, FaMedal, FaCalendarAlt } from 'react-icons/fa';

const Home = () => {
  const nextRaces = [
    {
      id: 1,
      title: "Gran Fondo de Mont...",
      date: "31/12/2024",
      location: "Sierra Nevada",
      participants: 200,
    },
    {
      id: 2,
      title: "Vuelta al Valle",
      date: "15/11/2024",
      location: "Valle Central",
      participants: 150,
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Running App</h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu plataforma para descubrir y participar en las mejores carreras de running
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-[#8D9B6A] mb-2">15</div>
            <div className="text-gray-600">Carreras Totales</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-[#8D9B6A] mb-2">5</div>
            <div className="text-gray-600">Carreras Activas</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-[#8D9B6A] mb-2">10</div>
            <div className="text-gray-600">Carreras Completadas</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-[#8D9B6A] mb-2">1500</div>
            <div className="text-gray-600">Participantes</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Features */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaRoute className="text-[#8D9B6A]" />
                Próximas Carreras Destacadas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {nextRaces.map(race => (
                  <div key={race.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{race.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>{race.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkedAlt />
                        <span>{race.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>{race.participants} participantes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/carreras-disponibles"
                className="inline-block mt-4 text-[#8D9B6A] hover:underline"
              >
                Ver todas las carreras →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMedal className="text-[#8D9B6A]" />
                ¿Por qué elegirnos?
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Variedad de Carreras</h3>
                  <p className="text-gray-600">
                    Desde carreras urbanas hasta trails de montaña, encuentra la que mejor se adapte a ti.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Comunidad Activa</h3>
                  <p className="text-gray-600">
                    Únete a miles de corredores y comparte tu pasión por el running.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Seguimiento Personal</h3>
                  <p className="text-gray-600">
                    Mantén un registro de tus carreras y mejora tu rendimiento.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Eventos Certificados</h3>
                  <p className="text-gray-600">
                    Todas nuestras carreras cumplen con los estándares de calidad y seguridad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkedAlt className="text-[#8D9B6A]" />
                Mapa de Carreras
              </h2>
              <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center text-gray-500">
                Mapa de carreras
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Explora las carreras disponibles en tu zona y encuentra las más cercanas a ti.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
              <div className="space-y-3">
                <Link 
                  to="/carreras-disponibles"
                  className="block w-full py-2 px-4 bg-[#8D9B6A] text-white rounded-md hover:bg-[#738055] transition-colors text-center"
                >
                  Ver Carreras Disponibles
                </Link>
                <Link 
                  to="/historial"
                  className="block w-full py-2 px-4 bg-white border border-[#8D9B6A] text-[#8D9B6A] rounded-md hover:bg-gray-50 transition-colors text-center"
                >
                  Mi Historial
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-[#8D9B6A] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Listo para tu próxima carrera?
          </h2>
          <p className="mb-6">
            Explora todas las carreras disponibles y encuentra la que mejor se adapte a ti
          </p>
          <Link
            to="/carreras-disponibles"
            className="inline-block bg-white text-[#8D9B6A] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Explorar Carreras
          </Link>
        </div>
      </div>

      {/* Call to Action modificado */}
      <div className="bg-[var(--primary)] text-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Descubre las Próximas Carreras
        </h2>
        <p className="mb-6 text-lg">
          Explora todas las carreras disponibles y encuentra la que mejor se adapte a ti
        </p>
        <Link
          to="/carreras-disponibles"
          className="inline-block bg-white text-[var(--primary)] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
        >
          Ver carreras disponibles
        </Link>
      </div>
    </div>
  );
};

export default Home;