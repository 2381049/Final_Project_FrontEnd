import React from 'react';
import MemberList from '../components/MemberList'; // Import komponen MemberList

const MemberPage: React.FC = () => {
  return (
    // Container utama halaman dengan padding
    <div className="p-4 md:p-6 lg:p-8"> 
      {/* Judul Halaman */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Manajemen Anggota
      </h1>

      {/* Anda bisa menambahkan deskripsi singkat atau tombol aksi global di sini jika perlu */}
      {/* <p className="mb-6 text-gray-600">
        Kelola data anggota yang terdaftar dalam sistem.
      </p> */}
      
      {/* Container untuk MemberList, bisa diberi background, shadow, dll. 
        Contoh: Memberi sedikit latar belakang dan shadow pada list
      */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6"> 
         {/* Komponen utama untuk menampilkan daftar anggota */}
         <MemberList />
      </div>

    </div>
  );
};

export default MemberPage;
