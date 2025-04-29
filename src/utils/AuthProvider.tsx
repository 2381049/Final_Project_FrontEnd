import React, { createContext, ReactNode, useContext, useState, useEffect, useCallback } from "react";
import AxiosInstance from "./AxiosInstance"; // Pastikan path benar

interface User {
  id: number | string;
  username: string;
  email: string;
  // Tambahkan properti lain jika ada
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null; 
  isLoading: boolean; // <-- Tambahkan isLoading
  login: (token: string) => Promise<void>; 
  logout: () => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Mulai dari false
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // <-- State loading, mulai true

  const getToken = useCallback((): string | null => {
    return localStorage.getItem("authToken"); // <-- KONSISTENSI KEY: Gunakan 'authToken'
  }, []);

  // Fungsi untuk mengambil data user berdasarkan token
  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        // Panggil API untuk mendapatkan data user 
        // Pastikan interceptor Axios sudah menambahkan token ke header ini
        const response = await AxiosInstance.get<User>('/api/auth/profile'); 
        
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("AuthProvider: Failed to fetch user profile:", error);
        // Token mungkin tidak valid, lakukan logout
        localStorage.removeItem("authToken"); // <-- KONSISTENSI KEY
        setUser(null);
        setIsAuthenticated(false);
      } finally {
         // Pastikan loading selesai baik sukses maupun gagal fetch user
         setIsLoading(false);
      }
    } else {
      // Jika tidak ada token, pastikan user null dan isAuth false, loading selesai
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false); // <-- Loading selesai jika tidak ada token
    }
  }, [getToken]); // Tambahkan getToken sebagai dependency jika diperlukan

  // Ambil data user saat komponen pertama kali dimuat
  useEffect(() => {
    setIsLoading(true); // Set loading true saat memulai fetch awal
    fetchUser();
  }, [fetchUser]); // Jalankan ulang jika fetchUser berubah (meskipun seharusnya tidak)

  // Modifikasi login
  const login = async (token: string) => {
    setIsLoading(true); // Set loading true saat proses login dimulai
    localStorage.setItem("authToken", token); // <-- KONSISTENSI KEY
    // Set authenticated true sementara, fetchUser akan konfirmasi
    setIsAuthenticated(true); 
    try {
       // Setelah set token, fetch data user untuk memastikan token valid & dapatkan data user
       await fetchUser(); 
    } catch (e) {
        // fetchUser sudah handle error dan logout jika perlu
    } finally {
        // Loading selesai setelah fetchUser dipanggil (baik sukses/gagal)
        // fetchUser sendiri sudah set isLoading(false) di dalamnya
    }
  };

  // Modifikasi logout
  const logout = () => {
    localStorage.removeItem("authToken"); // <-- KONSISTENSI KEY
    setIsAuthenticated(false);
    setUser(null); 
    setIsLoading(false); // Pastikan loading false saat logout
  };


  // Sertakan 'isLoading' dalam value
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, getToken }}>
      {/* Jangan render children sampai loading selesai */}
      {!isLoading ? children : null /* Atau tampilkan spinner global */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
