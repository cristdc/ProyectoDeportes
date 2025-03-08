import { useState, useEffect } from 'react';
import { FaEdit, FaUser, FaEnvelope, FaCheck, FaTimes, FaRunning, FaTrophy, FaRulerVertical, FaWeight, FaBirthdayCake, FaMapMarkerAlt, FaMedal, FaCamera, FaSave, FaExclamationTriangle, FaCheckCircle, FaRoute } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, logout, updateUser } = useAuth();
  
  // Añadir esta constante al inicio del componente
  const MONTHLY_GOAL = 200; // Objetivo mensual en kilómetros
  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    profileImage: null,
    stats: {
      totalRaces: 0,
      completedRaces: 0,
      totalKilometers: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userStats, setUserStats] = useState({
    totalKilometers: 0,
    longestRace: 0,
    totalRegistrations: 0
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    image: null,
    height: '',
    weight: '',
    age: '',
    gender: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar obtener datos del localStorage primero
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (storedUser) {
          const formattedUserData = {
            ...storedUser,
            // Asegurarnos de que los valores numéricos se manejen correctamente
            height: storedUser.height || '',
            weight: storedUser.weight || '',
            age: storedUser.age || '',
            gender: storedUser.gender || '',
            stats: {
              totalRaces: storedUser.stats?.totalRaces || 0,
              completedRaces: storedUser.stats?.completedRaces || 0,
              totalKilometers: storedUser.stats?.totalKilometers || 0
            }
          };

          setUserData(formattedUserData);
          // Inicializar el formulario de edición con los datos existentes
          setEditForm({
            name: formattedUserData.name || '',
            email: formattedUserData.email || '',
            image: null,
            height: formattedUserData.height?.toString() || '',
            weight: formattedUserData.weight?.toString() || '',
            age: formattedUserData.age?.toString() || '',
            gender: formattedUserData.gender || ''
          });

          if (formattedUserData.profileImage) {
            setProfileImage(formattedUserData.profileImage);
            setImagePreview(formattedUserData.profileImage);
          }
        }

        // Obtener datos actualizados de la API
        const response = await apiService.getUserProfile();
        
        if (response && response.user) {
          const apiUserData = {
            ...response.user,
            height: response.user.height || '',
            weight: response.user.weight || '',
            age: response.user.age || '',
            gender: response.user.gender || '',
            stats: {
              totalRaces: response.user.stats?.totalRaces || 0,
              completedRaces: response.user.stats?.completedRaces || 0,
              totalKilometers: response.user.stats?.totalKilometers || 0
            }
          };

          setUserData(apiUserData);
          // Actualizar el formulario de edición con los datos más recientes
          setEditForm({
            name: apiUserData.name || '',
            email: apiUserData.email || '',
            image: null,
            height: apiUserData.height?.toString() || '',
            weight: apiUserData.weight?.toString() || '',
            age: apiUserData.age?.toString() || '',
            gender: apiUserData.gender || ''
          });

          if (apiUserData.profileImage) {
            setProfileImage(apiUserData.profileImage);
            setImagePreview(apiUserData.profileImage);
          }

          // Actualizar localStorage con los datos más recientes
          localStorage.setItem('user', JSON.stringify(apiUserData));
        }

        // Get user registrations
        const registrations = await apiService.getUserRegistrations();
        
        // Calculate stats from registrations
        let totalKm = 0;
        let maxDistance = 0;
        
        registrations.forEach(reg => {
          if (reg.race && reg.race.distance) {
            totalKm += reg.race.distance;
            maxDistance = Math.max(maxDistance, reg.race.distance);
          }
        });

        setUserStats({
          totalKilometers: totalKm,
          longestRace: maxDistance,
          totalRegistrations: registrations.length
        });

      } catch (err) {
        console.error('Error al cargar el perfil:', err);
        if (!userData.name) {
          setError('Error al cargar los datos del perfil');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    console.log('userData actualizado:', userData);
  }, [userData]);

  useEffect(() => {
    console.log('editForm actualizado:', editForm);
  }, [editForm]);

  const chartData = {
    labels: ['Kilómetros recorridos', 'Objetivo'],
    datasets: [{
      data: [
        userStats.totalKilometers || 0,
        200 - (userStats.totalKilometers || 0)
      ],
      backgroundColor: [
        '#8D9B6A',
        '#E8E8E8'
      ],
      borderWidth: 0,
      cutout: '80%',
      borderRadius: 20
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}km`;
          }
        }
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({...prev, image: file}));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modificar la función compressImage para una compresión más agresiva
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Reducir el tamaño máximo a 400x400
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Reducir la calidad al 50%
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
          
          // Verificar el tamaño de la imagen comprimida
          const base64str = compressedDataUrl.split(',')[1];
          const decoded = atob(base64str);
          const sizeInBytes = decoded.length;
          const sizeInMB = sizeInBytes / (1024 * 1024);
          
          // Si la imagen sigue siendo muy grande, reducir aún más
          if (sizeInMB > 1) {
            resolve(canvas.toDataURL('image/jpeg', 0.3));
          } else {
            resolve(compressedDataUrl);
          }
        };
      };
    });
  };

  // Modificar handleEditSubmit para manejar mejor el proceso de la imagen
  const handleEditSubmit = async () => {
    try {
      setError(null);
      setSuccessMessage('');

      // Crear el objeto con los datos a actualizar
      const updateData = {
        name: editForm.name?.trim(),
        email: editForm.email?.trim(),
        height: editForm.height ? Number(editForm.height) : null,
        weight: editForm.weight ? Number(editForm.weight) : null,
        age: editForm.age ? Number(editForm.age) : null,
        gender: editForm.gender || ''
      };

      // Si hay una nueva imagen, comprimirla antes de enviar
      if (editForm.image) {
        try {
          const compressedImage = await compressImage(editForm.image);
          // Verificar el tamaño final de la imagen
          const base64str = compressedImage.split(',')[1];
          const decoded = atob(base64str);
          const sizeInMB = decoded.length / (1024 * 1024);
          
          if (sizeInMB > 1.5) {
            throw new Error('La imagen es demasiado grande incluso después de la compresión');
          }
          
          updateData.profileImage = compressedImage;
        } catch (imgError) {
          setError('Error al procesar la imagen: ' + imgError.message);
          return;
        }
      }

      console.log('Enviando datos de actualización');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        try {
          const parsedError = JSON.parse(errorData);
          throw new Error(parsedError.message || 'Error al actualizar el perfil');
        } catch (e) {
          if (response.status === 413) {
            throw new Error('La imagen es demasiado grande. Por favor, intenta con una imagen más pequeña.');
          }
          throw new Error('Error al actualizar el perfil: ' + errorData);
        }
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (data.user) {
        const updatedUserData = {
          ...data.user,
          stats: data.user.stats || {
            totalRaces: 0,
            completedRaces: 0,
            totalKilometers: 0
          }
        };

        setUserData(updatedUserData);
        updateUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));

        if (data.user.profileImage) {
          setProfileImage(data.user.profileImage);
          setImagePreview(data.user.profileImage);
        }

        setSuccessMessage('Perfil actualizado correctamente');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    }
  };

  // Asegurarnos de que los datos físicos se muestren correctamente en la UI
  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      {/* Header con banner y foto */}
      <div className="h-64 bg-gradient-to-r from-[#8D9B6A] to-[#D4A373] relative">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        
        {/* Foto de perfil centrada */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
              {imagePreview || userData?.profileImage ? (
                <img
                  src={imagePreview || userData?.profileImage}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#FAEDCD] to-[#D4A373]/20 flex items-center justify-center">
                  <FaUser className="text-3xl text-[#D4A373]" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#D4A373] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#c49366] transition-all shadow-lg">
                <FaCamera className="text-white text-sm" />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange} 
                  className="hidden"
                  // Limitar a archivos de máximo 5MB
                  max-size="5242880"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Información básica y botones */}
        <div className="text-center mt-20 mb-8">
          {isEditing ? (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Editar Perfil</h2>
              
              {/* Formulario de edición */}
              <div className="space-y-6">
                {/* Datos básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A]/20 focus:border-[#8D9B6A] transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A]/20 focus:border-[#8D9B6A] transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Datos físicos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      value={editForm.height}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        height: e.target.value
                      }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A]/20 focus:border-[#8D9B6A] transition-all"
                      placeholder="170"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      value={editForm.weight}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        weight: e.target.value
                      }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A]/20 focus:border-[#8D9B6A] transition-all"
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Edad
                    </label>
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        age: e.target.value
                      }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A]/20 focus:border-[#8D9B6A] transition-all"
                      placeholder="25"
                    />
                  </div>
                </div>

                {/* Género */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Género
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm(prev => ({
                      ...prev,
                      gender: e.target.value
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#8D9B6A]/20 focus:border-[#8D9B6A] transition-all"
                  >
                    <option value="">Seleccionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 justify-end mt-6">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                      setImagePreview(null);
                    }}
                    className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="px-6 py-2 bg-[#8D9B6A] text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">{userData?.name || 'No especificado'}</h2>
              <p className="text-gray-500 mt-1">{userData?.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-6 py-2 bg-[#8D9B6A] text-white rounded-lg hover:opacity-90 transition-all inline-flex items-center gap-2 text-sm font-medium"
              >
                <FaEdit className="text-sm" />
                Editar perfil
              </button>
            </>
          )}
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Estadísticas rápidas */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaMedal className="text-[#D4A373] mr-2" />
              Estadísticas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#3B82F6]/10 to-[#2563EB]/10 rounded-xl p-4 text-center border border-[#3B82F6]/20">
                <div className="text-[#3B82F6] mb-2">
                  <FaRunning className="text-2xl mx-auto" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{userStats.totalRegistrations}</p>
                <p className="text-sm text-gray-500">Carreras totales</p>
              </div>
              <div className="bg-gradient-to-br from-[#22C55E]/10 to-[#16A34A]/10 rounded-xl p-4 text-center border border-[#22C55E]/20">
                <div className="text-[#22C55E] mb-2">
                  <FaTrophy className="text-2xl mx-auto" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{userData.stats.completedRaces}</p>
                <p className="text-sm text-gray-500">Completadas</p>
              </div>
            </div>
          </div>

          {/* Actividad mensual */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaRunning className="text-[#D4A373] mr-2" />
              Actividad mensual
            </h3>
            <div className="h-[200px] relative">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-gray-800">{userStats.totalKilometers.toFixed(1)}</p>
                <p className="text-sm text-gray-500">km totales</p>
              </div>
            </div>
          </div>

          {/* Datos físicos */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="text-[#D4A373] mr-2" />
              Datos físicos
            </h3>
            <div className="space-y-4">
              <div className="bg-[#FAEDCD]/20 rounded-xl p-4 flex items-center">
                <FaRulerVertical className="text-[#8D9B6A]" />
                <span className="ml-3 text-gray-600">Altura</span>
                <span className="ml-auto font-medium text-gray-800">{userData.height || '-'} cm</span>
              </div>
              <div className="bg-[#FAEDCD]/20 rounded-xl p-4 flex items-center">
                <FaWeight className="text-[#8D9B6A]" />
                <span className="ml-3 text-gray-600">Peso</span>
                <span className="ml-auto font-medium text-gray-800">{userData.weight || '-'} kg</span>
              </div>
              <div className="bg-[#FAEDCD]/20 rounded-xl p-4 flex items-center">
                <FaBirthdayCake className="text-[#8D9B6A]" />
                <span className="ml-3 text-gray-600">Edad</span>
                <span className="ml-auto font-medium text-gray-800">{userData.age || '-'} años</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas inferiores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Objetivo Mensual */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaTrophy className="text-[#D4A373] mr-2" />
                Objetivo Mensual
              </h3>
              <span className="text-sm text-gray-500">{MONTHLY_GOAL} km meta</span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-sm text-gray-500">Progreso actual</p>
                  <p className="text-3xl font-bold text-[#D4A373]">{userStats.totalKilometers.toFixed(1)} km</p>
                </div>
                <p className="text-sm text-gray-500">
                  {((userStats.totalKilometers / MONTHLY_GOAL) * 100).toFixed(1)}% completado
                </p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#8D9B6A] to-[#D4A373] transition-all duration-500"
                  style={{ width: `${Math.min((userStats.totalKilometers / MONTHLY_GOAL) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#FAEDCD]/20 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Diario</p>
                <p className="text-lg font-semibold text-gray-800">{(userStats.totalKilometers / 30).toFixed(1)} km</p>
              </div>
              <div className="bg-[#FAEDCD]/20 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Semanal</p>
                <p className="text-lg font-semibold text-gray-800">{(userStats.totalKilometers / 4).toFixed(1)} km</p>
              </div>
              <div className="bg-[#FAEDCD]/20 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Mensual</p>
                <p className="text-lg font-semibold text-gray-800">{userStats.totalKilometers.toFixed(1)} km</p>
              </div>
            </div>
          </div>

          {/* Logros */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <FaMedal className="text-[#FFD700] mr-2" />
              Logros
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FDB931]/10 rounded-xl p-6 border border-[#FFD700]/20">
                <div className="flex items-center text-[#FFD700] mb-3">
                  <FaMedal className="text-2xl mr-2" />
                  <span className="text-base font-medium">Mejor tiempo</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">01:23:45</p>
                <p className="text-sm text-gray-500 mt-1">10K - Carrera del Sol</p>
              </div>
              <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#6D28D9]/10 rounded-xl p-6 border border-[#8B5CF6]/20">
                <div className="flex items-center text-[#8B5CF6] mb-3">
                  <FaRoute className="text-2xl mr-2" />
                  <span className="text-base font-medium">Distancia más larga</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{userStats.longestRace.toFixed(1)} km</p>
                <p className="text-sm text-gray-500 mt-1">Maratón de la Ciudad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}