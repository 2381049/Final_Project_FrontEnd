import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance'; // Instance Axios Anda
import { Link } from 'react-router-dom'; // Untuk tombol Edit/Tambah

// Definisikan tipe data Jadwal sesuai dengan Entity di backend
interface Jadwal {
  id: number;
  namaKegiatan: string;
  tanggal: string | Date; 
  lokasi: string;
  createdAt?: Date; 
  updatedAt?: Date;
}

// Fungsi untuk mengambil data jadwal dari API
const fetchJadwal = async (): Promise<Jadwal[]> => {
  try {
      const response = await axios.get('/api/jadwal'); // Endpoint untuk jadwal
      // Mungkin perlu konversi tipe tanggal jika API mengembalikan string tapi Anda ingin Date
      return Array.isArray(response.data) ? response.data.map((item: any) => ({
          ...item,
          tanggal: new Date(item.tanggal) // Contoh konversi ke Date object
      })) : [];
  } catch (error) {
      console.error("Error fetching jadwal:", error);
      throw error; // Lempar ulang error
  }
};

// Fungsi untuk menghapus jadwal
const deleteJadwal = async (id: number) => {
    const response = await axios.delete(`/api/jadwal/${id}`); // Endpoint delete jadwal
    return response.data;
}

// Helper function untuk format tanggal
const formatTanggal = (tanggal: string | Date): string => {
    try {
        const dateObj = typeof tanggal === 'string' ? new Date(tanggal) : tanggal;
        return dateObj.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false 
        }).replace(' pukul', ','); 
    } catch (e) {
        return 'Invalid Date'; 
    }
}

const ScheduleList: React.FC = () => {
  const queryClient = useQueryClient(); 

  // Menggunakan useQuery untuk mengambil data jadwal
  const { data: jadwal, isLoading, isError, error } = useQuery<Jadwal[], Error>({
    queryKey: ['jadwal'], 
    queryFn: fetchJadwal, 
  });

   // --- DEBUGGING ---
  console.log("Data Jadwal:", jadwal); 
  console.log("Is Loading Jadwal:", isLoading);
  console.log("Is Error Jadwal:", isError);
  if (error) {
    console.error("Query Error Jadwal:", error);
  }
  // ---------------


  // Menggunakan useMutation untuk operasi hapus jadwal
  const deleteMutation = useMutation({
    mutationFn: deleteJadwal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal'] }); 
      alert('Jadwal berhasil dihapus!');
    },
    onError: (err: any) => {
      console.error("Error deleting schedule:", err);
      alert(`Gagal menghapus jadwal: ${err.response?.data?.message || err.message}`);
    }
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      deleteMutation.mutate(id);
    }
  };

  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Memuat data jadwal...</span>
      </div>
    );
  }

  // Tampilan saat error
  if (isError) {
    return <div className="text-red-600 p-4">Error mengambil data jadwal: {error?.message || 'Terjadi kesalahan'}</div>;
  }

  // Tampilan utama
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Daftar Jadwal Kegiatan</h1>
        {/* UPDATE LINK TAMBAH */}
        <Link 
          to="/jadwal/tambah" // <-- Path ke form tambah jadwal
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Tambah Jadwal
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kegiatan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(jadwal) && jadwal.length > 0 ? (
              jadwal.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaKegiatan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatTanggal(item.tanggal)}</td> 
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.lokasi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* UPDATE LINK EDIT */}
                    <Link 
                      to={`/jadwal/edit/${item.id}`} // <-- Path ke form edit jadwal dengan ID
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
                  Tidak ada data jadwal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleList;
