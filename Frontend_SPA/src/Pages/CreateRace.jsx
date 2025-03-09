import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRace } from "../Context/RaceContext";
import { apiRequest } from "../utils/api";

const CreateRace = () => {
  const navigate = useNavigate();
  const { createRace } = useRace();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sport: "running",
    date: "",
    location: "",
    distance: "",
    maxParticipants: "",
    unevenness: "",
    tour: "",
    qualifyingTime: "00:00:00",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createRace(formData);
      navigate("/admin/home");
    } catch (err) {
      setError(err.message || "Error al crear la carrera");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Crear Nueva Carrera
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre de la carrera
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                />
              </div>

              <div>
                <label
                  htmlFor="sport"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deporte
                </label>
                <select
                  name="sport"
                  id="sport"
                  required
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                >
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="trailRunning">Trail Running</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ubicación
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                />
              </div>

              <div>
                <label
                  htmlFor="distance"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Distancia (km)
                </label>
                <input
                  type="number"
                  name="distance"
                  id="distance"
                  required
                  min="1"
                  step="0.1"
                  value={formData.distance}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                />
              </div>

              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Máximo participantes
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  id="maxParticipants"
                  required
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                />
              </div>

              <div>
                <label
                  htmlFor="unevenness"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Desnivel (m)
                </label>
                <input
                  type="number"
                  name="unevenness"
                  id="unevenness"
                  required
                  min="0"
                  value={formData.unevenness}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                />
              </div>

              <div>
                <label
                  htmlFor="qualifyingTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tiempo de clasificación (HH:MM:SS)
                </label>
                <input
                  type="text"
                  name="qualifyingTime"
                  id="qualifyingTime"
                  required
                  pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                  placeholder="00:00:00"
                  value={formData.qualifyingTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tour"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Recorrido (descripción)
              </label>
              <textarea
                name="tour"
                id="tour"
                rows="4"
                required
                value={formData.tour}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/home")}
                className="px-4 py-2 border border-[#9b9d79] text-[#9b9d79] rounded-lg hover:bg-[#9b9d79] hover:text-white transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#9b9d79] text-white rounded-lg hover:bg-[#6b6d54] transition-all duration-300"
              >
                {loading ? "Creando..." : "Crear Carrera"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRace;
