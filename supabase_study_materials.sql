-- Create study_materials table for PDF Notes and Formulas
CREATE TABLE IF NOT EXISTS public.study_materials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  subject text NOT NULL,
  type text NOT NULL, -- Examples: 'Formulas', 'Notes', 'PYQ'
  size text, -- Examples: '2.4 MB', '500 KB'
  file_url text NOT NULL, -- Link to Google Drive, Dropbox, or direct PDF
  icon text DEFAULT 'FileText',
  color text DEFAULT 'var(--primary)',
  is_active boolean DEFAULT true
);

-- Setup RLS (Row Level Security) if you want public viewing (you likely do for app users)
-- Uncomment these if you are enabling RLS in Supabase
-- ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON public.study_materials FOR SELECT USING (true);
