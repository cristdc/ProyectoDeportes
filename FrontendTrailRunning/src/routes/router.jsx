//Importaciones
import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage.jsx";
import RootLayout from "../layout/RootLayout.jsx"
import Home from "../pages/Home.jsx";
import { ROUTES } from "./paths.js"
import Races from "../pages/Races.jsx";
import RacesUser from "../pages/RacesUser.jsx";
import Login from "../pages/Login.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import User from "../pages/User.jsx";
import EditProfile from "../pages/editProfile.jsx";

export const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: <RootLayout />,
        errorElement: (
        <Navigate to="/404" replace={true} />
        ),
        children: [
            {
                index: true,
                element: <Login />
            },
            {
                path: ROUTES.HOME,
                element: (          
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                )
            },
            {
                path: ROUTES.RACES,
                element: (          
                    <PrivateRoute>
                        <Races />
                    </PrivateRoute>
                )
            },
            {
                path: ROUTES.RACESUSER,
                element: (          
                    <PrivateRoute>
                        <RacesUser />
                    </PrivateRoute>
                )
            },
            {
                path: ROUTES.USER,
                element: (          
                    <PrivateRoute>
                        <User />
                    </PrivateRoute>
                )
            },
            {
                path: ROUTES.EDITUSER,
                element: (          
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                )
            },
            {
              path: "404",
              element: (
                  <ErrorPage />
              )
            },
        ]
    }
]);