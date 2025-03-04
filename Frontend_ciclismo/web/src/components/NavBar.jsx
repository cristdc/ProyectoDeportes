import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function NavBar() {
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/carreras-disponibles">Carreras Disponibles</Link></li>
                <li><Link to="/carreras-historial">Historial de Carreras</Link></li>
                {isAuthenticated ? (
                    <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
                ) : (
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;