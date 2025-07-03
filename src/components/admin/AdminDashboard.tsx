import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApi';
import { OrderStats, ProductStats } from '../../types/admin';
import { Order } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orderStatsData, productStatsData, ordersData] = await Promise.all([
          AdminApiService.getOrderStats(),
          AdminApiService.getProductStats(),
          AdminApiService.getOrders()
        ]);

        setOrderStats(orderStatsData);
        setProductStats(productStatsData);
        setRecentOrders(ordersData.slice(0, 5)); // Last 5 orders
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      title: 'Total de Pedidos',
      value: orderStats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Faturamento Total',
      value: `R$ ${(orderStats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Produtos Cadastrados',
      value: productStats?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-500',
      change: '+3%',
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${(orderStats?.averageOrderValue || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%',
    },
  ];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          Atualizado em {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                  {stat.change}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400 text-sm ml-1">
                  vs mês anterior
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Pedidos Recentes
            </h3>
            <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
              Ver todos
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      #{order.id.slice(-8)}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {order.customerName || 'Cliente'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    R$ {order.total.toFixed(2)}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Status dos Produtos
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-neutral-700 dark:text-neutral-300">Em estoque</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {(productStats?.totalProducts || 0) - (productStats?.outOfStockProducts || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-neutral-700 dark:text-neutral-300">Estoque baixo</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {productStats?.lowStockProducts || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-neutral-700 dark:text-neutral-300">Sem estoque</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {productStats?.outOfStockProducts || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="text-neutral-700 dark:text-neutral-300">Em destaque</span>
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {productStats?.featuredProducts || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Status dos Pedidos
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {orderStats?.pendingOrders || 0}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Pendentes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {orderStats?.completedOrders || 0}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Entregues</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {orderStats?.totalOrders || 0}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Total</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              R$ {(orderStats?.averageOrderValue || 0).toFixed(0)}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Ticket Médio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
