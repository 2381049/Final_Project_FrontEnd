import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance'; // Sesuaikan path jika perlu
import { useNavigate, useParams } from 'react-router-dom';

// Tipe data untuk input form (sesuai CreateMentorDto/UpdateMentorDto)
interface MentorFormData {
  nama: string;
  email: string;
  spesialisasi: string;
}

// Tipe data Mentor dari backend (untuk fetch data saat edit)
interface Mentor {
  id: number;
  nama: string;
  email: string;
  spesialisasi: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Fungsi untuk mengambil data mentor berdasarkan ID (untuk mode edit)
const fetchMentorById = async (id: string | undefined): Promise<Mentor | null> => {
  if (!id) return null; 
  const response = await axios.get(`/api/mentor/${id}`); // Sesuaikan endpoint
  return response.data;
};

// Fungsi untuk membuat mentor baru
const createMentor = async (data: MentorFormData): Promise<Mentor> => {
  const response = await axios.post('/api/mentor', data); // Sesuaikan endpoint
  return response.data;
};

// Fungsi untuk mengupdate mentor
const updateMentor = async ({ id, data }: { id: string, data: Partial<MentorFormData> }): Promise<Mentor | null> => {
  const response = await axios.patch(`/api/mentor/${id}`, data); // Gunakan PATCH, sesuaikan endpoint
  return response.data;
};


const MentorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id); 

  // react-hook-form setup
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm<MentorFormData>();

  // useQuery untuk fetch data mentor jika dalam mode edit
  const { data: existingMentorData, isLoading: isLoadingMentor } = useQuery<Mentor | null, Error>({
    queryKey: ['mentor', id], // Kunci query termasuk ID
    queryFn: () => fetchMentorById(id),
    enabled: isEditMode, 
  });

  // Isi form dengan data yang ada saat mode edit
  useEffect(() => {
    if (isEditMode && existingMentorData) {
      reset({ 
        nama: existingMentorData.nama,
        email: existingMentorData.email,
        spesialisasi: existingMentorData.spesialisasi,
      });
    }
  }, [isEditMode, existingMentorData, reset]);

  // useMutation untuk create
  const createMutation = useMutation({
    mutationFn: createMentor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor'] }); // Invalidate cache list mentor
      alert('Mentor berhasil ditambahkan!');
      navigate('/mentor'); // Kembali ke halaman list mentor
    },
    onError: (error: any) => {
      console.error("Error creating mentor:", error);
      alert(`Gagal menambahkan mentor: ${error.response?.data?.message || error.message}`);
    }
  });

  // useMutation untuk update
  const updateMutation = useMutation({
    mutationFn: updateMentor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor'] }); 
      queryClient.invalidateQueries({ queryKey: ['mentor', id] }); 
      alert('Mentor berhasil diperbarui!');
      navigate('/mentor'); 
    },
    onError: (error: any) => {
      console.error("Error updating mentor:", error);
      alert(`Gagal memperbarui mentor: ${error.response?.data?.message || error.message}`);
    }
  });

  // Handler saat form disubmit
  const onSubmit: SubmitHandler<MentorFormData> = (data) => {
    if (isEditMode && id) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Tampilkan loading jika sedang mengambil data untuk edit
  if (isLoadingMentor) {
     return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Memuat data mentor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Mentor' : 'Tambah Mentor Baru'}
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

        {/* Input Spesialisasi */}
        <div>
          <label htmlFor="spesialisasi" className="block text-sm font-medium text-gray-700">Spesialisasi</label>
          <input
            id="spesialisasi"
            type="text"
            {...register("spesialisasi", { required: "Spesialisasi tidak boleh kosong" })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.spesialisasi ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.spesialisasi ? "true" : "false"}
          />
          {errors.spesialisasi && <p className="text-red-600 text-xs mt-1" role="alert">{errors.spesialisasi.message}</p>}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-4">
           <button
             type="button"
             onClick={() => navigate('/mentor')} // Tombol batal kembali ke list mentor
             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
           >
             Batal
           </button>
           <button
             type="submit"
             disabled={isSubmitting || createMutation.isPending || updateMutation.isPending} 
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isSubmitting || createMutation.isPending || updateMutation.isPending 
                ? 'Menyimpan...' 
                : (isEditMode ? 'Update Mentor' : 'Tambah Mentor')}
           </button>
        </div>
      </form>
    </div>
  );
};

export default MentorForm;
