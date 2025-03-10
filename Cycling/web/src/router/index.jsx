import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RootLayout from "../layout/RootLayout";
import CarrerasDisponibles from "../pages/CarrerasDisponibles";
import CarrerasHistorial from "../pages/CarrerasHistorial";
import CarrerasDetail from "../pages/CarrerasDetail";
import MisCarreras from "../pages/MisCarreras";

// Eliminar o modificar el basename
const basename = ""; // Si estamos en producción con la configuración de Vite

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "carreras-disponibles",
          element: (
            <ProtectedRoute>
              <CarrerasDisponibles />
            </ProtectedRoute>
          ),
        },
        {
          path: "carreras-historial",
          element: (
            <ProtectedRoute>
              <CarrerasHistorial />
            </ProtectedRoute>
          ),
        },
        {
          path: "carrerasDetail/:carreraId",
          element: (
            <ProtectedRoute>
              <CarrerasDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "mis-carreras",
          element: (
            <ProtectedRoute>
              <MisCarreras />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  { basename }
);
