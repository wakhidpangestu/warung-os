---
name: blockchain-audit
description: Implementasi audit blockchain WarungOS: payload kanonik, commitment, outbox, batch Merkle, kontrak.
---

# blockchain-audit

## Tujuan

Lapisan bukti yang privat, andal, dan dapat diverifikasi.

## Kapan dipakai

Mengerjakan commitment, worker, adapter chain, kontrak, verifikasi, biaya.

## Konteks yang dibutuhkan

- docs/blockchain/\*, ADR 003
- Konfigurasi jaringan terkini dari dokumentasi resmi

## Alur kerja

1. Finalisasi schema payload v1 (tanpa PII).
2. Canonicalization RFC 8785 + golden test.
3. Commitment dengan nonce 32 byte, simpan terenkripsi.
4. Outbox dalam transaksi checkout, worker SKIP LOCKED, retry backoff, dead-letter.
5. Merkle batch dan proof, tes inklusi.
6. Kontrak minimal + Foundry test; deploy testnet.
7. Verifikasi dan UI status 6 keadaan.

## Batasan

- Tidak ada data pribadi on-chain.
- Tidak ada RPC lambat dalam transaksi checkout.
- Jangan klaim kontrak diaudit tanpa audit nyata.
- Kunci signer tidak di repo/klien.

## Output yang diharapkan

Kode, kontrak, tes, dokumen blockchain diperbarui, catatan biaya hasil ukur.

## Checklist validasi

- [ ] Deterministik
- [ ] Tamper terdeteksi
- [ ] Duplikat ditolak
- [ ] RPC mati tidak mengubah status jual
- [ ] Nonce dicadangkan

## Dokumen rujukan

docs/blockchain/\*, ADR 003, SECURITY_MODEL.md
