import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../Context/UserContext';
import UserCard from '../Components/UserCard';
import { toast } from 'sonner';

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
      <div className="mb-6">
        <Link
          to="/admin/home"
          className="inline-flex items-center text-[#9b9d79] hover:text-[#6b6d54] transition-colors duration-300"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a carreras
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Administración de Usuarios
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(userItem => (
          <UserCard
            key={userItem._id}
            user={userItem}
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