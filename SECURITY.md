# Kebijakan Keamanan

## Melaporkan kerentanan
Kirim laporan privat ke pemilik repo (kontak: TODO isi email keamanan). Jangan membuka issue publik untuk kerentanan. Target respons awal: 3 hari kerja.

## Cakupan
Aplikasi web, API, worker, kontrak, konfigurasi. Di luar cakupan: layanan pihak ketiga (provider pembayaran, RPC).

## Prinsip
Otorisasi server-side, webhook bertanda tangan, idempotensi, least privilege, tanpa rahasia di klien. Rincian: docs/SECURITY_MODEL.md dan docs/THREAT_MODEL.md.

## Rahasia
Jangan commit `.env`, kunci API, kunci privat, keystore. Jika bocor: cabut dan rotasi segera, lalu ikuti docs/INCIDENT_RESPONSE.md.

## Versi didukung
Hanya `main`.
