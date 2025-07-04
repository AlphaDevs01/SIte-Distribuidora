-- =========================
-- TABELAS PRINCIPAIS
-- =========================

-- Produtos
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

-- Pedidos
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

-- Itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL
);

-- Usuários administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Configurações da loja
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text DEFAULT 'Gonçalves Distribuidora de bebidas 24hrs',
  store_address text DEFAULT '',
  store_phone text DEFAULT '',
  store_email text DEFAULT '',
  logo_url text DEFAULT '',
  base_delivery_fee decimal(10,2) DEFAULT 5.00,
  minimum_order_value decimal(10,2) DEFAULT 25.00,
  delivery_radius_km decimal(5,2) DEFAULT 10.00,
  updated_at timestamptz DEFAULT now()
);

-- =========================
-- ÍNDICES
-- =========================

CREATE INDEX IF NOT EXISTS idx_products_distributor_id ON products(distributor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- =========================
-- RLS E POLÍTICAS DE SEGURANÇA
-- =========================

ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Distribuidores: leitura pública
CREATE POLICY "Distributors are viewable by everyone"
  ON distributors
  FOR SELECT
  USING (is_active = true);

-- Produtos: leitura pública
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  USING (true);

-- Produtos: admins podem modificar
CREATE POLICY "Admins podem modificar produtos"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Pedidos: qualquer um pode criar
CREATE POLICY "Orders can be created by anyone"
  ON orders
  FOR INSERT
  WITH CHECK (true);

-- Pedidos: leitura para todos
CREATE POLICY "Orders are viewable by creator"
  ON orders
  FOR SELECT
  USING (true);

-- Pedidos: admins podem modificar
CREATE POLICY "Admins podem modificar pedidos"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Itens do pedido: qualquer um pode criar
CREATE POLICY "Order items can be created by anyone"
  ON order_items
  FOR INSERT
  WITH CHECK (true);

-- Itens do pedido: leitura para todos
CREATE POLICY "Order items are viewable by everyone"
  ON order_items
  FOR SELECT
  USING (true);

-- Itens do pedido: admins podem modificar
CREATE POLICY "Admins podem modificar itens do pedido"
  ON order_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Configurações da loja: leitura para todos, update para autenticados
CREATE POLICY "Allow read for everyone" ON store_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow update for admins" ON store_settings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Usuários admin: leitura para login
CREATE POLICY "Allow read for login" ON admin_users
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow update for own admin" ON admin_users
  FOR UPDATE
  TO authenticated
  USING (true);

-- =========================
-- DADOS INICIAIS (Opcional)
-- =========================

-- Admin padrão (senha: admin123, hash de exemplo)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@drinkup.com',
  '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZOzJqQZQZQZQZQ', -- Troque pelo hash real
  'Administrador',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Configuração padrão da loja
INSERT INTO store_settings (store_name, store_address, store_phone, store_email)
VALUES (
  'Gonçalves Distribuidora de bebidas 24hrs',
  'Rua das Bebidas, 123 - Centro',
  '(11) 99999-9999',
  'contato@GoncalvesDistribuidora.com'
)
ON CONFLICT DO NOTHING;

-- =========================
-- FIM DO SCRIPT
-- =========================
