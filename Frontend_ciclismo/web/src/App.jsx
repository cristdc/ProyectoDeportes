import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index'
import NavBar from './components/NavBar'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App