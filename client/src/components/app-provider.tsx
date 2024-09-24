"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import React, { useState, createContext, useContext, useEffect } from "react";
import type { Account } from "@/types/auth";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/theme-provider";

// Định nghĩa kiểu dữ liệu cho context
interface AppProviderContextProps {
  user: Account | undefined;
  setUser: React.Dispatch<React.SetStateAction<Account | undefined>>;
}

const initialContext: AppProviderContextProps = {
  user: undefined,
  setUser: () => {},
};

export const AppProviderContext = createContext<AppProviderContextProps>(initialContext);

export const useAppProvider = () => useContext(AppProviderContext);

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Account | undefined>(undefined);

  // Sử dụng useEffect để lấy dữ liệu từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as Account);
    }
  }, []);

  // Khởi tạo QueryClient bên trong Component
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviderContext.Provider value={{ user, setUser }}>
        {children}
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </AppProviderContext.Provider>
    </QueryClientProvider>
  );
}
