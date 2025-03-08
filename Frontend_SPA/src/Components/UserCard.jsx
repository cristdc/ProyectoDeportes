import { useState } from "react";
import { Link } from "react-router-dom";

import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const UserCard = ({ user, onDelete, onChangeRole }) => {
  const [isChangingRole, setIsChangingRole] = useState(false);
  const { user: currentUser } = useAuth();

  // Verificar si es el usuario actual
  const isCurrentUser = user._id === currentUser._id;

  const handleDelete = async () => {
    // Verificación de seguridad
    if (isCurrentUser) {
      toast.error("No puedes eliminar tu propia cuenta", {
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    try {
      await onDelete(user._id);
    } catch (error) {
      toast.error("Error al eliminar el usuario", {
        position: "top-right",
        duration: 3000,
      });
    }
  };

  const handleRoleChange = async () => {
    try {
      setIsChangingRole(true);
      const newRole = user.role === "admin" ? "user" : "admin";
      await onChangeRole(user._id, newRole);
    } catch (error) {
      console.error("Error al cambiar rol:", error);
    } finally {
      setIsChangingRole(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Barra de acciones superior */}
      <div className="flex justify-end gap-2 p-2 bg-gray-50 rounded-t-lg border-b">
        {/* Cambiar Rol */}
        <button
          onClick={handleRoleChange}
          disabled={isChangingRole}
          className="p-1.5 hover:bg-[#9b9d79] hover:text-white rounded-full transition-all duration-300"
          title={`Cambiar a ${
            user.role === "admin" ? "usuario" : "administrador"
          }`}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* Eliminar */}
        {!isCurrentUser && (
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500 hover:text-white rounded-full transition-all duration-300"
            title="Eliminar usuario"
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
        )}
      </div>

      {/* Contenido del usuario */}
      <div className="p-6">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>

          {/* Información del usuario */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Badge de rol */}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium 
            ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role === "admin" ? "Administrador" : "Usuario"}
          </span>
        </div>

        {/* Información adicional */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Edad:</span>{" "}
            {user.age || "No especificada"}
          </div>
          <div>
            <span className="font-medium">Registro:</span>{" "}
            {new Date(user.registrationDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
