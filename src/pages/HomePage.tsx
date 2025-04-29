// src/pages/HomePage.tsx

import React from 'react';
import { useAuth } from '../utils/AuthProvider'; // Sesuaikan path jika perlu

const HomePage: React.FC = () => {
  // Mengambil data user dari context AuthProvider (jika ada)
  const { user } = useAuth(); // Asumsi useAuth() mengembalikan objek user

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Selamat Datang!
      </h1>

      {/* Tampilkan nama pengguna jika tersedia dari AuthProvider */}
      {user ? (
        <p className="text-lg mb-6 text-gray-600">
          Anda login sebagai: {user.username || user.email || 'Pengguna'}
          {/* Sesuaikan 'user.username' atau 'user.email' dengan struktur data user Anda */}
        </p>
      ) : (
        <p className="text-lg mb-6 text-gray-600">
          Halaman utama aplikasi Anda.
        </p>
      )}

      {/* Area untuk konten utama atau dashboard */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
        <p className="text-gray-700">
          Ini adalah area konten utama untuk homepage Anda. Anda bisa menambahkan
          ringkasan, statistik, atau link cepat ke fitur lain di sini.
        </p>
        {/* Contoh: Tambahkan link atau komponen lain di sini */}
        {/* <Link to="/members" className="text-blue-600 hover:underline">Lihat Anggota</Link> */}
      </div>

    </div>
  );
};

export default HomePage;