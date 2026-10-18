# Roadmap

Estimasi dalam sprint ~1-2 minggu untuk 1 developer + agen. Tanggal dikunci setelah Sprint 0.

| Sprint | Fokus | Output | Syarat selesai |
|---|---|---|---|
| 0 | Perencanaan | Dokumen inti, ADR, risiko | Direview |
| 1 | Fondasi | Repo, auth, DB, RLS, CI, design system | Login + tes isolasi tenant lulus |
| 2 | Katalog + stok | Produk, kategori, cari harga, stok, CSV | AC-01, 02, 20, 22 lulus |
| 3 | Kasir tunai + laporan | Keranjang, tunai, struk, riwayat, laporan | AC-10..15, 30 lulus; dipakai di warung |
| 4 | PWA + APK | Offline, install, Capacitor Android | AC-60, 61; APK uji terpasang |
| 5 | QRIS dinamis | Adapter, mock, sandbox, webhook, rekonsiliasi | AC-40..42 lulus di sandbox |
| 6 | Audit blockchain | Outbox, batch Merkle, kontrak testnet, explorer | AC-50, 51 lulus |
| 7 | Hardening | Tes keamanan, backup restore, observabilitas | Checklist rilis lulus |
| 8 | Ekstensi | Multi-toko, barcode, printer, dll | Berdasar kebutuhan |

## Jalur kritis dan dependensi
Sprint 5 butuh onboarding merchant (di luar kendali tim): mulai urus paralel sejak Sprint 1.
Sprint 6 butuh keputusan jaringan dan RPC testnet.
iOS native butuh Mac, Xcode, Apple Developer; ditunda, PWA Safari dipakai dulu.

## Gerbang rilis produksi
1. Tes lulus (dijalankan). 2. Restore backup teruji. 3. QRIS live hanya jika onboarding selesai dan `QRIS_ENABLED=true`. 4. Tinjauan hukum untuk fitur aset digital sebelum diaktifkan.
