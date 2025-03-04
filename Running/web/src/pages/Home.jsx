const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Tabla de última carrera */}
      <div className="max-w-3xl mx-auto mt-8 p-6">
        <div className="border-2 border-secondary rounded-lg p-4">
          <div className="flex justify-between mb-4">
            <div className="text-xl font-bold text-primary border-2 border-secondary rounded px-4 py-1">
              ÚLTIMA CARRE
            </div>
            <div className="text-xl font-bold text-primary border-2 border-secondary rounded px-4 py-1">
              MEJORES
            </div>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-secondary">
                <th className="py-2 text-left">TOP</th>
                <th className="py-2 text-left">nombre</th>
                <th className="py-2 text-left">tiempo</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((position) => (
                <tr key={position} className="border-b border-secondary">
                  <td className="py-3">{position}</td>
                  <td className="py-3">—</td>
                  <td className="py-3">h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección inspiracional */}
      <div className="max-w-4xl mx-auto mt-12 p-6">
        <div className="relative">
          <img 
            src="/runner.jpg" 
            alt="Runner" 
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-8">
            <h2 className="text-white text-3xl font-bold mb-4">
              Frase inspiracional
            </h2>
            <div className="flex justify-between text-white text-xl">
              <span>3500 corredores</span>
              <span>5 carreras</span>
              <span>300 km recorridos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home