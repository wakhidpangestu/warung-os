# Risk Register Awal

Skala: Kemungkinan (R/S/T) x Dampak (R/S/T).

| ID  | Risiko                                       | K   | D   | Mitigasi                                                                                                                                  | Pemilik    |
| --- | -------------------------------------------- | --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| R1  | Onboarding QRIS provider lama atau ditolak   | T   | S   | Mock dulu, tunai tetap jalan, evaluasi 2 provider                                                                                         | PM         |
| R2  | Pembayaran kripto melanggar aturan           | S   | T   | Nonaktif produksi, legal review, testnet saja                                                                                             | PM         |
| R3  | Pembayaran palsu via webhook forged          | S   | T   | Verifikasi signature, idempoten, rekonsiliasi API                                                                                         | Backend    |
| R4  | Stok ganda/negatif karena konkurensi         | S   | S   | Transaksi DB, row lock/constraint, tes konkurensi                                                                                         | Backend    |
| R5  | Kebocoran lintas tenant                      | R   | T   | RLS + otorisasi server + tes keamanan                                                                                                     | Backend    |
| R6  | Kunci signer bocor                           | R   | S   | Secret manager, saldo minimal, rotasi, kontrak role                                                                                       | Blockchain |
| R7  | Biaya gas membengkak                         | S   | R   | Mode batch Merkle, testnet dulu                                                                                                           | Blockchain |
| R8  | RPC down menahan checkout                    | S   | S   | Outbox, tidak blok checkout                                                                                                               | Backend    |
| R9  | Data lokal hilang (iOS membersihkan storage) | S   | S   | Sinkron cepat, peringatan, batas offline                                                                                                  | Frontend   |
| R10 | Ibu kesulitan memakai UI                     | S   | T   | Uji dengan pengguna asli tiap sprint, UI sederhana                                                                                        | UX         |
| R11 | Overengineering memperlambat MVP             | T   | S   | Sprint 3 = nilai nyata, blockchain belakangan                                                                                             | PM         |
| R12 | Dependensi berbahaya                         | R   | S   | Lockfile, audit, pin versi. Audit 18 Okt 2026 masih memblokir rilis karena Next.js 15.1.3 memiliki advisory; upgrade wajib sebelum rilis. | DevOps     |
| R13 | Kehilangan data (tanpa backup)               | R   | T   | Backup + uji restore terjadwal                                                                                                            | DevOps     |
