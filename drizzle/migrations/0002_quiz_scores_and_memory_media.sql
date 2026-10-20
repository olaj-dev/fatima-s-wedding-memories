CREATE TABLE public.quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL CHECK (char_length(nickname) BETWEEN 2 AND 30),
  score integer NOT NULL CHECK (score >= 0 AND score <= 10),
  total_questions integer NOT NULL DEFAULT 10 CHECK (total_questions BETWEEN 1 AND 10),
  is_test boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_scores TO anon, authenticated;
GRANT ALL ON public.quiz_scores TO service_role;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view scores" ON public.quiz_scores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit a score" ON public.quiz_scores FOR INSERT TO anon, authenticated WITH CHECK (score <= total_questions);
CREATE INDEX quiz_scores_rank_idx ON public.quiz_scores (is_test, score DESC, created_at ASC);

ALTER TABLE public.memories ADD COLUMN media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video'));
ALTER TABLE public.memories ADD COLUMN category text NOT NULL DEFAULT 'general';