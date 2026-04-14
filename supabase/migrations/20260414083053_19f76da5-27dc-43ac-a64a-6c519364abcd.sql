
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  target_value TEXT,
  campaign_state TEXT NOT NULL,
  best_performer JSONB NOT NULL,
  worst_performer JSONB NOT NULL,
  decision TEXT NOT NULL,
  reason TEXT NOT NULL,
  action_plan JSONB NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  data_confidence TEXT NOT NULL CHECK (data_confidence IN ('High', 'Medium', 'Low')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_analyses_user_id ON public.analyses (user_id);
CREATE INDEX idx_analyses_created_at ON public.analyses (created_at DESC);
