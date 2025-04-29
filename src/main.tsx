// src/main.tsx

import React from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from './App.tsx';

// 1. Import QueryClient dan QueryClientProvider dari @tanstack/react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// (Opsional) Import React Query DevTools
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 2. Buat instance QueryClient
const queryClient = new QueryClient();

// Dapatkan root element
const rootElement = document.getElementById('root');

// Pastikan root element ada sebelum me-render
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode> {/* // Sebaiknya gunakan StrictMode */}
      {/* 3. Bungkus App dengan QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        <App />
        {/* (Opsional) Tambahkan DevTools di sini */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element. Make sure your public/index.html has an element with id 'root'.");
}

