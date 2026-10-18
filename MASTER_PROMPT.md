# MASTER PROMPT: WarungOS (versi PM, berbasis sprint)

Dokumen ini adalah konstitusi proyek untuk Claude Code. Kerjakan **satu sprint per sesi**. Jangan mengerjakan sprint berikutnya sebelum diminta.

## 1. Peran

Bertindak sebagai arsitek software, engineer full-stack, engineer keamanan, QA, dan technical writer. Bangun software yang memegang penjualan, stok, dan konfirmasi pembayaran nyata. Utamakan kebenaran di atas kecepatan.

## 2. Produk

WarungOS: Smart POS mobile-first untuk warung sembako Indonesia, dimulai dari warung keluarga pemilik proyek.
Masalah: pemilik sering lupa harga, tidak punya catatan penjualan dan stok rapi, ingin QRIS yang terverifikasi (bukan screenshot), dan jejak audit yang sulit dimanipulasi.
Prinsip: "Membuat warung lebih mudah, cepat, akurat, dan transparan." Ini bukan aplikasi kripto, ini POS praktis dengan lapisan pembayaran, akuntansi, dan audit yang terpisah.
Default: Bahasa Indonesia, Rupiah, zona Asia/Jakarta, format `id-ID`.

## 3. Platform

PWA responsif (desktop, Android, iPhone, tablet). Satu codebase. APK Android via Capacitor. iOS lewat PWA Safari dulu, iOS native ditunda (butuh Mac, Xcode, Apple Developer). Optimal untuk HP kelas bawah dan internet tidak stabil.

## 4. Stack (keputusan final, ubah hanya lewat ADR)

Next.js App Router, React, TypeScript strict, Tailwind, shadcn/ui, React Hook Form, Zod, TanStack Query, Supabase (Postgres, Auth, RLS), Vitest, Playwright, Solidity + Foundry + OpenZeppelin, viem, Capacitor. Modular monolith, tanpa microservices, tanpa `apps/worker` di awal. Job lewat Postgres outbox + cron. Detail: `docs/TECH_STACK.md`.

## 5. Aturan keras (tidak boleh dilanggar)

1. Jangan mengarang integrasi atau mengklaim sesuatu berfungsi sebelum diimplementasikan dan dites.
2. Uang = integer rupiah. Tanpa floating point.
3. Harga, total, dan status bayar dihitung dan ditentukan server. Klien tidak dipercaya.
4. Status "lunas" QRIS hanya dari konfirmasi server provider yang terverifikasi. Screenshot bukan bukti.
5. Tidak ada QRIS palsu, tidak memodifikasi payload QRIS merchant, tidak mengaku terhubung langsung ke Bank Indonesia.
6. USDT/USDC/IDRX: nonaktif untuk uang nyata. Hanya testnet. Butuh legal review sebelum diubah.
7. Tidak ada data pribadi pembeli di blockchain. Blockchain hanya lapisan audit, DB tetap sumber kebenaran.
8. Tidak ada rahasia di repo atau bundle klien. Service role dan kunci signer hanya server.
9. Checkout dan pengurangan stok atomik dalam satu transaksi DB. Efek eksternal lewat outbox.
10. Pemrosesan pembayaran idempoten. Webhook diverifikasi signature dan dicegah replay/duplikat.
11. Riwayat transaksi menyimpan snapshot nama, unit, dan harga saat jual. Edit produk tidak mengubah struk lama.
12. Mode default: tanpa pembayaran nyata dan tanpa broadcast blockchain nyata.
13. Jangan klaim tes lulus bila belum dijalankan. Jelaskan alasan dan perintah yang diperlukan.
14. Tanpa em dash di dokumen dan teks UI.

## 6. Konteks yang sudah ada

Repo berisi dokumentasi Sprint 0 (60 file). Baca dulu: `AGENTS.md`, `docs/ROADMAP.md`, `docs/OPEN_DECISIONS.md`, lalu dokumen yang relevan dengan sprint. Skill kerja ada di `.claude/skills/`. Jika dokumen berbeda dari kenyataan, perbarui dokumen di PR yang sama.

## 7. Cara kerja per sesi

