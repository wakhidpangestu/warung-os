---
name: database-engineering
description: Rancang migrasi, RLS, indeks, dan konsistensi data WarungOS di PostgreSQL/Supabase.
---

# database-engineering

## Tujuan

Skema yang benar, aman antar tenant, dan tahan konkurensi.

## Kapan dipakai

Menambah/mengubah tabel, kebijakan RLS, indeks, fungsi, trigger, seed.

## Konteks yang dibutuhkan

- DATABASE_SCHEMA.md
- Migrasi yang ada

## Alur kerja

1. Baca skema dan migrasi sebelumnya.
2. Tulis migrasi baru bernomor (forward-only).
3. Tambah `shop_id`, FK, check constraint, unique untuk idempotensi.
4. Aktifkan RLS dan kebijakan berbasis `shop_memberships`.
5. Tabel append-only: cabut update/delete atau trigger penolak.
6. Tambah indeks berdasarkan query nyata.
7. Uji di DB kosong dan dengan seed; uji RLS lintas tenant.
8. Perbarui DATABASE_SCHEMA.md dan ER diagram.

## Batasan

- Jangan edit migrasi yang sudah di-merge.
- Tanpa float untuk uang.
- Tanpa hapus fisik data keuangan.
- Service role hanya server.

## Output yang diharapkan

File migrasi, tes RLS/konstrain, dokumen skema diperbarui.

## Checklist validasi

- [ ] RLS aktif dan dites
- [ ] Constraint integritas
- [ ] Indeks sesuai query
- [ ] Migrasi berjalan dari nol
- [ ] Dokumen diperbarui

## Dokumen rujukan

docs/DATABASE_SCHEMA.md, SECURITY_MODEL.md
