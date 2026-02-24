-- DOMAIN-29-29-3: deep_merge_config RPC for tenant settings partial updates

CREATE OR REPLACE FUNCTION public.deep_merge_config(
  p_tenant_id uuid,
  p_path text[],
  p_value jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_config jsonb;
  target_snapshot jsonb;
BEGIN
  SELECT config
  INTO current_config
  FROM public.tenants
  WHERE id = p_tenant_id;

  IF current_config IS NULL THEN
    RAISE EXCEPTION 'Tenant % not found', p_tenant_id;
  END IF;

  target_snapshot := COALESCE(current_config #> p_path, '{}'::jsonb);

  UPDATE public.tenants
  SET
    config = jsonb_set(current_config, p_path, target_snapshot || p_value, true),
    updated_at = NOW()
  WHERE id = p_tenant_id;
END;
$$;

REVOKE ALL ON FUNCTION public.deep_merge_config(uuid, text[], jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deep_merge_config(uuid, text[], jsonb) TO authenticated;
