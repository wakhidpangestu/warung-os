# Aksesibilitas

Target: WCAG 2.2 AA untuk alur inti.

- Semua kontrol dapat dioperasikan dengan keyboard, urutan fokus logis.
- Indikator fokus terlihat jelas.
- Label dan nama aksesibel untuk ikon tombol (`aria-label`).
- Kontras teks >= 4.5:1, komponen UI >= 3:1.
- Status tidak hanya lewat warna.
- Perubahan dinamis (item ditambah, status bayar berubah) diumumkan lewat `aria-live`.
- Hormati `prefers-reduced-motion` dan ukuran teks sistem.
- Target sentuh >= 44 px.
- Dialog menjebak fokus dan mengembalikannya saat ditutup.
- Uji: axe di Playwright, pemeriksaan manual keyboard, uji pembaca layar dasar (TalkBack).
