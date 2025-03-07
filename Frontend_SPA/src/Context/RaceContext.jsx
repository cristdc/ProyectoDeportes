import { createContext, useState, useContext } from 'react';

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
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar las carreras');
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(raceData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al editar la carrera');
      }

      const updatedRace = await response.json();
      setRaces(prevRaces => ({
        ...prevRaces,
        races: prevRaces.races.map(race => 
          race._id === raceId ? updatedRace : race
        )
      }));

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
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la carrera');
      }

      setRaces(prevRaces => ({
        ...prevRaces,
        races: prevRaces.races.filter(race => race._id !== raceId)
      }));

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
      const response = await fetch(`${BACKEND_URL}/races/${raceId}/download-csv`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al descargar el CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carrera-${raceId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadResults = async (raceId, resultsFile) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('results', resultsFile);

      const response = await fetch(`${BACKEND_URL}/races/${raceId}/upload-results`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al subir los resultados');
      }

      const updatedRace = await response.json();
      setRaces(prevRaces => ({
        ...prevRaces,
        races: prevRaces.races.map(race => 
          race._id === raceId ? updatedRace : race
        )
      }));

      return updatedRace;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createRace = async (raceData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BACKEND_URL}/races`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(raceData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al crear la carrera');
      }

      const newRace = await response.json();
      setRaces(prevRaces => ({
        ...prevRaces,
        races: [...prevRaces.races, newRace]
      }));

      return newRace;
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
      const response = await fetch(`${BACKEND_URL}/api/races/${raceId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la carrera');
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
      const response = await fetch(`${BACKEND_URL}/api/races/${raceId}/results`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al obtener los resultados de la carrera');
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
    getRaceResults
  };

  return <RaceContext.Provider value={value}>{children}</RaceContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useRace = () => {
  const context = useContext(RaceContext);
  if (!context) {
    throw new Error('useRace debe ser usado dentro de un RaceProvider');
  }
  return context;
};