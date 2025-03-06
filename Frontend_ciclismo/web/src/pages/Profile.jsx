import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_CICLISMO_URL;

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.username || '',
                age: user.age || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.name,
                    age: parseInt(formData.age) || undefined
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setSuccess('Perfil actualizado correctamente');
                setIsEditing(false);
                setFormData({
                    name: data.user.username || '',
                    age: data.user.age || ''
                });
            } else {
                setError(data.message || 'Error al actualizar el perfil');
            }
        } catch (err) {
            setError('Error al actualizar el perfil');
        }
    };



    return (
        <div className="min-h-screen bg-[#fdf7ed] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#9B9D79] text-white p-6">
                        <div className="flex items-center space-x-4">
                            {user.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt="Avatar" 
                                    className="w-20 h-20 rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-white text-[#9B9D79] flex items-center justify-center text-2xl font-bold">
                                    {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold">{user.username}</h1>
                                <p className="text-white/80">{user.age ? `${user.age} años` : 'Edad no especificada'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de usuario
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B9D79]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Edad
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9B9D79]"
                                        min="0"
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
                                            <p className="text-sm text-gray-600">Edad</p>
                                            <p className="font-medium">{user.age || 'No especificada'}</p>
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