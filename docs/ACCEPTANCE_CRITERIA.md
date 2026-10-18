# Kriteria Penerimaan

Format Given/When/Then ringkas. Tiap kriteria harus punya tes (lihat REQUIREMENTS_TRACEABILITY.md).

## US-01 Cari harga

- AC-01.1 Given katalog 1000 produk, when mengetik 2+ huruf, then hasil muncul < 300 ms (lokal) dan menampilkan nama, satuan, harga.
- AC-01.2 Given produk berbarcode, when memindai/mengetik barcode, then produk tepat tampil.
- AC-01.3 Produk arsip tidak muncul di hasil kasir.

## US-02/05 Produk dan harga

- AC-02.1 Harga jual tidak boleh negatif; modal tidak boleh negatif.
- AC-02.2 Mengubah harga menulis baris `product_price_history` dengan pengguna dan waktu.
- AC-02.3 Produk yang sudah ada di transaksi tidak bisa dihapus, hanya diarsipkan.

## US-10..12 Kasir tunai

- AC-10.1 Given produk dipilih, when diketuk, then masuk keranjang dalam 1 ketukan.
- AC-11.1 Jumlah <= 0 ditolak. Total = jumlah(harga x qty) - diskon, dihitung integer.
- AC-12.1 Uang diterima < total ditolak. Kembalian = diterima - total.
- AC-12.2 Setelah bayar: transaksi tersimpan, stok berkurang, struk tersedia, dalam satu transaksi database.

## US-14 Diskon

- AC-14.1 Diskon melebihi batas peran ditolak server.

## US-15 Idempotensi

- AC-15.1 Dua request dengan `Idempotency-Key` sama menghasilkan satu transaksi.
- AC-15.2 Koneksi putus saat checkout: ulang request tidak menggandakan stok/pendapatan.

## US-20..22 Stok

- AC-20.1 Penyesuaian wajib alasan; tercatat dengan stok lama, baru, pengguna.
- AC-22.1 Dua penjualan bersamaan untuk stok 1: satu berhasil, satu ditolak (kecuali pengecualian owner aktif).
- AC-22.2 Webhook ganda tidak mengurangi stok dua kali.

## US-30..32 Laporan

- AC-30.1 Hari bisnis dihitung Asia/Jakarta.
- AC-30.2 Laporan membedakan penjualan kotor, diskon, refund, bersih, biaya pembayaran, laba estimasi, dengan catatan keterbatasan.

## US-40..42 QRIS

- AC-40.1 Setiap percobaan punya referensi unik dan terikat satu transaksi.
- AC-41.1 Webhook tanda tangan salah ditolak. Nominal/mata uang/referensi tidak cocok masuk `under_review`.
- AC-41.2 Webhook duplikat tidak mengubah state kedua kali.
- AC-42.1 QR kedaluwarsa tidak dapat melunasi transaksi lain.
- AC-42.2 Status tidak pasti ditampilkan "menunggu", bukan "berhasil".

## US-50..51 Audit

- AC-50.1 Kegagalan RPC tidak mengubah status bayar.
- AC-50.2 Job outbox idempoten; retry dengan backoff; dead-letter terlihat.
- AC-51.1 Data transaksi diubah manual menghasilkan "verification mismatch".

## US-60..61 Offline

- AC-60.1 Tanpa internet, katalog cache dan keranjang berfungsi.
- AC-61.1 Penjualan tunai offline berstatus "tersimpan lokal" sampai sinkron; tidak pernah dibuang diam-diam.
- AC-61.2 Pembayaran QRIS tidak bisa dilunasi offline.

## Umum

- AC-G.1 Semua rute terproteksi; peran tak berwenang mendapat 403 dari server.
- AC-G.2 UI utama lolos pemeriksaan keyboard dan kontras.
