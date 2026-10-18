# Threat Model (STRIDE ringkas)

Aset: data penjualan, stok, status pembayaran, kunci provider/signer, akun pengguna, integritas audit.
Batas kepercayaan: browser ↔ server, server ↔ DB, server ↔ provider, server ↔ RPC.

| #   | Ancaman                     | Kategori        | Kontrol                                           | Tes                   |
| --- | --------------------------- | --------------- | ------------------------------------------------- | --------------------- |
| T1  | Akses lintas shop           | Info disclosure | RLS + cek server                                  | tests/security/tenant |
| T2  | Webhook palsu               | Spoofing        | Signature, allowlist, rekonsiliasi API            | webhook-invalid       |
| T3  | Replay webhook              | Tampering       | unique event_id, cek timestamp                    | webhook-replay        |
| T4  | Transaksi ganda             | Tampering       | Idempotency-Key, unique constraint                | checkout-dup          |
| T5  | Stok terpotong dua kali     | Tampering       | Satu transaksi DB, status inventory               | inventory-once        |
| T6  | Harga dimanipulasi di klien | Tampering       | Hitung ulang server                               | checkout-price        |
| T7  | Nominal QRIS tidak cocok    | Tampering       | Validasi nominal, under_review                    | amount-mismatch       |
| T8  | QR berbahaya/ditukar        | Spoofing        | QR hanya dari server, payload provider tak diubah | manual review         |
| T9  | Pencurian sesi kasir        | Spoofing        | Sesi singkat, cabut perangkat, PIN terbatas       | pin-lockout           |
| T10 | Kebocoran rahasia           | Info disclosure | Secret manager, scan secret di CI                 | gitleaks              |
| T11 | SQLi                        | Tampering       | Query terparameter, ORM                           | lint/tes              |
| T12 | XSS                         | Tampering       | Escape, CSP                                       | e2e                   |
| T13 | CSRF                        | Tampering       | SameSite, cek Origin untuk mutasi                 | e2e                   |
| T14 | Unggahan berbahaya          | Tampering       | Validasi tipe/ukuran, bucket privat               | tes upload            |
| T15 | RPC down / dikompromi       | DoS             | Outbox, retry, multi-RPC opsional                 | rpc-failure           |
| T16 | Kontrak token salah         | Spoofing        | Allowlist alamat resmi per chain                  | token-config          |
| T17 | Dependensi jahat            | Supply chain    | Lockfile, audit, review                           | CI                    |
| T18 | Refund curang               | Fraud           | Izin Owner, audit log, batas                      | refund-authz          |
| T19 | Insider mengubah catatan    | Repudiation     | audit_logs append-only, commitment on-chain       | tamper-detect         |
| T20 | Signer blockchain dicuri    | Elevation       | Saldo minimal, role kontrak, rotasi               | runbook               |
