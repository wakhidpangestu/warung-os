---
name: security-review
description: Tinjau keamanan perubahan WarungOS: auth, tenant, pembayaran, rahasia, input.
---

# security-review

## Tujuan

Menemukan celah sebelum merge.

## Kapan dipakai

Perubahan pada auth, RLS, checkout, webhook, upload, rahasia, dependensi, kontrak.

## Konteks yang dibutuhkan

- Diff, THREAT_MODEL.md, SECURITY_MODEL.md

## Alur kerja

1. Identifikasi aset dan batas kepercayaan yang disentuh diff.
2. Cocokkan dengan T1-T20 di THREAT_MODEL.md.
3. Periksa otorisasi server, RLS, validasi input.
4. Periksa rahasia (klien, log, repo) dan header.
5. Periksa idempotensi dan transisi status.
6. Pastikan ada tes negatif.
7. Laporkan temuan dengan tingkat keparahan dan perbaikan.

## Batasan

- Jangan menurunkan standar demi cepat.
- Temuan kritis memblokir merge.

## Output yang diharapkan

Laporan temuan (Kritis/Tinggi/Sedang/Rendah), tes tambahan, pembaruan threat model.

## Checklist validasi

- [ ] Checklist di SECURITY_MODEL.md terisi
- [ ] Tidak ada rahasia
- [ ] Tes otorisasi negatif
- [ ] Dependensi diaudit

## Dokumen rujukan

docs/SECURITY_MODEL.md, THREAT_MODEL.md, SECURITY.md
