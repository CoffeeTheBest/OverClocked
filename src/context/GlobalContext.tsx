import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, CartItem, GlobalContextType, Theme, Address } from '../types';
import API from '../api';


// type DecodedToken = {
//   username: string;
//   email: string;
//   role: "user" | "admin";
//   exp: number;
// };

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Try to get user from localStorage as backup
    const savedUser = localStorage.getItem('overclocked-user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
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

  // User address storage with localStorage persistence
  const [userAddress, setUserAddress] = useState<Address | null>(() => {
    const savedAddress = localStorage.getItem('overclocked-user-address');
    try {
      return savedAddress ? JSON.parse(savedAddress) : null;
    } catch {
      return null;
    }
  });

  // Theme state with localStorage persistence
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('overclocked-theme') as Theme;
    // Validate saved theme is still valid
    const validThemes: Theme[] = [
      'dark', 'light', 'purple-dark', 'purple-light',
      'ocean-dark', 'ocean-light', 'forest-dark', 'forest-light',
      'sunset-dark', 'sunset-light', 'cyber-dark', 'cyber-light'
    ];
    return savedTheme && validThemes.includes(savedTheme) ? savedTheme : 'purple-dark'; // Default to purple-dark theme
  });

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('overclocked-theme', theme);
  }, [theme]);

  // Persist user address to localStorage
  useEffect(() => {
    if (userAddress) {
      localStorage.setItem('overclocked-user-address', JSON.stringify(userAddress));
    } else {
      localStorage.removeItem('overclocked-user-address');
    }
  }, [userAddress]);

  // Persist user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('overclocked-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('overclocked-user');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    // Toggle between light and dark variants of the current theme
    const isDark = theme.endsWith('-dark') || theme === 'dark';
    
    if (theme === 'dark') {
      setThemeState('light');
    } else if (theme === 'light') {
      setThemeState('dark');
    } else if (isDark) {
      // Switch to light variant
      setThemeState(theme.replace('-dark', '-light') as Theme);
    } else {
      // Switch to dark variant
      setThemeState(theme.replace('-light', '-dark') as Theme);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
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
        console.log('User not authenticated or session expired:', error.response?.status);
        setCurrentUser(null);
        // Clean up any stale cookies and user data
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Clear stored address when user logs out
        setUserAddress(null);
        // Clear localStorage backup
        localStorage.removeItem('overclocked-user');
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <GlobalContext.Provider value={{ currentUser, setCurrentUser, cart, setCart, theme, toggleTheme, setTheme, isAuthLoading, userAddress, setUserAddress }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
