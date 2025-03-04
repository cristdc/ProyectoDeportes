import React, { useContext } from 'react'
import { AuthProvider } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function NavBar() {

    const { isAuthenticated, login, logout } = useContext(AuthProvider);


  return (
    <>
    
    <nav>
        <ul>
            <li><Link to={"/"}>Inicio</Link></li>
            <li><Link to={"/carreras-disponibles"}>Carreras Disponibles</Link></li>
            <li><Link to={"/carreras-historial"}>Historial de Carreras</Link></li>
            {isAuthenticated ? (
            <li><button onClick={logout()}></button></li>
            ) : (
            <li><Link to={"/login"} onClick={login()}>Login</Link></li>
            )}
        </ul>
    </nav>
    
    </>
  )
}

export default NavBar;