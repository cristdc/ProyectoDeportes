import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

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
    <div>LoginPage</div>
  )
}

export default LoginPage