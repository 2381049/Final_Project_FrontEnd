import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

// Tipe data untuk input form (sesuaikan dengan CreateAnggotaDto/UpdateAnggotaDto)
interface MemberFormData {
  nama: string;
  email: string;
  nomorTelepon: string;
}

// Tipe data Anggota dari backend (untuk fetch data saat edit)
interface Anggota {
  id: number;
  nama: string;
  email: string;
  nomorTelepon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Fungsi untuk mengambil data anggota berdasarkan ID (untuk mode edit)
const fetchAnggotaById = async (id: string | undefined): Promise<Anggota | null> => {
  if (!id) return null; // Jangan fetch jika tidak ada ID
  const response = await axios.get(`/api/anggota/${id}`);
  return response.data;
};

// Fungsi untuk membuat anggota baru
const createAnggota = async (data: MemberFormData): Promise<Anggota> => {
  const response = await axios.post('/api/anggota', data);
  return response.data;
};

// Fungsi untuk mengupdate anggota
const updateAnggota = async ({ id, data }: { id: string, data: Partial<MemberFormData> }): Promise<Anggota | null> => {
  const response = await axios.patch(`/api/anggota/${id}`, data); // Gunakan PATCH
  return response.data;
};


const MemberForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Ambil ID dari URL jika ada (mode edit)
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id); // Tentukan apakah ini mode edit atau tambah

  // react-hook-form setup
  const { 
    register, 
    handleSubmit, 
    reset, // Untuk mengisi form saat edit
    formState: { errors, isSubmitting } // Ambil errors dan isSubmitting
  } = useForm<MemberFormData>();

  // useQuery untuk fetch data anggota jika dalam mode edit
  const { data: existingMemberData, isLoading: isLoadingMember } = useQuery<Anggota | null, Error>({
    queryKey: ['anggota', id], // Kunci query termasuk ID
    queryFn: () => fetchAnggotaById(id),
    enabled: isEditMode, // Hanya aktifkan query jika isEditMode true
  });

  // Isi form dengan data yang ada saat mode edit dan data sudah ter-load
  useEffect(() => {
    if (isEditMode && existingMemberData) {
      reset({ // Gunakan reset dari react-hook-form
        nama: existingMemberData.nama,
        email: existingMemberData.email,
        nomorTelepon: existingMemberData.nomorTelepon,
      });
    }
  }, [isEditMode, existingMemberData, reset]);

  // useMutation untuk create
  const createMutation = useMutation({
    mutationFn: createAnggota,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota'] }); // Invalidate cache list anggota
      alert('Anggota berhasil ditambahkan!');
      navigate('/anggota'); // Kembali ke halaman list
    },
    onError: (error: any) => {
      console.error("Error creating member:", error);
      alert(`Gagal menambahkan anggota: ${error.response?.data?.message || error.message}`);
    }
  });

  // useMutation untuk update
  const updateMutation = useMutation({
    mutationFn: updateAnggota,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota'] }); // Invalidate cache list
      queryClient.invalidateQueries({ queryKey: ['anggota', id] }); // Invalidate cache detail (jika ada)
      alert('Anggota berhasil diperbarui!');
      navigate('/anggota'); // Kembali ke halaman list
    },
    onError: (error: any) => {
      console.error("Error updating member:", error);
      alert(`Gagal memperbarui anggota: ${error.response?.data?.message || error.message}`);
    }
  });

  // Handler saat form disubmit
  const onSubmit: SubmitHandler<MemberFormData> = (data) => {
    if (isEditMode && id) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Tampilkan loading jika sedang mengambil data untuk edit
  if (isLoadingMember) {
     return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Memuat data anggota...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Anggota' : 'Tambah Anggota Baru'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Input Nama */}
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            id="nama"
            type="text"
            {...register("nama", { required: "Nama tidak boleh kosong" })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.nama ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.nama ? "true" : "false"}
          />
          {errors.nama && <p className="text-red-600 text-xs mt-1" role="alert">{errors.nama.message}</p>}
        </div>

        {/* Input Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", { 
              required: "Email tidak boleh kosong",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format email tidak valid"
              } 
            })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <p className="text-red-600 text-xs mt-1" role="alert">{errors.email.message}</p>}
        </div>

        {/* Input Nomor Telepon */}
        <div>
          <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            id="nomorTelepon"
            type="tel" // Gunakan type="tel" untuk nomor telepon
            {...register("nomorTelepon", { required: "Nomor telepon tidak boleh kosong" })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.nomorTelepon ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.nomorTelepon ? "true" : "false"}
          />
          {errors.nomorTelepon && <p className="text-red-600 text-xs mt-1" role="alert">{errors.nomorTelepon.message}</p>}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-4">
           <button
             type="button"
             onClick={() => navigate('/anggota')} // Tombol batal kembali ke list
             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
           >
             Batal
           </button>
           <button
             type="submit"
             disabled={isSubmitting || createMutation.isPending || updateMutation.isPending} // Disable saat submit/mutasi
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isSubmitting || createMutation.isPending || updateMutation.isPending 
                ? 'Menyimpan...' 
                : (isEditMode ? 'Update Anggota' : 'Tambah Anggota')}
           </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;

