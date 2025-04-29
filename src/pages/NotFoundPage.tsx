// src/pages/NotFoundPage.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link untuk navigasi

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-100">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
      </p>
      <Link
        to="/" // Arahkan kembali ke halaman utama
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
};

export default NotFoundPage;