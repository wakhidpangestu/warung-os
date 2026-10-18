# Batasan yang Diketahui

Dokumen hidup. Perbarui seiring implementasi.

## Saat ini
- Fondasi aplikasi, autentikasi, setup toko, dan RLS tersedia sejak Sprint 1. Fitur produk, transaksi, pembayaran, offline, dan blockchain belum diimplementasikan.
- Tabel provider QRIS dan perbandingan jaringan belum diisi (butuh verifikasi dokumentasi resmi).
- Asumsi regulasi belum diverifikasi hukum.

## Desain
- **iOS PWA:** background sync terbatas, storage dapat dibersihkan sistem, notifikasi push terbatas. Offline iOS lebih rapuh dari Android.
- **Offline:** hanya tunai. Stok lokal bisa basi, konflik ditandai untuk tinjau.
- **Serverless:** job pendek via cron, bukan worker abadi.
- **Blockchain:** membuktikan integritas catatan, bukan bahwa penjualan fisik terjadi. Mode batch memiliki latensi bukti. Kehilangan nonce menghilangkan kemampuan membuktikan transaksi itu.
- **Laba:** estimasi dari harga beli tercatat, tidak memperhitungkan susut, pajak, biaya lain, dan perubahan harga beli antar batch (metode biaya sederhana).
- **Insider Owner** dapat mengubah DB, commitment mendeteksi tetapi tidak mencegah.
- **Kripto:** tidak tersedia untuk uang nyata.
- **Printer struk Bluetooth:** ditunda.
- **iOS native:** butuh Mac dan akun Apple Developer, belum dikerjakan.
- **Pajak:** tidak dihitung.
## Sprint 1

- Tes pgTAP RLS belum dijalankan dalam verifikasi terakhir. Jalankan `pnpm db:test` pada Supabase lokal yang aktif.
- Playwright memerlukan browser terunduh (`pnpm exec playwright install`) untuk runner standar. Verifikasi terakhir menggunakan executable Chrome lokal.
- Rate limiting login dan PIN kasir belum diimplementasikan. PIN kasir serta pengelolaan staf berada di ruang lingkup sprint setelah fondasi IAM.
