---
name: testing-and-qa
description: Rancang dan jalankan tes WarungOS: unit, integrasi, e2e, kontrak, keamanan, a11y.
---

# testing-and-qa

## Tujuan

Bukti nyata bahwa fitur memenuhi acceptance criteria.

## Kapan dipakai

Menulis tes, menyelidiki bug, memverifikasi sprint selesai.

## Konteks yang dibutuhkan

- ACCEPTANCE_CRITERIA.md, TESTING_STRATEGY.md

## Alur kerja

1. Petakan AC ke tes (perbarui REQUIREMENTS_TRACEABILITY.md).
2. Tulis tes terendah yang efektif (unit → integrasi → e2e).
3. Wajib: konkurensi stok, idempotensi, webhook, RLS.
4. Jalankan `pnpm lint && pnpm typecheck && pnpm test` (dan e2e bila relevan).
5. Laporkan hasil nyata.

## Batasan

- Jangan klaim lulus bila belum dijalankan; jelaskan alasan dan perintahnya.
- Jangan menonaktifkan tes yang gagal untuk meloloskan.

## Output yang diharapkan

Tes baru, laporan hasil, traceability diperbarui.

## Checklist validasi

- [ ] Setiap AC punya tes
- [ ] Kasus negatif ada
- [ ] Hasil dilaporkan jujur

## Dokumen rujukan

docs/TESTING_STRATEGY.md, ACCEPTANCE_CRITERIA.md, REQUIREMENTS_TRACEABILITY.md
