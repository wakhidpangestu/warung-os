create type public.shop_role as enum ('owner', 'cashier', 'inventory', 'auditor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  timezone text not null default 'Asia/Jakarta' check (timezone = 'Asia/Jakarta'),
  currency text not null default 'IDR' check (currency = 'IDR'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shop_memberships (
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.shop_role not null,
  created_at timestamptz not null default now(),
  primary key (shop_id, user_id)
);

create index shop_memberships_user_id_idx on public.shop_memberships(user_id);

alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.shop_memberships enable row level security;

create policy profiles_select_own on public.profiles for select using (id = auth.uid());
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy memberships_select_own on public.shop_memberships for select using (user_id = auth.uid());
create policy shops_select_member on public.shops for select using (
  exists (select 1 from public.shop_memberships membership where membership.shop_id = shops.id and membership.user_id = auth.uid())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name) values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.create_shop_for_owner(shop_name text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare new_shop_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTHENTICATION_REQUIRED' using errcode = '42501'; end if;
  if char_length(trim(shop_name)) not between 2 and 120 then raise exception 'INVALID_SHOP_NAME' using errcode = '22023'; end if;
  insert into public.shops (name) values (trim(shop_name)) returning id into new_shop_id;
  insert into public.shop_memberships (shop_id, user_id, role) values (new_shop_id, auth.uid(), 'owner');
  return new_shop_id;
end;
$$;

revoke all on function public.create_shop_for_owner(text) from public;
grant execute on function public.create_shop_for_owner(text) to authenticated;
