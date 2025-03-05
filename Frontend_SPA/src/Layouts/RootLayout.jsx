import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'
import NavBar from '../Components/NavBar'

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ed]">
      <NavBar/>
      <main className="flex-grow">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default RootLayout