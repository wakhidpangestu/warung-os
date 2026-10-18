---
name: backend-engineering
description: Implementasi API, domain, dan checkout WarungOS dengan validasi, otorisasi, idempotensi.
---

# backend-engineering

## Tujuan

Membangun logika server yang benar untuk penjualan, stok, dan laporan.

## Kapan dipakai

Membuat/mengubah route handler, modul domain, checkout, laporan, job.

## Konteks yang dibutuhkan

- API_SPECIFICATION.md, ACCEPTANCE_CRITERIA.md
- Skema DB terkait

## Alur kerja

1. Definisikan skema Zod untuk request dan response.
2. Otorisasi: periksa sesi, shop, peran di server.
3. Taruh aturan bisnis di `domain/`, bukan di route.
4. Operasi keuangan: transaksi DB, idempotency key, hitung ulang harga dari DB.
5. Efek eksternal lewat outbox.
6. Error seragam dengan kode.
7. Tulis tes integrasi (termasuk kasus negatif dan konkurensi).

## Batasan

- Uang integer, tanpa float.
- Jangan percaya harga/status dari klien.
- Jangan log rahasia.
- Transisi status lewat `assertTransition`.

## Output yang diharapkan

Kode, tes, pembaruan API_SPECIFICATION.md, catatan keamanan.

## Checklist validasi

- [ ] Validasi Zod
- [ ] Cek peran dan shop
- [ ] Idempoten
- [ ] Atomik
- [ ] Tes negatif dan konkurensi lulus

## Dokumen rujukan

docs/API_SPECIFICATION.md, ARCHITECTURE.md, SECURITY_MODEL.md
