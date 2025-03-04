import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar />
          <Outlet />
        <Footer />
    </div>
  )
}

export default RootLayout