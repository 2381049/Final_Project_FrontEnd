import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider"; // Sesuaikan path jika perlu
import axios from "../utils/AxiosInstance"; // Sesuaikan path jika perlu
import { useMutation } from "@tanstack/react-query";
import React, { useState } from 'react'; // Import React dan useState

// Definisikan tipe data untuk input form login
export type LoginInput = {
  email: string;
  password: string;
};

// Komponen Login
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Ambil fungsi login dari AuthProvider
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State untuk pesan error

  // Inisialisasi react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors } // Ambil errors dari formState
  } = useForm<LoginInput>();

  // Fungsi yang akan dijalankan saat form disubmit
  const handleLogin = async (data: LoginInput) => {
    setErrorMessage(null); // Reset pesan error setiap kali mencoba login
    try {
      // Kirim request POST ke endpoint login backend
      const res = await axios.post<{ access_token: string }>(
        "/api/auth/login", // Pastikan endpoint ini benar
        {
          email: data.email,
          password: data.password
        }
      );

      // Cek apakah response berisi access_token
      if (res.data && res.data.access_token) {
        // Panggil fungsi login dari AuthProvider untuk menyimpan token
        login(res.data.access_token);
        // Arahkan pengguna ke halaman utama setelah login berhasil
        navigate("/");
      } else {
        // Jika response tidak sesuai harapan (jarang terjadi jika backend benar)
        setErrorMessage("Login failed: Invalid response from server.");
      }
    } catch (err: any) { // Tangkap error dari request Axios
      console.error("Login error:", err); // Log error ke konsol untuk debugging
      // Coba ambil pesan error spesifik dari backend jika ada
      const backendError = err.response?.data?.message;
      // Set pesan error untuk ditampilkan ke pengguna
      setErrorMessage(backendError || "Username or password is wrong. Please try again.");
    }
  };

  // Gunakan useMutation dari TanStack Query untuk menangani proses login
  const { mutate, isPending } = useMutation({
    mutationFn: handleLogin // Fungsi yang akan dijalankan oleh mutate
  });

  // Render komponen
  return (
    // Container utama, tengahkan form
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Card Form */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md relative overflow-hidden"> {/* Tambah relative & overflow-hidden untuk overlay */}

        {/* Loading Spinner Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-2xl">
            {/* Spinner */}
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Judul Form */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>

        {/* Tampilkan pesan error jika ada */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Form Login */}
        <form
          className="space-y-5"
          // Panggil mutate saat form disubmit setelah validasi react-hook-form
          onSubmit={handleSubmit((data) => mutate(data))}
          noValidate // Nonaktifkan validasi HTML bawaan, gunakan react-hook-form
        >
          {/* Input Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              // Tambahkan kelas error jika ada error validasi
              className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="you@example.com"
              // Daftarkan input ke react-hook-form dengan validasi
              {...register("email", { 
                  required: "Email is required", 
                  pattern: { // Contoh validasi format email
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                  } 
              })}
              aria-invalid={errors.email ? "true" : "false"} // Untuk aksesibilitas
            />
            {/* Tampilkan pesan error validasi email */}
            {errors.email && (
              <p className="text-red-600 text-xs mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              // Tambahkan kelas error jika ada error validasi
              className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="••••••••"
              // Daftarkan input ke react-hook-form dengan validasi
              {...register("password", { required: "Password is required" })}
              aria-invalid={errors.password ? "true" : "false"} // Untuk aksesibilitas
            />
            {/* Tampilkan pesan error validasi password */}
            {errors.password && (
              <p className="text-red-600 text-xs mt-1" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Tombol Submit */}
          <div>
            <button
              type="submit"
              // Disable tombol saat proses login berjalan (isPending)
              disabled={isPending}
              className="w-full flex justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Tampilkan teks berbeda saat loading */}
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Link ke Halaman Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button // Ganti <a> dengan <button> untuk navigasi programmatic yang lebih baik
            onClick={() => {
              navigate("/register"); // Gunakan navigate dari react-router-dom
            }}
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

// Ekspor komponen agar bisa digunakan di tempat lain
export default Login;

