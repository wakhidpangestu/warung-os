# Deployment

## Opsi (D4)
Vercel (Next.js) + Supabase terkelola. Alternatif: Node hosting sendiri (VPS) bila butuh worker panjang.

## Langkah
1. Proyek Supabase staging dan produksi, jalankan migrasi lewat CLI/CI.
2. Atur env di Vercel (server-only vs publik dipisah). Rahasia hanya di secret manager.
3. Atur Vercel Cron memanggil `/api/v1/jobs/run` dengan `CRON_SECRET`.
4. Daftarkan webhook URL di provider (hanya saat onboarding selesai).
5. Domain dan HTTPS, header keamanan.
6. Smoke test: login, cek harga, checkout tunai, laporan.

## Batas serverless
Durasi fungsi terbatas, jadi job kecil dan idempoten, cron interval pendek. Jika job butuh lebih lama atau antrean menumpuk, pindahkan ke worker Node (ADR 001).

## Android APK
Capacitor membungkus build web. `npx cap add android`, `npx cap sync`, buka Android Studio, Build APK untuk uji. Rilis: keystore dibuat sendiri, disimpan di luar repo (password manager + cadangan offline), `signingConfigs` membaca dari variabel lingkungan/`keystore.properties` yang di-gitignore. Hilang keystore = tidak bisa update aplikasi di Play Store, jadi cadangkan.

## iOS
PWA lewat Safari "Tambahkan ke Layar Utama" (tersedia sekarang). iOS native butuh: macOS, Xcode, Apple Developer Program (berbayar), `npx cap add ios`, penandatanganan, TestFlight, tinjauan App Store. Ditunda. Catatan: aplikasi yang hanya membungkus situs web dapat ditolak review, perlu fitur native bermakna.

## Rollback
Redeploy versi sebelumnya. Migrasi forward-only: siapkan migrasi koreksi, bukan rollback destruktif.
