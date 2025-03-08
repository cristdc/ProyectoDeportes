import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRegistration } from '../Context/RegistrationContext';
import { toast } from 'sonner';

const RaceRegistrations = () => {
  const { id } = useParams();
  const { 
    registrations, 
    loading, 
    getRaceRegistrations,
    updateRegistrationTime,
    updateRegistration,
    cancelRegistration 
  } = useRegistration();

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalRegistrations: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    time: '',
    position: ''
  });

  const fetchRegistrations = async () => {
    try {
      const data = await getRaceRegistrations(id, currentPage);
      setPagination({
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        totalRegistrations: data.totalRegistrations
      });
    } catch (error) {
      toast.error('Error al cargar las inscripciones');
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [id, currentPage]);

  const handleEdit = (registration) => {
    setEditingId(registration._id);
    setEditForm({
      time: registration.time || '',
      position: registration.position || ''
    });
  };

  const handleUpdateTime = async (registrationId, time, position) => {
    try {
      await updateRegistrationTime(registrationId, time, position, id);
      toast.success('Tiempo actualizado correctamente', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false
      });
      // Recargar los datos de la tabla
      await getRaceRegistrations(id, currentPage);
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el tiempo', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false
      });
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    try {
      await cancelRegistration(registrationId);
      toast.success('Inscripción cancelada exitosamente');
      // Recargar los datos
      await getRaceRegistrations(id, currentPage);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9b9d79]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón Volver */}
      <div className="mb-6">
        <Link
          to={`/admin/races/${id}`}
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
          Volver
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Inscripciones de la Carrera</h1>
      
      {registrations.length === 0 ? (
        <p className="text-center text-gray-600">No hay inscripciones para esta carrera</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-[#9b9d79] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Participante</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Dorsal</th>
                  <th className="px-6 py-3 text-left">Tiempo</th>
                  <th className="px-6 py-3 text-left">Posición</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map(registration => (
                  <tr key={registration._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{registration.user?.name}</td>
                    <td className="px-6 py-4">{registration.user?.email}</td>
                    <td className="px-6 py-4">{registration.dorsal}</td>
                    <td className="px-6 py-4">
                      {editingId === registration._id ? (
                        <input
                          type="text"
                          value={editForm.time}
                          onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                          className="border rounded px-2 py-1"
                          placeholder="HH:mm:ss"
                        />
                      ) : (
                        registration.time || '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === registration._id ? (
                        <input
                          type="number"
                          value={editForm.position}
                          onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                          className="border rounded px-2 py-1 w-20"
                        />
                      ) : (
                        registration.position || '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        registration.status === 'registered' ? 'bg-green-100 text-green-800' :
                        registration.status === 'finished' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === registration._id ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleUpdateTime(registration._id, editForm.time, editForm.position)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(registration)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleCancelRegistration(registration._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500' 
                  : 'bg-[#9b9d79] text-white hover:bg-[#6b6d54]'
              }`}
            >
              Anterior
            </button>
            <span className="px-4 py-2">
              Página {currentPage} de {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === pagination.totalPages 
                  ? 'bg-gray-200 text-gray-500' 
                  : 'bg-[#9b9d79] text-white hover:bg-[#6b6d54]'
              }`}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RaceRegistrations;