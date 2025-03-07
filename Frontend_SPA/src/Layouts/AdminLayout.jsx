import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'
import NavBarAdmin from '../Components/NavBarAdmin'

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ed]">
      <NavBarAdmin/>
      <main className="flex-grow">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default AdminLayout