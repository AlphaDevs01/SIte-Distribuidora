import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const ProductGrid: React.FC = () => {
  const { filters, searchQuery } = useAppStore();
  const { products, featuredProducts, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    if (loading || !products.length) return [];
    
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price filter
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => 
        product.price >= filters.minPrice! && product.price <= filters.maxPrice!
      );
    }

    // Distributor filter
    if (filters.distributorId) {
      filtered = filtered.filter(product => product.distributorId === filters.distributorId);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
          break;
      }
    }

    return filtered;
  }, [filters, searchQuery, products, loading]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-primary-600 dark:text-neutral-100 mb-2">
            Erro ao carregar produtos
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Products */}
      {!searchQuery && Object.keys(filters).length === 0 && featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-yellow-400 mb-6">
            Produtos em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary-600 dark:text-yellow-400">
          {searchQuery || Object.keys(filters).length > 0 ? 'Resultados' : 'Todos os Produtos'}
        </h2>
        <span className="text-sm text-neutral-500 dark:text-yellow-300">
          {filteredProducts.length} produtos encontrados
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-primary-600 dark:text-neutral-100 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Tente ajustar os filtros ou alterar sua busca
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
