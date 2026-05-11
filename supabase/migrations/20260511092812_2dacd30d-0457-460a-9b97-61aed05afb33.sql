
-- Atomic credit consume: returns json { success, remaining, error }
CREATE OR REPLACE FUNCTION public.consume_credit_atomic(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_free_used int;
  v_purchased int;
  v_free_limit constant int := 1;
BEGIN
  -- Lock the row (or create it) atomically
  INSERT INTO public.user_credits (user_id, free_used, purchased_credits)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT free_used, purchased_credits
    INTO v_free_used, v_purchased
  FROM public.user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF (v_free_limit - v_free_used) > 0 THEN
    UPDATE public.user_credits
       SET free_used = v_free_used + 1,
           updated_at = now()
     WHERE user_id = p_user_id;
    RETURN jsonb_build_object(
      'success', true,
      'remaining', (v_free_limit - v_free_used - 1) + v_purchased
    );
  ELSIF v_purchased > 0 THEN
    UPDATE public.user_credits
       SET purchased_credits = v_purchased - 1,
           updated_at = now()
     WHERE user_id = p_user_id;
    RETURN jsonb_build_object(
      'success', true,
      'remaining', v_purchased - 1
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'remaining', 0,
      'error', 'No credits remaining'
    );
  END IF;
END;
$$;

-- user_credits needs unique constraint on user_id for ON CONFLICT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_credits_user_id_key'
      AND conrelid = 'public.user_credits'::regclass
  ) THEN
    ALTER TABLE public.user_credits ADD CONSTRAINT user_credits_user_id_key UNIQUE (user_id);
  END IF;
END$$;

-- Atomic credit grant after successful payment
CREATE OR REPLACE FUNCTION public.grant_credits_atomic(p_user_id uuid, p_credits int)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_credits <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid credit amount');
  END IF;

  INSERT INTO public.user_credits (user_id, free_used, purchased_credits)
  VALUES (p_user_id, 0, p_credits)
  ON CONFLICT (user_id) DO UPDATE
    SET purchased_credits = public.user_credits.purchased_credits + p_credits,
        updated_at = now();

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Payments table for Razorpay
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  plan text NOT NULL,
  amount_paise integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  credits_granted integer NOT NULL,
  status text NOT NULL DEFAULT 'created',
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_status_check CHECK (status IN ('created','paid','failed','refunded'))
);

CREATE UNIQUE INDEX IF NOT EXISTS payments_razorpay_order_id_key ON public.payments(razorpay_order_id);
CREATE UNIQUE INDEX IF NOT EXISTS payments_razorpay_payment_id_key ON public.payments(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies — only service role (server) can write.
