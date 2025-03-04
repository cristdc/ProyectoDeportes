import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home/Home.jsx';
import AvailableRaces from './pages/AvailableRaces/AvailableRaces.jsx';
import Participate from './pages/Participate/Participate.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'carreras-disponibles',
        element: <AvailableRaces />
      },
      {
        path: 'participar',
        element: <Participate />
      }
    ]
  }
]);