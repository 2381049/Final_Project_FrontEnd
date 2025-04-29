import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios'; // Import AxiosRequestHeaders

// 1. Ambil Base URL dari Environment Variable
const apiBaseUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.DEV) {
  console.log('Axios Instance - API Base URL:', apiBaseUrl);
}

// 2. Buat Instance Axios
const instance = axios.create({
  baseURL: apiBaseUrl, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
    'Accept': 'application/json',
  }
});

// 3. Request Interceptor (Berjalan SEBELUM request dikirim)
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken'); 
    
    if (import.meta.env.DEV) {
        console.log('Axios Interceptor Request - Reading localStorage key "authToken". Token found:', token ? 'Yes' : 'No');
    }

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      // FIX: Cara lebih aman mengatur header
      // Pastikan objek headers ada
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders; // Inisialisasi jika belum ada
      }
      // Set header Authorization
      config.headers.Authorization = `Bearer ${token}`; 
      
      if (import.meta.env.DEV) {
          console.log('Axios Interceptor Request - Authorization header set.'); // Ini sekarang sekitar baris 39
      }
    } else {
        if (import.meta.env.DEV) {
            console.warn('Axios Interceptor Request - Token not found in localStorage for key "authToken".'); // Ini sekarang sekitar baris 43
        }
    }
    
    return config; // Ini sekarang sekitar baris 46
  },
  (error: AxiosError) => {
    // Handle error saat setup request interceptor
    console.error('Axios request interceptor error:', error); // Ini sekarang sekitar baris 50
    return Promise.reject(error); 
  }
);

// 4. Response Interceptor (Berjalan SETELAH response diterima) - Opsional tapi berguna
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('Axios response interceptor error:', error.response?.status, error.message); // Ini sekarang sekitar baris 61

    if (error.response && error.response.status === 401) {
      console.warn('Axios response interceptor: Received 401 Unauthorized. Logging out and redirecting.');
      localStorage.removeItem('authToken'); 
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
         window.location.href = '/login'; 
      }
    }

    return Promise.reject(error); 
  }
);

// 5. Ekspor instance yang sudah dikonfigurasi
export default instance;
