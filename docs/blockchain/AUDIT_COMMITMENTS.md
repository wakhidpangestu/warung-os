# Audit Commitments

## Payload kanonik (schema v1)
Hanya data non-sensitif:
```json
{
  "v": 1,
  "shop": "<opaque shop id>",
  "tx": "<opaque transaction id>",
  "no": "WOS-20261018-0007",
  "ts": "2026-10-18T05:12:00Z",
  "cur": "IDR",
  "items": [{"p": "<product id>", "q": 2, "u": 4500}],
  "disc": 500,
  "total": 8500,
  "pay": "cash",
  "st": "paid"
}
```
Dilarang: nama/telepon/alamat pembeli, label pembeli, struk lengkap.

## Serialisasi deterministik
RFC 8785 (JSON Canonicalization Scheme). Urutan item diurutkan stabil (product id lalu harga). Angka integer, timestamp UTC format tetap.

## Commitment
```
nonce      = 32 byte acak (CSPRNG), per transaksi
commitment = keccak256( "WOS1" || nonce || canonical_bytes )
```
Alasan nonce: hash polos dari data yang mudah ditebak (total, tanggal) dapat dibrute-force. Nonce disimpan **off-chain** terenkripsi (AES-GCM, kunci `AUDIT_NONCE_ENCRYPTION_KEY`). Nonce tidak dipublikasikan kecuali saat pembuktian kepada auditor tertentu. Kehilangan nonce berarti transaksi tidak bisa dibuktikan, jadi nonce ikut backup.

## Batch Merkle
Daun = commitment. Pohon dibangun urut deterministik (urut commitment), pasangan di-hash terurut (kompatibel pola OpenZeppelin MerkleProof). Root diterbitkan ke kontrak dengan `batchId`. Bukti inklusi (proof) disimpan per commitment. Satu transaksi ganjil: daun dibawa naik (aturan didokumentasikan dan diuji).

## Verifikasi
1. Bangun ulang payload dari DB (dengan harga snapshot).
2. Hitung commitment dengan nonce tersimpan.
3. Mode single: baca commitment dari kontrak. Mode batch: verifikasi proof terhadap root on-chain.
4. Cocok: verified. Tidak cocok: `verification_mismatch` dan alert.

## Tes wajib
Determinisme (urutan field berbeda, hash sama), tamper detect (ubah total, harus mismatch), proof valid dan tidak valid, duplikat ditolak, vektor uji tetap (golden file).
