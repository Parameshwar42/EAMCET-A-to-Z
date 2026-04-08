-- 1. Add premium columns to study_materials
ALTER TABLE public.study_materials 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;

-- 2. Add premium access to user tracking map
ALTER TABLE public.user_progress
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS premium_unlocked_at TIMESTAMP WITH TIME ZONE;

-- 3. Create a Transactions table for Admin to track manual UPI payments
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    amount NUMERIC NOT NULL,
    plan_name TEXT DEFAULT 'Premium Access',
    utr_number TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, verified, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 4. Set permissions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);
