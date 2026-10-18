# Design Direction

Tujuan: kasir cepat, bacaan jelas, tenang. Terinspirasi POS ritel dan aplikasi bank modern, tanpa glassmorphism berlebihan, gradasi, atau animasi dekoratif.

## Prinsip
1. Kecepatan checkout di atas estetika.
2. Satu aksi utama per layar.
3. Tema terang default (warung terang), tema gelap opsional.
4. Target sentuh besar, kontras tinggi.
5. Status jelas: sukses, menunggu, gagal, dan selalu ada langkah berikutnya.
6. Label Indonesia sederhana. Hindari istilah teknis (blockchain tampil sebagai "Terverifikasi").

## Halaman (24)
Login, Setup toko, Dashboard, POS, Cari produk, Daftar produk, Form produk, Kategori, Ringkasan stok, Riwayat stok, Riwayat transaksi, Detail transaksi, Pratinjau struk, Tampil QR, Status pembayaran, Laporan harian, Pengeluaran, Rekonsiliasi kas, Audit blockchain, Staf dan izin, Pengaturan toko, Pengaturan provider, Diagnostik integrasi, Status offline dan sinkron.

## Dashboard
Prioritas: omzet hari ini, jumlah transaksi, estimasi laba kotor, total tunai vs QRIS, stok tipis, transaksi terbaru, produk populer, aksi cepat. Tanpa metrik pajangan.

## Layar POS
Desktop: kiri cari dan kategori, kanan keranjang dan ringkasan bayar. Mobile: kolom cari ringkas, chip kategori, tombol produk besar, bilah keranjang menempel di bawah dengan total dan tombol Bayar, layar bayar muat di layar kecil. Tidak ada aksi yang hanya muncul saat hover.

## Label mode pembayaran
Mode MOCK, SANDBOX, dan LIVE selalu terlihat dengan lencana warna berbeda di layar bayar dan struk uji. Struk mock tidak boleh tampak seperti struk asli.

## Salinan teks (contoh)
Berhasil: "Pembayaran diterima". Menunggu: "Menunggu konfirmasi pembayaran. Jangan tutup layar ini." Gagal: "Pembayaran gagal. Coba lagi atau pilih tunai."
