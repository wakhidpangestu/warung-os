# Kebijakan Aset Digital (USDT, USDC, IDRX)

## Posisi
**Produksi: nonaktif.** Pembayaran sah di Indonesia untuk jual beli adalah Rupiah, dan aset kripto umumnya diatur sebagai komoditas/aset keuangan digital, bukan alat pembayaran. Ini asumsi yang **wajib diverifikasi konsultan hukum** (lihat `COMPLIANCE_REVIEW.md`) sebelum fitur apa pun aktif untuk uang nyata. Dokumen ini bukan nasihat hukum.

## Yang dibedakan
1. Menerima aset sebagai pembayaran sah.
2. Mencatat transaksi yang selesai di luar sistem.
3. Demo integrasi di testnet.
4. Mengoperasikan layanan pembayaran/aset digital teregulasi.
Hanya (3) yang diizinkan sekarang.

## Aturan implementasi
- Adapter `testnet-crypto` terpisah, aktif hanya dengan `FEATURE_CRYPTO_TESTNET=true`, dan tampil berlabel TESTNET.
- `FEATURE_CRYPTO_LIVE` harus false. Server menolak request yang mencoba metode ini.
- Tidak ada jalan pintas lewat dompet, penyedia luar negeri, atau label UI yang menyesatkan.
- Tanpa kustodi dompet, tanpa bursa, tanpa penerbitan token.

## Desain untuk masa depan (jika disetujui)
| Topik | Keputusan |
|---|---|
| Jaringan | Daftar putih per chain id |
| Kontrak token | Alamat dari dokumentasi resmi issuer, disimpan per chain, tidak pernah dikenali dari simbol/nama. Alamat USDT/USDC berbeda per jaringan |
| Desimal | Dari kontrak (mis. 6 untuk USDT/USDC, verifikasi), uang disimpan integer unit terkecil |
| Konfirmasi | Jumlah blok minimal per jaringan, tangani reorg |
| Kedaluwarsa | Permintaan bayar berumur pendek, referensi unik |
| Salah jaringan | Tidak otomatis lunas, antrean tinjau |
| Kurang/lebih bayar | Kurang: tidak lunas. Lebih: dicatat, kebijakan pengembalian terdokumentasi |
| Duplikat | Unique (chain_id, tx_hash, log_index) |
| Refund | Manual berizin, biaya jaringan jelas |
| Kurs | Hanya bila legal, kutipan berumur pendek, sumber tepercaya |
| Kunci | Tidak pernah di browser/repo/plaintext, dompet penerima milik merchant (non-kustodian) |
| Rekonsiliasi | Pemantau on-chain, catat audit |

## IDRX (roadmap)
Diperlukan due diligence sendiri: dokumentasi issuer resmi, alamat kontrak dan jaringan, mekanisme penebusan, likuiditas, opsi integrasi, dan regulasi. Jangan berasumsi IDRX sah sebagai alat pembayaran ritel hanya karena dipatok ke Rupiah.
