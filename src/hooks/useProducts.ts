import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ApiService } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [allProducts, featured] = await Promise.all([
          ApiService.getProducts(),
          ApiService.getFeaturedProducts(),
        ]);
        
        setProducts(allProducts);
        setFeaturedProducts(featured);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, featuredProducts, loading, error };
};