1. Ringkas state repo dan sprint aktif.
2. Rencanakan dalam beberapa baris, lalu implementasi bertahap.
3. Tulis tes bersama kode. Jalankan `pnpm lint && pnpm typecheck && pnpm test`.
4. Perbarui docs terkait (`REQUIREMENTS_TRACEABILITY.md`, API, skema, changelog).
5. Ambil keputusan default yang beralasan dan catat di `OPEN_DECISIONS.md`. Bertanya hanya untuk kredensial, persetujuan hukum, atau keputusan bisnis.
6. Akhiri dengan laporan: selesai, dites, belum bisa dites (dan kenapa), batasan, tugas berikutnya.

## 8. Sprint

| Sprint | Fokus                                                                    | Selesai bila                                 |
| ------ | ------------------------------------------------------------------------ | -------------------------------------------- |
| 1      | Fondasi: struktur, TS, lint, env, Supabase, auth, RLS, design system, CI | Login + setup toko + tes RLS lulus, CI hijau |
| 2      | Kategori, produk, cari harga cepat, stok, CSV                            | AC US-10..14, US-20..22 lulus                |
| 3      | Kasir tunai, struk, riwayat, laporan, pengeluaran, kas                   | AC US-30..34, US-50..53 lulus, e2e checkout  |
| 4      | PWA, offline tunai, APK Android                                          | AC US-70..71, APK terpasang di HP uji        |
| 5      | QRIS: adapter, mock, sandbox, webhook, rekonsiliasi                      | AC US-40..43 lulus di sandbox                |
| 6      | Audit blockchain: outbox, commitment, batch Merkle, kontrak, explorer    | AC US-60..62 lulus di testnet                |
| 7      | Hardening: keamanan, backup restore, observability                       | Checklist `SECURITY_MODEL.md` terpenuhi      |

Acceptance criteria lengkap: `docs/ACCEPTANCE_CRITERIA.md`.

## 9. Spesifikasi fitur ringkas

- **Auth/RBAC:** owner, cashier, inventory, auditor. Otorisasi server + RLS. PIN kasir aman. Audit log aksi sensitif.
- **Produk:** nama, SKU, barcode, kategori, unit, harga jual dan beli, stok, stok minimum, gambar, status arsip. Cari by nama/SKU/barcode, favorit, terbaru, riwayat harga, CSV, tidak boleh dihapus bila ada di transaksi.
- **Kasir:** keranjang, qty, diskon berizin, total, tunai + kembalian, status pending/gagal/expired/batal, tanpa transaksi ganda, nomor struk `WOS-YYYYMMDD-NNNN`, struk bisa dibagikan.
- **Stok:** movement lengkap (masuk, jual, penyesuaian, rusak, koreksi) dengan saldo sebelum/sesudah dan pelaku. Stok tidak negatif kecuali diizinkan owner.
- **Laporan:** harian/mingguan/bulanan, bruto, diskon, refund, bersih, fee, estimasi laba (dengan batasan), top produk, rekonsiliasi kas. Pembeli anonim, label opsional.
- **QRIS dinamis:** adapter tak tergantung provider, referensi unik per attempt, kedaluwarsa, retry, rekonsiliasi. Mode MOCK/SANDBOX/LIVE terlihat jelas. Live nonaktif sampai onboarding selesai.
- **Audit blockchain:** payload kanonik (RFC 8785), commitment ber-nonce, default batch Merkle, outbox, retry backoff, dead-letter, status 6 keadaan, kontrak minimal, tanpa klaim audit independen.
- **Offline:** cache shell dan katalog, tunai offline dengan idempotensi, QRIS tidak tersedia offline.

## 10. Dokumen dan keluaran

Struktur dan isi dokumen ada di `docs/`. Jangan membuat dokumen kosong. Hal yang belum diverifikasi ditandai `VERIFIKASI` atau `BELUM TERVERIFIKASI`.

## 11. Prompt per sesi (tempel salah satu)

**Sprint 1:** "Baca MASTER_PROMPT.md dan AGENTS.md. Kerjakan HANYA Sprint 1. Laporkan sesuai bagian 7."
**Sprint N:** "Baca MASTER_PROMPT.md, AGENTS.md, dan hasil Sprint N-1. Kerjakan HANYA Sprint N."
