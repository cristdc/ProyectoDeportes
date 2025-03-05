import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCamera } from 'react-icons/fa';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+34 123 456 789",
    address: "Madrid, España",
    profileImage: "https://via.placeholder.com/150"
  });

  const [stats] = useState({
    completedRaces: 15,
    upcomingRaces: 3,
    bestDistance: "42km",
    bestTime: "4:25"
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Aquí iría la lógica para actualizar los datos en el backend
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8D9B6A] text-white rounded-md hover:bg-[#738055] transition-colors"
        >
          <FaEdit />
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Información del perfil */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center mb-6 relative">
              <div className="relative group">
                <img 
                  src={userData.profileImage} 
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#8D9B6A]"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[#8D9B6A] p-2 rounded-full cursor-pointer hover:bg-[#738055] transition-colors">
                    <FaCamera className="text-white" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nombre:</label>
                  <input 
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8D9B6A]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email:</label>
                  <input 
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8D9B6A]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Teléfono:</label>
                  <input 
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8D9B6A]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Dirección:</label>
                  <input 
                    type="text"
                    value={userData.address}
                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8D9B6A]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 bg-[#8D9B6A] text-white rounded-md hover:bg-[#738055] transition-colors"
                >
                  Guardar Cambios
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
                  <FaUser className="text-[#8D9B6A]" />
                  <span>{userData.name}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
                  <FaEnvelope className="text-[#8D9B6A]" />
                  <span>{userData.email}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
                  <FaPhone className="text-[#8D9B6A]" />
                  <span>{userData.phone}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#8D9B6A]" />
                  <span>{userData.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Mis Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-[#8D9B6A]">{stats.completedRaces}</div>
                <div className="text-gray-600 text-sm">Carreras Completadas</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-[#8D9B6A]">{stats.upcomingRaces}</div>
                <div className="text-gray-600 text-sm">Próximas Carreras</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-[#8D9B6A]">{stats.bestDistance}</div>
                <div className="text-gray-600 text-sm">Mejor Distancia</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-[#8D9B6A]">{stats.bestTime}</div>
                <div className="text-gray-600 text-sm">Mejor Tiempo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;