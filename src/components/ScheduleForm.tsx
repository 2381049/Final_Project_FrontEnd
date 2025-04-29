import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance'; // Sesuaikan path jika perlu
import { useNavigate, useParams } from 'react-router-dom';

// Tipe data untuk input form (sesuai CreateJadwalDto/UpdateJadwalDto)
interface ScheduleFormData {
  namaKegiatan: string;
  tanggal: string; // Tetap string untuk input type="datetime-local"
  lokasi: string;
}

// Tipe data Jadwal dari backend (untuk fetch data saat edit)
interface Jadwal {
  id: number;
  namaKegiatan: string;
  tanggal: string | Date; // Bisa string atau Date tergantung API/fetch
  lokasi: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper untuk format Date ke string YYYY-MM-DDTHH:mm yang diterima datetime-local
const formatDateForInput = (date: string | Date | undefined): string => {
  if (!date) return '';
  try {
    const d = new Date(date);
    // Format: YYYY-MM-DDTHH:MM
    // Tambah padding jika perlu (padStart)
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return '';
  }
};


// Fungsi untuk mengambil data jadwal berdasarkan ID (untuk mode edit)
const fetchJadwalById = async (id: string | undefined): Promise<Jadwal | null> => {
  if (!id) return null; 
  const response = await axios.get(`/api/jadwal/${id}`); // Sesuaikan endpoint
  return response.data;
};

// Fungsi untuk membuat jadwal baru
const createJadwal = async (data: ScheduleFormData): Promise<Jadwal> => {
  // Pastikan format tanggal sesuai yang diharapkan backend (misal ISO string)
  const payload = {
      ...data,
      tanggal: new Date(data.tanggal).toISOString() // Konversi ke ISO string saat mengirim
  };
  const response = await axios.post('/api/jadwal', payload); // Sesuaikan endpoint
  return response.data;
};

// Fungsi untuk mengupdate jadwal
const updateJadwal = async ({ id, data }: { id: string, data: Partial<ScheduleFormData> }): Promise<Jadwal | null> => {
   // Pastikan format tanggal sesuai yang diharapkan backend jika diubah
   const payload = {
      ...data,
      ...(data.tanggal && { tanggal: new Date(data.tanggal).toISOString() }) // Konversi jika tanggal ada
  };
  const response = await axios.patch(`/api/jadwal/${id}`, payload); // Gunakan PATCH, sesuaikan endpoint
  return response.data;
};


const ScheduleForm: React.FC = () => {
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
  } = useForm<ScheduleFormData>();

  // useQuery untuk fetch data jadwal jika dalam mode edit
  const { data: existingScheduleData, isLoading: isLoadingSchedule } = useQuery<Jadwal | null, Error>({
    queryKey: ['jadwal', id], 
    queryFn: () => fetchJadwalById(id),
    enabled: isEditMode, 
  });

  // Isi form dengan data yang ada saat mode edit
  useEffect(() => {
    if (isEditMode && existingScheduleData) {
      reset({ 
        namaKegiatan: existingScheduleData.namaKegiatan,
        // Format tanggal dari API ke format input datetime-local
        tanggal: formatDateForInput(existingScheduleData.tanggal), 
        lokasi: existingScheduleData.lokasi,
      });
    }
  }, [isEditMode, existingScheduleData, reset]);

  // useMutation untuk create
  const createMutation = useMutation({
    mutationFn: createJadwal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal'] }); 
      alert('Jadwal berhasil ditambahkan!');
      navigate('/jadwal'); 
    },
    onError: (error: any) => {
      console.error("Error creating schedule:", error);
      alert(`Gagal menambahkan jadwal: ${error.response?.data?.message || error.message}`);
    }
  });

  // useMutation untuk update
  const updateMutation = useMutation({
    mutationFn: updateJadwal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jadwal'] }); 
      queryClient.invalidateQueries({ queryKey: ['jadwal', id] }); 
      alert('Jadwal berhasil diperbarui!');
      navigate('/jadwal'); 
    },
    onError: (error: any) => {
      console.error("Error updating schedule:", error);
      alert(`Gagal memperbarui jadwal: ${error.response?.data?.message || error.message}`);
    }
  });

  // Handler saat form disubmit
  const onSubmit: SubmitHandler<ScheduleFormData> = (data) => {
    if (isEditMode && id) {
      updateMutation.mutate({ id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Tampilkan loading jika sedang mengambil data untuk edit
  if (isLoadingSchedule) {
     return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Memuat data jadwal...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Input Nama Kegiatan */}
        <div>
          <label htmlFor="namaKegiatan" className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
          <input
            id="namaKegiatan"
            type="text"
            {...register("namaKegiatan", { required: "Nama kegiatan tidak boleh kosong" })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.namaKegiatan ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.namaKegiatan ? "true" : "false"}
          />
          {errors.namaKegiatan && <p className="text-red-600 text-xs mt-1" role="alert">{errors.namaKegiatan.message}</p>}
        </div>

        {/* Input Tanggal & Waktu */}
        <div>
          <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal & Waktu</label>
          <input
            id="tanggal"
            type="datetime-local" // Gunakan type datetime-local
            {...register("tanggal", { 
              required: "Tanggal tidak boleh kosong",
              // Validasi tambahan mungkin diperlukan jika backend sangat ketat
              // valueAsDate: true // Bisa ditambahkan jika ingin validasi sebagai Date object
            })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.tanggal ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.tanggal ? "true" : "false"}
          />
          {errors.tanggal && <p className="text-red-600 text-xs mt-1" role="alert">{errors.tanggal.message}</p>}
        </div>

        {/* Input Lokasi */}
        <div>
          <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">Lokasi</label>
          <input
            id="lokasi"
            type="text"
            {...register("lokasi", { required: "Lokasi tidak boleh kosong" })}
            className={`mt-1 block w-full px-4 py-2 border ${errors.lokasi ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.lokasi ? "true" : "false"}
          />
          {errors.lokasi && <p className="text-red-600 text-xs mt-1" role="alert">{errors.lokasi.message}</p>}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-4">
           <button
             type="button"
             onClick={() => navigate('/jadwal')} // Tombol batal kembali ke list jadwal
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
                : (isEditMode ? 'Update Jadwal' : 'Tambah Jadwal')}
           </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
