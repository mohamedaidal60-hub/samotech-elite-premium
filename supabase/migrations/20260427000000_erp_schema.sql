-- SamoTech Advanced ERP Schema
-- This schema handles clients, packs, orders, invoices, and file tracking.

-- 1. Profiles Table (Linked to Auth Users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  company_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Packs Table
CREATE TABLE IF NOT EXISTS packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'marketing', 'development', 'automation', 'workflow'
  features JSONB, -- List of what's included
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pack_id UUID REFERENCES packs(id),
  custom_product_name TEXT, -- For independent products
  status TEXT DEFAULT 'pending_invoice' CHECK (status IN ('pending_invoice', 'pending_payment', 'in_progress', 'completed', 'cancelled')),
  progress_percent INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending_verification', 'paid')),
  specs_url TEXT, -- Link to uploaded cahier des charges
  delivery_url TEXT, -- Link to final delivery
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE,
  amount DECIMAL(12,2),
  file_url TEXT, -- URL to the PDF invoice
  status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'paid')),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- 5. Order Assets (Product images, payment receipts)
CREATE TABLE IF NOT EXISTS order_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'product_image', 'payment_receipt', 'deliverable'
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_assets ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for Packs
CREATE POLICY "Packs are viewable by everyone" ON packs FOR SELECT USING (true);
CREATE POLICY "Only admins can manage packs" ON packs ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for Orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = client_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Only admins can update orders" ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for Invoices
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = invoices.order_id AND client_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for Assets
CREATE POLICY "Users can view own assets" ON order_assets FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = order_assets.order_id AND client_id = auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can upload assets to own orders" ON order_assets FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE id = order_id AND client_id = auth.uid()));
