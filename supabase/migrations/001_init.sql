-- Supabase SQL Migrations for Choose-Your-Own-Adventure App
-- Run this in the Supabase SQL Editor

-- =====================================================
-- 1. Create story_packs table (for future extensibility)
-- =====================================================
CREATE TABLE IF NOT EXISTS story_packs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default story pack
INSERT INTO story_packs (id, title) 
VALUES ('default', 'PDKT di Kantor')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. Create unlocked_endings table
-- =====================================================
CREATE TABLE IF NOT EXISTS unlocked_endings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_pack_id TEXT NOT NULL DEFAULT 'default' REFERENCES story_packs(id),
  ending_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, story_pack_id, ending_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_unlocked_endings_user 
ON unlocked_endings(user_id, story_pack_id);

-- =====================================================
-- 3. Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE unlocked_endings ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_packs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. RLS Policies for unlocked_endings
-- =====================================================

-- Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "Users can read their own endings" ON unlocked_endings;
DROP POLICY IF EXISTS "Users can insert their own endings" ON unlocked_endings;
DROP POLICY IF EXISTS "Users can delete their own endings" ON unlocked_endings;

-- Policy: Users can SELECT only their own rows
CREATE POLICY "Users can read their own endings"
  ON unlocked_endings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can INSERT only their own rows
CREATE POLICY "Users can insert their own endings"
  ON unlocked_endings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE only their own rows
CREATE POLICY "Users can delete their own endings"
  ON unlocked_endings
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. RLS Policy for story_packs (public read)
-- =====================================================

DROP POLICY IF EXISTS "Story packs are public" ON story_packs;

-- Policy: Anyone can read story packs
CREATE POLICY "Story packs are public"
  ON story_packs
  FOR SELECT
  USING (true);

-- =====================================================
-- 6. Verify setup
-- =====================================================
-- You can run these queries to verify:

-- Check tables exist:
-- SELECT * FROM story_packs;
-- SELECT * FROM unlocked_endings LIMIT 5;

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('story_packs', 'unlocked_endings');
