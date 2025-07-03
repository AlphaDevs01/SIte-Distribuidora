export interface Database {
  public: {
    Tables: {
      distributors: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          rating: number;
          delivery_time: string;
          minimum_order: number;
          delivery_fee: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url: string;
          rating?: number;
          delivery_time: string;
          minimum_order?: number;
          delivery_fee?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string;
          rating?: number;
          delivery_time?: string;
          minimum_order?: number;
          delivery_fee?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          original_price: number | null;
          image_url: string;
          category: string;
          volume: string;
          alcohol_content: string;
          brand: string;
          distributor_id: string;
          stock: number;
          featured: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          original_price?: number | null;
          image_url: string;
          category: string;
          volume: string;
          alcohol_content: string;
          brand: string;
          distributor_id: string;
          stock?: number;
          featured?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          original_price?: number | null;
          image_url?: string;
          category?: string;
          volume?: string;
          alcohol_content?: string;
          brand?: string;
          distributor_id?: string;
          stock?: number;
          featured?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: string;
          total_amount: number;
          delivery_fee: number;
          payment_method: string;
          status: string;
          distributor_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          delivery_address: string;
          total_amount: number;
          delivery_fee?: number;
          payment_method: string;
          status?: string;
          distributor_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          delivery_address?: string;
          total_amount?: number;
          delivery_fee?: number;
          payment_method?: string;
          status?: string;
          distributor_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
      };
    };
  };
}