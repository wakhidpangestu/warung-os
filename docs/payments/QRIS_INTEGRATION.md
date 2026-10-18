# Integrasi QRIS Dinamis

## Yang tidak boleh
Membuat QR acak, memutar QR statis, memodifikasi payload QRIS merchant, mengaku terhubung langsung ke Bank Indonesia. QRIS dinamis hanya lewat penyelenggara jasa pembayaran yang berizin dan mendukung fiturnya.

## Matriks evaluasi provider
Tanggal akses semua sumber pada tabel: 18 Oktober 2026. Konfirmasi komersial dan onboarding tetap perlu dilakukan dengan sales sebelum memilih provider.

| Kriteria | Xendit | Midtrans | Lainnya |
|---|---|---|---|
| Izin penyelenggara (PJP) | tidak ditemukan bukti izin PJP atas nama Xendit pada sumber resmi yang ditinjau. BI menyatakan merchant harus mendaftar pada PJP QRIS terdaftar. [BI QRIS](https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx) (akses 18 Oktober 2026) | tidak ditemukan bukti izin PJP atas nama Midtrans pada sumber resmi yang ditinjau. [BI QRIS](https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx) (akses 18 Oktober 2026) | |
| QRIS dinamis per transaksi | Ya, Payments API v3 membuat `PAY` dengan `request_amount`, `reference_id`, dan `channel_code: QRIS`; respons QR ada di `actions`. [Migrasi Payments API v3](https://docs.xendit.co/docs/migrate-direct-per-method-apis-to-v3) (akses 18 Oktober 2026) | Ya, Charge API QRIS membuat transaksi dan mengembalikan URL QR; nominal dikirim pada `transaction_details.gross_amount`. [QRIS](https://docs.midtrans.com/reference/qris) (akses 18 Oktober 2026) | |
| Expiry QR dapat diatur | Ya, QRIS mendukung set expiry; dokumentasi menyatakan batas payment-request expiry 48 jam. [QRIS Xendit](https://docs.xendit.co/docs/qris) (akses 18 Oktober 2026) | Ya, custom expiry didukung; maksimum QRIS ShopeePay 5 hari dan GoPay 7 hari. [Charge Transactions](https://docs.midtrans.com/reference/charge-transactions-1) (akses 18 Oktober 2026) | |
| Webhook dan metode signature | Webhook status pembayaran memakai header `x-callback-token`, yang direkomendasikan untuk verifikasi asal webhook. [Payment webhook notification](https://docs.xendit.co/apidocs/payment-webhook-notification) (akses 18 Oktober 2026) | HTTP notification membawa `signature_key`; dokumentasi menjelaskan pembentukan dari `order_id`, `status_code`, `gross_amount`, dan Server Key. [Webhooks](https://docs.midtrans.com/docs/https-notification-webhooks) (akses 18 Oktober 2026) | |
| Sandbox untuk QRIS | tidak ditemukan pernyataan khusus sandbox QRIS pada dokumentasi resmi yang ditinjau. [QRIS Xendit](https://docs.xendit.co/docs/qris) (akses 18 Oktober 2026) | Ya, contoh QRIS menggunakan `https://api.sandbox.midtrans.com/v2/charge`. [QRIS](https://docs.midtrans.com/reference/qris) (akses 18 Oktober 2026) | |
| Refund QRIS | Ya, termasuk partial dan multiple partial refund, dengan batas refund 7 hari dan batasan issuer yang tercantum. [QRIS Xendit](https://docs.xendit.co/docs/qris) (akses 18 Oktober 2026) | Ya, Refund API mendukung QRIS setelah status `Settlement`; kapabilitas perlu diaktifkan bila belum tersedia. [Refund Transactions](https://docs.midtrans.com/reference/refund-transaction) (akses 18 Oktober 2026) | |
| Fee (MDR) dan skema pencairan | Dokumentasi QRIS menyebut pencairan T+1 hari kerja, tetapi MDR tidak ditemukan pada sumber resmi yang ditinjau. [QRIS Xendit](https://docs.xendit.co/docs/qris) (akses 18 Oktober 2026) | tidak ditemukan tarif MDR dan skema pencairan QRIS pada dokumentasi resmi yang ditinjau. [QRIS Midtrans](https://docs.midtrans.com/reference/qris) (akses 18 Oktober 2026) | |
| Syarat onboarding UMKM (NIB, KTP, rekening) | tidak ditemukan daftar NIB, KTP, dan rekening yang spesifik untuk Xendit pada sumber resmi yang ditinjau. BI hanya menyebut merchant melengkapi data usaha dan dokumen yang diminta PJP. [BI QRIS](https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx) (akses 18 Oktober 2026) | tidak ditemukan daftar NIB, KTP, dan rekening yang spesifik untuk Midtrans pada sumber resmi yang ditinjau. [BI QRIS](https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx) (akses 18 Oktober 2026) | |
| SDK/REST untuk TypeScript | REST didokumentasikan melalui Payments API v3; SDK TypeScript khusus QRIS tidak ditemukan pada sumber resmi yang ditinjau. [Migrasi Payments API v3](https://docs.xendit.co/docs/migrate-direct-per-method-apis-to-v3) (akses 18 Oktober 2026) | REST Charge API QRIS didokumentasikan; SDK TypeScript khusus QRIS tidak ditemukan pada sumber resmi yang ditinjau. [QRIS](https://docs.midtrans.com/reference/qris) (akses 18 Oktober 2026) | |
| Rekonsiliasi/endpoint cek status | Webhook mengirim perubahan status pembayaran; endpoint cek status terpisah tidak ditemukan pada sumber resmi yang ditinjau. [Payment webhook notification](https://docs.xendit.co/apidocs/payment-webhook-notification) (akses 18 Oktober 2026) | Ya, Get Status API mengambil status terbaru dan direkomendasikan sebagai cadangan bila notifikasi gagal diterima. [Get Status API](https://docs.midtrans.com/docs/get-status-api-requests) (akses 18 Oktober 2026) | |

Rekomendasi kerja: bangun terhadap `mock`, lalu implementasi satu adapter sandbox setelah akun sandbox tersedia. Pilih provider berdasarkan matriks yang sudah terisi dan syarat onboarding yang bisa dipenuhi oleh warung.

## Alur implementasi
1. Kasir checkout, server buat transaksi `pending_payment` dan attempt.
2. Server panggil `createPaymentRequest` dengan referensi unik, nominal, kedaluwarsa.
3. UI menampilkan QR dan nominal.
4. Webhook terverifikasi atau polling/rekonsiliasi menentukan hasil.
5. Server memvalidasi nominal, referensi, mata uang, lalu memproses idempoten.

## Kedaluwarsa dan ulang
Default kedaluwarsa singkat (mis. 5 menit, sesuaikan kemampuan provider). Setelah kedaluwarsa: attempt `expired`, kasir bisa membuat attempt baru (referensi baru) untuk transaksi yang sama. Webhook terlambat untuk attempt kedaluwarsa menjadi `under_review` bila ternyata dibayar, untuk ditangani manual atau refund.

## Prasyarat produksi
Akun merchant aktif, kredensial produksi, webhook URL terdaftar, secret webhook, uji end-to-end di sandbox, persetujuan Owner. Sampai itu, `FEATURE_QRIS_LIVE=false`.
