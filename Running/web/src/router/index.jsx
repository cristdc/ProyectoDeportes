import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout.jsx";
import Home from "../pages/Home.jsx";
import AvailableRaces from "../pages/AvailableRaces.jsx";
import RaceDetails from "../pages/RaceDetails.jsx";
import Participate from "../pages/Participate.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import HistoryPage from "../pages/HistoryPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute";

// Definir el basename antes de inicializar el router
const basename = window.location.pathname.startsWith("/running")
  ? "/running"
  : "/";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "available-races",
          element: <AvailableRaces />,
        },
        {
          path: "races/:id",
          element: <RaceDetails />,
        },
        {
          path: "historial",
          element: (
            <ProtectedRoute>
              <Participate />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "history",
          element: (
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  { basename } 
);
