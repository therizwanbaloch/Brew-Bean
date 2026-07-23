import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#3E2723] antialiased">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-[#1C100B] text-[#D2B48C] py-8 text-center border-t border-[#3E2723]">
        <p className="text-sm">© {new Date().getFullYear()} Brew &amp; Bean. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;