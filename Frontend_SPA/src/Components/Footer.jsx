import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#9b9d79] shadow-lg p-4 mt-auto">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} - Derechos reservados - Alumnado IES HLanz
        </p>
      </div>
    </footer>
  )
}

export default Footer