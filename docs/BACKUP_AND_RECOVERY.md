# Backup dan Pemulihan

## Yang dicadangkan

Database (termasuk `nonce_enc` commitment), konfigurasi shop, aset gambar. Kunci enkripsi nonce dicadangkan terpisah di secret manager.

## Kebijakan (target awal)

- Backup harian otomatis dan Point-in-Time Recovery bila tersedia di paket Supabase (verifikasi paket).
- Ekspor CSV berkala (mingguan) ke penyimpanan milik Owner sebagai cadangan lapis kedua.
- Retensi minimal 30 hari.

## Uji pemulihan

Tiap kuartal: pulihkan ke proyek kosong, jalankan smoke test, hitung ulang laporan satu hari dan cocokkan, verifikasi sampel commitment. Catat hasil dan durasi.

## RPO/RTO target

RPO <= 24 jam (lebih baik dengan PITR), RTO <= 4 jam. Sesuaikan dengan kebutuhan Owner.

## Skenario

| Skenario               | Langkah                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| Data terhapus salah    | PITR ke sebelum insiden, ekspor baris, impor selektif                                                      |
| Proyek hilang          | Restore backup ke proyek baru, ganti env, daftarkan ulang webhook                                          |
| Nonce hilang           | Commitment terkait tidak dapat dibuktikan, catat sebagai insiden dan terbitkan commitment ulang bila perlu |
| Perangkat kasir hilang | Cabut sesi dan perangkat, rotasi PIN                                                                       |
