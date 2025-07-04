import React from 'react';
import { Search, ShoppingCart, Menu, Sun, Moon } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { getTotalItems, openCart } = useCartStore();
  const { isDarkMode, toggleDarkMode, searchQuery, setSearchQuery, toggleFilters } = useAppStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-primary/95 dark:bg-olive-dark/95 backdrop-blur-md border-b border-brown-dark dark:border-olive-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Distribuidora de bebidas 24hrs
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-accent" />
              <input
                type="text"
                placeholder="Buscar bebidas, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brown-dark dark:border-olive-dark rounded-full bg-primary-light dark:bg-brown-dark text-olive-dark dark:text-primary-light placeholder-accent focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-primary-light dark:hover:bg-brown-dark transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-olive-dark dark:text-primary-light" />
              ) : (
                <Moon className="h-5 w-5 text-olive-dark dark:text-primary-light" />
              )}
            </button>

            {/* Filters */}
            <button
              onClick={toggleFilters}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full border border-brown-dark dark:border-olive-dark hover:bg-primary-light dark:hover:bg-brown-dark transition-colors duration-200"
            >
              <Menu className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-olive-dark dark:text-primary-light">Filtros</span>
            </button>
            <button
              onClick={() => navigate('/my-orders')}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full border border-brown-dark dark:border-olive-dark hover:bg-primary-light dark:hover:bg-brown-dark transition-colors duration-200"
            >
              <span className="text-sm font-medium text-olive-dark dark:text-primary-light">Pedidos</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full border border-brown-dark dark:border-olive-dark hover:bg-primary-light dark:hover:bg-brown-dark transition-colors duration-200"
            >
              <span className="text-sm font-medium text-olive-dark dark:text-primary-light">Catálogo</span>
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full bg-accent hover:bg-brown-dark text-primary-light transition-colors duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-dark text-olive-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-bounce-subtle">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;