import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RootLayout from "../layout/RootLayout";
import CarrerasDisponibles from "../pages/CarrerasDisponibles";
import CarrerasHistorial from "../pages/CarrerasHistorial";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <ProtectedRoute><Home /></ProtectedRoute>
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "profile",
                element: <ProtectedRoute><Profile /></ProtectedRoute>
            },
            {
                path: "carreras-disponibles",
                element: <ProtectedRoute><CarrerasDisponibles /></ProtectedRoute>
            },
            {
                path: "carreras-historial",
                element: <ProtectedRoute><CarrerasHistorial /></ProtectedRoute>
            }
        ]
    }
]);

