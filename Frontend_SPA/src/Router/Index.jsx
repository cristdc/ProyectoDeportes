import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";

import Register from "../Pages/Register";
import RootLayout from "../Layouts/RootLayout";
import LoginAdmin from "../Pages/LoginAdmin";
import HomeAdmin from "../Pages/HomeAdmin";
import AdminLayout from "../Layouts/AdminLayout";
import CreateRace from "../Pages/CreateRace";
import RaceDetail from "../Pages/RaceDetail";
import EditPage from "../Pages/EditPage";
import AdminUsers from "../Pages/AdminUsers";
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
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LoginAdmin />,
      },
      {
        path: "home",
        element: <HomeAdmin />,
      },
      {
        path: "races/new",
        element: <CreateRace />,
      },
      {
        path: "races/:id",
        element: <RaceDetail />,
      },
      {
        path: "races/edit/:id",
        element: <EditPage />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
    ],
  },
]);

export default router;