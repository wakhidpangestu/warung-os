# Workflow Paralel WarungOS

Dokumen ini mengatur pekerjaan paralel setelah fondasi Sprint 1 telah diverifikasi pada branch `main`. Setiap worker hanya boleh mengubah area yang ditetapkan. Tidak ada worker yang melakukan merge.

## Preamble untuk semua worker

- Baca `AGENTS.md`, `MASTER_PROMPT.md`, dokumen sprint terkait, dan perubahan pada `main` sebelum mengubah kode.
- Jangan mengubah file di luar area kepemilikan tanpa melaporkan blocker ke koordinator.
- Uang tetap `bigint` Rupiah. Otorisasi harus ada di server. RLS tetap menjadi lapis tambahan.
- Tulis tes bersama kode dan jalankan lint, typecheck, serta tes yang relevan.
- Jangan mengubah `pnpm-lock.yaml` secara manual. Bila dependensi yang disetujui diperlukan, gunakan `pnpm install` dan laporkan perubahan manifest.
- Akhiri dengan: selesai, tes dijalankan, belum bisa dites, batasan, dan file di luar area jika ada.

## 1. Gerbang sebelum Gelombang 1

Koordinator menjalankan di `main`:

```text
git status
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm test
pnpm db:reset && pnpm db:test
pnpm test:e2e
```

Gelombang 1 hanya boleh dibuka bila hasilnya lulus dan `main` bersih. Status CI GitHub diverifikasi dari run workflow yang terkait commit `main`.

## 2. Worker `feat/s2-catalog`

Target: Sprint 2, katalog dan stok dasar.

Area kepemilikan:

- `apps/web/src/app/(catalog)/**`, `apps/web/src/domain/catalog/**`, `apps/web/src/domain/inventory/**`
- `supabase/migrations/20261018{01..99}*.sql` dengan nomor urut 0100 sampai 0199
- tes katalog dan stok terkait, serta dokumentasi API/skema/traceability Sprint 2

Tugas:

1. Implementasikan kategori dan produk dengan harga dan modal sebagai `bigint` Rupiah.
2. Implementasikan pencarian nama, SKU, dan barcode serta produk arsip tidak muncul pada hasil kasir.
3. Implementasikan saldo stok dan movement yang mencatat stok sebelum/sesudah serta alasan penyesuaian.
4. Validasi Zod, otorisasi server, RLS sesuai shop, migrasi forward-only, dan tes negatif lintas tenant.
5. Implementasikan CSV hanya bila kontrak dan validasinya selesai dalam scope Sprint 2.

Larangan: tidak mengubah pembayaran, blockchain, CI, atau design system lintas aplikasi tanpa eskalasi. Hanya worker ini yang boleh menambah migrasi 0100 sampai 0199.

Penerimaan: AC-01, AC-02, AC-20, dan AC-22 yang relevan memiliki tes nyata. Laporkan perintah dan hasil aktual.

## 3. Worker `feat/design-system`

Target: polish design system lintas halaman Sprint 1 dan primitives yang akan dipakai Sprint 2.

Area kepemilikan:

- `apps/web/src/components/ui/**`, `apps/web/src/app/globals.css`, `apps/web/src/components/**`
- `docs/design/**`
- tes komponen dan E2E aksesibilitas yang hanya menyentuh UI

Tugas:

1. Konsolidasikan token warna, tipografi, spasi, fokus, dan status UI dengan arah desain WarungOS.
2. Sediakan primitives aksesibel untuk tombol, input, label, alert, empty/loading/error state, dan layout responsif.
3. Pastikan layar 360px, keyboard focus, kontras, dan target sentuh memenuhi pedoman desain.
4. Jangan membuat menu atau data operasional palsu. Gunakan UI Indonesia.

Larangan: tidak mengubah migrasi, domain, pembayaran, atau auth flow kecuali perbaikan markup/aksesibilitas yang dilaporkan ke koordinator.

Penerimaan: lint/typecheck/test UI relevan lulus dan perubahan desain didokumentasikan.

## 4. Worker `feat/s5-payment-mock`

Target: persiapan adapter pembayaran mock yang aman tanpa menyatakan QRIS live atau mengubah status pembayaran berdasarkan klien.

Area kepemilikan:

- `apps/web/src/domain/payments/**`, `apps/web/src/adapters/payments/**`
- `packages/payments/**` bila package tersebut dibuat untuk isolasi adapter
- `docs/payments/**`, tes pembayaran terkait

Tugas:

1. Pertahankan state machine pembayaran dan adapter mock yang eksplisit berlabel MOCK.
2. Pastikan hanya konfirmasi server-side yang dapat mengarahkan status ke `paid`.
3. Tambahkan tes transisi ilegal, metode nonaktif, idempotensi event, dan penolakan input klien yang tidak sah.
4. Dokumentasikan batasan: bukan integrasi QRIS resmi, bukan sandbox provider, dan tidak ada pembayaran nyata.

Larangan: tidak membuat migrasi database, tidak mengubah katalog/stok, tidak menyimpan rahasia, dan tidak mengaktifkan aset digital atau QRIS live.

Penerimaan: semua tes pembayaran relevan lulus dan dokumentasi menyatakan mode MOCK secara jujur.

## Pemantauan koordinator

Selama Gelombang 1, koordinator memeriksa:

- `git diff --stat main` di setiap branch untuk perubahan di luar area.
- perubahan `package.json` dan `pnpm-lock.yaml` yang tidak dilaporkan.
- migrasi: hanya `feat/s2-catalog` dapat memakai 0100 sampai 0199; `feat/s5-payment-mock` tidak boleh mempunyai migrasi.

Setelah semua worker mengirim `worker_done`, koordinator merangkum hasil dan batasan tanpa merge. Pengguna menentukan urutan merge dan pembukaan `feat/s3-checkout`.
