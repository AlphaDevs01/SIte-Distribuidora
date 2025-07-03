import { create } from 'zustand';
import { AdminUser } from '../types/admin';
import { AdminApiService } from '../services/adminApi';

interface AdminStore {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  currentAdmin: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const admin = await AdminApiService.login(email, password);
      if (admin) {
        set({ currentAdmin: admin, isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  logout: () => {
    AdminApiService.logout();
    set({ currentAdmin: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const admin = AdminApiService.getCurrentAdmin();
    set({ 
      currentAdmin: admin, 
      isAuthenticated: !!admin 
    });
  },
}));