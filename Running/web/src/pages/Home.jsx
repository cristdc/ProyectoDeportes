import { FaRunning, FaMapMarkedAlt, FaTrophy, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  // Datos de ejemplo para las estadísticas
  const stats = {
    totalRaces: 15,
    activeRaces: 5,
    completedRaces: 10,
    totalParticipants: 1500
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section más compacto */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a Running App
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre las mejores carreras y compite con corredores de todo el mundo
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-[var(--primary)] text-3xl font-bold mb-2">
            {stats.totalRaces}
          </div>
          <div className="text-gray-600">Carreras Totales</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-[var(--primary)] text-3xl font-bold mb-2">
            {stats.activeRaces}
          </div>
          <div className="text-gray-600">Carreras Activas</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-[var(--primary)] text-3xl font-bold mb-2">
            {stats.completedRaces}
          </div>
          <div className="text-gray-600">Carreras Completadas</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-[var(--primary)] text-3xl font-bold mb-2">
            {stats.totalParticipants}
          </div>
          <div className="text-gray-600">Participantes</div>
        </div>
      </div>

      {/* Mapa y Características en grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Mapa más compacto */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaMapMarkedAlt className="text-[var(--primary)]" />
              Próximas Carreras
            </h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg">
              {/* Aquí iría el componente del mapa */}
              <div className="flex items-center justify-center h-[300px] bg-gray-50 text-gray-400">
                Mapa de carreras
              </div>
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaRunning className="text-[var(--primary)]" />
              Participa en Carreras
            </h3>
            <p className="text-gray-600 mb-4">
              Encuentra y participa en las mejores carreras de running organizadas en tu zona.
            </p>
            <Link
              to="/carreras-disponibles"
              className="inline-block bg-[var(--primary)] text-white px-6 py-2 rounded-md hover:bg-[var(--accent)] transition-colors"
            >
              Ver carreras disponibles
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaTrophy className="text-[var(--primary)]" />
              Historial de Carreras
            </h3>
            <p className="text-gray-600 mb-4">
              Consulta tus tiempos, posiciones y estadísticas de todas tus carreras completadas.
            </p>
            <Link
              to="/historial"
              className="inline-block bg-[var(--primary)] text-white px-6 py-2 rounded-md hover:bg-[var(--accent)] transition-colors"
            >
              Ver mi historial
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUserCircle className="text-[var(--primary)]" />
              Mi Perfil
            </h3>
            <p className="text-gray-600 mb-4">
              Gestiona tu perfil, revisa tus inscripciones y actualiza tus datos personales.
            </p>
            <Link
              to="/perfil"
              className="inline-block bg-[var(--primary)] text-white px-6 py-2 rounded-md hover:bg-[var(--accent)] transition-colors"
            >
              Ir a mi perfil
            </Link>
          </div>
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