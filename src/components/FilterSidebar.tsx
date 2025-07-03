import React from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useDistributors } from '../hooks/useDistributors';
import { ProductCategory } from '../types';

const categories = [
  { id: 'cerveja', name: 'Cerveja', icon: '🍺' },
  { id: 'vinho', name: 'Vinho', icon: '🍷' },
  { id: 'whisky', name: 'Whisky', icon: '🥃' },
  { id: 'vodka', name: 'Vodka', icon: '🍸' },
  { id: 'gin', name: 'Gin', icon: '🍹' },
  { id: 'rum', name: 'Rum', icon: '🍹' },
  { id: 'cachaça', name: 'Cachaça', icon: '🍹' },
  { id: 'licor', name: 'Licor', icon: '🍷' },
  { id: 'espumante', name: 'Espumante', icon: '🥂' },
];

const FilterSidebar: React.FC = () => {
  const { showFilters, toggleFilters, filters, setFilters, clearFilters } = useAppStore();
  const { distributors } = useDistributors();

  if (!showFilters) return null;

  const handleCategoryChange = (category: ProductCategory) => {
    setFilters({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handleDistributorChange = (distributorId: string) => {
    setFilters({
      ...filters,
      distributorId: filters.distributorId === distributorId ? undefined : distributorId,
    });
  };

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    setFilters({
      ...filters,
      minPrice,
      maxPrice,
    });
  };

  const handleSortChange = (sortBy: 'price_asc' | 'price_desc' | 'name' | 'rating') => {
    setFilters({
      ...filters,
      sortBy: filters.sortBy === sortBy ? undefined : sortBy,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={toggleFilters} />
      
      {/* Sidebar */}
      <div className="relative w-80 bg-white dark:bg-neutral-900 shadow-xl p-6 overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Filtros
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearFilters}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
            <button
              onClick={toggleFilters}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
            Categorias
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id as ProductCategory)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  filters.category === category.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-xs">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
            Faixa de Preço
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePriceChange(0, 10)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                filters.minPrice === 0 && filters.maxPrice === 10
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              Até R$ 10
            </button>
            <button
              onClick={() => handlePriceChange(10, 30)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                filters.minPrice === 10 && filters.maxPrice === 30
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              R$ 10 - R$ 30
            </button>
            <button
              onClick={() => handlePriceChange(30, 60)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                filters.minPrice === 30 && filters.maxPrice === 60
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              R$ 30 - R$ 60
            </button>
            <button
              onClick={() => handlePriceChange(60, 1000)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                filters.minPrice === 60 && filters.maxPrice === 1000
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              Acima de R$ 60
            </button>
          </div>
        </div>

        {/* Distributors */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
            Distribuidoras
          </h3>
          <div className="space-y-2">
            {distributors.map((distributor) => (
              <button
                key={distributor.id}
                onClick={() => handleDistributorChange(distributor.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                  filters.distributorId === distributor.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={distributor.logo}
                    alt={distributor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{distributor.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {distributor.deliveryTime} • R$ {distributor.deliveryFee}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
            Ordenar por
          </h3>
          <div className="space-y-2">
            {[
              { key: 'price_asc' as const, label: 'Menor preço' },
              { key: 'price_desc' as const, label: 'Maior preço' },
              { key: 'name' as const, label: 'Nome A-Z' },
              { key: 'rating' as const, label: 'Mais avaliados' },
            ].map((sort) => (
              <button
                key={sort.key}
                onClick={() => handleSortChange(sort.key)}
                className={`w-full p-3 rounded-lg border text-left text-sm font-medium transition-all duration-200 ${
                  filters.sortBy === sort.key
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
