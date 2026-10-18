# ADR 001: Modular Monolith

Status: Diterima

## Konteks

Satu developer, satu warung, kebutuhan skala kecil, kebutuhan konsistensi data keuangan tinggi.

## Keputusan

Satu aplikasi Next.js dengan modul domain terpisah dan Supabase Postgres. Job latar belakang lewat outbox + cron di aplikasi yang sama.

## Alternatif

Microservices (kompleks, biaya operasi), backend terpisah NestJS (dua deployment), monorepo multi-paket (overhead awal).

## Kelebihan

Transaksi DB tunggal untuk checkout, deploy sederhana, biaya rendah, refactor mudah.

## Kekurangan

Skala horizontal job terbatas, batas modul hanya disiplin kode, serverless membatasi durasi.

## Implikasi keamanan

Satu permukaan serangan, satu kebijakan auth. Rahasia terpusat.

## Implikasi biaya

Rendah: satu hosting, satu DB.

## Konsekuensi

Aturan dependensi domain wajib ditegakkan lewat lint. Domain tidak boleh impor Next.js.

## Tinjau ulang jika

Job butuh proses panjang, banyak merchant dengan beban tinggi, atau tim bertambah dan butuh deploy independen.
