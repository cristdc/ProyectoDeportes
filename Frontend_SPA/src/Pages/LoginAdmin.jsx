import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const { loginAdmin, user, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya hay un usuario admin logueado, redirigir a home admin
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/home');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginAdmin(formData.email, formData.password);
      
      if (data.user.role !== 'admin') {
        // Si no es admin, hacemos logout y mostramos error
        await logout();
        setError('Acceso denegado. Esta página es solo para administradores.');
        return;
      }

      navigate('/admin/home');
      
    } catch (err) {
      setError(err.message || 'Error en el inicio de sesión');
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-[#9b9d79] text-center mb-4">
            Panel de Administración
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[#9b9d79] text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                placeholder="Ingrese su email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#9b9d79] text-sm mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-[#9b9d79] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b9d79]"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

       
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9b9d79] text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;