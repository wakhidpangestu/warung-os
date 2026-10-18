# User Stories

Format: sebagai [peran], saya ingin [tujuan], agar [manfaat]. Kriteria rinci di ACCEPTANCE_CRITERIA.md.

## Produk dan harga

- US-01 Owner: cari produk lewat nama/SKU/barcode agar tahu harga saat melayani pembeli.
- US-02 Owner: tambah/ubah/arsipkan produk agar katalog selalu benar.
- US-03 Owner: tandai produk favorit agar yang sering dijual tampil di atas.
- US-04 Owner: impor/ekspor CSV agar tidak mengetik ratusan produk satu per satu.
- US-05 Owner: lihat riwayat perubahan harga agar tahu kapan dan siapa yang mengubah.

## Kasir

- US-10 Kasir: tambah produk ke keranjang dalam hitungan detik.
- US-11 Kasir: ubah jumlah, hapus item, lihat total.
- US-12 Kasir: terima tunai dan lihat kembalian.
- US-13 Kasir: cetak/bagikan struk digital.
- US-14 Owner: terapkan diskon dengan batas wewenang.
- US-15 Kasir: transaksi tidak dobel jika menekan tombol dua kali atau koneksi putus.

## Stok

- US-20 Inv. Manager: catat stok masuk dan penyesuaian dengan alasan.
- US-21 Owner: peringatan stok menipis.
- US-22 Owner: stok berkurang tepat sekali per penjualan.

## Laporan

- US-30 Owner: lihat penjualan, jumlah transaksi, laba estimasi hari ini.
- US-31 Owner: riwayat transaksi dengan filter dan ekspor CSV.
- US-32 Owner: rekonsiliasi kas akhir hari.
- US-33 Owner: catat pengeluaran.

## QRIS

- US-40 Kasir: tampilkan QR dinamis dengan nominal otomatis.
- US-41 Owner: sistem hanya menandai lunas setelah konfirmasi resmi provider.
- US-42 Kasir: lihat status menunggu/kedaluwarsa/gagal dengan jelas dan coba ulang.

## Audit

- US-50 Owner: setiap penjualan lunas punya status audit (antri/terkirim/terkonfirmasi/gagal).
- US-51 Auditor: verifikasi bahwa data transaksi tidak berubah sejak dikomit.

## Offline

- US-60 Kasir: tetap bisa menyusun keranjang dan mencari harga saat internet putus.
- US-61 Kasir: penjualan tunai offline tersimpan dan tersinkron kemudian tanpa duplikasi.

## Admin

- US-70 Owner: kelola staf dan peran.
- US-71 Owner: lihat diagnostik integrasi (pembayaran, blockchain, sinkronisasi).
