import { useNavigate } from "react-router-dom"

const ErrorPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf7ed]">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#9b9d79]">404</h1>
        <h2 className="text-4xl font-semibold text-[#9b9d79] mt-4">
          ¡Página no encontrada!
        </h2>
        <p className="text-lg text-gray-600 mt-4">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <button
          onClick={handleGoHome}
          className="mt-8 px-6 py-3 bg-[#9b9d79] text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default ErrorPage