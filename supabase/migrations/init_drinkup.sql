-- Tabela de distribuidores
CREATE TABLE IF NOT EXISTS distributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  rating decimal(3,2) DEFAULT 0.0,
  delivery_time text,
  minimum_order decimal(10,2) DEFAULT 0.0,
  delivery_fee decimal(10,2) DEFAULT 0.0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de produtos
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

-- Tabela de pedidos
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

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- Tabela de configurações da loja
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL,
  store_address text NOT NULL,
  store_phone text NOT NULL,
  store_email text NOT NULL,
  logo_url text,
  base_delivery_fee decimal(10,2) DEFAULT 0.0,
  minimum_order_value decimal(10,2) DEFAULT 0.0,
  delivery_radius_km integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de usuários admin
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Habilita RLS em todas as tabelas
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública de distribuidores e produtos
CREATE POLICY "Distributors are viewable by everyone"
  ON distributors
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

-- Políticas para pedidos e itens do pedido
CREATE POLICY "Orders can be created by anyone"
  ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders are viewable by creator"
  ON orders
  FOR SELECT
  USING (true);

CREATE POLICY "Order items can be created by anyone"
  ON order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Order items are viewable by everyone"
  ON order_items
  FOR SELECT
  USING (true);

-- Políticas para store_settings
CREATE POLICY "Allow read for everyone" ON store_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow update for everyone" ON store_settings
  FOR UPDATE
  USING (true);

-- Políticas para admin_users (apenas leitura de usuários ativos)
CREATE POLICY "Allow read for login" ON admin_users
  FOR SELECT
  USING (is_active = true);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_products_distributor_id ON products(distributor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
