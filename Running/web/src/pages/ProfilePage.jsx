import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiService.getUserProfile();
        console.log('Datos del perfil cargados:', data);
        setProfileData(data);
      } catch (err) {
        console.error('Error cargando perfil:', err);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!profileData) {
    return <div className="text-center py-8">No hay datos del perfil</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Perfil de Usuario</h1>
        <div className="space-y-4">
          <div>
            <label className="font-medium text-gray-600">Nombre:</label>
            <p className="mt-1">{profileData.name}</p>
          </div>
          <div>
            <label className="font-medium text-gray-600">Email:</label>
            <p className="mt-1">{profileData.email}</p>
          </div>
          <div>
            <label className="font-medium text-gray-600">Edad:</label>
            <p className="mt-1">{profileData.age} años</p>
          </div>
          <div>
            <label className="font-medium text-gray-600">Género:</label>
            <p className="mt-1">{profileData.gender}</p>
          </div>
          <div>
            <label className="font-medium text-gray-600">Miembro desde:</label>
            <p className="mt-1">{new Date(profileData.registeredAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}