<<<<<<< HEAD
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

=======
import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
>>>>>>> 1206b59232267f1b08b7b1acb8d899a68a9a693a
const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow">
        <Outlet />
<<<<<<< HEAD
      </div>
      <Footer />
=======
        <Footer />
>>>>>>> 1206b59232267f1b08b7b1acb8d899a68a9a693a
    </div>
  );
};

export default RootLayout;