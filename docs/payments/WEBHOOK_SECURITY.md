# Keamanan Webhook

## Langkah penerimaan

1. Baca raw body (jangan parse dulu).
2. Verifikasi signature/token sesuai spesifikasi resmi provider (metode berbeda per provider, ikuti dokumentasinya). Bandingkan dengan constant-time compare.
3. Tolak jika signature salah: 401, log tanpa rahasia, tanpa efek.
4. Cek timestamp bila provider menyediakannya, tolak yang terlalu lama (anti replay).
5. Insert ke `payment_provider_events` dengan unique `(provider, event_id)`. Jika duplikat, balas 200 tanpa efek.
6. Cari attempt dari referensi. Referensi tak dikenal: simpan event, tandai untuk tinjau.
7. Validasi nominal, mata uang, referensi, status attempt masih boleh transisi.
8. Dalam satu transaksi DB: update attempt, sale, stok, outbox audit.
9. Balas 200 cepat. Pekerjaan lanjutan lewat outbox.

## Aturan

- Jangan pernah percaya status dari klien.
- Endpoint webhook dikecualikan dari auth sesi tetapi dibatasi rate dan, jika disediakan provider, allowlist IP (verifikasi daftar resmi).
- Jangan mencatat secret atau header otorisasi.
- Payload disimpan, field sensitif disamarkan.
- Event tidak berurutan ditangani: transisi yang tidak valid ditolak dan masuk `under_review`.

## Tes wajib

Signature salah, tanpa signature, replay, duplikat, nominal salah, referensi tak dikenal, urutan terbalik, body dimodifikasi.
