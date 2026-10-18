# Alur Pengembangan

## Branch dan PR

`main` selalu hijau. Branch pendek `feat/*`, `fix/*`, `docs/*`. PR kecil. Squash merge dengan Conventional Commits.

## Definition of Done

- Lint, tipe, tes lulus lokal dan di CI.
- Acceptance criteria terkait terpenuhi dan dites.
- Dokumen yang terdampak diperbarui (traceability, API, skema).
- Checklist keamanan diisi untuk perubahan keuangan/auth/DB.
- Changelog diperbarui untuk perubahan yang terlihat pengguna.

## Lingkungan

| Env        | Pembayaran            | Blockchain                       | DB                  |
| ---------- | --------------------- | -------------------------------- | ------------------- |
| local      | mock                  | noop/anvil                       | Supabase lokal      |
| test       | mock                  | noop                             | DB uji sekali pakai |
| sandbox    | sandbox provider      | testnet                          | proyek staging      |
| production | live (jika disetujui) | mainnet/testnet sesuai keputusan | proyek produksi     |

## Perintah

```
pnpm dev | pnpm lint | pnpm typecheck | pnpm test | pnpm test:e2e
pnpm db:reset | pnpm db:migrate | pnpm contracts:test
```

Perintah ini baru ada setelah Sprint 1. Sebelum itu, hanya dokumen.

## CI (GitHub Actions)

Install, lint, typecheck, tes unit/integrasi (Postgres service), e2e (Playwright), `pnpm audit`, scan rahasia, forge test.

## Migrasi

Forward-only, bernomor, direview. Tes migrasi pada DB kosong dan pada snapshot data seed.
