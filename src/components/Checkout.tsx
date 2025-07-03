import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CreditCard, Smartphone, DollarSign, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useDistributors } from '../hooks/useDistributors';
import { ApiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: 'credit' | 'debit' | 'pix' | 'cash';
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { distributors } = useDistributors();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>();

  const paymentMethod = watch('paymentMethod');

  // Get the main distributor (most items from)
  const distributorCounts = items.reduce((acc, item) => {
    acc[item.product.distributorId] = (acc[item.product.distributorId] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const mainDistributorId = Object.entries(distributorCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const mainDistributor = distributors.find(d => d.id === mainDistributorId);
  const deliveryFee = mainDistributor?.deliveryFee || 0;
  const totalAmount = getTotalPrice() + deliveryFee;

  const onSubmit = async (data: CheckoutForm) => {
    if (!mainDistributorId) {
      toast.error('Erro: Distribuidora não encontrada');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const orderId = await ApiService.createOrder({
        ...data,
        items,
        distributorId: mainDistributorId,
        deliveryFee,
      });

      toast.success('Pedido realizado com sucesso!');
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Carrinho vazio
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Adicione produtos ao carrinho para finalizar o pedido
          </p>
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Finalizar Pedido
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Informações Pessoais
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nome completo
                  </label>
                  <input
                    {...register('customerName', { required: 'Nome é obrigatório' })}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email
                  </label>
                  <input
                    {...register('customerEmail', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                    type="email"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Telefone
                  </label>
                  <input
                    {...register('customerPhone', { required: 'Telefone é obrigatório' })}
                    type="tel"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                  {errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço de Entrega
              </h3>
              
              <div>
                <textarea
                  {...register('deliveryAddress', { required: 'Endereço é obrigatório' })}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Rua, número, complemento, bairro, cidade, CEP"
                />
                {errors.deliveryAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress.message}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Forma de Pagamento
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'credit' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
                }`}>
                  <input
                    {...register('paymentMethod', { required: 'Selecione uma forma de pagamento' })}
                    type="radio"
                    value="credit"
                    className="sr-only"
                  />
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Cartão de Crédito</span>
                </label>

                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'debit' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
                }`}>
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="debit"
                    className="sr-only"
                  />
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Cartão de Débito</span>
                </label>

                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'pix' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
                }`}>
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="pix"
                    className="sr-only"
                  />
                  <Smartphone className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">PIX</span>
                </label>

                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
                }`}>
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="cash"
                    className="sr-only"
                  />
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Dinheiro</span>
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-2">{errors.paymentMethod.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              {isSubmitting ? 'Finalizando...' : `Finalizar Pedido - R$ ${totalAmount.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 h-fit">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Resumo do Pedido
          </h3>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                    {item.product.name}
                  </h4>
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

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>R$ {getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxa de entrega</span>
              <span>R$ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-neutral-200 dark:border-neutral-700 pt-2">
              <span>Total</span>
              <span>R$ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {mainDistributor && (
            <div className="mt-6 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <img
                  src={mainDistributor.logo}
                  alt={mainDistributor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-sm">{mainDistributor.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Entrega em {mainDistributor.deliveryTime}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;