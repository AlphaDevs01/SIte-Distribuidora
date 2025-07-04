/*
  # Admin Panel Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `role` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `store_settings`
      - `id` (uuid, primary key)
      - `store_name` (text)
      - `store_address` (text)
      - `store_phone` (text)
      - `store_email` (text)
      - `logo_url` (text)
      - `base_delivery_fee` (decimal)
      - `minimum_order_value` (decimal)
      - `delivery_radius_km` (decimal)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on admin tables
    - Add policies for admin access only
*/

-- Create admin_users table
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

-- Create store_settings table
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

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users (only authenticated admins can access)
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can update own data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for store_settings (admins can read and update)
CREATE POLICY "Store settings are readable by admins"
  ON store_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Store settings are updatable by admins"
  ON store_settings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@drinkup.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', 'Administrador', 'admin');

-- Insert default store settings
INSERT INTO store_settings (store_name, store_address, store_phone, store_email) VALUES
('Gonçalves Distribuidora de bebidas 24hrs', 'Rua das Bebidas, 123 - Centro', '(11) 99999-9999', 'contato@Gonçalves Distribuidora de bebidas 24hrs.com');

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
