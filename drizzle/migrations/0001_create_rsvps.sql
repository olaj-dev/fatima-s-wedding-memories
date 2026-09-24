CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  attending boolean NOT NULL,
  email text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.rsvps TO anon;
GRANT ALL ON public.rsvps TO service_role;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can submit RSVPs"
  ON public.rsvps FOR INSERT
  TO anon
  WITH CHECK (true);

COMMENT ON TABLE public.rsvps IS 'Guest RSVP submissions from the wedding invitation site';