import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UploadResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Por favor, selecciona un archivo CSV válido');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, selecciona un archivo CSV");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); 

    try {
      const headers = {};

      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/races/${id}/results-csv`,
        {
          method: "POST",
          credentials: "include",
          headers: headers,
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir los resultados");
      }

      navigate(`/admin/races/${id}`);
    } catch (err) {
      console.error("Error completo:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    navigate('/admin');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Subir Resultados de la Carrera
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo CSV con resultados
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9b9d79] focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-500">
              El archivo debe ser un CSV con las columnas: email, nombre, dorsal, tiempo.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !file}
              className={`flex-1 bg-[#9b9d79] text-white py-2 px-4 rounded-lg 
                ${
                  loading || !file
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#6b6d54]"
                }
                transition-all duration-300`}
            >
              {loading ? "Subiendo..." : "Subir Resultados"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/races/${id}`)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResults; 