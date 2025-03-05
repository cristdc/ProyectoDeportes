import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import useAuth from "../hooks/useAuth.js";

const RootLayout = () => {
  
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar user= { user } />
          <Outlet />
        <Footer />
    </div>
  )
}

export default RootLayout