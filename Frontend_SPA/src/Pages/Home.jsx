import carrera1 from '../assets/carrera1.png'
import carrera2 from '../assets/carrera2.png'
import carrera3 from '../assets/carrera3.png'

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-[#9b9d79]">Ciclismo</h2>
        <img 
          src={carrera1}
          alt="Carrera 1" 
          className="max-w-2xl w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <ul className="list-disc text-[#9b9d79]">
          <li>Enlace uno</li>
          <li>Enlace dos</li>
          <li>Enlace tres</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#9b9d79]">Running</h2>
        <img 
          src={carrera2} 
          alt="Carrera 2" 
          className="max-w-2xl w-full h-48 object-cover object-top rounded-lg shadow-lg"
        />
        <ul className="list-disc text-[#9b9d79]">
          <li>Enlace uno</li>
          <li>Enlace dos</li>
          <li>Enlace tres</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#9b9d79]">Trailrunning</h2>
        <img 
          src={carrera3}
          alt="Carrera 3" 
          className="max-w-2xl w-full h-48 object-cover rounded-lg shadow-lg"
        />
        <ul className="list-disc text-[#9b9d79]">
          <li>Enlace uno</li>
          <li>Enlace dos</li>
          <li>Enlace tres</li>
        </ul>
      </div>
    </div>
  )
}

export default Home