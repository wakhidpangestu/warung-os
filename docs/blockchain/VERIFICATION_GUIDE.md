# Panduan Verifikasi

Untuk Owner dan Auditor. Tujuan: memastikan sebuah transaksi tercatat dan tidak berubah.

## Dari aplikasi
Buka Detail Transaksi, bagian Verifikasi, tekan "Verifikasi". Hasil:
- **Terverifikasi:** data cocok dengan commitment on-chain.
- **Menunggu:** belum terkonfirmasi di chain.
- **Tidak cocok:** data berbeda dari saat dicatat. Hubungi Owner, lihat audit_logs.
- **Gagal kirim:** job akan diulang, atau gunakan Retry.

## Manual (independen)
1. Ambil dari ekspor audit: payload kanonik, nonce (diberikan Owner untuk pembuktian), proof (mode batch), batch id.
2. Hitung `commitment = keccak256("WOS1" || nonce || canonical_bytes)`.
3. Mode batch: verifikasi proof menuju root. Bandingkan root dengan `rootOf(batchId)` di explorer (fungsi read pada kontrak yang terverifikasi).
4. Mode single: cek `commitmentTime(commitment)` bernilai bukan nol.
5. Cek tx hash di explorer: jaringan benar, kontrak benar, jumlah konfirmasi memadai.

## Yang dibuktikan dan tidak
Dibuktikan: payload dengan nonce tersebut ada pada waktu blok tertentu. Tidak dibuktikan: bahwa penjualan benar-benar terjadi secara fisik, atau bahwa pembayaran diterima (itu dibuktikan oleh provider dan rekonsiliasi).
