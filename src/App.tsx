// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'; 
import { AuthProvider } from './utils/AuthProvider';
import PrivateRoute from './utils/PrivateRoute'; 
import PublicRoute from './utils/PublicRoute'; 
import Navbar from './components/Navbar'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import MemberPage from './pages/MemberPage';
import SchedulePage from './pages/SchedulePage';
import SpecialistPage from './pages/SpecialistPage'; 
import NotFoundPage from './pages/NotFoundPage';
import MemberForm from './components/MemberForm'; 
import ScheduleForm from './components/ScheduleForm'; 
import MentorForm from './components/MentorForm'; // <-- Import MentorForm

// Define a layout component specifically for protected routes
const ProtectedLayout: React.FC = () => {
  return (
    <>
      <Navbar /> 
      <main className="container mx-auto p-4">
        <Outlet /> 
      </main>
    </>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- Rute Publik --- */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
           <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* --- Rute Terproteksi (Membutuhkan Login) --- */}
          <Route 
            element={
              <PrivateRoute> 
                <ProtectedLayout /> 
              </PrivateRoute>
            }
          >
            <Route path="/home" element={<HomePage />} /> 
            
            {/* Rute Anggota (Terproteksi) */}
            <Route path="/anggota" element={<MemberPage />} /> 
            <Route path="/anggota/tambah" element={<MemberForm />} /> 
            <Route path="/anggota/edit/:id" element={<MemberForm />} /> 
            
            {/* Rute Jadwal (Terproteksi) */}
            <Route path="/jadwal" element={<SchedulePage />} />  
            <Route path="/jadwal/tambah" element={<ScheduleForm />} /> 
            <Route path="/jadwal/edit/:id" element={<ScheduleForm />} />

            {/* Rute Mentor (Terproteksi) */}
            <Route path="/mentor" element={<SpecialistPage />} /> 
            {/* TAMBAHKAN RUTE FORM MENTOR DI SINI */}
            <Route path="/mentor/tambah" element={<MentorForm />} /> 
            <Route path="/mentor/edit/:id" element={<MentorForm />} />
            {/* ----------------------------------- */}

          </Route>

          {/* --- Rute 404 --- */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 
