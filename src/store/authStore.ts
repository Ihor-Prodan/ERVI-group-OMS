import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserCompany {
  id: string;
  slug: string;
  name: string;
  street: string;
  psc: string;
  city: string;
  country: string;
  email: string;
  phone: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'accountant' | 'company';
  companyId?: string | null;
  company?: UserCompany | null;
  mustChangePassword?: boolean;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logoutUser: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
);
