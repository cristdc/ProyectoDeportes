import { createContext, useState, useContext } from "react";
import { apiRequest } from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RaceContext = createContext();

export const RaceProvider = ({ children }) => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(`${BACKEND_URL}/races`);

      if (!response.ok) {
        throw new Error("Error al cargar las carreras");
      }

      const data = await response.json();
      setRaces(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editRace = async (id, data) => {
    setLoading(true);

    try {
      console.log("Datos que se envían al servidor:", data);

      const response = await apiRequest(
        `${import.meta.env.VITE_BACKEND_URL}/races/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error del servidor:", responseData);
        throw new Error(responseData.message || "Error al editar la carrera");
      }

      setRaces((prevRaces) =>
        prevRaces.map((race) =>
          race._id === id ? { ...race, ...responseData.race } : race
        )
      );

      return responseData.race;
    } catch (error) {
      console.error("Error completo:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRace = async (raceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(`${BACKEND_URL}/races/${raceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la carrera");
      }

      window.location.reload();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async (raceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        `${BACKEND_URL}/races/${raceId}/runners-csv`
      ).then(async (res) => {
        if (res.status === 404) {
          return { notFound: true };
        }
        return res;
      });

      // Si no hay inscripciones
      if (response.notFound) {
        return { success: false, message: "No hay inscripciones" };
      }

      if (!response.ok) {
        return { success: false, message: "Error al descargar el CSV" };
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resultados_carrera_${raceId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      return { success: false, message: "Error al descargar el CSV" };
    } finally {
      setLoading(false);
    }
  };

  const uploadResults = async (raceId, file) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      // Para FormData no configuramos Content-Type, el navegador lo establece automáticamente
      const headers = {};

      // Añadir token si existe
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      const response = await fetch(
        `${BACKEND_URL}/races/${raceId}/results-csv`,
        {
          method: "POST",
          credentials: "include",
          headers,
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message,
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        message: "Error al subir los resultados",
        errors: [],
      };
    } finally {
      setLoading(false);
    }
  };

  const createRace = async (raceData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(`${BACKEND_URL}/races`, {
        method: "POST",
        body: JSON.stringify(raceData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la carrera");
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const getRaceById = async (raceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(`${BACKEND_URL}/races/${raceId}`);

      if (!response.ok) {
        throw new Error("Error al obtener los detalles de la carrera");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRaceResults = async (raceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        `${BACKEND_URL}/races/${raceId}/results`
      );

      if (!response.ok) {
        throw new Error("Error al obtener los resultados de la carrera");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadRaceGpx = async (raceId, file) => {
    try {
      // Verificar solo la extensión del archivo
      if (!file.name.toLowerCase().endsWith(".gpx")) {
        throw new Error("El archivo debe tener extensión .gpx");
      }

      // Crear un nuevo Blob con el tipo MIME correcto
      const gpxBlob = new Blob([file], {
        type: "application/gpx+xml",
      });

      // Crear un nuevo File con el tipo MIME correcto
      const gpxFile = new File([gpxBlob], file.name, {
        type: "application/gpx+xml",
      });

      const formData = new FormData();
      formData.append("gpxFile", gpxFile);

      // Para FormData no configuramos Content-Type
      const headers = {};

      // Añadir token si existe
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      const response = await fetch(`${BACKEND_URL}/races/${raceId}/gpx`, {
        method: "POST",
        credentials: "include",
        headers,
        body: formData,
      });

      // Intentar obtener el mensaje de error incluso si la respuesta no es ok
      let data;
      try {
        const textResponse = await response.text();
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch (e) {
        console.error("Error al parsear respuesta:", e);
        data = { message: "Error al procesar la respuesta del servidor" };
      }

      if (!response.ok) {
        throw new Error(data.message || "Error al subir el archivo GPX");
      }

      return data;
    } catch (error) {
      console.error("Error en uploadRaceGpx:", error);
      throw error;
    }
  };

  const value = {
    races,
    loading,
    error,
    fetchRaces,
    editRace,
    deleteRace,
    downloadCSV,
    uploadResults,
    createRace,
    clearError,
    getRaceById,
    getRaceResults,
    uploadRaceGpx,
  };

  return <RaceContext.Provider value={value}>{children}</RaceContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useRace = () => {
  const context = useContext(RaceContext);
  if (!context) {
    throw new Error("useRace debe ser usado dentro de un RaceProvider");
  }
  return context;
};
