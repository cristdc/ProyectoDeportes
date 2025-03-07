import { RouterProvider } from 'react-router-dom'
import router from './Router/Index'
import { RaceProvider } from './Context/RaceContext';
import { AuthProvider } from './Context/AuthContext';
import { UserProvider } from './Context/UserContext';

function App() {
  return ( 
  <>
    <AuthProvider>
      <UserProvider>
        <RaceProvider>
          <RouterProvider router={router} />  
        </RaceProvider>
      </UserProvider>
    </AuthProvider>
  </>
  )
}

export default App;