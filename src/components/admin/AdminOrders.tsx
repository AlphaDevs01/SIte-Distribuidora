import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package,
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApi';
import { Order } from '../../types';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      const data = await AdminApiService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await AdminApiService.updateOrderStatus(orderId, newStatus);
      toast.success('Status do pedido atualizado!');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar status do pedido');
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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'credit': return 'Cartão de Crédito';
      case 'debit': return 'Cartão de Débito';
      case 'pix': return 'PIX';
      case 'cash': return 'Dinheiro';
      default: return method;
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Gestão de Pedidos
        </h1>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {filteredOrders.length} pedidos encontrados
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmado</option>
              <option value="preparing">Preparando</option>
              <option value="on_way">Saiu para entrega</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <span>Pendentes: {orders.filter(o => o.status === 'pending').length}</span>
            <span>•</span>
            <span>Entregues: {orders.filter(o => o.status === 'delivered').length}</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {order.customerName || 'Cliente'}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        R$ {order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {getPaymentMethodText(order.paymentMethod)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-neutral-900 dark:text-neutral-100">
                        {order.createdAt.toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {order.createdAt.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 bg-white dark:bg-neutral-700"
                          >
                            <option value="pending">Pendente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="preparing">Preparando</option>
                            <option value="on_way">Saiu para entrega</option>
                            <option value="delivered">Entregue</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Detalhes do Pedido #{selectedOrder.id.slice(-8)}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Informações do Cliente
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                        {selectedOrder.customerName?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {selectedOrder.customerName || 'Cliente'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-neutral-400" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {selectedOrder.customerEmail}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-neutral-400" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {selectedOrder.customerPhone}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-neutral-400 mt-0.5" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {selectedOrder.deliveryAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Informações do Pedido
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Data do pedido:</span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {selectedOrder.createdAt.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Pagamento:</span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {getPaymentMethodText(selectedOrder.paymentMethod)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Taxa de entrega:</span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      R$ {selectedOrder.deliveryFee?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Itens do Pedido
              </h3>
              
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {item.product.volume} • {item.product.brand}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        R$ {item.product.price.toFixed(2)} cada
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-neutral-900 dark:text-neutral-100">Total do Pedido:</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    R$ {selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update */}
            {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
              <div className="mt-6 p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                  Atualizar Status
                </h4>
                <div className="flex space-x-2">
                  {['confirmed', 'preparing', 'on_way', 'delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-neutral-200 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;