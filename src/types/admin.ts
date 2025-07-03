export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  logoUrl: string;
  baseDeliveryFee: number;
  minimumOrderValue: number;
  deliveryRadiusKm: number;
  updatedAt: Date;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
}

export interface ProductStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
}

export interface SalesReport {
  date: string;
  orders: number;
  revenue: number;
  topProduct: string;
}
