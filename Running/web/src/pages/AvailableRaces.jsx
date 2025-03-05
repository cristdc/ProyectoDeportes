const AvailableRaces = () => {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 text-left">Nombre</th>
                <th className="py-3 text-left">Fecha</th>
                <th className="py-3 text-left">Distancia</th>
                <th className="py-3 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4">—</td>
                  <td className="py-4">—</td>
                  <td className="py-4">—</td>
                  <td className="py-4">
                    <button className="bg-primary text-white px-4 py-1 rounded hover:bg-opacity-90 transition-colors">
                      Participar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default AvailableRaces;