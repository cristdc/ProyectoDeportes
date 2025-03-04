import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="logo">
            LOGO
          </a>
          
          <div className="flex gap-4">
            <a href="/carreras-dispo" className="nav-link">
              Carreras dispo
            </a>
            <a href="/participar" className="nav-link">
              Participar
            </a>
            <a href="/user" className="nav-link">
              User
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar