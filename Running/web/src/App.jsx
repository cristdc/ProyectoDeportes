import { RouterProvider } from 'react-router-dom';
import { router } from './routes.jsx'; // Añadimos la extensión .jsx
import './styles/index.css';

function App() {
  return <RouterProvider router={router} />;
}

export default App;