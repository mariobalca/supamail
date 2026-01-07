-- Create a table for public profiles (users)
CREATE TABLE public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  primary_email text NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create a table for email aliases
CREATE TABLE public.aliases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  address text UNIQUE NOT NULL, -- e.g., shopping@tool.com
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create a table for rules
CREATE TABLE public.rules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  alias_id uuid REFERENCES public.aliases(id) ON DELETE CASCADE NOT NULL,
  pattern text NOT NULL, -- e.g., 'amazon.com' or 'newsletter@spam.com'
  action text CHECK (action IN ('allow', 'block')) DEFAULT 'allow',
  created_at timestamp with time zone DEFAULT now()
);

-- Create a table for activity logs
CREATE TABLE public.logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  alias_id uuid REFERENCES public.aliases(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL,
  subject text,
  ai_summary text,
  status text CHECK (status IN ('forwarded', 'blocked')) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage their own aliases" ON public.aliases FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own rules" ON public.rules FOR ALL
USING (EXISTS (SELECT 1 FROM public.aliases WHERE aliases.id = rules.alias_id AND aliases.user_id = auth.uid()));

CREATE POLICY "Users can view their own logs" ON public.logs FOR SELECT
USING (EXISTS (SELECT 1 FROM public.aliases WHERE aliases.id = logs.alias_id AND aliases.user_id = auth.uid()));

-- Enable realtime for logs (optional but nice for dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.logs;
