-- ======================================================
-- MCQ Exam Questions Engine - Run in Supabase SQL Editor
-- ======================================================

-- 1. Create exam_questions table (stores each MCQ individually)
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES pdf_exams(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  subject TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Public read exam_questions" ON exam_questions FOR SELECT USING (true);
CREATE POLICY "Public insert exam_questions" ON exam_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update exam_questions" ON exam_questions FOR UPDATE USING (true);
CREATE POLICY "Public delete exam_questions" ON exam_questions FOR DELETE USING (true);

-- 4. Also create exam_submissions table to track student results
CREATE TABLE IF NOT EXISTS exam_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exam_id UUID REFERENCES pdf_exams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- { "1": "A", "2": "C", ... }
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own submissions" ON exam_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON exam_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
