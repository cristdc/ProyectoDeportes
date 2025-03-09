import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index'
import { RaceProvider } from './context/RaceContext'

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