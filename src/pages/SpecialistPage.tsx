// src/pages/SpecialistPage.tsx

import React from 'react';
import SpecialistList from '../components/MentorList'; // Import komponen SpecialistList

const SpecialistPage: React.FC = () => {
  return (
    <div>
      {/* Anda bisa menambahkan judul halaman atau elemen lain di sini jika perlu */}
      {/* Contoh Judul: */}
      {/* <h1 className="text-2xl font-semibold mb-4">Daftar Spesialis</h1> */}

      {/* Komponen utama untuk menampilkan daftar spesialis */}
      <SpecialistList />
    </div>
  );
};

export default SpecialistPage;