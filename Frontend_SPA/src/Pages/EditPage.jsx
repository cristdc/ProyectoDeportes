import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRace } from "../Context/RaceContext";
import { useAuth } from "../hooks/useAuth";

const EditRace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRaceById, editRace, loading } = useRace();
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    sport: "running",
    date: "",
    location: "",
    distance: "",
    maxParticipants: "",
    unevenness: "",
    tour: "",
    qualifyingTime: "",
  });

  useEffect(() => {
    const fetchRace = async () => {
      try {
        const data = await getRaceById(id);
        const formattedDate = data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "";
        setFormData({
          name: data.name || "",
          sport: data.sport || "running",
          date: formattedDate,
          location: data.location || "",
          distance: data.distance || "",
          maxParticipants: data.maxParticipants || "",
          unevenness: data.unevenness || "",
          tour: data.tour || "",
          qualifyingTime: data.qualifyingTime || "",
        });
      } catch (err) {
        console.error("Error al cargar la carrera:", err);
        setFormError("Error al cargar los datos de la carrera");
      }
    };

    fetchRace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      // Solo enviar los campos editables
      const updatedFields = {
        name: formData.name,
        sport: formData.sport,
        date: formData.date,
        location: formData.location,
        distance: formData.distance,
        maxParticipants: formData.maxParticipants,
        unevenness: formData.unevenness,
        tour: formData.tour,
        qualifyingTime: formData.qualifyingTime,
      };

      await editRace(id, updatedFields);
      navigate(`/admin/races/${id}`);
    } catch (err) {
      console.error("Error al actualizar la carrera:", err);
      setFormError(err.message || "Error al actualizar la carrera");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b9d79]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Editar Carrera
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre de la carrera
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="sport"
                  className="block text-sm font-medium text-gray-700"
                >
                  Deporte
                </label>
                <select
                  name="sport"
                  id="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                >
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="trailRunning">Trail Running</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ubicación
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                />
              </div>

              {/* Campos adicionales */}
              <div>
                <label
                  htmlFor="distance"
                  className="block text-sm font-medium text-gray-700"
                >
                  Distancia (km)
                </label>
                <input
                  type="number"
                  name="distance"
                  id="distance"
                  min="0.1"
                  step="0.1"
                  value={formData.distance}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-medium text-gray-700"
                >
                  Máximo de participantes
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  id="maxParticipants"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="unevenness"
                  className="block text-sm font-medium text-gray-700"
                >
                  Desnivel (m)
                </label>
                <input
                  type="number"
                  name="unevenness"
                  id="unevenness"
                  min="0"
                  value={formData.unevenness}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                />
              </div>


              <div>
                <label
                  htmlFor="qualifyingTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tiempo de calificación (HH:MM:SS)
                </label>
                <input
                  type="text"
                  name="qualifyingTime"
                  id="qualifyingTime"
                  placeholder="00:00:00"
                  pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                  value={formData.qualifyingTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
                           focus:border-[#9b9d79] focus:outline-none focus:ring-1 focus:ring-[#9b9d79]"
                  required
                />
                <small className="text-gray-500">Formato: 00:00:00</small>
              </div>
            </div>

            {formError && (
              <div className="text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                {formError}
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(`/admin/races/${id}`)}
                className="px-4 py-2 border border-[#9b9d79] text-[#9b9d79] rounded-lg
                         hover:bg-[#9b9d79] hover:text-white transition-all duration-1000"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#9b9d79] text-white rounded-lg
                         hover:bg-[#6b6d54] transition-all duration-1000"
              >
                {loading ? "Guardando..." : "Actualizar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRace;
