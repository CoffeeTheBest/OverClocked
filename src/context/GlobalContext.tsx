import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { User, CartItem, GlobalContextType } from '../types';


type DecodedToken = {
  username: string;
  email: string;
  role: "user" | "admin";
  exp: number;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setCurrentUser({ username: decoded.username, email: decoded.email, role: decoded.role });
      } catch (err) {
        console.error("Invalid token", err);
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setCurrentUser(null);
      }
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ currentUser, setCurrentUser, cart, setCart }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobal must be used within GlobalProvider");
  return context;
};