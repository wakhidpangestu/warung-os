create table public.app_settings (
  shop_id uuid not null references public.shops(id) on delete cascade,
  key text not null check (char_length(key) between 1 and 100),
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (shop_id, key)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
alter table public.audit_logs enable row level security;

create policy app_settings_owner_read on public.app_settings for select using (
  exists (select 1 from public.shop_memberships m where m.shop_id = app_settings.shop_id and m.user_id = auth.uid() and m.role = 'owner')
);
create policy app_settings_owner_write on public.app_settings for all using (
  exists (select 1 from public.shop_memberships m where m.shop_id = app_settings.shop_id and m.user_id = auth.uid() and m.role = 'owner')
) with check (
  exists (select 1 from public.shop_memberships m where m.shop_id = app_settings.shop_id and m.user_id = auth.uid() and m.role = 'owner')
);
create policy audit_logs_member_read on public.audit_logs for select using (
  exists (select 1 from public.shop_memberships m where m.shop_id = audit_logs.shop_id and m.user_id = auth.uid())
);

create or replace function public.reject_audit_log_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'AUDIT_LOGS_ARE_APPEND_ONLY' using errcode = '42501';
end;
$$;

create trigger audit_logs_no_update before update on public.audit_logs for each row execute function public.reject_audit_log_mutation();
create trigger audit_logs_no_delete before delete on public.audit_logs for each row execute function public.reject_audit_log_mutation();
