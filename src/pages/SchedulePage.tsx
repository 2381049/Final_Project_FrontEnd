// src/pages/SchedulePage.tsx

import React from 'react';
import ScheduleList from '../components/ScheduleList'; // Import komponen ScheduleList

const SchedulePage: React.FC = () => {
  return (
    <div>
      {/* Anda bisa menambahkan judul halaman atau elemen lain di sini jika perlu */}
      {/* Contoh Judul: */}
      {/* <h1 className="text-2xl font-semibold mb-4">Jadwal Kegiatan</h1> */}

      {/* Komponen utama untuk menampilkan daftar jadwal */}
      <ScheduleList />
    </div>
  );
};

export default SchedulePage;