import React from 'react';
import { Plus, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  
  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-accent-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current" />
            <span>Destaque</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Distributor */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {product.distributorName}
          </span>
          <span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {product.volume}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-neutral-900 dark:text-yellow-400 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600 dark:text-yellow-400">
              R$ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-500 dark:text-yellow-200 line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {product.alcoholContent}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group"
        >
          <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span>Adicionar ao Carrinho</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
