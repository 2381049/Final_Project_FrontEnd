import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Import Navbar

const MainLayout: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* Navbar akan selalu tampil di atas */}
      <main className="container mx-auto p-4"> {/* Container untuk konten halaman */}
        <Outlet /> {/* Tempat konten halaman (HomePage, MemberPage, dll.) akan dirender */}
      </main>
    </div>
  );
};

export default MainLayout;
