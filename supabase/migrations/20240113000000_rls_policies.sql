-- Wave 0 / Task 2: Centralized tenant isolation policies

-- app.current_tenant must be set by request lifecycle before queries are executed.
create policy if not exists tenant_select_leads
  on app_public.leads
  for select
  using (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy if not exists tenant_insert_leads
  on app_public.leads
  for insert
  with check (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy if not exists tenant_update_leads
  on app_public.leads
  for update
  using (tenant_id = current_setting('app.current_tenant', true)::uuid)
  with check (tenant_id = current_setting('app.current_tenant', true)::uuid);

create policy if not exists tenant_delete_leads
  on app_public.leads
  for delete
  using (tenant_id = current_setting('app.current_tenant', true)::uuid);
