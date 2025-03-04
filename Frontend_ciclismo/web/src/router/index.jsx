import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />
    },
    {
        path: "/",
        element: <ProtectedRoute><Home /></ProtectedRoute>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <ProtectedRoute><Home /></ProtectedRoute>
            },
            {
                path: "profile",
                element: <ProtectedRoute><Profile /></ProtectedRoute>
            }
        ]
    }
]);

