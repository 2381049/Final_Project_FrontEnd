import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Sesuaikan path
import { ReactNode } from "react";


const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Ambil isLoading juga

  // 1. Jika masih loading, jangan render apa-apa (atau tampilkan spinner)
  if (isLoading) {
    console.log("PublicRoute: Auth state is loading...");
    // return <div>Loading Authentication...</div>; // Opsi: tampilkan loading
    return null; 
  }

  // 2. Jika sudah tidak loading, cek autentikasi
  if (isAuthenticated) {
    // Jika SUDAH login, redirect ke halaman utama setelah login
    console.log("PublicRoute: Authenticated, redirecting to /home");
    return <Navigate to="/home" replace />; 
  }

  // 3. Jika BELUM login, render halaman publik (Login/Register)
  console.log("PublicRoute: Not authenticated, rendering children");
  return <>{children}</>; 
};

export default PublicRoute;
