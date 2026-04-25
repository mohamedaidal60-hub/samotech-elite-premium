-- SamoTech — Neon DB Schema
-- Run this in Neon SQL Editor to create the tables

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
