-- Livek — Creator Discovery Platform
-- Run this in your Supabase SQL Editor to set up the database

-- ── categories ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name    TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  icon    TEXT NOT NULL,
  slug    TEXT NOT NULL UNIQUE,
  count   INT  DEFAULT 0,
  color   TEXT DEFAULT '#0B8A7E'
);

-- Seed categories
INSERT INTO categories (name, name_ar, icon, slug, count, color) VALUES
  ('Cars',                 'سيارات',            '🚗', 'cars',                142, '#EF4444'),
  ('Watches',              'ساعات',             '⌚', 'watches',              98, '#F59E0B'),
  ('Electronics',          'إلكترونيات',        '📱', 'electronics',          76, '#3B82F6'),
  ('Sneakers',             'أحذية رياضية',      '👟', 'sneakers',             54, '#8B5CF6'),
  ('Luxury Items',         'مقتنيات فاخرة',     '💎', 'luxury-items',         38, '#EC4899'),
  ('Real Estate',          'عقارات',            '🏢', 'real-estate',           22, '#10B981'),
  ('Gaming Collectibles',  'مقتنيات الألعاب',   '🃏', 'gaming-collectibles',   67, '#0B8A7E')
ON CONFLICT (slug) DO NOTHING;


-- ── creators ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS creators (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  handle       TEXT    NOT NULL UNIQUE,
  display_name TEXT    NOT NULL,
  platform     TEXT    NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
  followers    INT     DEFAULT 0,
  country      TEXT    DEFAULT '',
  flag         TEXT    DEFAULT '',
  country_name TEXT    DEFAULT '',
  category     TEXT    DEFAULT '',
  is_verified  BOOLEAN DEFAULT FALSE,
  is_live      BOOLEAN DEFAULT FALSE,
  viewers      INT,
  avatar_url   TEXT,
  rating       NUMERIC(3,2) DEFAULT 0,
  review_count INT     DEFAULT 0,
  status       TEXT    DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast live-first sorting
CREATE INDEX IF NOT EXISTS creators_is_live_viewers ON creators (is_live DESC, viewers DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS creators_platform ON creators (platform);
CREATE INDEX IF NOT EXISTS creators_category ON creators (category);


-- ── creator_submissions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS creator_submissions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  handle      TEXT NOT NULL,
  platform    TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
  profile_url TEXT,
  category    TEXT NOT NULL,
  country     TEXT NOT NULL,
  followers   INT,
  email       TEXT NOT NULL,
  message     TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE creators           ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories          ENABLE ROW LEVEL SECURITY;

-- Public read access for approved creators & categories
CREATE POLICY "Public read creators" ON creators
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (TRUE);

-- Anyone can submit (insert only, no read of others' submissions)
CREATE POLICY "Anyone can submit" ON creator_submissions
  FOR INSERT WITH CHECK (TRUE);
