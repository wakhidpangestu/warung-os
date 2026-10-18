# Design Tokens

Diterapkan sebagai CSS variables dan konfigurasi Tailwind.

## Warna (terang)
| Token | Nilai | Pakai |
|---|---|---|
| --bg | #FFFFFF | latar |
| --surface | #F6F7F9 | kartu |
| --text | #111827 | teks utama |
| --text-muted | #4B5563 | teks sekunder (kontras >= 4.5:1) |
| --primary | #0F766E | aksi utama |
| --primary-fg | #FFFFFF | teks di atas primary |
| --success | #15803D | berhasil |
| --warning | #B45309 | menunggu/stok tipis |
| --danger | #B91C1C | gagal/hapus |
| --border | #D1D5DB | garis |
Gelap: balik skala, verifikasi kontras sebelum dipakai. Jangan mengandalkan warna saja: sertakan ikon dan teks.

## Tipografi
Font sistem (`system-ui`) agar cepat di perangkat murah. Skala: 14, 16 (dasar), 18, 20, 24, 32. Angka uang memakai `tabular-nums`, format `Rp 12.500`.

## Spasi dan bentuk
Spasi basis 4px: 4, 8, 12, 16, 24, 32. Radius: 8 (kontrol), 12 (kartu), 9999 (chip). Bayangan: satu level tipis untuk kartu dan satu untuk modal.

## Target sentuh
Minimal 44x44 px, tombol utama POS 56 px tinggi.

## Breakpoint
sm 640, md 768, lg 1024, xl 1280. Desain mobile dulu.

## Gerak
Durasi 150 ms, hormati `prefers-reduced-motion`.
