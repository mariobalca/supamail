-- Create a table for categories
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert initial default categories
INSERT INTO public.categories (name) VALUES
('Personal'),
('Social'),
('Promotions'),
('Updates'),
('Transactional'),
('Spam')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS (though categories are mostly read-only for users, they might be added to)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert new categories (AI service will do this via admin, but let's keep it flexible)
CREATE POLICY "Authenticated users can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
