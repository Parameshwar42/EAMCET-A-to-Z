-- Fix 1: Allow Admins to update Transactions to "verified" or "rejected"
DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;
CREATE POLICY "Admins can update transactions" ON public.transactions
    FOR UPDATE USING (true) WITH CHECK (true);

-- Fix 2: Allow Admins to update other users' Premium Status in user_progress
DROP POLICY IF EXISTS "Admins can update user progress" ON public.user_progress;
CREATE POLICY "Admins can update user progress" ON public.user_progress
    FOR UPDATE USING (true) WITH CHECK (true);
