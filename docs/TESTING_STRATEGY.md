# Strategi Pengujian

## Piramida
- **Unit (Vitest):** uang, pembulatan, kalkulasi total, state machine, canonicalization, Merkle, pemetaan status provider.
- **Integrasi (Vitest + Postgres nyata):** checkout, konkurensi stok, idempotensi, RLS, webhook, outbox.
- **Kontrak (Foundry):** otorisasi, duplikat, fuzz, gas.
- **E2E (Playwright):** cari produk lalu bayar tunai, QRIS mock, offline lalu sinkron, layar kecil, axe a11y.
- **Keamanan:** tenant, peran, webhook replay, input berbahaya, scan rahasia.

## Matriks minimum
| Area | Kasus |
|---|---|
| Produk/stok | cari harga, ubah harga, snapshot harga, receive, adjust, konkurensi, stok kurang, potong ganda |
| Checkout | subtotal/total, qty, diskon, kembalian, duplikat, struk, pemulihan |
| QRIS | request benar, signature salah, duplikat, nominal salah, expired, tertunda, timeout, rekonsiliasi |
| Blockchain | determinisme, verifikasi, tamper, duplikat, retry, RPC mati, otorisasi kontrak, proof |
| Keamanan | lintas tenant, peran, validasi, rahasia, replay, transisi ilegal |
| UX | layar kecil, keyboard, sentuh, offline, reconnect, PWA install |

## Konkurensi
Tes menjalankan N checkout paralel pada stok terbatas, memastikan total terjual <= stok dan tidak ada deadlock.

## Aturan pelaporan
Jangan klaim tes lulus bila belum dijalankan. Bila tidak bisa (mis. tidak ada Docker), sebutkan alasannya dan perintah yang harus dijalankan.

## Data uji
`supabase/seed.sql` dengan toko dan produk sembako contoh. Tidak ada data pribadi nyata.
