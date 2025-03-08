import { createContext, useState, useContext } from "react";
import { apiRequest } from "../utils/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest(`${BACKEND_URL}/admin/users`);

      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }

      const data = await response.json();
      setUsers(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        `${BACKEND_URL}/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar usuario");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest(
        `${BACKEND_URL}/admin/users/change-role`,
        {
          method: "POST",
          body: JSON.stringify({ userId, role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al cambiar el rol del usuario");
      }

      const { user: updatedUser } = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? updatedUser : user))
      );
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    users,
    loading,
    error,
    getAllUsers,
    deleteUser,
    changeUserRole,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
