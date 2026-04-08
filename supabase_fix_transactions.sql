-- Fix RLS so the Admin Dashboard can view all transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;

-- Allow all authenticated users to view transactions so the Admin Dashboard works
CREATE POLICY "Admins can view transactions" ON public.transactions
    FOR SELECT USING (true);
