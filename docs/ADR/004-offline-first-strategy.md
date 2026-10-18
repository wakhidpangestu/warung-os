# ADR 004: Strategi Offline-First

Status: Diterima

## Konteks

Internet warung tidak stabil. iOS membatasi background sync dan dapat membersihkan storage PWA.

## Keputusan

Cache app shell dan katalog (service worker + IndexedDB). Keranjang lokal. Penjualan **tunai** offline diizinkan dan disimpan sebagai `local_sale` dengan `client_uuid` sebagai idempotency key, status "belum sinkron". Sinkron saat online lewat endpoint idempoten. QRIS dan kripto tidak tersedia offline. Penjualan offline tidak pernah dianggap tersinkron sebelum server mengonfirmasi.

## Alternatif

Online-only (tidak tahan putus), offline penuh termasuk QRIS (tidak aman), CRDT penuh (berlebihan).

## Kelebihan

Warung tetap bisa jualan, tanpa duplikat berkat idempotensi.

## Kekurangan

Stok lokal bisa basi, konflik stok mungkin (dua perangkat). Data lokal bisa hilang di iOS.

## Implikasi keamanan

Data lokal berisi katalog dan antrean penjualan, bukan rahasia. Sesi tetap dibatasi. Server memvalidasi ulang harga dan stok saat sinkron.

## Implikasi biaya

Waktu pengembangan sinkron dan UI konflik.

## Konsekuensi

Konflik (stok tidak cukup saat sinkron) ditandai untuk ditinjau owner, penjualan tidak dibuang. Batasi jumlah/umur antrean offline dan beri peringatan. Dokumentasi batas iOS di `KNOWN_LIMITATIONS.md`.

## Tinjau ulang jika

Beberapa perangkat kasir per toko, atau iOS mengubah kebijakan storage.
