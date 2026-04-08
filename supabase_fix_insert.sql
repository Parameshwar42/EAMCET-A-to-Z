-- Fix: Allow Admins to insert user progress for brand new users
DROP POLICY IF EXISTS "Admins can insert user progress" ON public.user_progress;
CREATE POLICY "Admins can insert user progress" ON public.user_progress
    FOR INSERT WITH CHECK (true);
