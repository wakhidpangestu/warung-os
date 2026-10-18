# Tech Stack

## Rekomendasi final

| Lapisan       | Pilihan                                      | Alasan                                       |
| ------------- | -------------------------------------------- | -------------------------------------------- |
| Web           | Next.js App Router, React, TypeScript strict | Satu codebase UI + API, ekosistem besar      |
| UI            | Tailwind, shadcn/ui, Lucide                  | Aksesibel, ringan, kustom                    |
| Form/validasi | React Hook Form + Zod                        | Skema dipakai klien dan server               |
| Data klien    | TanStack Query                               | Cache, retry, sinkron                        |
| DB/Auth       | Supabase (Postgres, Auth, RLS)               | Terkelola, RLS, migrasi                      |
| Job           | Postgres outbox + cron                       | Cukup untuk skala kecil, tanpa infra baru    |
| Kontrak       | Solidity + OpenZeppelin + Foundry            | Standar, teruji                              |
| Chain client  | viem                                         | Tipe kuat, ringan                            |
| PWA           | Serwist (atau next-pwa terawat)              | Verifikasi kompatibilitas Next saat Sprint 4 |
| Native        | Capacitor (Android dulu)                     | Bungkus PWA jadi APK                         |
| Tes           | Vitest, Playwright, Foundry                  | Unit/integrasi, e2e, kontrak                 |
| CI            | GitHub Actions                               | Lint, tipe, tes, audit dependensi            |

Perubahan dari proposal master prompt: **tanpa `apps/worker` dan monorepo besar di awal**. Alasan: satu developer, satu deployment. Pisahkan paket hanya saat ada nilai nyata.

## Struktur repo awal

```
warung-os/
  AGENTS.md CLAUDE.md README.md ...
  src/
    app/            # routes, layout, API route handlers
    domain/         # catalog, inventory, checkout, payments, reports, audit, iam
    adapters/
      payments/     # cash, mock, qris-<provider>, testnet
      blockchain/   # evm (viem)
    lib/            # db client, env, money, time, errors
    components/     # ui, pos, forms
  contracts/        # Solidity + Foundry
  supabase/migrations, seed.sql
  tests/{integration,e2e,security}
  docs/  .claude/skills/  .github/workflows/
```

Tanggung jawab: `domain` berisi aturan bisnis murni, `adapters` mengisolasi pihak ketiga, `app` hanya HTTP dan UI.

## Batasan serverless

Fungsi pendek dan tanpa state. Job kecil, idempoten, dipicu cron. Jangan menahan koneksi RPC lama di dalam request checkout.

## Penambahan pustaka

Hanya dengan alasan jelas di PR. Lockfile wajib, versi dipin.

## Status bootstrap Sprint 1

Workspace pnpm dan manifest dependensi telah dibuat pada Sprint 1. `pnpm-lock.yaml` belum dapat dibuat di lingkungan implementasi karena executable pnpm lokal kehilangan binary native. Sebelum merge, jalankan `corepack pnpm install` pada mesin dengan akses registry, commit lockfile yang dihasilkan, lalu ubah kembali CI menjadi `pnpm install --frozen-lockfile`.
