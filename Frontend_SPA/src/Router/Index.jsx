import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";

import Register from "../Pages/Register";
import RootLayout from "../Layouts/RootLayout";
import LoginAdmin from "../Pages/LoginAdmin";
import HomeAdmin from "../Pages/HomeAdmin";
import AdminLayout from "../Layouts/AdminLayout";
import CreateRace from "../Pages/CreateRace";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "home",
                element: <Home />
            },
            {
                path: "register",
                element: <Register />
            },
            
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <LoginAdmin />
            },
            {
                path: "home",
                element: <HomeAdmin />
            },
            {
                path: "races/new",
                element: <CreateRace />
            },
        ]
    }
]);

export default router;