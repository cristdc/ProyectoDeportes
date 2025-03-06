import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";

import Register from "../Pages/Register";
import RootLayout from "../Layouts/RootLayout";
import Prueba from "../Pages/Prueba";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "prueba",
        element: <Prueba />,
      },
    ],
  },
]);

export default router;