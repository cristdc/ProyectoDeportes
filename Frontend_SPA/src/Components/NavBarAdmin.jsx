import { useState } from 'react'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const NavBarAdmin = () => {
  const navigate = useNavigate()
  const { user, logout, isAuth } = useAuth()


  const handleManageUsers = () => {
    navigate('/admin/users')
  }

  return (
    <nav className="h-20 bg-[#9b9d79] shadow-lg">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo y nombre de la app */}
        <div className="flex items-center space-x-4">
          <div className="w-16 cursor-pointer" onClick={() => navigate('/admin/home')}>
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white hidden sm:block">
            MULTISPORTS
          </h1>
        </div>

        {/* Botones a la derecha */}
        <div className="flex space-x-4">
          {isAuth && (
            <>
        
              <button 
                onClick={handleManageUsers}
                className="px-4 py-2 bg-white text-[#9b9d79] rounded-lg 
                          hover:bg-[#6b6d54] hover:text-white
                          transition-all duration-1000 ease-in-out"
              >
                Administrar usuarios
              </button>

              <button 
                onClick={logout}
                className="px-4 py-2 bg-white text-[#9b9d79] rounded-lg 
                          hover:bg-[#6b6d54] hover:text-white
                          transition-all duration-1000 ease-in-out"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBarAdmin