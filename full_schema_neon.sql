-- =========================================================
-- SAMOTECH ELITE - FULL DATABASE SCHEMA (NEON POSTGRES)
-- =========================================================
-- Copy and paste this script into your Neon SQL Editor
-- to initialize the entire ERP and Lead management system.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. LEADS TABLE (Prospects)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40),
  company VARCHAR(120),
  service TEXT NOT NULL,
  budget VARCHAR(60),
  timeline VARCHAR(60),
  project_summary TEXT,
  raw_message TEXT,
  ai_transcript JSONB,
  language VARCHAR(5) DEFAULT 'fr',
  source VARCHAR(30) DEFAULT 'website-form',
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE (Linked to Auth Users)
-- Note: In Neon, we use a separate profiles table. 
-- In a full Vercel deployment with Supabase Auth, this would sync with auth.users.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_auth_id UUID UNIQUE, -- Link to your Auth provider ID (Supabase/Firebase/Clerk)
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PACKS TABLE
CREATE TABLE IF NOT EXISTS packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id),
  pack_id UUID REFERENCES packs(id),
  custom_product_name TEXT,
  status TEXT DEFAULT 'pending_invoice',
  progress_percent INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid',
  specs_url TEXT,
  delivery_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE,
  amount DECIMAL(12,2),
  file_url TEXT,
  status TEXT DEFAULT 'issued',
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- 6. ORDER ASSETS
CREATE TABLE IF NOT EXISTS order_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'product_image', 'payment_receipt', 'deliverable'
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INITIAL DATA (Packs)
INSERT INTO packs (name, description, category, features) VALUES 
('Pack Entreprise', 'Solution prestige pour une domination totale de votre secteur avec le meilleur rapport qualité-prix.', 'corporate', '["Branding & Identity", "Detailed Charter", "Website & App", "Meta Certification", "Community Management", "10 Posters", "3 Videos", "Ads Campaigns"]'),
('Pack SamoTech Basic', 'Les essentiels pour lancer votre aventure digitale avec impact.', 'marketing', '["Logo & Identity", "Meta Account Creation", "Followers Boost", "2 Posters", "1 Video", "Ads Campaign"]'),
('Pack Automation', 'Optimisez votre temps et vos profits.', 'automation', '["Process Audit", "CRM Integration", "Auto Invoicing", "Bot Qualification"]'),
('Pack Branding Prestige', 'Donnez une âme et une voix à votre marque.', 'branding', '["Full Graphic Charter", "Storytelling", "Content Strategy", "Templates", "Shooting Direction"]');

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- TRIGGERS FOR UPDATED_AT (Optional but recommended)
-- You can add triggers here if your Postgres setup supports it easily.
