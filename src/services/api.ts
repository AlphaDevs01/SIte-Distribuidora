import { supabase } from '../lib/supabase';
import { Product, Distributor, Order, CartItem } from '../types';

export class ApiService {
  // Products
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        distributors!inner(name)
      `)
      .gt('stock', 0); // Corrigido aqui

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

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
      distributorId: product.distributor_id,
      distributorName: product.distributors.name,
      stock: product.stock,
      featured: product.featured,
      tags: product.tags,
    }));
  }

  static async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        distributors!inner(name)
      `)
      .eq('featured', true)
      .gt('stock', 0) // Corrigido aqui
      .limit(8);

    if (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }

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
      distributorId: product.distributor_id,
      distributorName: product.distributors.name,
      stock: product.stock,
      featured: product.featured,
      tags: product.tags,
    }));
  }

  // Distributors
  static async getDistributors(): Promise<Distributor[]> {
    const { data, error } = await supabase
      .from('distributors')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching distributors:', error);
      throw error;
    }

    return data.map(distributor => ({
      id: distributor.id,
      name: distributor.name,
      logo: distributor.logo_url,
      rating: distributor.rating,
      deliveryTime: distributor.delivery_time,
      minimumOrder: distributor.minimum_order,
      deliveryFee: distributor.delivery_fee,
      isActive: distributor.is_active,
    }));
  }

  // Orders
  static async createOrder(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: string;
    items: CartItem[];
    distributorId: string;
    deliveryFee: number;
  }): Promise<string> {
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    ) + orderData.deliveryFee;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        delivery_address: orderData.deliveryAddress,
        total_amount: totalAmount,
        delivery_fee: orderData.deliveryFee,
        payment_method: orderData.paymentMethod,
        distributor_id: orderData.distributorId,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      total_price: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    return order.id;
  }

  static async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        ),
        distributors(name)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return {
      id: data.id,
      items: data.order_items.map((item: any) => ({
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
          distributorId: item.products.distributor_id,
          distributorName: data.distributors.name,
          stock: item.products.stock,
          featured: item.products.featured,
          tags: item.products.tags,
        },
        quantity: item.quantity,
      })),
      total: data.total_amount,
      deliveryAddress: data.delivery_address,
      paymentMethod: data.payment_method as any,
      distributorId: data.distributor_id,
      status: data.status as any,
      createdAt: new Date(data.created_at),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    };
  }
}