    /// <reference types="vite/client" />

    interface ImportMetaEnv {
      // Variabel custom Anda (pastikan ini ada dan namanya benar)
      readonly VITE_API_URL: string; 

      // Variabel standar Vite (pastikan ini ada)
      readonly MODE: string;
      readonly DEV: boolean; // <-- BARIS INI PENTING
      readonly PROD: boolean;
      readonly BASE_URL: string;
      
      // Tambahkan variabel VITE_* lainnya yang mungkin Anda gunakan
    }

    interface ImportMeta {
      readonly env: ImportMetaEnv;
    }
    