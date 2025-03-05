import { FaRunning, FaMapMarkedAlt, FaMedal } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="content-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Running App</h1>
        <p className="hero-subtitle">Tu plataforma para descubrir y participar en las mejores carreras de running</p>
      </div>

      {/* Featured Race Card */}
      <div className="featured-race-card">
        <div className="race-image-container">
          <FaMapMarkedAlt className="placeholder-icon" />
        </div>
        <div className="race-info">
          <div className="race-status">No disponible</div>
          <div className="race-details">
            <p><FaMapMarkedAlt className="detail-icon" /> Ubicación no disponible</p>
            <p><FaRunning className="detail-icon" /> Fecha no disponible</p>
            <div className="race-stats">
              <div>
                <span>Distancia</span>
                <span>-- km</span>
              </div>
              <div>
                <span>Desnivel</span>
                <span>-- m</span>
              </div>
            </div>
            <div className="race-actions">
              <button className="btn-details">Ver Detalles</button>
              <button className="btn-all">Ver Todas</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaRunning />
          </div>
          <div className="stat-info">
            <span className="stat-number">0</span>
            <span className="stat-label">Carreras Totales</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaMapMarkedAlt />
          </div>
          <div className="stat-info">
            <span className="stat-number">0</span>
            <span className="stat-label">Carreras Activas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaMedal />
          </div>
          <div className="stat-info">
            <span className="stat-number">0</span>
            <span className="stat-label">Carreras Completadas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;