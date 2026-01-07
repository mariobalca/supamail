-- Create a table for public profiles (users)
CREATE TABLE public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create a table for rules
CREATE TABLE public.rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  pattern text NOT NULL, -- e.g., 'amazon.com' or 'newsletter@spam.com'
  action text CHECK (action IN ('allow', 'block')) DEFAULT 'allow',
  created_at timestamp with time zone DEFAULT now()
);

-- Create a table for activity logs
CREATE TABLE public.logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL,
  subject text,
  ai_summary text,
  status text CHECK (status IN ('forwarded', 'blocked')) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage their own rules" ON public.rules FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs" ON public.logs FOR SELECT USING (auth.uid() = user_id);

-- Enable realtime for logs (optional but nice for dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.logs;
