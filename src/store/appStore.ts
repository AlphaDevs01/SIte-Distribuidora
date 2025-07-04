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
    (set, get) => ({
      isDarkMode: true, // dark mode padrão
      filters: {},
      searchQuery: '',
      showFilters: false,
      
      toggleDarkMode: () => {
        set((state) => {
          const newDark = !state.isDarkMode;
          // Sincroniza com <html>
          if (newDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newDark };
        });
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
      // Ao reidratar, só ADICIONE a classe dark se isDarkMode for true, nunca remova automaticamente!
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
        // Nunca remova a classe dark aqui!
      }
    }
  )
);
