import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Sesuaikan path

const PrivateRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Ambil isLoading juga

  // 1. Jika masih loading, jangan render apa-apa (atau tampilkan spinner)
  if (isLoading) {
    console.log("PrivateRoute: Auth state is loading...");
    // return <div>Loading Authentication...</div>; // Opsi: tampilkan loading
    return null; 
  }

  // 2. Jika sudah tidak loading, cek autentikasi
  if (!isAuthenticated) {
    // Jika tidak terautentikasi, redirect ke login
    console.log("PrivateRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />; 
  }

  // 3. Jika terautentikasi, render children atau Outlet
  console.log("PrivateRoute: Authenticated, rendering children/Outlet");
  // Jika komponen ini membungkus Route dengan children (versi lama react-router)
  // return <>{children}</>; 
  // Jika komponen ini digunakan pada <Route element={<PrivateRoute />}> (versi baru)
  // atau membungkus layout dengan <Outlet/>
   return children ? <>{children}</> : <Outlet />; // Render Outlet jika children tidak ada
};

export default PrivateRoute;
