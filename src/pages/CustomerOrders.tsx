import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiService } from '../services/api';
import { Order } from '../types';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Clock, CheckCircle, Truck, Package, X, Eye } from 'lucide-react';

// Alterado para buscar apenas pelo número do pedido
interface SearchForm {
  orderId: string;
}

const CustomerOrders: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchForm>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedOrderId, setSearchedOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (data: SearchForm) => {
    setLoading(true);
    // Remove espaços extras e normaliza o número do pedido
    const normalizedOrderId = data.orderId.replace(/\s+/g, '').replace(/^#/, '').toUpperCase();
    setSearchedOrderId(normalizedOrderId);
    try {
      // Busca pelo short id usando o novo método
      const found = await ApiService.getOrderByShortId(normalizedOrderId);
      if (found) {
        setOrders([found]);
      } else {
        setOrders([]);
        toast('Nenhum pedido encontrado para este número.', { icon: 'ℹ️' });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Erro ao buscar pedido.');
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

      {/* Formulário de busca apenas por número do pedido */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Buscar Pedido
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              {...register('orderId', {
                required: 'Número do pedido é obrigatório',
                minLength: { value: 4, message: 'Digite pelo menos 4 caracteres' }
              })}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Digite o número do pedido (ex: #B879A73B ou B879A73B)"
            />
            {errors.orderId && (
              <p className="text-red-500 text-sm mt-1">{errors.orderId.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex-shrink-0"
          >
            {loading ? 'Buscando...' : 'Buscar Pedido'}
          </button>
        </form>
      </div>

      {/* Order List */}
      {loading && <LoadingSpinner />}

      {!loading && orders.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
             <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Pedido encontrado: "#{searchedOrderId}"
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
                    <button
                      onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                    >
                      Ver Detalhes <Eye className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && orders.length === 0 && searchedOrderId && (
         <div className="text-center p-8 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
           <p className="text-neutral-600 dark:text-neutral-400">
             Nenhum pedido encontrado para o número<span className="font-semibold text-neutral-900 dark:text-neutral-100">"#{searchedOrderId}"</span>.
           </p>
           <p className="text-neutral-600 dark:text-neutral-400 mt-2">
             Verifique se digitou o número corretamente.
           </p>
         </div>
      )}

       {!loading && !searchedOrderId && (
         <div className="text-center p-8 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
           <p className="text-neutral-600 dark:text-neutral-400">
             Digite o número do seu pedido acima (ex: #B879A73B) para ver o status.
           </p>
         </div>
      )}

      {/* Modal de detalhes do pedido */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
              Detalhes do Pedido #{selectedOrder.id.slice(-8).toUpperCase()}
            </h2>
            <div className="mb-4">
              <div className="mb-2">
                <span className="font-semibold">Status:</span> {getStatusText(selectedOrder.status)}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Data:</span> {selectedOrder.createdAt.toLocaleString('pt-BR')}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Pagamento:</span> {selectedOrder.paymentMethod}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Taxa de entrega:</span> R$ {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Endereço:</span> {selectedOrder.deliveryAddress}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Itens do Pedido</h4>
              <ul className="space-y-2">
                {selectedOrder.items.map(item => (
                  <li key={item.product.id} className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 py-2">
                    <div>
                      <span className="font-medium">{item.quantity}x {item.product.name}</span>
                      <span className="ml-2 text-neutral-500 text-xs">{item.product.volume} • {item.product.brand}</span>
                    </div>
                    <span className="font-medium">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-primary-600 dark:text-primary-400">R$ {selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;