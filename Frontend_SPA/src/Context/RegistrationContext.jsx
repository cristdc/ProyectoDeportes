import { createContext, useState, useContext } from "react";
import { apiRequest } from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  // Inicializar como array vacío
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las inscripciones de una carrera
  const getRaceRegistrations = async (raceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        `${BACKEND_URL}/registrations/race/${raceId}`
      );

      if (!response.ok) {
        throw new Error("Error al obtener las inscripciones");
      }

      const data = await response.json();
      setRegistrations(data.registrations || []);
      return data;
    } catch (err) {
      setError(err.message);
      setRegistrations([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Actualizar tiempo y posición de una inscripción
  const updateRegistrationTime = async (
    registrationId,
    time,
    position,
    raceId,
    updateRaceStatus = false // Añadimos un parámetro opcional
  ) => {
    try {
      // Solo actualizamos el estado de la carrera si explícitamente se solicita
      if (updateRaceStatus) {
        const raceResponse = await apiRequest(
          `${BACKEND_URL}/races/${raceId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              status: "finished",
            }),
          }
        );

        if (!raceResponse.ok) {
          throw new Error("Error al actualizar el estado de la carrera");
        }
      }

      // Actualizamos el tiempo de la inscripción
      const timeResponse = await apiRequest(
        `${BACKEND_URL}/registrations/${registrationId}/time`,
        {
          method: "PUT",
          body: JSON.stringify({
            time,
            position,
          }),
        }
      );

      if (!timeResponse.ok) {
        const errorData = await timeResponse.json();
        throw new Error(errorData.message || "Error al actualizar el tiempo");
      }

      const updatedData = await timeResponse.json();

      // Actualizamos el estado local para reflejar los cambios sin necesidad de recargar
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg._id === registrationId
            ? { ...reg, time, position, status: "finished" }
            : reg
        )
      );

      return updatedData;
    } catch (error) {
      console.error("Error al actualizar tiempo:", error);
      throw error;
    }
  };
  // Actualizar una inscripción (cualquier campo)
  const updateRegistration = async (registrationId, registrationData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        `${BACKEND_URL}/registrations/${registrationId}`,
        {
          method: "PUT",
          body: JSON.stringify(registrationData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la inscripción");
      }

      const updatedRegistration = await response.json();
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === registrationId ? updatedRegistration : reg
        )
      );

      return updatedRegistration;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar una inscripción
  const cancelRegistration = async (registrationId) => {
    try {
      const response = await apiRequest(
        `${BACKEND_URL}/registrations/${registrationId}/cancel`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          if (error.message.includes("ya finalizada o cancelada")) {
            throw new Error(
              "No se puede cancelar una inscripción que ya está finalizada o cancelada"
            );
          } else if (error.message.includes("carrera ya pasó")) {
            throw new Error(
              "No se puede cancelar una inscripción cuando la carrera ya ha pasado"
            );
          }
        }
        throw new Error(error.message || "Error al cancelar la inscripción");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Obtener todas las inscripciones (solo admin)
  const getAllRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(`${BACKEND_URL}/registrations`);

      if (!response.ok) {
        throw new Error("Error al obtener todas las inscripciones");
      }

      const data = await response.json();
      setRegistrations(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        loading,
        error,
        getRaceRegistrations,
        updateRegistrationTime,
        updateRegistration,
        cancelRegistration,
        getAllRegistrations,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration debe ser usado dentro de un RegistrationProvider"
    );
  }
  return context;
};
