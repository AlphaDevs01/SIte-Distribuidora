import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiService } from '../services/api';
import { Order } from '../types';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Clock, CheckCircle, Truck, Package, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchForm {
  email: string;
}

const CustomerOrders: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SearchForm>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedEmail, setSearchedEmail] = useState('');

  const onSubmit = async (data: SearchForm) => {
    setLoading(true);
    setSearchedEmail(data.email);
    try {
      const fetchedOrders = await ApiService.getOrdersByEmail(data.email);
      // Sort orders by creation date, newest first
      setOrders(fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      if (fetchedOrders.length === 0) {
        toast('Nenhum pedido encontrado para este email.', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao buscar pedidos.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'preparing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'on_way': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'on_way': return 'Saiu para entrega';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'preparing': return Package;
      case 'on_way': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return X;
      default: return Clock;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Meus Pedidos
      </h1>

      {/* Email Search Form */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Buscar Pedidos por Email
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              type="email"
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Digite o email usado no pedido"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex-shrink-0"
          >
            {loading ? 'Buscando...' : 'Buscar Pedidos'}
          </button>
        </form>
      </div>

      {/* Order List */}
      {loading && <LoadingSpinner />}

      {!loading && orders.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
             <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Pedidos para "{searchedEmail}"
            </h3>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Realizado em {order.createdAt.toLocaleDateString('pt-BR')} às {order.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                       <StatusIcon className="h-3 w-3 mr-1" />
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                       <p className="text-sm text-neutral-600 dark:text-neutral-400">
                         Total: <span className="font-medium text-neutral-900 dark:text-neutral-100">R$ {order.total.toFixed(2)}</span>
                       </p>
                       <p className="text-sm text-neutral-600 dark:text-neutral-400">
                         {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                       </p>
                    </div>
                     {/* Optional: Button to view full details if needed later */}
                     {/* <button
                       onClick={() => navigate(`/order-confirmation/${order.id}`)}
                       className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                     >
                       Ver Detalhes <Eye className="h-4 w-4 ml-1" />
                     </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && orders.length === 0 && searchedEmail && (
         <div className="text-center p-8 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
           <p className="text-neutral-600 dark:text-neutral-400">
             Nenhum pedido encontrado para o email <span className="font-semibold text-neutral-900 dark:text-neutral-100">"{searchedEmail}"</span>.
           </p>
           <p className="text-neutral-600 dark:text-neutral-400 mt-2">
             Verifique se digitou o email corretamente.
           </p>
         </div>
      )}

       {!loading && !searchedEmail && (
         <div className="text-center p-8 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
           <p className="text-neutral-600 dark:text-neutral-400">
             Digite seu email acima para ver seus pedidos.
           </p>
         </div>
      )}
    </div>
  );
};

export default CustomerOrders;
