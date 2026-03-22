-- Run this in your Supabase SQL Editor to create the PDF Exams Engine!

-- 1. Create the Storage Bucket for PDF Files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('test-pdfs', 'test-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies (Allow anyone to read and upload for MVP Admin simplicity)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'test-pdfs' );
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'test-pdfs' );

-- 3. Create the Database Table for Exam Metadata
CREATE TABLE pdf_exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  duration_mins INTEGER NOT NULL,
  questions_count INTEGER NOT NULL,
  pdf_url TEXT NOT NULL,
  solution_url TEXT,
  answer_key TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS on the new table
ALTER TABLE pdf_exams ENABLE ROW LEVEL SECURITY;

-- 5. Open Table Policies (Permissive for MVP CMS)
CREATE POLICY "Allow public read access on pdf_exams" ON pdf_exams FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on pdf_exams" ON pdf_exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on pdf_exams" ON pdf_exams FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on pdf_exams" ON pdf_exams FOR DELETE USING (true);
