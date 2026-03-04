-- Wave 1 / TASK-017: Generic audit trigger for automatic change capture
-- Attaches to tables in app_public schema and writes a row to
-- app_private.audit_logs after every INSERT, UPDATE, or DELETE.
--
-- Usage (call once per table you want to audit):
--   select app_private.attach_audit_trigger('app_public.leads');
--   select app_private.attach_audit_trigger('app_public.tenants');
--
-- The trigger function reads app.current_tenant and app.current_user from
-- the session configuration set by the request lifecycle before queries run.

-- ── Trigger function ─────────────────────────────────────────────────────────

create or replace function app_private.audit_trigger_fn()
  returns trigger
  language plpgsql
  security definer
as $$
declare
  v_action        text;
  v_tenant_id     uuid;
  v_user_id       uuid;
  v_metadata      jsonb;
  v_prev_hash     text;
  v_row_data      jsonb;
  v_chain_input   text;
  v_chain_hash    text;
begin
  -- Map DML operation to action name.
  v_action := lower(TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME || '.' || TG_OP);

  -- Resolve tenant from session config (set by request lifecycle).
  begin
    v_tenant_id := current_setting('app.current_tenant', true)::uuid;
  exception when others then
    v_tenant_id := null;
  end;

  -- Skip rows that have no tenant context (e.g. migrations, system jobs).
  if v_tenant_id is null then
    return coalesce(NEW, OLD);
  end if;

  -- Resolve actor from session config.
  begin
    v_user_id := current_setting('app.current_user', true)::uuid;
  exception when others then
    v_user_id := null;
  end;

  -- Capture before/after as JSON, excluding columns that should never be logged.
  v_row_data := jsonb_build_object(
    'old', case when TG_OP = 'INSERT' then null else to_jsonb(OLD) end,
    'new', case when TG_OP = 'DELETE' then null else to_jsonb(NEW) end
  );

  -- Strip sensitive columns from the captured row snapshot.
  -- Add more column names here as your schema grows.
  v_row_data := jsonb_set(
    v_row_data,
    '{new}',
    coalesce(v_row_data->'new', 'null'::jsonb)
      - 'password_hash'
      - 'stripe_secret'
      - 'refresh_token'
      - 'access_token'
  );
  v_row_data := jsonb_set(
    v_row_data,
    '{old}',
    coalesce(v_row_data->'old', 'null'::jsonb)
      - 'password_hash'
      - 'stripe_secret'
      - 'refresh_token'
      - 'access_token'
  );

  v_metadata := jsonb_build_object(
    'table',      TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
    'operation',  TG_OP,
    'row_data',   v_row_data
  );

  -- Fetch the previous chain_hash for this tenant (for hash chaining).
  select chain_hash
    into v_prev_hash
    from app_private.audit_logs
   where tenant_id = v_tenant_id
   order by id desc
   limit 1;

  v_prev_hash := coalesce(v_prev_hash, '');

  -- Compute new chain hash.  Note: actual SHA-256 requires pgcrypto.
  -- If pgcrypto is not available this falls back to a deterministic placeholder
  -- that preserves the chain structure while remaining upgrade-safe.
  begin
    v_chain_input := v_prev_hash
      || ':' || now()::text
      || ':' || v_tenant_id::text
      || ':' || v_action
      || ':success';

    -- Use pgcrypto digest if available; otherwise pad to 64 chars.
    v_chain_hash := encode(digest(v_chain_input, 'sha256'), 'hex');
  exception when undefined_function then
    -- pgcrypto not installed: use a deterministic 64-char placeholder.
    v_chain_hash := lpad(md5(v_chain_input) || md5(reverse(v_chain_input)), 64, '0');
  end;

  insert into app_private.audit_logs
    (tenant_id, user_id, action, outcome, metadata, occurred_at, chain_hash)
  values
    (v_tenant_id, v_user_id, v_action, 'success', v_metadata, now(), v_chain_hash);

  return coalesce(NEW, OLD);
end;
$$;

comment on function app_private.audit_trigger_fn()
  is 'Generic AFTER trigger that appends a hash-chained row to audit_logs.  '
     'Attach to any table via app_private.attach_audit_trigger().';

-- ── Attach helper ─────────────────────────────────────────────────────────────

create or replace function app_private.attach_audit_trigger(p_table regclass)
  returns void
  language plpgsql
as $$
declare
  v_trigger_name text;
begin
  -- Derive a deterministic trigger name from the table OID to avoid
  -- name collisions when attaching to multiple tables.
  v_trigger_name := 'zz_audit_' || p_table::text;

  -- Drop the trigger if it already exists so this function is idempotent.
  execute format(
    'drop trigger if exists %I on %s',
    v_trigger_name,
    p_table
  );

  execute format(
    'create trigger %I
       after insert or update or delete on %s
       for each row execute function app_private.audit_trigger_fn()',
    v_trigger_name,
    p_table
  );
end;
$$;

comment on function app_private.attach_audit_trigger(regclass)
  is 'Idempotently attaches the audit trigger to the given table.  '
     'Call once per table you want to capture changes for.';
