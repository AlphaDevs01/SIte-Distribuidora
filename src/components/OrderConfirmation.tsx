import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Clock, MapPin } from 'lucide-react';
import { ApiService } from '../services/api';
import { Order } from '../types';
import LoadingSpinner from './LoadingSpinner';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const orderData = await ApiService.getOrder(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Pedido não encontrado
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Voltar às compras
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Pedido Confirmado!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Seu pedido foi recebido e está sendo preparado
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Pedido #{order.id.slice(-8)}
          </h3>
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-sm font-medium">
            {order.status === 'pending' ? 'Pendente' : order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-neutral-500" />
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Previsão de entrega
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {order.estimatedDelivery.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-neutral-500" />
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Total do pedido
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                R$ {order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 mb-6">
          <MapPin className="h-5 w-5 text-neutral-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Endereço de entrega
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {order.deliveryAddress}
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
            Itens do pedido
          </h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                    {item.product.name}
                  </h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {item.quantity}x R$ {item.product.price.toFixed(2)}
                  </p>
                </div>
                <span className="font-medium text-sm">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-4"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
