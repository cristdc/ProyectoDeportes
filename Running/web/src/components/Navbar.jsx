import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="w-full bg-background border-b border-gray-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-text">
          LOGO
        </NavLink>
        
        <div className="flex items-center space-x-6">
          <NavLink 
            to="/carreras-disponibles" 
            className={({ isActive }) => 
              `text-text hover:text-primary transition-colors ${
                isActive ? 'font-semibold text-primary' : ''
              }`
            }
          >
            Carreras dispo
          </NavLink>
          
          <NavLink 
            to="/participar"
            className={({ isActive }) => 
              `text-text hover:text-primary transition-colors ${
                isActive ? 'font-semibold text-primary' : ''
              }`
            }
          >
            Participar
          </NavLink>
          
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-background">User</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar