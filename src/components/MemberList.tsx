import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance'; // Instance Axios Anda
import { Link } from 'react-router-dom'; // Untuk tombol Edit/Tambah

// Definisikan tipe data Anggota sesuai dengan Entity di backend
interface Anggota {
  id: number;
  nama: string;
  email: string;
  nomorTelepon: string; 
  createdAt?: Date; 
  updatedAt?: Date;
}

// Fungsi untuk mengambil data anggota dari API
const fetchAnggota = async (): Promise<Anggota[]> => {
  try {
    const response = await axios.get('/api/anggota'); // Sesuaikan endpoint jika berbeda
    // Pastikan response.data adalah array, jika tidak kembalikan array kosong
    // Sesuaikan ini jika struktur data dari API berbeda (misal: response.data.items)
    // Jika API selalu mengembalikan array atau null/undefined jika kosong:
    return Array.isArray(response.data) ? response.data : []; 
  } catch (error) {
    console.error("Error fetching anggota:", error);
    // FIX: Lempar ulang error agar useQuery bisa menangkapnya dan set isError=true
    throw error; 
  }
};

// Fungsi untuk menghapus anggota (contoh dengan useMutation)
const deleteAnggota = async (id: number) => {
    const response = await axios.delete(`/api/anggota/${id}`); // Sesuaikan endpoint
    return response.data;
}

const MemberList: React.FC = () => {
  const queryClient = useQueryClient(); // Untuk invalidasi cache setelah mutasi

  // Menggunakan useQuery untuk mengambil dan mengelola data anggota
  const { data: anggota, isLoading, isError, error } = useQuery<Anggota[], Error>({
    queryKey: ['anggota'], // Kunci unik untuk query ini
    queryFn: fetchAnggota, // Fungsi yang akan dijalankan untuk fetch data
    // Opsi: nonaktifkan refetch otomatis sementara untuk debug
    // refetchOnWindowFocus: false, 
    // staleTime: Infinity, 
  });

  // --- DEBUGGING ---
  // Log data yang diterima dari useQuery
  console.log("Data Anggota:", anggota); 
  console.log("Is Loading:", isLoading);
  console.log("Is Error:", isError);
  if (error) {
    console.error("Query Error Object:", error);
  }
  // ---------------

  // Menggunakan useMutation untuk operasi hapus
  const deleteMutation = useMutation({
    mutationFn: deleteAnggota,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota'] });
      alert('Anggota berhasil dihapus!');
    },
    onError: (err: any) => { // Tambahkan tipe 'any' atau tipe error Axios
      console.error("Error deleting member:", err);
      const errorMsg = err.response?.data?.message || err.message || 'Gagal menghapus anggota.';
      alert(errorMsg);
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
      deleteMutation.mutate(id);
    }
  };

  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Memuat data anggota...</span>
      </div>
    );
  }

  // Tampilan saat error (sekarang seharusnya lebih akurat karena fetchAnggota melempar error)
  if (isError) {
    return <div className="text-red-600 p-4">Error mengambil data: {error?.message || 'Terjadi kesalahan tidak diketahui'}</div>;
  }

  // Tampilan utama jika data berhasil diambil
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Daftar Anggota</h1>
        <Link 
          to="/anggota/tambah" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Tambah Anggota
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Telepon</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Pengecekan Array.isArray masih bagus untuk memastikan */}
            {Array.isArray(anggota) && anggota.length > 0 ? ( 
              anggota.map((member) => ( 
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.nomorTelepon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link 
                      to={`/anggota/edit/${member.id}`} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === member.id} 
                      className={`text-red-600 hover:text-red-900 ${deleteMutation.isPending && deleteMutation.variables === member.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === member.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* Tampilkan pesan jika array kosong */}
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data anggota.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
