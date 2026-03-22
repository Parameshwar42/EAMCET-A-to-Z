-- Run this in your Supabase SQL Editor to create the new tables for Practice, Revision, and Study Plan!

-- 1. Practice Chapters Table
CREATE TABLE practice_chapters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  questions_count INTEGER DEFAULT 0,
  mastery INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Revision Notes Table
CREATE TABLE revision_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  content_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Study Plan Tasks Table
CREATE TABLE study_plan_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  scheduled_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE practice_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan_tasks ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Allow public read access on practice_chapters" ON practice_chapters FOR SELECT USING (true);
CREATE POLICY "Allow public read access on revision_notes" ON revision_notes FOR SELECT USING (true);
CREATE POLICY "Allow public read access on study_plan_tasks" ON study_plan_tasks FOR SELECT USING (true);

-- Admin Modify Access (Assuming public for simplicity as requested, but logic is tied to Admin UI)
CREATE POLICY "Allow public insert access on practice_chapters" ON practice_chapters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on practice_chapters" ON practice_chapters FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on practice_chapters" ON practice_chapters FOR DELETE USING (true);

CREATE POLICY "Allow public insert access on revision_notes" ON revision_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on revision_notes" ON revision_notes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on revision_notes" ON revision_notes FOR DELETE USING (true);

CREATE POLICY "Allow public insert access on study_plan_tasks" ON study_plan_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on study_plan_tasks" ON study_plan_tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on study_plan_tasks" ON study_plan_tasks FOR DELETE USING (true);
