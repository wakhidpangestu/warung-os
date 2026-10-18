---
name: payment-integration
description: Implementasi adapter pembayaran (cash, mock, QRIS, testnet), webhook, rekonsiliasi WarungOS.
---

# payment-integration

## Tujuan

Pembayaran yang aman, idempoten, dan jujur terhadap kemampuan provider.

## Kapan dipakai

Menambah adapter, webhook, status pembayaran, refund, rekonsiliasi.

## Konteks yang dibutuhkan

- docs/payments/\*
- Dokumentasi resmi provider (baca ulang, jangan dari ingatan)

## Alur kerja

1. Baca PAYMENT_ARCHITECTURE.md dan dokumentasi resmi provider.
2. Isi/perbarui matriks kapabilitas provider.
3. Implementasi adapter sesuai interface dan `capabilities`.
4. Pemetaan status provider → internal, dengan tes.
5. Webhook: raw body, signature, unique event, validasi nominal/ref, transaksi atomik.
6. Rekonsiliasi dan kedaluwarsa.
7. Tes: signature salah, duplikat, replay, nominal salah, expired, timeout.

## Batasan

- Dilarang QRIS palsu atau modifikasi payload merchant.
- Screenshot bukan bukti.
- Mode live nonaktif sampai onboarding selesai.
- Kripto produksi dilarang (lihat DIGITAL_ASSET_POLICY).
- Tanpa klaim integrasi yang belum dites.

## Output yang diharapkan

Adapter, tes, dokumen payments diperbarui, daftar prasyarat yang belum ada.

## Checklist validasi

- [ ] Signature diverifikasi constant-time
- [ ] Idempoten
- [ ] Nominal/mata uang/ref dicek
- [ ] Flag server menolak metode nonaktif
- [ ] Lencana mode benar

## Dokumen rujukan

docs/payments/\*, ADR 002, THREAT_MODEL.md
