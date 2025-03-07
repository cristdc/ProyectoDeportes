import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../Context/UserContext';
import UserCard from '../Components/UserCard';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, loading, error, getAllUsers, deleteUser, changeUserRole } = useUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
      return;
    }
    getAllUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b9d79]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Usuarios
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onDelete={deleteUser}
            onChangeRole={changeUserRole}
          />
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8 p-4 bg-white rounded-lg shadow">
          No hay usuarios registrados
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 