import { useState, useEffect } from 'react';
import { Distributor } from '../types';
import { ApiService } from '../services/api';

export const useDistributors = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getDistributors();
        setDistributors(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching distributors:', err);
        setError('Erro ao carregar distribuidoras');
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  return { distributors, loading, error };
};
