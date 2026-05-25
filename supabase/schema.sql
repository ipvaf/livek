-- Mazady Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  location TEXT DEFAULT 'Kuwait',
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CATEGORIES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO categories (name, name_ar, icon, slug) VALUES
  ('Cars', 'سيارات', '🚗', 'cars'),
  ('Electronics', 'إلكترونيات', '💻', 'electronics'),
  ('Watches', 'ساعات', '⌚', 'watches'),
  ('Real Estate', 'عقارات', '🏢', 'real-estate'),
  ('Collectibles', 'مقتنيات', '🏺', 'collectibles'),
  ('Fashion', 'موضة', '👜', 'fashion'),
  ('Jewelry', 'مجوهرات', '💎', 'jewelry'),
  ('Art', 'فنون', '🎨', 'art')
ON CONFLICT (slug) DO NOTHING;

-- =====================
-- AUCTIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  category TEXT NOT NULL REFERENCES categories(slug),
  condition TEXT NOT NULL DEFAULT 'Good',
  starting_price DECIMAL(12,3) NOT NULL,
  current_bid DECIMAL(12,3) NOT NULL DEFAULT 0,
  reserve_price DECIMAL(12,3),
  end_time TIMESTAMPTZ NOT NULL,
  seller_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ending_soon', 'completed', 'cancelled')),
  location TEXT DEFAULT 'Kuwait',
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  bids_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_category ON auctions(category);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auctions_seller_id ON auctions(seller_id);

-- =====================
-- BIDS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(12,3) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for bid lookups
CREATE INDEX IF NOT EXISTS idx_bids_auction_id ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON bids(created_at DESC);

-- =====================
-- WATCHLIST TABLE
-- =====================
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, auction_id)
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Users: public read, own write
CREATE POLICY "Users are publicly viewable" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Auctions: public read, seller write
CREATE POLICY "Auctions are publicly viewable" ON auctions FOR SELECT USING (true);
CREATE POLICY "Users can create auctions" ON auctions FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own auctions" ON auctions FOR UPDATE USING (auth.uid() = seller_id);

-- Bids: public read for auction bids, own write
CREATE POLICY "Bids are publicly viewable" ON bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bids" ON bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Watchlist: own only
CREATE POLICY "Users can view own watchlist" ON watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist" ON watchlist FOR ALL USING (auth.uid() = user_id);

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Auto-update current_bid when new bid is placed
CREATE OR REPLACE FUNCTION update_auction_on_bid()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auctions
  SET
    current_bid = NEW.amount,
    bids_count = bids_count + 1,
    updated_at = NOW()
  WHERE id = NEW.auction_id AND current_bid < NEW.amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_bid_placed
  AFTER INSERT ON bids
  FOR EACH ROW
  EXECUTE FUNCTION update_auction_on_bid();

-- Auto-mark auctions as ending_soon (within 2 hours)
CREATE OR REPLACE FUNCTION mark_ending_soon()
RETURNS void AS $$
BEGIN
  UPDATE auctions
  SET status = 'ending_soon', updated_at = NOW()
  WHERE
    status = 'active'
    AND end_time BETWEEN NOW() AND NOW() + INTERVAL '2 hours';

  UPDATE auctions
  SET status = 'completed', updated_at = NOW()
  WHERE
    status IN ('active', 'ending_soon')
    AND end_time < NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================
-- REALTIME
-- =====================
-- Enable realtime for live bidding
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE bids;
