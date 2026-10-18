# Rekonsiliasi Pembayaran

Tujuan: memastikan status internal sama dengan provider, terutama saat webhook hilang atau terlambat.

## Pemicu
1. **Polling cepat:** saat QR tampil, server cek status ke provider berkala singkat (rate terbatas).
2. **Job rekonsiliasi:** tiap beberapa menit untuk attempt `awaiting_customer`/`processing` yang lewat ambang.
3. **Harian:** bandingkan seluruh attempt hari itu dengan laporan/endpoint list provider (bila tersedia, verifikasi).

## Aturan
- Hasil provider diproses lewat jalur yang sama dengan webhook (idempoten).
- Ketidakcocokan: `under_review` dan muncul di Diagnostik integrasi.
- Pembayaran diterima provider untuk attempt kedaluwarsa atau nominal salah: antrean peninjauan, opsi refund (hanya lewat alur refund berizin).
- Tidak ada pembatalan atau refund otomatis tanpa alur terdokumentasi dan izin Owner.

## Rekonsiliasi kas dan QRIS
Laporan harian memisahkan tunai dan QRIS. Pencairan dana dari provider dicocokkan manual dengan mutasi rekening (Sprint 8 bisa diotomatisasi).

## Metrik
Jumlah attempt `under_review`, umur tertua, selisih nominal harian.
