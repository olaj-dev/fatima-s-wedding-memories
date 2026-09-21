CREATE TABLE public.memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path text NOT NULL,
  guest_name text,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.memories TO anon;
GRANT SELECT, INSERT ON public.memories TO authenticated;
GRANT ALL ON public.memories TO service_role;

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view memories"
  ON public.memories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add a memory"
  ON public.memories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public read of memories bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'memories');

CREATE POLICY "Anyone can upload to memories bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'memories');
