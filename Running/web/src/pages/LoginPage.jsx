import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      console.log('Intentando login con:', credentials);
      const response = await login(credentials);
      console.log('Login exitoso:', response);
      
      showSuccessToast('Login exitoso');
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      showErrorToast(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm space-y-6 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="text-sm text-gray-300">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-3 mt-1 rounded bg-gray-700 text-white text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-sm text-gray-300">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-3 mt-1 rounded bg-gray-700 text-white text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 
