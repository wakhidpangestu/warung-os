# Panduan Responsif

| Perangkat | Layout POS | Navigasi |
|---|---|---|
| HP (<640) | Satu kolom, bilah keranjang bawah, layar bayar penuh | Bottom nav 4-5 item |
| Tablet (768-1023) | Dua kolom (produk | keranjang) | Rail samping |
| Desktop (>=1024) | Dua kolom lebar + pintasan keyboard | Sidebar |

## Aturan
- Konten lebar (tabel, kode) scroll di dalam wadahnya, halaman tidak scroll horizontal.
- Tidak ada fungsi hover-only.
- Dukung area aman (notch) dengan `env(safe-area-inset-*)`.
- Uji di layar 360x640 sebagai batas bawah.
- Performa: bundel awal kecil, gambar produk dimuat malas dan diperkecil, daftar panjang divirtualisasi.
- Orientasi: potret dan lanskap tidak boleh merusak keranjang.

## Pintasan keyboard desktop
`/` fokus cari, `Enter` tambah produk teratas, `F2` bayar, `Esc` tutup dialog.
