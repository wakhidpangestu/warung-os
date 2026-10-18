---
name: frontend-ui
description: Bangun UI WarungOS: POS, katalog, laporan, PWA. Pakai untuk halaman, komponen, form, responsif, aksesibilitas.
---

# frontend-ui

## Tujuan
Menghasilkan UI cepat, aksesibel, mobile-first berbahasa Indonesia.

## Kapan dipakai
Membuat/mengubah halaman, komponen, alur POS, form, tampilan offline.

## Konteks yang dibutuhkan
- docs/design/* (token, komponen, responsif, a11y)
- Kontrak API terkait

## Alur kerja
1. Baca DESIGN.md dan token.
2. Mulai dari layout mobile (360px), lalu tablet dan desktop.
3. Gunakan komponen shadcn/ui dengan token, komponen `Money` untuk rupiah.
4. Form: React Hook Form + Zod, pesan galat Indonesia.
5. Tangani state memuat, kosong, galat, offline.
6. Lencana MOCK/SANDBOX/LIVE di alur bayar.
7. Tulis tes komponen dan e2e alur kritis.

## Batasan
- Tidak ada aksi hover-only.
- Tidak menghitung harga/total final di klien sebagai otoritas.
- Tidak memakai localStorage untuk data keuangan.
- Tanpa em dash di teks UI.

## Output yang diharapkan
Komponen/halaman, tes, tangkapan layar atau catatan visual, pembaruan docs desain bila perlu.

## Checklist validasi
- [ ] Layar 360x640 tidak scroll horizontal
- [ ] Keyboard dan fokus terlihat
- [ ] Kontras AA
- [ ] Target sentuh >= 44px
- [ ] Status memuat/kosong/galat ada

## Dokumen rujukan
docs/design/DESIGN.md, DESIGN_TOKENS.md, COMPONENT_GUIDELINES.md, RESPONSIVE_GUIDELINES.md, ACCESSIBILITY.md
