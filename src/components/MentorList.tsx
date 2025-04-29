import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance'; // Instance Axios Anda
import { Link } from 'react-router-dom'; // Untuk tombol Edit/Tambah

// Definisikan tipe data Mentor sesuai dengan Entity di backend
// (Pastikan properti dan tipe datanya cocok dengan entity Mentor Anda)
interface Mentor {
  id: number;
  nama: string;
  email: string;
  spesialisasi: string;
  createdAt?: Date; 
  updatedAt?: Date;
}

// Fungsi untuk mengambil data mentor dari API
const fetchMentor = async (): Promise<Mentor[]> => {
  const response = await axios.get('/api/mentor'); // Endpoint untuk mentor
  return response.data;
};

// Fungsi untuk menghapus mentor
const deleteMentor = async (id: number) => {
    const response = await axios.delete(`/api/mentor/${id}`); // Endpoint delete mentor
    return response.data;
}

const MentorList: React.FC = () => {
  const queryClient = useQueryClient(); // Untuk invalidasi cache

  // Menggunakan useQuery untuk mengambil data mentor
  const { data: mentor, isLoading, isError, error } = useQuery<Mentor[], Error>({
    queryKey: ['mentor'], // Kunci unik untuk query mentor
    queryFn: fetchMentor, // Fungsi fetch data mentor
  });

  // Menggunakan useMutation untuk operasi hapus mentor
  const deleteMutation = useMutation({
    mutationFn: deleteMentor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor'] }); // Invalidate cache mentor
      alert('Mentor berhasil dihapus!');
      // Tambahkan notifikasi yang lebih baik jika perlu
    },
    onError: (err) => {
      console.error("Error deleting mentor:", err);
      // Coba ambil pesan error dari response jika ada
      const errorMsg = (err as any)?.response?.data?.message || 'Gagal menghapus mentor.';
      alert(errorMsg);
      // Handle error
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mentor ini?')) {
      deleteMutation.mutate(id);
    }
  };

  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Memuat data mentor...</span>
      </div>
    );
  }

  // Tampilan saat error
  if (isError) {
    return <div className="text-red-600 p-4">Error mengambil data: {error?.message || 'Terjadi kesalahan'}</div>;
  }

  // Tampilan utama
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Daftar Mentor</h1>
        {/* Tombol untuk menambah mentor baru */}
        <Link 
          to="/mentor/tambah" // Sesuaikan path ke form tambah mentor
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Tambah Mentor
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spesialisasi
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentor && mentor.length > 0 ? (
              mentor.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.spesialisasi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* Tombol Edit */}
                    <Link 
                      to={`/mentor/edit/${item.id}`} // Sesuaikan path ke form edit mentor
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    {/* Tombol Hapus */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === item.id} 
                      className={`text-red-600 hover:text-red-900 ${deleteMutation.isPending && deleteMutation.variables === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === item.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data mentor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorList;
