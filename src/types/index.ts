export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: ProductCategory;
  volume: string;
  alcoholContent: string;
  brand: string;
  stock: number;
  featured: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryFee?: number;
}

export type ProductCategory = 
  | 'cerveja'
  | 'vinho'
  | 'whisky'
  | 'vodka'
  | 'gin'
  | 'rum'
  | 'cachaça'
  | 'licor'
  | 'espumante'
  | 'energético'
  | 'refrigerante'
  | 'água'
  | 'suco';

export type PaymentMethod = 'credit' | 'debit' | 'pix' | 'cash';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'on_way' | 'delivered' | 'cancelled';

export interface FilterOptions {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'rating';
}
  | 'água'
  | 'suco';

export type PaymentMethod = 'credit' | 'debit' | 'pix' | 'cash';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'on_way' | 'delivered' | 'cancelled';

export interface FilterOptions {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  distributorId?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'rating';
}
