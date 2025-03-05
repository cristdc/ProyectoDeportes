import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Profile = () => {
    const { user, loading, error, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí iría la lógica para actualizar el perfil
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B9D79]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
                <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!user) {
  return (
            <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
                <div className="bg-yellow-100 text-yellow-700 p-6 rounded-lg shadow-md">
                    <p>No se ha encontrado información del usuario</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Cabecera del perfil */}
                    <div className="bg-[#9B9D79] text-white p-6">
                        <div className="flex items-center space-x-4">
                            <UserCircleIcon className="h-20 w-20" />
                            <div>
                                <h1 className="text-2xl font-bold">{user.username}</h1>
                                <p className="text-white/80">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del perfil */}
                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de usuario
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B9D79]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B9D79]"
                                    />
                                </div>

                                

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#9B9D79] text-white rounded-md hover:bg-[#8EAC93] transition-colors"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Información del usuario</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Nombre de usuario</p>
                                            <p className="font-medium">{user.username}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Carreras participadas</p>
                                            <p className="text-2xl font-bold text-[#9B9D79]">0</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Carreras completadas</p>
                                            <p className="text-2xl font-bold text-[#9B9D79]">0</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Próximas carreras</p>
                                            <p className="text-2xl font-bold text-[#9B9D79]">0</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-[#9B9D79] text-white rounded-md hover:bg-[#8EAC93] transition-colors"
                                    >
                                        Editar perfil
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;