# Observability

## Log
Terstruktur (JSON), ada `request_id`, `shop_id`, `user_id`. Tanpa rahasia, token, nomor kartu, payload webhook penuh. Level: info, warn, error.

## Metrik penting
- Checkout: jumlah, gagal, latensi p95.
- Pembayaran: attempt per status, `under_review`, umur attempt tertunda, webhook ditolak.
- Outbox: kedalaman antrean, umur job tertua, dead-letter.
- Blockchain: commitment per status, saldo signer, kegagalan RPC.
- Stok: stok tipis, selisih koreksi.

## Alert
| Kondisi | Tindakan |
|---|---|
| Webhook signature gagal berulang | Selidiki spoofing/salah secret |
| Attempt tertunda > ambang | Rekonsiliasi manual |
| Dead-letter > 0 | Tinjau di Diagnostik |
| Saldo signer rendah | Isi gas |
| Error rate tinggi | Cek rilis terakhir |

## Alat
Log platform (Vercel/Supabase), pelacak error (mis. Sentry, verifikasi kebijakan privasi), uptime check di `/health`. Halaman Diagnostik integrasi menampilkan status provider, chain, outbox.
