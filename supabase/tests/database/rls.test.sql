begin;
select plan(6);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'owner-a@example.test', 'not-used', now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'owner-b@example.test', 'not-used', now(), '{"provider":"email","providers":["email"]}', '{}');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select lives_ok($$ select public.create_shop_for_owner('Toko A') $$, 'pemilik dapat membuat toko');
select is((select count(*) from public.shops), 1::bigint, 'pemilik hanya melihat tokonya');

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select lives_ok($$ select public.create_shop_for_owner('Toko B') $$, 'pemilik kedua dapat membuat toko');
select is((select count(*) from public.shops), 1::bigint, 'RLS menutup toko tenant lain');
select is((select count(*) from public.shop_memberships), 1::bigint, 'RLS menutup membership tenant lain');
select throws_ok($$ insert into public.shop_memberships (shop_id, user_id, role) values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'owner') $$, '42501', null, 'klien tidak dapat menambah membership langsung');

select * from finish();
rollback;
