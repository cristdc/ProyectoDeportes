import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">¡Oops!</h1>
      <p className="text-lg text-gray-700 mb-2">Algo salió mal.</p>
      {error && (
        <div className="bg-white p-4 rounded shadow-md">
          <p className="text-gray-800">
            <strong>Error:</strong> {error.statusText || error.message}
          </p>
        </div>
      )}
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Volver al inicio
      </a>
    </div>
  );
};

export default ErrorPage;