# ADR 003: Desain Audit Blockchain

Status: Diterima

## Konteks

Pemilik ingin transaksi tercatat di blockchain. Data pembeli tidak boleh publik. DB tetap sumber kebenaran.

## Keputusan

Blockchain sebagai lapisan audit terpisah. Tiap transaksi selesai punya commitment = hash(nonce acak 32 byte + payload kanonik JCS). Default **batch Merkle**: commitment dikumpulkan, root dipublikasikan periodik (harian atau per N transaksi). Mode single tersedia lewat konfigurasi. Pengiriman via outbox, tidak di dalam transaksi checkout. Jaringan EVM terkonfigurasi, mulai testnet.

## Alternatif

On-chain per transaksi (biaya dan latensi per penjualan, verifikasi sederhana), simpan data penuh on-chain (melanggar privasi), tanpa blockchain (tidak memenuhi tujuan produk), layanan timestamp non-blockchain (opsi cadangan).

## Kelebihan

Biaya rendah, privasi terjaga, bukti inklusi per transaksi lewat Merkle proof.

## Kekurangan

Latensi sampai batch ditutup, nonce harus dijaga (hilang = tidak bisa dibuktikan), kompleksitas Merkle.

## Implikasi keamanan

Nonce dienkripsi di DB. Signer khusus. Kontrak hanya menerima penulis berizin. Hash polos data yang mudah ditebak tidak privat, makanya nonce.

## Implikasi biaya

Lihat `blockchain/COST_ANALYSIS.md`. Batch: biaya hampir tetap per periode. Single: linear dengan jumlah transaksi.

## Konsekuensi

Status audit terpisah dari status penjualan. Kegagalan chain tidak mengubah penjualan sah. UI menampilkan 6 status.

## Tinjau ulang jika

Regulasi atau auditor menuntut finalitas per transaksi, volume sangat rendah (single jadi murah), atau jaringan berubah biaya/keandalan.
