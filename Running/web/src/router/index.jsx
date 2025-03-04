import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layout/RootLayout.jsx';
import Home from '../pages/Home.jsx';
import AvailableRaces from '../pages/AvailableRaces.jsx';
import Participate from '../pages/Participate.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';

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
        path:"login",
        element:<LoginPage/>
      },
      {
        path:"profile",
        element:<ProfilePage/>
      },
      {
        path:"history",
        element:<HistoryPage/>
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
