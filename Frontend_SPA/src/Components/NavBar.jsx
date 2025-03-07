import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate()
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRegisterClick = () => {
    navigate('/register');
  }

  return (
    <nav className="bg-[#9b9d79] shadow-lg p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo a la izquierda */}
        <div className="w-16">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-full h-auto"
          />
        </div>

        {/* Título en el centro */}
        <h1 className="text-2xl font-bold text-white">
          MULTISPORTS
        </h1>

        {/* Botones a la derecha */}
        <div className="space-x-4">
          {!isRegistered && (
            <button 
              onClick={handleRegisterClick}
              className="px-4 py-2 bg-white text-[#9b9d79] rounded-lg 
                        hover:bg-[#9b9d79] hover:text-white
                        transition-all duration-1000 ease-in-out"
            >
              Registrarse
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar