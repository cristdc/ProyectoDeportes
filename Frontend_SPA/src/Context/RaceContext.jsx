import { createContext, useState, useContext } from "react";

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
      const response = await fetch(`${BACKEND_URL}/races`, {
        credentials: "include",
      });

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

  const editRace = async (raceId, raceData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BACKEND_URL}/races/${raceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raceData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al editar la carrera");
      }

      const updatedRace = await response.json();

      return updatedRace;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRace = async (raceId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BACKEND_URL}/races/${raceId}`, {
        method: "DELETE",
        credentials: "include",
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

      const response = await fetch(
        `${BACKEND_URL}/races/${raceId}/runners-csv`,
        {
          credentials: "include",
        }
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

      const response = await fetch(
        `${BACKEND_URL}/races/${raceId}/results-csv`,
        {
          method: "POST",
          credentials: "include",
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

      const response = await fetch(`${BACKEND_URL}/races`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raceData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al crear la carrera");
      }
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
      const response = await fetch(`${BACKEND_URL}/races/${raceId}`, {
        credentials: "include",
      });

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
      const response = await fetch(`${BACKEND_URL}/races/${raceId}/results`, {
        credentials: "include",
      });

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

      const response = await fetch(`${BACKEND_URL}/races/${raceId}/gpx`, {
        method: "POST",
        body: formData,
        credentials: "include",
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
