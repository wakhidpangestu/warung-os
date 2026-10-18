# Matriks Keterlacakan

| Kebutuhan | User story | Kriteria | Sprint | Tes (target) |
|---|---|---|---|---|
| FR-AUTH | US-70 | AC-G.1 | 1 | `apps/web/src/domain/iam/roles.test.ts`, `supabase/tests/database/rls.test.sql` |
| FR-PROD | US-01..05 | AC-01.*, 02.* | 2 | unit price lookup, e2e produk |
| FR-INV | US-20..22 | AC-20.1, 22.* | 2-3 | integration konkurensi stok |
| FR-POS | US-10..15 | AC-10..15 | 3 | unit total/kembalian, e2e kasir, idempotensi |
| FR-REP | US-30..33 | AC-30.* | 3 | integration laporan, timezone |
| FR-OFF | US-60..61 | AC-60.*, 61.* | 4 | e2e offline/reconnect |
| FR-QRIS | US-40..42 | AC-40..42 | 5 | webhook signature/replay/amount |
| FR-AUDIT | US-50..51 | AC-50.*, 51.* | 6 | kanonisasi, Merkle, forge test |
| FR-ADMIN | US-70..71 | AC-G.* | 1,7 | e2e staf |

Status tes Sprint 1: tes unit peran lulus. E2E login dengan Chrome lokal lulus untuk pengguna baru yang dialihkan ke setup toko. Tes RLS pgTAP tetap harus dijalankan dengan `pnpm db:test`.
