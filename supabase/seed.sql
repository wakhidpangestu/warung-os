-- Hanya contoh non-pribadi. Tidak ada pengguna atau membership agar RLS tetap tertutup secara default.
insert into public.shops (id, name)
values ('00000000-0000-0000-0000-000000000100', 'Contoh Warung')
on conflict (id) do nothing;
