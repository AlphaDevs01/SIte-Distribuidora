import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Store, MapPin, Phone, Mail, DollarSign, Truck } from 'lucide-react';
import { AdminApiService } from '../../services/adminApi';
import { StoreSettings } from '../../types/admin';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

interface SettingsForm {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  logoUrl: string;
  baseDeliveryFee: number;
  minimumOrderValue: number;
  deliveryRadiusKm: number;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsForm>();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await AdminApiService.getStoreSettings();
      if (data) {
        setSettings(data);
        reset({
          storeName: data.storeName,
          storeAddress: data.storeAddress,
          storePhone: data.storePhone,
          storeEmail: data.storeEmail,
          logoUrl: data.logoUrl,
          baseDeliveryFee: data.baseDeliveryFee,
          minimumOrderValue: data.minimumOrderValue,
          deliveryRadiusKm: data.deliveryRadiusKm,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true);
    try {
      await AdminApiService.updateStoreSettings(data);
      toast.success('Configurações salvas com sucesso!');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Configurações da Loja
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Store Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-2 mb-4">
            <Store className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Informações da Loja
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nome da Loja
              </label>
              <input
                {...register('storeName', { required: 'Nome da loja é obrigatório' })}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm mt-1">{errors.storeName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                URL do Logo
              </label>
              <input
                {...register('logoUrl')}
                type="url"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Endereço da Loja
            </label>
            <textarea
              {...register('storeAddress', { required: 'Endereço é obrigatório' })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Rua, número, bairro, cidade, CEP"
            />
            {errors.storeAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.storeAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Telefone
              </label>
              <input
                {...register('storePhone', { required: 'Telefone é obrigatório' })}
                type="tel"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
              {errors.storePhone && (
                <p className="text-red-500 text-sm mt-1">{errors.storePhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                {...register('storeEmail', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                type="email"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="contato@loja.com"
              />
              {errors.storeEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.storeEmail.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center space-x-2 mb-4">
            <Truck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Configurações de Entrega
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Taxa de Entrega Base (R$)
              </label>
              <input
                {...register('baseDeliveryFee', { 
                  required: 'Taxa de entrega é obrigatória',
                  min: { value: 0, message: 'Valor deve ser positivo' }
                })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.baseDeliveryFee && (
                <p className="text-red-500 text-sm mt-1">{errors.baseDeliveryFee.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Valor Mínimo do Pedido (R$)
              </label>
              <input
                {...register('minimumOrderValue', { 
                  required: 'Valor mínimo é obrigatório',
                  min: { value: 0, message: 'Valor deve ser positivo' }
                })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.minimumOrderValue && (
                <p className="text-red-500 text-sm mt-1">{errors.minimumOrderValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Raio de Entrega (km)
              </label>
              <input
                {...register('deliveryRadiusKm', { 
                  required: 'Raio de entrega é obrigatório',
                  min: { value: 1, message: 'Raio deve ser pelo menos 1km' }
                })}
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.deliveryRadiusKm && (
                <p className="text-red-500 text-sm mt-1">{errors.deliveryRadiusKm.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Como funciona o cálculo de frete:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• A taxa base é cobrada para entregas dentro do raio configurado</li>
              <li>• Pedidos abaixo do valor mínimo podem ter taxa adicional</li>
              <li>• O endereço da loja é usado como ponto de partida para cálculo de distância</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>
      </form>

      {/* Current Settings Preview */}
      {settings && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Configurações Atuais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-neutral-600 dark:text-neutral-400">Taxa de entrega:</span>
              <p className="text-neutral-900 dark:text-neutral-100">R$ {settings.baseDeliveryFee.toFixed(2)}</p>
            </div>
            <div>
              <span className="font-medium text-neutral-600 dark:text-neutral-400">Pedido mínimo:</span>
              <p className="text-neutral-900 dark:text-neutral-100">R$ {settings.minimumOrderValue.toFixed(2)}</p>
            </div>
            <div>
              <span className="font-medium text-neutral-600 dark:text-neutral-400">Raio de entrega:</span>
              <p className="text-neutral-900 dark:text-neutral-100">{settings.deliveryRadiusKm} km</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;