import React, { useState } from 'react'; // Import useState untuk mobile menu
import { NavLink, useNavigate } from 'react-router-dom'; // Use NavLink for active styling
import { useAuth } from '../utils/AuthProvider'; // Import your Auth context hook

// Asumsi AuthContextType menyediakan 'user' (bisa null) dan 'logout'
interface AuthContextType {
  user: { [key: string]: any } | null; 
  logout: () => void;
}

const Navbar: React.FC = () => {
  const { user, logout } = useAuth() as AuthContextType; // Tetap ambil user untuk tombol Login/Logout
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
    setIsMobileMenuOpen(false); 
  };

  // Helper function for NavLink active styling
  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    let classes = 'px-3 py-2 rounded-md text-sm font-medium ';
    classes += isActive 
        ? 'bg-gray-900 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'; 
    return classes;
  };

  // Helper function for Mobile NavLink active styling 
  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
      return `block px-3 py-2 rounded-md text-base font-medium ${
        isActive 
          ? 'text-white bg-gray-700' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white' 
      }`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Brand/Logo and core links */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to="/" className="text-white font-bold text-xl">
                MyApp
              </NavLink>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={getNavLinkClass} end> 
                  Home
                </NavLink>
                {/* HAPUS KONDISI {user && ...} DARI SINI */}
                <> 
                  <NavLink to="/anggota" className={getNavLinkClass}>
                    Anggota
                  </NavLink>
                  <NavLink to="/jadwal" className={getNavLinkClass}>
                    Jadwal
                  </NavLink>
                  <NavLink to="/mentor" className={getNavLinkClass}>
                    Mentor
                  </NavLink>
                </>
                {/* --------------- */}
              </div>
            </div>
          </div>

          {/* Right side: Auth links / Logout */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Logika untuk tombol Login/Logout tetap berdasarkan 'user' */}
              {user ? ( 
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Logout
                </button>
              ) : (
                <div className="space-x-4">
                  <NavLink 
                    to="/login" 
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="text-gray-300 bg-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu} 
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" 
              aria-controls="mobile-menu" 
              aria-expanded={isMobileMenuOpen} 
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                 <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
              ) : (
                 <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu"> 
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/" className={getMobileNavLinkClass} end onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink> 
          {/* HAPUS KONDISI {user && ...} DARI SINI JUGA */}
          <> 
            <NavLink to="/anggota" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Anggota</NavLink>
            <NavLink to="/jadwal" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Jadwal</NavLink>
            <NavLink to="/mentor" className={getMobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Mentor</NavLink>
          </>
          {/* --------------- */}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {/* Logika Login/Logout di mobile tetap berdasarkan 'user' */}
          {user ? ( 
            <div className="px-2 space-y-1">
               <button
                  onClick={handleLogout} 
                  className="block w-full text-left bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-red-700"
                >
                  Logout
                </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <NavLink 
                to="/login" 
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)} 
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="block text-gray-300 bg-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                 onClick={() => setIsMobileMenuOpen(false)} 
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
