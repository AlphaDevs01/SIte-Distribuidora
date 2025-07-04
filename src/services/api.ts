import { supabase } from '../lib/supabase';
import { Product, Order, CartItem } from '../types';

export class ApiService {
  // Products
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0);

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
      stock: product.stock,
      featured: product.featured,
      tags: product.tags,
    }));
  }

  static async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .gt('stock', 0)
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
      stock: product.stock,
      featured: product.featured,
      tags: product.tags,
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
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      deliveryAddress: data.delivery_address,
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
          stock: item.products.stock,
          featured: item.products.featured,
          tags: item.products.tags,
        },
        quantity: item.quantity,
      })),
      total: data.total_amount,
      deliveryFee: data.delivery_fee,
      paymentMethod: data.payment_method as any,
      status: data.status as any,
      createdAt: new Date(data.created_at),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // Placeholder
    };
  }

  // Novo método: buscar pedido pelo short id (últimos 8 caracteres do UUID)
  static async getOrderByShortId(shortId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        )
      `);

    if (error) {
      console.error('Error fetching orders:', error);
      return null;
    }

    if (!data) return null;

    const found = data.find((order: any) =>
      order.id.slice(-8).toUpperCase() === shortId.toUpperCase()
    );

    if (!found) return null;

    return {
      id: found.id,
      customerName: found.customer_name,
      customerEmail: found.customer_email,
      customerPhone: found.customer_phone,
      deliveryAddress: found.delivery_address,
      items: found.order_items.map((item: any) => ({
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
      total: found.total_amount,
      deliveryFee: found.delivery_fee,
      paymentMethod: found.payment_method as any,
      status: found.status as any,
      createdAt: new Date(found.created_at),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // Placeholder
    };
  }
}
