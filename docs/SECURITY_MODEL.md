# Security Model

## Prinsip
Least privilege, server sebagai otoritas, default aman, jejak audit untuk aksi sensitif.

## Peran dan izin
| Aksi | Owner | Cashier | Inventory | Auditor |
|---|---|---|---|---|
| Checkout, lihat struk | ya | ya | tidak | tidak |
| Ubah harga jual/beli | ya | tidak | tidak | tidak |
| Kelola produk non-harga | ya | tidak | ya | tidak |
| Penyesuaian stok | ya | tidak | ya | tidak |
| Diskon di atas batas | ya | tidak (batas di setting) | tidak | tidak |
| Void/refund | ya | tidak | tidak | tidak |
| Laporan | ya | harian terbatas | stok | semua (baca) |
| Staf, pengaturan, provider | ya | tidak | tidak | tidak |
| Retry audit blockchain | ya | tidak | tidak | tidak |

Dua lapis: RLS di Postgres dan pemeriksaan peran di domain/API. RLS bukan pengganti otorisasi aplikasi.

## Autentikasi dan sesi
Supabase Auth. Cookie httpOnly, Secure, SameSite=Lax. Sesi punya masa berlaku dan refresh. PIN kasir: hash (argon2/bcrypt), terikat perangkat terdaftar oleh Owner, batas percobaan, kunci sementara.

### Implementasi Sprint 1
Login memakai sesi Supabase Auth di browser dan halaman terlindungi memeriksa ulang sesi di server. Middleware melindungi `/setup-toko` dan `/dashboard`; server action memeriksa ulang pengguna sebelum membuat toko. RLS membatasi query klien, sedangkan fungsi `create_shop_for_owner` membaca pemilik dari `auth.uid()` dan tidak menerima peran atau pengguna dari input. CSP mengizinkan koneksi hanya ke origin Supabase yang dikonfigurasi; mode development menambahkan kebutuhan runtime Next.js (`unsafe-inline` dan `unsafe-eval`) agar hidrasi dan HMR berfungsi. Tes RLS lintas tenant ada di `supabase/tests/database/rls.test.sql`. Rate limiting dan PIN kasir belum diimplementasikan dan tetap menjadi batasan Sprint 1.

## Pembayaran
- Referensi unik per attempt, satu attempt satu transaksi.
- Verifikasi signature sesuai spesifikasi provider, nominal, mata uang, referensi.
- Event disimpan dengan unique (provider, event_id), proses idempoten.
- Selalu cocokkan ulang status via API provider (rekonsiliasi) bila ragu.
- Screenshot bukan bukti.

## Kunci dan rahasia
Service role dan signer hanya server. Tidak di log. Rotasi terdokumentasi. Nonce commitment dienkripsi (AES-GCM, kunci dari secret manager).

## Header dan web
CSP ketat, HSTS, X-Content-Type-Options, Referrer-Policy, frame-ancestors none. Output React di-escape, hindari `dangerouslySetInnerHTML`. Unggahan gambar: batasi tipe/ukuran, simpan di bucket dengan kebijakan per shop.

## Rate limiting dan abuse
Per IP dan per akun pada login, PIN, checkout, webhook.

## Dependensi
Lockfile, `pnpm audit` di CI, Dependabot, pin versi skrip CDN (tidak dipakai di app).

## Backup
Lihat `BACKUP_AND_RECOVERY.md`.

## Checklist keamanan (gunakan di tiap PR relevan)
- [ ] Setiap query/route memeriksa shop dan peran
- [ ] Input divalidasi Zod di server
- [ ] Tidak ada rahasia di klien/log/repo
- [ ] Endpoint keuangan idempoten
- [ ] Transisi status divalidasi server
- [ ] Aksi sensitif menulis audit_logs
- [ ] Tes otorisasi negatif ada
- [ ] Metode pembayaran nonaktif tidak bisa dipaksa lewat request

## Risiko tersisa
Insider owner bisa mengubah data DB (kompensasi: audit_logs dan commitment blockchain mendeteksi, tidak mencegah). Penyedia Supabase/Vercel adalah pihak tepercaya. Perangkat kasir yang dicuri (kompensasi: sesi singkat, cabut perangkat).
