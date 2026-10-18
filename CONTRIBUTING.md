# Kontribusi

## Alur
1. Buat branch dari `main`: `feat/<nama>`, `fix/<nama>`.
2. Perubahan kecil, satu tujuan.
3. Jalankan `pnpm lint && pnpm typecheck && pnpm test` sebelum PR.
4. Perbarui docs terkait dan CHANGELOG.
5. PR butuh minimal satu review. Perubahan di pembayaran, auth, migrasi, atau kontrak butuh review keamanan (skill security-review).

## Commit
Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`.

## Aturan kode
TypeScript strict, tanpa `any` tanpa alasan, uang integer, validasi Zod di batas API, tidak ada rahasia di repo.

## Definition of Done
Tes lulus (dijalankan, bukan diasumsikan), docs diperbarui, tidak ada rahasia, kriteria penerimaan di docs/ACCEPTANCE_CRITERIA.md terpenuhi, aksesibilitas dasar dicek.
