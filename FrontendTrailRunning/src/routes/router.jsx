//Importaciones
import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage.jsx";
import RootLayout from "../layout/RootLayout.jsx"
import Home from "../pages/Home.jsx";
import { ROUTES } from "./paths.js"
import Races from "../pages/Races.jsx";
import RacesUser from "../pages/RacesUser.jsx";
import Login from "../pages/Login.jsx";

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
              path: "404",
              element: (
                  <ErrorPage />
              )
            },
        ]
    }
]);