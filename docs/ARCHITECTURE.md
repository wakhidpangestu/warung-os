# Arsitektur

Modular monolith Next.js + Supabase Postgres. Layanan eksternal diakses lewat adapter. Efek samping lewat outbox.

## Diagram sistem
```mermaid
flowchart LR
  subgraph Client[PWA / APK Capacitor]
    UI[Next.js UI]
    SW[Service Worker + IndexedDB]
  end
  subgraph Server[Next.js Server]
    API[Route Handlers / Server Actions]
    DOM[Domain: catalog, inventory, checkout, payments, reports, audit]
    PAY[Payment Adapter: cash, mock, qris, testnet]
    BC[Blockchain Adapter]
  end
  DB[(Supabase Postgres + RLS)]
  CRON[Cron / Worker endpoint]
  PROV[Provider QRIS resmi]
  CHAIN[(EVM Testnet/Mainnet)]
  UI --> API
  SW -. sinkron cash offline .-> API
  API --> DOM --> DB
  DOM --> PAY --> PROV
  PROV -- webhook bertanda tangan --> API
  DOM -- outbox --> DB
  CRON --> DB
  CRON --> BC --> CHAIN
```

## Modul domain
| Modul | Tanggung jawab |
|---|---|
| catalog | produk, kategori, harga, riwayat harga, CSV |
| inventory | saldo, movement, validasi stok |
| checkout | keranjang server, pembuatan transaksi, state machine |
| payments | adapter, payment_attempts, webhook, rekonsiliasi |
| reports | agregasi harian/mingguan/bulanan, kas |
| audit | payload kanonik, commitment, outbox, batch, verifikasi |
| iam | profil, membership, peran, PIN, audit log |

Aturan dependensi: UI → API → domain → DB. Domain tidak tahu Next.js. Adapter tidak tahu UI.

## State machine terpisah
```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> pending_payment: checkout dibuat
  pending_payment --> completed: pembayaran paid
  pending_payment --> cancelled: dibatalkan/expired
  completed --> voided: void berizin
```
**sale_status:** draft, pending_payment, completed, cancelled, voided.
**payment_status:** pending, awaiting_customer, processing, paid, expired, failed, cancelled, under_review, partially_refunded, refunded.
Transisi valid payment:
- pending → awaiting_customer | cancelled | failed
- awaiting_customer → processing | paid | expired | cancelled | failed | under_review
- processing → paid | failed | under_review
- paid → partially_refunded | refunded | under_review
- partially_refunded → refunded
- expired, failed, cancelled, refunded: terminal (kecuali under_review ditinjau manual)

**inventory_status:** not_committed → committed → reversed. **audit_status:** not_submitted → queued → submitted → confirmed | failed | verification_mismatch.

Transisi ditegakkan di server dengan fungsi `assertTransition(from, to)` dan constraint/trigger DB. Perbedaan: sale dibuat ≠ pembayaran dimulai ≠ pembayaran terkonfirmasi ≠ stok dikomit ≠ refund diminta ≠ refund dikonfirmasi ≠ audit terkonfirmasi.

## Checkout tunai
```mermaid
sequenceDiagram
  participant K as Kasir UI
  participant A as API
  participant D as Postgres
  K->>A: POST /checkout (idempotency_key, items, cash_received)
  A->>D: BEGIN
  A->>D: cek idempotency, lock saldo stok, hitung ulang harga server
  A->>D: insert transaction + items(snapshot) + payment(paid) + movement + outbox(audit)
  A->>D: COMMIT
  A-->>K: 201 receipt_no, change
```

## Checkout QRIS
```mermaid
sequenceDiagram
  participant K as Kasir UI
  participant A as API
  participant D as Postgres
  participant P as Provider
  K->>A: POST /checkout (method=qris)
  A->>D: transaction(pending_payment) + payment_attempt(pending)
  A->>P: createPaymentRequest(ref, amount IDR)
  P-->>A: qr + expires_at
  A->>D: attempt=awaiting_customer
  A-->>K: QR + nominal
  P->>A: webhook (signature)
  A->>D: simpan event unik, verifikasi nominal/ref/mata uang
  A->>D: BEGIN; attempt=paid; sale=completed; commit stok; outbox; COMMIT
  K->>A: polling status
  A-->>K: paid, struk
```

## Pembayaran gagal / webhook retry
```mermaid
sequenceDiagram
  participant P as Provider
  participant A as API
  participant D as Postgres
  P->>A: webhook event E1
  A->>D: insert provider_events(event_id UNIQUE)
  D-->>A: berhasil, proses
  A-->>P: 200
  P->>A: webhook E1 (retry)
  A->>D: insert gagal (duplikat)
  A-->>P: 200 (tanpa efek)
  Note over A,P: Nominal salah atau event kedaluwarsa: under_review, tidak paid
```

## Refund
```mermaid
sequenceDiagram
  participant O as Owner
  participant A as API
  participant D as Postgres
  participant P as Provider
  O->>A: POST /refunds (alasan, jumlah)
  A->>D: cek izin, refund(requested), audit_log
  A->>P: refundPayment() (jika didukung)
  P-->>A: webhook refund confirmed
  A->>D: refund(confirmed), payment partially_refunded/refunded, movement balik stok opsional
```
Tunai: refund dicatat manual dengan izin Owner dan masuk rekonsiliasi kas.

## Audit blockchain
```mermaid
sequenceDiagram
  participant D as Postgres
  participant W as Worker (cron)
  participant C as Chain
  Note over D: Saat checkout: outbox(audit_job) dibuat di transaksi yang sama
  W->>D: ambil job (SKIP LOCKED)
  W->>W: payload kanonik + nonce → commitment
  W->>D: masukkan ke batch terbuka
  W->>C: commitRoot(batchId, root) (saat batch ditutup)
  C-->>W: tx hash
  W->>D: status submitted
  W->>C: pantau konfirmasi
  W->>D: confirmed + block ref
```

## Pekerjaan latar belakang
Postgres outbox + endpoint cron (Vercel Cron atau pg_cron memicu HTTP). Tabel `blockchain_job_outbox` dengan `FOR UPDATE SKIP LOCKED`, backoff eksponensial, dead-letter setelah N kali. Batas serverless: durasi fungsi pendek, jadi tiap job kecil dan idempoten. Bila volume atau latensi menuntut, pindah ke worker Node terpisah (ADR 001 revisit).

## Multi-tenant
`shop_id` di semua tabel bisnis, RLS berbasis `shop_memberships`, plus otorisasi di server.

## Struktur repo
Lihat bagian "Struktur" di `TECH_STACK.md`.
