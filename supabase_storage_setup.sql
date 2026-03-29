-- 1. Create the bucket and make it public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study_materials_pdfs', 'study_materials_pdfs', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable Row Level Security (RLS) on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies for this bucket (to prevent conflicts if you run this multiple times)
DROP POLICY IF EXISTS "Public View PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow Updates Deletes PDFs" ON storage.objects;

-- 4. Create Policy: Allow public to VIEW (download) the PDFs
CREATE POLICY "Public View PDFs"
ON storage.objects FOR SELECT
USING ( bucket_id = 'study_materials_pdfs' );

-- 5. Create Policy: Allow uploading (Insert) to the bucket
CREATE POLICY "Allow Uploads PDFs"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'study_materials_pdfs' );

-- 6. Create Policy: Allow modifying/deleting for admin overrides
CREATE POLICY "Allow Updates Deletes PDFs"
ON storage.objects FOR ALL
USING ( bucket_id = 'study_materials_pdfs' );
