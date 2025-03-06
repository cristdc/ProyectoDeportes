import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index'
<<<<<<< HEAD
import NavBar from './components/NavBar'

=======
import { RaceProvider } from './context/RaceContext'
>>>>>>> 1206b59232267f1b08b7b1acb8d899a68a9a693a
const App = () => {
  return (
    <AuthProvider>
      <RaceProvider>
        <RouterProvider router={router} />
      </RaceProvider>
    </AuthProvider>
  )
}

export default App