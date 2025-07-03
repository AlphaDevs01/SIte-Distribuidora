import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const FloatingCartButton: React.FC = () => {
  const { getTotalItems, getTotalPrice, openCart } = useCartStore();

  if (getTotalItems() === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3 transition-all duration-200 animate-slide-up z-40"
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
          {getTotalItems()}
        </span>
      </div>
      <div className="hidden sm:block">
        <div className="text-sm font-medium">
          R$ {getTotalPrice().toFixed(2)}
        </div>
      </div>
    </button>
  );
};

export default FloatingCartButton;