import { Toaster } from "sonner";
import { AuthProvider } from "./Context/AuthContext";
import { UserProvider } from "./Context/UserContext";
import { RaceProvider } from "./Context/RaceContext";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Index";
import { RegistrationProvider } from "./Context/RegistrationContext";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RegistrationProvider>
          <RaceProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </RaceProvider>
        </RegistrationProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
