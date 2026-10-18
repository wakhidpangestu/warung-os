# Respons Insiden

## Tingkat

- **SEV1:** uang atau data bocor/hilang, pembayaran palsu terkonfirmasi.
- **SEV2:** checkout tidak jalan, webhook gagal massal.
- **SEV3:** blockchain tertunda, fitur non-kritis rusak.

## Langkah umum

1. Deteksi dan catat waktu.
2. Kontainmen (matikan metode pembayaran via flag, cabut kunci, pause kontrak).
3. Selidiki lewat log, audit_logs, event provider.
4. Pulihkan (restore, rotasi rahasia).
5. Komunikasikan ke Owner dan, bila perlu, provider/pengguna terdampak.
6. Tinjauan pasca-insiden tanpa menyalahkan, tindakan perbaikan masuk backlog.

## Runbook cepat

| Insiden              | Tindakan                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Dugaan webhook palsu | Nonaktifkan QRIS (flag), rotasi secret webhook, rekonsiliasi semua attempt, tinjau `under_review` |
| Rahasia bocor        | Cabut dan ganti segera, cek penggunaan, bersihkan riwayat git bila perlu                          |
| Signer dicuri        | Cabut WRITER_ROLE, signer baru, tinjau transaksi                                                  |
| Stok tidak konsisten | Bekukan penyesuaian, bandingkan movement vs saldo, koreksi via movement berizin                   |
| RPC down lama        | Biarkan antrean, ganti RPC, retry massal                                                          |

## Kontak

Isi daftar kontak (Owner, provider, pengembang) sebelum produksi.
