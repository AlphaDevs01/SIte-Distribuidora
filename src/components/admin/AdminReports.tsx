import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Package, 
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApi';
import { OrderStats, ProductStats } from '../../types/admin';
import { Order, Product } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

const AdminReports: React.FC = () => {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // days

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const [orderStatsData, productStatsData, ordersData, productsData] = await Promise.all([
        AdminApiService.getOrderStats(),
        AdminApiService.getProductStats(),
        AdminApiService.getOrders(),
        AdminApiService.getProducts()
      ]);

      setOrderStats(orderStatsData);
      setProductStats(productStatsData);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopProducts = () => {
    const productSales = new Map<string, { product: Product; totalSold: number; revenue: number }>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.product.id);
        if (existing) {
          existing.totalSold += item.quantity;
          existing.revenue += item.product.price * item.quantity;
        } else {
          productSales.set(item.product.id, {
            product: item.product,
            totalSold: item.quantity,
            revenue: item.product.price * item.quantity
          });
        }
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  };

  const getLowStockProducts = () => {
    return products
      .filter(product => product.stock <= 10 && product.stock > 0)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 10);
  };

  const getRecentOrders = () => {
    return orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
        return orderDate >= daysAgo;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getSalesData = () => {
    const recentOrders = getRecentOrders();
    const salesByDay = new Map<string, { orders: number; revenue: number }>();

    recentOrders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const existing = salesByDay.get(dateKey);
      
      if (existing) {
        existing.orders += 1;
        existing.revenue += order.total;
      } else {
        salesByDay.set(dateKey, { orders: 1, revenue: order.total });
      }
    });

    return Array.from(salesByDay.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('pt-BR'),
        ...data
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const topProducts = getTopProducts();
  const lowStockProducts = getLowStockProducts();
  const salesData = getSalesData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Relatórios e Análises
        </h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <button
            onClick={() => exportToCSV(salesData, 'relatorio-vendas')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Total de Pedidos
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {orderStats?.totalOrders || 0}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Faturamento Total
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                R$ {(orderStats?.totalRevenue || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Ticket Médio
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                R$ {(orderStats?.averageOrderValue || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Produtos Ativos
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {productStats?.totalProducts || 0}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Produtos Mais Vendidos
            </h3>
            <BarChart3 className="h-5 w-5 text-neutral-400" />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((item, index) => (
              <div key={item.product.id} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.totalSold} vendidos • R$ {item.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Alerta de Estoque Baixo
            </h3>
            <Package className="h-5 w-5 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">
                Todos os produtos têm estoque adequado
              </p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {product.name}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {product.brand} • {product.volume}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock <= 5 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {product.stock} restantes
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Vendas por Dia (Últimos {dateRange} dias)
          </h3>
          <Calendar className="h-5 w-5 text-neutral-400" />
        </div>
        
        {salesData.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
            Nenhuma venda no período selecionado
          </p>
        ) : (
          <div className="space-y-4">
            {salesData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {day.date}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {day.orders} {day.orders === 1 ? 'pedido' : 'pedidos'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    R$ {day.revenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Média: R$ {(day.revenue / day.orders).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Exportar Relatórios
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => exportToCSV(orders.map(o => ({
              id: o.id,
              cliente: o.customerName,
              total: o.total,
              status: o.status,
              data: o.createdAt.toLocaleDateString('pt-BR')
            })), 'pedidos')}
            className="flex items-center justify-center space-x-2 p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Exportar Pedidos</span>
          </button>
          
          <button
            onClick={() => exportToCSV(products.map(p => ({
              nome: p.name,
              categoria: p.category,
              preco: p.price,
              estoque: p.stock,
              marca: p.brand
            })), 'produtos')}
            className="flex items-center justify-center space-x-2 p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Exportar Produtos</span>
          </button>
          
          <button
            onClick={() => exportToCSV(salesData, 'vendas-por-dia')}
            className="flex items-center justify-center space-x-2 p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Exportar Vendas</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
