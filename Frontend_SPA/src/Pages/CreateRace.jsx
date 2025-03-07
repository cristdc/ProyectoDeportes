import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const CreateRace = ({race}) => {
    const navigate = useNavigate();
    const { loginAdmin, user, loading } = useAuth();
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
    const [error, setError] = useState('');
  
    useEffect(() => {
      if (user) {
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
  
      try {
        await loginAdmin(formData.email, formData.password);
        navigate('/admin/home');
      } catch (err) {
        setError(err.message || 'Error en el inicio de sesión');
        setFormData(prev => ({
          ...prev,
          password: ''
        }));
      }
    };
  
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-[#9b9d79] text-center mb-4">
              Añadir carrera
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
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };
export default CreateRace