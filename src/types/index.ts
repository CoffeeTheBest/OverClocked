export type ProductCategory = 
  | "laptop" | "keyboard" | "mouse" | "monitor" 
  | "headset" | "console" | "accessory" | "graphics card"
  | "controller" | "cpu" | "motherboard" | "ram" 
  | "cooling system" | "pc case" | "psu" | "storage" 
  | "streaming gear" | "gaming chair" | "vr" | "networking" 
  | "capture card" | "software" | "bundle" | "other";

export interface Product {
  _id: string;
  name: string;
  category: ProductCategory;
  brand?: string;
  description: string;
  price: number;
  quantity: number;
  specs?: string;
}

export interface User {
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface CartItem extends Product {
  quantity: number;
}

export interface GlobalContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
}

export interface ApiError {
  msg: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginForm {
  username: string;
  password: string;
  role: string;
}

export interface SignupForm {
  username: string;
  email: string;
  password: string;
  role: string;
}
