import { RouterProvider } from 'react-router-dom'
import router from './Router/Index'
import { RaceProvider } from './Context/RaceContext';

function App() {
  return ( 
  <>
    <RaceProvider>
      <RouterProvider router={router} />  

    </RaceProvider>
  </>
  )
}

export default App;