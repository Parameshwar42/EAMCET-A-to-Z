-- Paste this directly into the Supabase 'SQL Editor' to create your tables!

-- 1. Create Videos Table
CREATE TABLE videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  thumbnail text,
  subject text NOT NULL,
  duration text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Mock Tests Table
CREATE TABLE mock_tests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  duration text NOT NULL,
  questions_count integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS) policies 
-- (For this prototype, we allow public read access so students can see them, and public insert access so you can easily upload from the Admin Dashboard without complex Role permissions right now)

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on videos" ON videos FOR INSERT WITH CHECK (true);

ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on mock_tests" ON mock_tests FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on mock_tests" ON mock_tests FOR INSERT WITH CHECK (true);
