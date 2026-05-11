
REVOKE ALL ON FUNCTION public.consume_credit_atomic(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grant_credits_atomic(uuid, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credit_atomic(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.grant_credits_atomic(uuid, int) TO service_role;
