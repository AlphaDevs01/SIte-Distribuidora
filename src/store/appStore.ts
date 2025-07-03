import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FilterOptions } from '../types';

interface AppStore {
  isDarkMode: boolean;
  filters: FilterOptions;
  searchQuery: string;
  showFilters: boolean;
  toggleDarkMode: () => void;
  setFilters: (filters: FilterOptions) => void;
  setSearchQuery: (query: string) => void;
  toggleFilters: () => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      filters: {},
      searchQuery: '',
      showFilters: false,
      
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      setFilters: (filters) => {
        set({ filters });
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      toggleFilters: () => {
        set((state) => ({ showFilters: !state.showFilters }));
      },
      
      clearFilters: () => {
        set({ filters: {}, searchQuery: '' });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);