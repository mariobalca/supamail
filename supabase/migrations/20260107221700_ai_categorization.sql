-- Update rules table to support different matching types
ALTER TABLE public.rules ADD COLUMN type text CHECK (type IN ('domain', 'email', 'category')) DEFAULT 'domain';

-- Update logs table to store AI categorization
ALTER TABLE public.logs ADD COLUMN category text;
ALTER TABLE public.logs ADD COLUMN body_html text;
ALTER TABLE public.logs ADD COLUMN body_plain text;
