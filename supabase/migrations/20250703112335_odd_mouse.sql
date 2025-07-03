/*
  # Seed Initial Data for Gonçalves Distribuidora de bebidas 24hrs

  1. Insert sample distributors
  2. Insert sample products with real data
  3. Set up initial categories and featured products
*/

-- Insert distributors
INSERT INTO distributors (id, name, logo_url, rating, delivery_time, minimum_order, delivery_fee, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Distribuidora Central', 'https://images.pexels.com/photos/5632382/pexels-photo-5632382.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 4.8, '30-45 min', 25.00, 5.00, true),
('550e8400-e29b-41d4-a716-446655440002', 'Bebidas Premium', 'https://images.pexels.com/photos/6649896/pexels-photo-6649896.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 4.9, '40-60 min', 50.00, 8.00, true),
('550e8400-e29b-41d4-a716-446655440003', 'Express Drinks', 'https://images.pexels.com/photos/8112181/pexels-photo-8112181.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop', 4.6, '20-35 min', 30.00, 6.00, true);

-- Insert products
INSERT INTO products (id, name, description, price, original_price, image_url, category, volume, alcohol_content, brand, distributor_id, stock, featured, tags) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Heineken Original', 'Cerveja premium holandesa com sabor único e refrescante', 4.99, 5.99, 'https://images.pexels.com/photos/5947075/pexels-photo-5947075.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'cerveja', '350ml', '5%', 'Heineken', '550e8400-e29b-41d4-a716-446655440001', 150, true, ARRAY['premium', 'importada', 'lager']),

('650e8400-e29b-41d4-a716-446655440002', 'Johnnie Walker Red Label', 'Whisky escocês blended com notas amadeiradas e especiarias', 89.99, null, 'https://images.pexels.com/photos/4916630/pexels-photo-4916630.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'whisky', '750ml', '40%', 'Johnnie Walker', '550e8400-e29b-41d4-a716-446655440002', 45, true, ARRAY['premium', 'escocês', 'blended']),

('650e8400-e29b-41d4-a716-446655440003', 'Vinho Cabernet Sauvignon', 'Vinho tinto seco com aromas frutados e taninos equilibrados', 29.99, 34.99, 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'vinho', '750ml', '13%', 'Miolo', '550e8400-e29b-41d4-a716-446655440001', 80, true, ARRAY['tinto', 'seco', 'nacional']),

('650e8400-e29b-41d4-a716-446655440004', 'Vodka Absolut', 'Vodka premium sueca com pureza excepcional e sabor suave', 79.99, null, 'https://images.pexels.com/photos/6667442/pexels-photo-6667442.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'vodka', '750ml', '40%', 'Absolut', '550e8400-e29b-41d4-a716-446655440002', 60, false, ARRAY['premium', 'sueca', 'pura']),

('650e8400-e29b-41d4-a716-446655440005', 'Gin Tanqueray', 'Gin premium inglês com botanicals cuidadosamente selecionados', 94.99, null, 'https://images.pexels.com/photos/5946950/pexels-photo-5946950.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'gin', '750ml', '43.1%', 'Tanqueray', '550e8400-e29b-41d4-a716-446655440002', 35, true, ARRAY['premium', 'inglês', 'botanicals']),

('650e8400-e29b-41d4-a716-446655440006', 'Skol Pilsen', 'Cerveja brasileira refrescante e cremosa', 2.99, null, 'https://images.pexels.com/photos/5946925/pexels-photo-5946925.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'cerveja', '350ml', '4.7%', 'Skol', '550e8400-e29b-41d4-a716-446655440003', 200, false, ARRAY['nacional', 'pilsen', 'refrescante']),

('650e8400-e29b-41d4-a716-446655440007', 'Cachaça 51', 'Cachaça tradicional brasileira com sabor autêntico', 19.99, null, 'https://images.pexels.com/photos/5946656/pexels-photo-5946656.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'cachaça', '1L', '39%', 'Cachaça 51', '550e8400-e29b-41d4-a716-446655440003', 120, false, ARRAY['tradicional', 'brasileira', 'autêntica']),

('650e8400-e29b-41d4-a716-446655440008', 'Espumante Chandon', 'Espumante brasileiro com bolhas finas e sabor elegante', 45.99, null, 'https://images.pexels.com/photos/1407510/pexels-photo-1407510.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'espumante', '750ml', '12%', 'Chandon', '550e8400-e29b-41d4-a716-446655440001', 55, true, ARRAY['brasileiro', 'elegante', 'celebração']),

('650e8400-e29b-41d4-a716-446655440009', 'Rum Bacardi', 'Rum caribenho com sabor tropical e aroma intenso', 69.99, null, 'https://images.pexels.com/photos/5946930/pexels-photo-5946930.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'rum', '750ml', '37.5%', 'Bacardi', '550e8400-e29b-41d4-a716-446655440002', 70, false, ARRAY['caribenho', 'tropical', 'intenso']),

('650e8400-e29b-41d4-a716-446655440010', 'Licor Amarula', 'Licor cremoso sul-africano com sabor de marula', 59.99, null, 'https://images.pexels.com/photos/5946959/pexels-photo-5946959.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'licor', '750ml', '17%', 'Amarula', '550e8400-e29b-41d4-a716-446655440001', 40, false, ARRAY['cremoso', 'sul-africano', 'marula']),

('650e8400-e29b-41d4-a716-446655440011', 'Brahma Duplo Malte', 'Cerveja brasileira com sabor encorpado e maltado', 3.49, null, 'https://images.pexels.com/photos/5946904/pexels-photo-5946904.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'cerveja', '350ml', '4.8%', 'Brahma', '550e8400-e29b-41d4-a716-446655440003', 180, false, ARRAY['duplo malte', 'encorpada', 'brasileira']),

('650e8400-e29b-41d4-a716-446655440012', 'Vinho Rosé Miolo', 'Vinho rosé brasileiro com notas frutadas e frescor', 24.99, null, 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop', 'vinho', '750ml', '12%', 'Miolo', '550e8400-e29b-41d4-a716-446655440001', 90, true, ARRAY['rosé', 'frutado', 'fresco']);