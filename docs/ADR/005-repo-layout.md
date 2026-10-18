# ADR 005: Tata Letak Repositori (Repo Layout)

Status: Diterima

## Konteks

Rencana awal dan prompt menyebutkan kode aplikasi berada langsung di bawah `src/...`. Namun, fondasi Sprint 1 diimplementasikan menggunakan struktur monorepo pnpm workspaces dengan aplikasi Next.js berada di `apps/web`, sedangkan `contracts/` tetap di root repo, dan paket/modul domain diletakkan di `apps/web/src/domain` serta adapter di `apps/web/src/adapters`. Hal ini menyebabkan inkonsistensi antara dokumen prompt awal dan struktur aktual repo.

## Keputusan

Menetapkan `apps/web` sebagai homebase aplikasi web/API Next.js:

- Semua referensi path `src/...` pada prompt/dokumen lama merujuk ke `apps/web/src/...`.
- Domain dan adapter diletakkan di `apps/web/src/domain` dan `apps/web/src/adapters` dalam aplikasi web tanpa membuat paket workspace baru pada tahap awal untuk menghindari overhead tooling monorepo.
- `contracts/` tetap di root repo untuk tooling Foundry/Solidity.
- Tes database Supabase (RLS dan konstrain) diletakkan di `supabase/tests` dan dijalankan dengan `pnpm db:test`.
- Aturan ini dikomunikasikan secara eksplisit ke semua agen/worker melalui blok `OVERRIDE PATH`.

## Alternatif

1. Memindahkan kembali `apps/web` ke root `src/`: Berisiko tinggi merusak konfigurasi workspace pnpm, Next.js, tsconfig, path alias, dan tes CI yang sudah berjalan dan terverifikasi.
2. Memecah domain dan adapter menjadi package pnpm terpisah (`packages/domain`, `packages/payments`): Memperkenalkan overhead build, link, dan konfigurasi monorepo yang belum mendesak pada fase Sprint 1 & 2.

## Kelebihan

- Menjaga stabilitas konfigurasi Next.js, Supabase, Playwright, dan pnpm workspace yang sudah terbukti lulus uji lokal.
- Memberikan ruang pemisahan jelas jika di masa depan ada aplikasi atau layanan lain (misal: mobile app, background worker terpisah, atau smart contracts).
- Tidak mengganggu pekerjaan worker lain asalkan blok `OVERRIDE PATH` disematkan di awal setiap prompt worker.

## Kekurangan

- Diperlukan override path eksplisit pada instruksi/prompt agen agar tidak salah menaruh file di root `src/`.

## Implikasi Keamanan

Tidak ada dampak keamanan negatif. Batasan arsitektural (boundary domain) tetap dipertahankan melalui disiplin arsitektur: modul domain tidak boleh mengimpor Next.js framework atau server action langsung.

## Implikasi Biaya

Tidak ada dampak biaya infrastruktur atau operasional tambahan.

## Konsekuensi

- Semua worker pada Gelombang 1 dan seterusnya wajib membaca dan mematuhi blok `OVERRIDE PATH`.
- Setiap modul domain baru diletakkan di `apps/web/src/domain/<modul>` dan adapter di `apps/web/src/adapters/<modul>`.
- `docs/ADR/README.md` diperbarui mencantumkan ADR 005.

## Tinjau Ulang Jika

Aplikasi berkembang membutuhkan shared packages terpisah yang dikonsumsi oleh lebih dari satu aplikasi (misal mobile app Capacitor terpisah atau standalone microservice worker).
