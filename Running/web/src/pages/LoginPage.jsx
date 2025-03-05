import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import "../styles/main.css";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            await login(credentials);
            toast.success('Inicio de sesión exitoso');
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Iniciar Sesión</h2>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div>
                        <label htmlFor="email" className="text-sm">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder='tu@email.com'
                            required
                            className="input-field"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="text-sm">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder='*******'
                            required
                            className="input-field"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;