import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, CartItem, GlobalContextType, Theme } from '../types';
import API from '../api';


// type DecodedToken = {
//   username: string;
//   email: string;
//   role: "user" | "admin";
//   exp: number;
// };

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const part = parts.pop();
      if (part) return part.split(';').shift() || null;
    }
    return null;
  };

  const [cart, setCart] = useState<CartItem[]>(() => {
    const cartCookie = getCookie("cart");
    try {
      return cartCookie ? JSON.parse(cartCookie) : [];
    } catch {
      return [];
    }
  });

  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('overclocked-theme') as Theme;
    return savedTheme || 'dark'; // Default to dark theme to match current design
  });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('overclocked-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    // Check if user is authenticated by calling the backend
    const checkAuthStatus = async () => {
      try {
        const response = await API.get('/auth/me');
        const user = response.data.user;
        setCurrentUser(user);
        console.log('User authenticated:', user);
      } catch (error: any) {
        // If the request fails (401, 403, etc.), user is not authenticated
        console.log('User not authenticated or session expired');
        setCurrentUser(null);
        // Clean up any stale cookies
        document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <GlobalContext.Provider value={{ currentUser, setCurrentUser, cart, setCart, theme, toggleTheme, isAuthLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};
