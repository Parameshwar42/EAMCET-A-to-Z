-- Fix: Allow Admins to delete transactions from the Admin Dashboard
DROP POLICY IF EXISTS "Admins can delete transactions" ON public.transactions;
CREATE POLICY "Admins can delete transactions" ON public.transactions
    FOR DELETE USING (true);
