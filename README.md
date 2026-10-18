# WarungOS

Smart POS untuk warung sembako dan toko kecil Indonesia. Nama kerja, dapat berubah.

## Masalah yang diselesaikan

Pemilik sering lupa harga, mencatat penjualan manual, dan sulit memantau stok. WarungOS memberi pencarian harga cepat, kasir, stok, laporan, QRIS dinamis resmi, dan jejak audit berbasis blockchain.

## Status

Tahap perencanaan (Sprint 0). Lihat [docs/ROADMAP.md](docs/ROADMAP.md). Belum ada integrasi pembayaran nyata.

## Arsitektur singkat

Modular monolith Next.js + Supabase Postgres sebagai sumber kebenaran. Pembayaran lewat adapter. Blockchain hanya lapisan audit (hash/commitment) melalui outbox. Detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Prasyarat

Node.js LTS, pnpm, Docker (untuk Supabase lokal), Supabase CLI, Foundry (untuk kontrak).

## Setup lokal

```
git clone <repo> warung-os && cd warung-os
cp .env.example .env.local
pnpm install
supabase start
pnpm db:reset
pnpm dev
```

Buka http://localhost:3000. Mode default memakai provider pembayaran mock; tidak ada uang nyata.

## Variabel lingkungan

Lihat `.env.example`. Hanya `NEXT_PUBLIC_*` yang aman di browser.

## Tes

```
pnpm lint && pnpm typecheck
pnpm test
pnpm test:e2e
pnpm contracts:test
```

## Deploy

Lihat [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Batasan yang diketahui

Lihat [docs/KNOWN_LIMITATIONS.md](docs/KNOWN_LIMITATIONS.md).
