import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ed]">
      <main className="flex-grow">
        <Outlet/>
      </main>
    </div>
  )
}

export default RootLayout