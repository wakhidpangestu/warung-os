# API Specification (draf v0)

REST JSON di bawah `/api/v1`. Auth: sesi Supabase (cookie httpOnly). Validasi Zod. Error seragam:

```json
{ "error": { "code": "INSUFFICIENT_STOCK", "message": "Stok tidak cukup", "details": {} } }
```

## Sprint 1: autentikasi dan setup toko

Belum ada REST endpoint aplikasi pada Sprint 1. Halaman `/login` menggunakan `signInWithPassword` dari Supabase Auth. Halaman `/setup-toko` yang terlindungi sesi memvalidasi nama toko dengan Zod dan memanggil RPC `create_shop_for_owner`. RPC tidak menerima `user_id` atau `role` dari klien, sehingga owner selalu berasal dari `auth.uid()`.
Header `Idempotency-Key` wajib untuk POST keuangan.

| Method   | Path                                              | Peran                                | Keterangan                                                        |
| -------- | ------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| GET      | /products?q=&category=&cursor=                    | semua                                | cari cepat                                                        |
| POST     | /products                                         | owner, inventory                     | buat                                                              |
| PATCH    | /products/:id                                     | owner (harga), inventory (non-harga) | harga mencatat history                                            |
| POST     | /products/:id/archive                             | owner, inventory                     |                                                                   |
| POST     | /products/import                                  | owner, inventory                     | CSV                                                               |
| GET      | /products/export                                  | owner, auditor                       | CSV                                                               |
| POST     | /inventory/movements                              | owner, inventory                     | receive, adjust, damage, expire                                   |
| GET      | /inventory/movements                              | owner, inventory, auditor            |                                                                   |
| POST     | /checkout                                         | owner, cashier                       | body: items[{product_id, qty}], method, cash_received?, discount? |
| GET      | /transactions?from=&to=&method=&status=           | owner, cashier(terbatas), auditor    |                                                                   |
| GET      | /transactions/:id                                 | idem                                 | termasuk audit status                                             |
| POST     | /transactions/:id/void                            | owner                                | alasan wajib                                                      |
| GET      | /payments/:attempt_id/status                      | owner, cashier                       | polling                                                           |
| POST     | /payments/:attempt_id/cancel                      | owner, cashier                       |                                                                   |
| POST     | /webhooks/qris/:provider                          | publik, signature                    | tanpa sesi                                                        |
| POST     | /refunds                                          | owner                                |                                                                   |
| GET      | /reports/daily?date=                              | owner, auditor                       |                                                                   |
| GET/POST | /expenses                                         | owner                                |                                                                   |
| POST     | /cash-sessions/open, /close                       | owner, cashier                       |                                                                   |
| GET      | /audit/commitments, /audit/verify/:transaction_id | owner, auditor                       |                                                                   |
| POST     | /audit/retry/:job_id                              | owner                                |                                                                   |
| POST     | /jobs/run                                         | cron secret                          | memproses outbox                                                  |
| GET      | /health                                           | publik                               | tanpa detail sensitif                                             |

## Aturan checkout

1. Server mengabaikan harga dari klien, menghitung ulang dari DB.
2. `Idempotency-Key` sama dengan payload sama mengembalikan hasil sama, payload berbeda mengembalikan 409.
3. Metode nonaktif (feature flag/setting) mengembalikan 403 `METHOD_DISABLED`.

## Rate limiting

Login, PIN, checkout, webhook: batas per IP dan per user. PIN salah beruntun mengunci sementara.
