-- Add streak tracking columns to the user_progress table
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_login_date DATE;
