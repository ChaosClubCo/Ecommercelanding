-- ============================================
-- E-COMMERCE DATABASE SCHEMA
-- Production V1 - 30-Day Plan
-- ============================================

-- ============================================
-- 1. PRODUCTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INT DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('english', description));

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

-- ============================================
-- 2. MIGRATE MOCK DATA TO PRODUCTS TABLE
-- ============================================

INSERT INTO products (name, description, price, image_url, category, rating, review_count)
VALUES 
  (
    'Premium Wireless Headphones',
    'Experience crystal clear sound with our premium noise-cancelling headphones. Perfect for travel and work.',
    299.99,
    'https://images.unsplash.com/photo-1674658556545-f18d4080ab6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjgxNTcxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Electronics',
    4.8,
    124
  ),
  (
    'Urban Runner Sneakers',
    'Lightweight, breathable, and stylish. The Urban Runner is designed for the modern city dweller.',
    89.95,
    'https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHByb2R1Y3R8ZW58MXx8fHwxNzY4MjA1MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'Fashion',
    4.5,
    89
  ),
  (
    'Smart Watch Series 5',
    'Track your fitness, notifications, and more with the new Series 5 Smart Watch. 48-hour battery life.',
    199.50,
    'https://images.unsplash.com/photo-1714218707756-173966d250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjgyMDgxODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Electronics',
    4.9,
    230
  ),
  (
    'Everyday Backpack',
    'Durable, water-resistant, and plenty of pockets. The only backpack you''ll ever need.',
    59.99,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    'Accessories',
    4.6,
    56
  ),
  (
    'Minimalist Leather Wallet',
    'Hand-crafted from genuine leather. Slim profile that fits perfectly in any pocket.',
    45.00,
    'https://images.unsplash.com/photo-1627123424574-181ce5171bf3?auto=format&fit=crop&q=80&w=800',
    'Accessories',
    4.7,
    42
  ),
  (
    'Professional Camera Lens',
    'Capture stunning portraits and landscapes with this versatile 50mm lens.',
    450.00,
    'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800',
    'Electronics',
    4.9,
    15
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. ORDERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL CHECK (total > 0),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT UNIQUE,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders by email" 
  ON orders FOR SELECT 
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can view own orders by user_id" 
  ON orders FOR SELECT 
  USING (user_id = auth.uid());

-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Run this script in Supabase SQL Editor
-- Then configure your environment variables:
--   SUPABASE_URL
--   SUPABASE_ANON_KEY  
--   SUPABASE_SERVICE_ROLE_KEY
-- ============================================
