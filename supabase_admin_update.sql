-- Run this in your Supabase SQL Editor to unlock UPDATE and DELETE abilities for the Admin Dashboard!

CREATE POLICY "Allow public update access on videos" ON videos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on videos" ON videos FOR DELETE USING (true);

CREATE POLICY "Allow public update access on mock_tests" ON mock_tests FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on mock_tests" ON mock_tests FOR DELETE USING (true);
