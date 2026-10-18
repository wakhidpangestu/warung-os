# AGENTS.md: Instruksi untuk Agen Koding

Berlaku untuk seluruh repo. Baca file ini sebelum mengubah apa pun.

## Produk
WarungOS: Smart POS untuk warung sembako Indonesia. Prioritas: operasi harian yang andal (cari harga, kasir, stok), lalu QRIS resmi, lalu audit blockchain.

## Aturan keras (tidak boleh dilanggar)
1. Uang disimpan sebagai integer Rupiah (`bigint`). Dilarang float untuk uang.
2. Status pembayaran hanya boleh `paid` setelah konfirmasi server-ke-server dari provider (webhook terverifikasi atau query status). Jangan percaya status dari frontend atau screenshot.
3. Tidak ada integrasi palsu. Jangan klaim provider, kontrak, atau tes berhasil jika belum dijalankan.
4. Tidak ada rahasia di repo atau bundle klien. `NEXT_PUBLIC_` hanya untuk nilai publik.
5. Item transaksi menyimpan snapshot nama, satuan, dan harga saat penjualan. Edit produk tidak boleh mengubah struk lama.
6. Panggilan blockchain/RPC tidak boleh berada di dalam transaksi database checkout. Gunakan outbox.
7. Otorisasi selalu di server. RLS adalah lapis tambahan, bukan pengganti.
8. Metode pembayaran nonaktif harus ditolak server, bukan hanya disembunyikan di UI.
9. Jangan masukkan data pribadi pembeli ke blockchain.
10. USDT/USDC/IDRX tidak boleh aktif di produksi tanpa persetujuan hukum tertulis (lihat docs/payments/DIGITAL_ASSET_POLICY.md).

## Stack
Next.js (App Router) + TypeScript strict + Tailwind + shadcn/ui, Supabase (Postgres, Auth, RLS), Zod, TanStack Query, Vitest, Playwright, Foundry, viem, pnpm. Lihat docs/TECH_STACK.md.

## Struktur
`apps/web` (UI + API), `packages/shared` (domain, uang, state machine), `packages/payments` (adapter), `packages/blockchain` (audit, Merkle), `contracts` (Solidity), `supabase/migrations`, `docs`. Lihat docs/ARCHITECTURE.md.

## Alur kerja
- Perubahan kecil dan terbaca. Satu fitur, satu PR.
- Tulis tes bersama kode. Jangan klaim tes lulus jika belum dijalankan; laporkan perintahnya.
- Jangan menyembunyikan error TypeScript, lint, atau tes gagal. Hindari `any`; jika perlu, beri komentar alasan.
- Perubahan skema lewat migrasi di `supabase/migrations`, tidak lewat edit manual.
- Perbarui dokumen terkait pada PR yang sama (lihat skill documentation-maintenance).
- Bahasa UI: Indonesia. Zona waktu bisnis: Asia/Jakarta. Simpan waktu dalam UTC.

## Perintah
```
pnpm install
pnpm dev
pnpm lint && pnpm typecheck
pnpm test            # Vitest
pnpm test:e2e        # Playwright
pnpm db:reset        # supabase db reset
pnpm contracts:test  # forge test
```

## Skill proyek
Ada di `.claude/skills/`: architecture-review, frontend-ui, backend-engineering, database-engineering, payment-integration, blockchain-audit, security-review, testing-and-qa, documentation-maintenance.
