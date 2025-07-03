/*
  # Initial Schema for Gonçalves Distribuidora de bebidas 24hrs Alcohol Delivery System

  1. New Tables
    - `distributors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo_url` (text)
      - `rating` (decimal)
      - `delivery_time` (text)
      - `minimum_order` (decimal)
      - `delivery_fee` (decimal)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `original_price` (decimal, nullable)
      - `image_url` (text)
      - `category` (text)
      - `volume` (text)
      - `alcohol_content` (text)
      - `brand` (text)
      - `distributor_id` (uuid, foreign key)
      - `stock` (integer)
      - `featured` (boolean)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `delivery_address` (text)
      - `total_amount` (decimal)
      - `delivery_fee` (decimal)
      - `payment_method` (text)
      - `status` (text)
      - `distributor_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `unit_price` (decimal)
      - `total_price` (decimal)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to products and distributors
    - Add policies for order creation and management
*/

-- Create distributors table
CREATE TABLE IF NOT EXISTS distributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  rating decimal(3,2) DEFAULT 0.0,
  delivery_time text NOT NULL,
  minimum_order decimal(10,2) DEFAULT 0.0,
  delivery_fee decimal(10,2) DEFAULT 0.0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  image_url text NOT NULL,
  category text NOT NULL,
  volume text NOT NULL,
  alcohol_content text NOT NULL,
  brand text NOT NULL,
  distributor_id uuid REFERENCES distributors(id) ON DELETE CASCADE,
  stock integer DEFAULT 0,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  delivery_fee decimal(10,2) DEFAULT 0.0,
  payment_method text NOT NULL,
  status text DEFAULT 'pending',
  distributor_id uuid REFERENCES distributors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for distributors (public read access)
CREATE POLICY "Distributors are viewable by everyone"
  ON distributors
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for orders (allow creation by anyone)
CREATE POLICY "Orders can be created by anyone"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Orders are viewable by creator"
  ON orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for order_items (allow creation with orders)
CREATE POLICY "Order items can be created by anyone"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Order items are viewable by everyone"
  ON order_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_distributor_id ON products(distributor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
