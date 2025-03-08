import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRace } from '../Context/RaceContext';

const CreateRace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRace, loading } = useRace();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sport: 'running',
    date: '',
    location: '',
    distance: '',
    maxParticipants: '',
    unevenness: '',
    tour: '',
    qualifyingTime: ''
  });

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const raceData = {
        ...formData,
        distance: parseFloat(formData.distance),
        maxParticipants: parseInt(formData.maxParticipants),
        unevenness: parseFloat(formData.unevenness)
      };

      await createRace(raceData);
      navigate('/admin/home');
    } catch (err) {
      setError(err.message || 'Error al crear la carrera');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#9b9d79] mb-6">Crear Nueva Carrera</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#9b9d79] mb-1">
                Nombre de la carrera *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                required
              />
            </div>

            <div>
              <label htmlFor="sport" className="block text-sm font-medium text-[#9b9d79] mb-1">
                Deporte *
              </label>
              <select
                id="sport"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                required
              >
                <option value="running">Running</option>
                <option value="trailRunning">Trail Running</option>
                <option value="cycling">Cycling</option>
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-[#9b9d79] mb-1">
                Fecha *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[#9b9d79] mb-1">
                Ubicación *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-[#9b9d79] mb-1">
                  Distancia (km) *
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-[#9b9d79] mb-1">
                  Participantes *
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                  required
                />
              </div>

              <div>
                <label htmlFor="unevenness" className="block text-sm font-medium text-[#9b9d79] mb-1">
                  Desnivel (m) *
                </label>
                <input
                  type="number"
                  id="unevenness"
                  name="unevenness"
                  value={formData.unevenness}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="tour" className="block text-sm font-medium text-[#9b9d79] mb-1">
                Recorrido *
              </label>
              <textarea
                id="tour"
                name="tour"
                value={formData.tour}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="qualifyingTime" className="block text-sm font-medium text-[#9b9d79] mb-1">
                Tiempo de Calificación (HH:mm:ss) *
              </label>
              <input
                type="text"
                id="qualifyingTime"
                name="qualifyingTime"
                value={formData.qualifyingTime}
                onChange={handleChange}
                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
                placeholder="00:00:00"
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link
                to="/admin/home"
                className="px-4 py-2 border border-[#9b9d79] text-[#9b9d79] rounded-lg
                         hover:bg-[#9b9d79] hover:text-white transition-all duration-1000 text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#9b9d79] text-white rounded-lg
                         hover:bg-[#6b6d54] transition-all duration-1000"
              >
                {loading ? 'Creando...' : 'Crear Carrera'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRace;