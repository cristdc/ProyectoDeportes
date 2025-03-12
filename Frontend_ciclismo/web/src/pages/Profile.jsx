import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_CICLISMO_URL;

const Profile = () => {
    const { user, logout, updateUserData, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: user?.age || '',
        avatar: user?.avatar || ''
    });
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    console.log("Datos del usuario en Profile:", user);
    useEffect(() => {
        const refreshProfile = async () => {
            try {
                setIsLoading(true);
                await checkAuth();
            } catch (error) {
                console.error('Error al actualizar perfil:', error);
                toast.error('Error al cargar el perfil');
            } finally {
                setIsLoading(false);
            }
        };

        refreshProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            toast.loading('Actualizando perfil...');
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (response.ok) {
                await updateUserData(data.user);
                setFormData({
                    name: data.user.name || '',
                    age: data.user.age || '',
                    avatar: data.user.avatar || ''
                });
                toast.success('¡Perfil actualizado correctamente!');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error('Error al actualizar el perfil: ' + error.message);
            setError('Error al actualizar el perfil');
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB límite
                toast.error('La imagen es demasiado grande. Máximo 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Por favor, selecciona un archivo de imagen válido');
                return;
            }

            try {
                toast.loading('Procesando imagen...');
                
                // Crear un nombre único para la imagen
                const fileName = `avatar-${Date.now()}-${file.name}`;
                const avatarPath = `/img/${fileName}`;

                // Copiar el archivo a la carpeta public/img
                const formData = new FormData();
                formData.append('avatar', file);
                formData.append('fileName', fileName);

                // Actualizar el perfil con la nueva ruta de la imagen
                const updateResponse = await fetch(`${API_URL}/users/profile`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        avatar: avatarPath
                    })
                });

                if (!updateResponse.ok) {
                    throw new Error('Error al actualizar el perfil');
                }

                const data = await updateResponse.json();
                
                // Actualizar el estado local
                setFormData(prev => ({
                    ...prev,
                    avatar: avatarPath
                }));
                
                await updateUserData(data.user);
                toast.success('Imagen actualizada correctamente');

                // Recargar el perfil para asegurarnos de que tenemos los datos más recientes
                await fetchProfile();
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error al actualizar la imagen');
            }
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener el perfil');
            }

            const data = await response.json();
            
            // Verificar si la imagen existe en /public/img
            if (data.user.avatar) {
                const avatarPath = data.user.avatar;
                try {
                    // Intentar cargar la imagen
                    const imgResponse = await fetch(avatarPath);
                    if (!imgResponse.ok) {
                        // Si la imagen no existe, usar avatar por defecto
                        data.user.avatar = '/img/default-avatar.png';
                    }
                } catch (error) {
                    console.error('Error al verificar la imagen:', error);
                    data.user.avatar = '/img/default-avatar.png';
                }
            }

            setFormData({
                name: data.user.name || '',
                age: data.user.age || '',
                avatar: data.user.avatar || ''
            });
            await updateUserData(data.user);
        } catch (error) {
            console.error('Error al obtener el perfil:', error);
            toast.error('Error al cargar el perfil');
        }
    };

    // Cargar el perfil cuando el componente se monta
    useEffect(() => {
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fdf7ed] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B9D79] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
            </div>
        );
    }

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
                            <div 
                                onClick={handleImageClick}
                                className="relative cursor-pointer group"
                            >
                                {formData.avatar ? (
                                    <img 
                                        src={formData.avatar} 
                                        alt="Avatar" 
                                        className="w-20 h-20 rounded-full object-cover border-2 border-white transition-opacity group-hover:opacity-80"
                                        onError={(e) => {
                                            e.target.src = '/img/default-avatar.png';
                                        }}
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-white text-[#9B9D79] flex items-center justify-center text-2xl font-bold transition-opacity group-hover:opacity-80">
                                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                                        Cambiar foto
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{formData.name || 'Nombre no especificado'}</h1>
                                <p className="text-white/80">{user?.email || 'Email no especificado'}</p>
                                <p className="text-white/80">{formData.age ? `${formData.age} años` : 'Edad no especificada'}</p>
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
                                        Actualizar perfil
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
                                            <p className="font-medium">{formData.name || 'No especificado'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{user?.email || 'No especificado'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Edad</p>
                                            <p className="font-medium">{formData.age || 'No especificada'}</p>
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