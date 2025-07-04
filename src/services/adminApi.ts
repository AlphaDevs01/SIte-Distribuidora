import { supabase } from '../lib/supabase';
import { AdminUser, StoreSettings, OrderStats, ProductStats, SalesReport } from '../types/admin';
import { Product, Order } from '../types';

export class AdminApiService {
  // Authentication
  static async login(email: string, password: string): Promise<AdminUser | null> {
    // Login via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      console.error('Login error:', error);
      return null;
    }
    // Agora você está autenticado, pode buscar dados do admin
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();
    if (adminError || !admin) return null;

    // Store admin session
    localStorage.setItem('admin_token', JSON.stringify({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.is_active,
      createdAt: new Date(admin.created_at),
    };
  }

  static logout(): void {
    localStorage.removeItem('admin_token');
  }

  static getCurrentAdmin(): AdminUser | null {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return null;

      const adminData = JSON.parse(token);
      if (adminData.expiresAt < Date.now()) {
        this.logout();
        return null;
      }

      return adminData;
    } catch {
      return null;
    }
  }

  // Products Management
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price,
      imageUrl: product.image_url,
      category: product.category as any,
      volume: product.volume,
      alcoholContent: product.alcohol_content,
      brand: product.brand,
      stock: product.stock,
      featured: product.featured,
      tags: product.tags,
    }));
  }

  static async createProduct(productData: Partial<Product>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        image_url: productData.imageUrl,
        category: productData.category,
        volume: productData.volume,
        alcohol_content: productData.alcoholContent,
        brand: productData.brand,
        stock: productData.stock,
        featured: productData.featured,
        tags: productData.tags,
      });

    if (error) throw error;
  }

  static async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        original_price: productData.originalPrice,
        image_url: productData.imageUrl,
        category: productData.category,
        volume: productData.volume,
        alcohol_content: productData.alcoholContent,
        brand: productData.brand,
        stock: productData.stock,
        featured: productData.featured,
        tags: productData.tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Orders Management
  static async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((order: any) => ({
      id: order.id,
      items: order.order_items.map((item: any) => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          description: item.products.description,
          price: item.unit_price,
          originalPrice: item.products.original_price,
          imageUrl: item.products.image_url,
          category: item.products.category,
          volume: item.products.volume,
          alcoholContent: item.products.alcohol_content,
          brand: item.products.brand,
          stock: item.products.stock,
          featured: item.products.featured,
          tags: item.products.tags,
        },
        quantity: item.quantity,
      })),
      total: order.total_amount,
      deliveryAddress: order.delivery_address,
      paymentMethod: order.payment_method as any,
      status: order.status as any,
      createdAt: new Date(order.created_at),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      deliveryFee: order.delivery_fee,
    }));
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) throw error;
  }

  // Statistics
  static async getOrderStats(): Promise<OrderStats> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, status, created_at');

    if (error) throw error;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue,
    };
  }

  static async getProductStats(): Promise<ProductStats> {
    const { data: products, error } = await supabase
      .from('products')
      .select('stock, featured');

    if (error) throw error;

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const featuredProducts = products.filter(p => p.featured).length;

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      featuredProducts,
    };
  }

  // Store Settings
  static async getStoreSettings(): Promise<StoreSettings | null> {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .single();

    if (error) return null;

    return {
      id: data.id,
      storeName: data.store_name,
      storeAddress: data.store_address,
      storePhone: data.store_phone,
      storeEmail: data.store_email,
      logoUrl: data.logo_url,
      baseDeliveryFee: data.base_delivery_fee,
      minimumOrderValue: data.minimum_order_value,
      deliveryRadiusKm: data.delivery_radius_km,
      updatedAt: new Date(data.updated_at),
    };
  }

  static async updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
    // Apenas campos válidos e snake_case
    const updateData: any = {};
    if (settings.storeName !== undefined) updateData.store_name = settings.storeName;
    if (settings.storeAddress !== undefined) updateData.store_address = settings.storeAddress;
    if (settings.storePhone !== undefined) updateData.store_phone = settings.storePhone;
    if (settings.storeEmail !== undefined) updateData.store_email = settings.storeEmail;
    if (settings.logoUrl !== undefined) updateData.logo_url = settings.logoUrl;
    if (settings.baseDeliveryFee !== undefined) updateData.base_delivery_fee = settings.baseDeliveryFee;
    if (settings.minimumOrderValue !== undefined) updateData.minimum_order_value = settings.minimumOrderValue;
    if (settings.deliveryRadiusKm !== undefined) updateData.delivery_radius_km = settings.deliveryRadiusKm;
    updateData.updated_at = new Date().toISOString();

    // Corrigir: garantir que settings.id está presente e usar .eq('id', settings.id)
    if (!settings.id) throw new Error('ID das configurações da loja não informado.');

    const { error } = await supabase
      .from('store_settings')
      .update(updateData)
      .eq('id', settings.id);

    if (error) throw error;
  }
}