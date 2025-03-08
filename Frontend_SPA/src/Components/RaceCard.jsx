import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useRace } from "../Context/RaceContext";

const RaceCard = ({
  race,
  currentUserId,
  onDelete,
  onDownloadCSV,
  onUploadResults,
  onRaceUpdate,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingGpx, setIsUploadingGpx] = useState(false);
  const { uploadRaceGpx } = useRace();

  // Verifica si el usuario actual es el creador de la carrera
  const isCreator = race.createdBy === currentUserId;

  const getStatusStyle = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "finished":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "deleted":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Abierta";
      case "finished":
        return "Finalizada";
      case "cancelled":
        return "Cancelada";
      case "deleted":
        return "Eliminada";
      default:
        return status;
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(race._id);
      setShowDeleteModal(false);
      toast.success("Carrera eliminada correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Error al eliminar la carrera", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadCSV = async () => {
    const result = await onDownloadCSV(race._id);

    if (!result.success) {
      if (result.message === "No hay inscripciones") {
        toast.info("No hay inscripciones registradas para esta carrera", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      return;
    }
  };

  const handleUploadResults = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Verificar si la carrera está finalizada
    if (race.status === "finished") {
      toast.error("No se pueden subir resultados a una carrera finalizada", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      event.target.value = "";
      return;
    }

    try {
      const result = await onUploadResults(race._id, file);

      if (result.success) {
        toast.success("Resultados subidos correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        // Recargar la página después de mostrar el toast
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        if (result.errors && result.errors.length > 0) {
          toast.error("El archivo CSV contiene errores de formato", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
          });
        } else {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });
        }
      }
    } finally {
      event.target.value = "";
    }
  };

  const handleUploadGpx = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploadingGpx(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target.result;
          if (!content.includes("<?xml") && !content.includes("<gpx")) {
            throw new Error("El archivo no parece ser un GPX válido");
          }

          await uploadRaceGpx(race._id, file);

          toast.success("Archivo GPX subido correctamente", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          });

          try {
            if (typeof onRaceUpdate === "function") {
              await onRaceUpdate();
            }
          } catch (updateError) {
            console.error(
              "Error al actualizar la lista de carreras:",
              updateError
            );
            // No mostrar error al usuario ya que el archivo se subió correctamente
          }
        } catch (error) {
          console.error("Error completo:", error);
          let errorMessage = error.message;
          if (error.message.includes("interno del servidor")) {
            errorMessage =
              "Error al procesar el archivo en el servidor. Por favor, verifica que el archivo GPX sea válido.";
          }
          toast.error(errorMessage);
        } finally {
          setIsUploadingGpx(false);
        }
      };

      reader.onerror = () => {
        toast.error("Error al leer el archivo");
        setIsUploadingGpx(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      toast.error("Error al procesar el archivo");
      setIsUploadingGpx(false);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-end gap-2 p-2 bg-gray-50 rounded-t-lg border-b">
        {/* Botón de editar */}
        <Link
          to={`/admin/races/edit/${race._id}`}
          className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300"
          title="Editar carrera"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </Link>

        {/* Botón para subir GPX */}
        <div>
          <input
            type="file"
            accept=".gpx"
            onChange={handleUploadGpx}
            className="hidden"
            id={`gpx-upload-${race._id}`}
            disabled={isUploadingGpx || race.status === "deleted"}
          />
          <label
            htmlFor={`gpx-upload-${race._id}`}
            className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300 cursor-pointer inline-flex items-center"
            title="Subir archivo GPX de la ruta"
          >
            {isUploadingGpx ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            )}
          </label>
        </div>

        {/* Botón para descargar CSV */}
        <button
          onClick={handleDownloadCSV}
          className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300"
          title="Descargar CSV"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>

        {/* Botón para subir resultados */}
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleUploadResults}
            className="hidden"
            id={`csv-upload-${race._id}`}
          />
          <label
            htmlFor={`csv-upload-${race._id}`}
            className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300 cursor-pointer inline-flex items-center"
            title="Subir resultados CSV"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </label>
        </div>

        {/* Botón para eliminar */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300"
          title="Eliminar carrera"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Contenido de la carrera */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {race.name}
        </h3>

        <div className="space-y-3">
          {/* Fecha */}
          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{new Date(race.date).toLocaleDateString()}</span>
          </div>

          {/* Ubicación */}
          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{race.location}</span>
          </div>

          {/* Estado */}
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                race.status
              )}`}
            >
              {getStatusText(race.status)}
            </span>
          </div>
        </div>

        {/* Botón Ver Detalles */}
        <div className="mt-6 text-center">
          <Link
            to={`/admin/races/${race._id}`}
            className="inline-block w-full px-4 py-2 bg-[#9b9d79] text-white rounded-lg
                     hover:bg-[#6b6d54] transition-all duration-1000 ease-in-out"
          >
            Ver Detalles
          </Link>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar la carrera "{race.name}"?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceCard;
