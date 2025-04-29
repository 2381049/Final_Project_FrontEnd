// FIX: Hapus 'React' jika tidak digunakan, import hook spesifik
import { 
  createContext, 
  ReactNode, 
  useContext, 
  useState, 
  useEffect, 
  useCallback 
} from "react"; 
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
  isLoading: boolean; 
  login: (token: string) => Promise<void>; 
  logout: () => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); 
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const getToken = useCallback((): string | null => {
    return localStorage.getItem("authToken"); 
  }, []);

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await AxiosInstance.get<User>('/api/auth/profile'); 
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("AuthProvider: Failed to fetch user profile:", error);
        localStorage.removeItem("authToken"); 
        setUser(null);
        setIsAuthenticated(false);
      } finally {
         setIsLoading(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false); 
    }
  }, [getToken]); 

  useEffect(() => {
    setIsLoading(true); 
    fetchUser();
  }, [fetchUser]); 

  const login = async (token: string) => {
    setIsLoading(true); 
    localStorage.setItem("authToken", token); 
    setIsAuthenticated(true); 
    try {
       await fetchUser(); 
    } catch (e) {
        // fetchUser sudah handle error
    } 
    // isLoading akan diset false di dalam fetchUser
  };

  const logout = () => {
    localStorage.removeItem("authToken"); 
    setIsAuthenticated(false);
    setUser(null); 
    setIsLoading(false); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, getToken }}>
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
