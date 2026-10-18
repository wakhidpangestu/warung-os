# PRD: WarungOS

## 1. Ringkasan

Smart POS mobile-first untuk warung sembako milik keluarga, dirancang agar bisa menjadi SaaS multi-toko. Bahasa Indonesia, Rupiah, zona Asia/Jakarta.

## 2. Masalah

Pemilik warung: sering lupa harga, mencatat manual, tidak tahu stok menipis, tidak punya laporan harian, tidak bisa memverifikasi pembayaran QRIS selain percaya bukti layar.

## 3. Pengguna

| Peran             | Kebutuhan utama                  |
| ----------------- | -------------------------------- |
| Owner             | Semua akses, laporan, pengaturan |
| Kasir             | Jual, lihat transaksi terbatas   |
| Inventory Manager | Produk dan stok                  |
| Auditor           | Baca saja                        |

Persona utama: ibu pemilik warung, literasi teknis terbatas, HP Android kelas menengah ke bawah, internet tidak stabil.

## 4. Tujuan dan non-tujuan

**Tujuan:** cari harga < 5 detik, kasir tunai andal, stok akurat, laporan harian, QRIS resmi, audit terverifikasi.
**Non-tujuan (MVP):** pertukaran kripto, custody wallet, pinjaman, marketplace, pembayaran kripto produksi.

## 5. Ruang lingkup per rilis

| Rilis            | Isi                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------- |
| MVP (Sprint 1-4) | Auth, produk, kategori, cari harga, stok, kasir tunai, struk, riwayat, laporan, PWA, APK |
| R2 (Sprint 5)    | QRIS dinamis via provider resmi (mock lalu sandbox lalu live)                            |
| R3 (Sprint 6)    | Audit blockchain (batch Merkle default)                                                  |
| R4               | Produksi, hardening, multi-toko                                                          |
| Nanti            | Pembayaran aset digital (hanya jika disetujui hukum), supplier, printer, loyalty         |

## 6. Kebutuhan fungsional ringkas (ID dipakai di traceability)

- FR-AUTH: login, peran, sesi, PIN kasir opsional.
- FR-PROD: CRUD produk, SKU/barcode, kategori, satuan, harga jual/modal, favorit, impor/ekspor CSV, riwayat harga.
- FR-POS: keranjang, diskon berwenang, tunai + kembalian, status pending/gagal/kedaluwarsa, nomor struk, idempotensi.
- FR-INV: stok masuk/keluar/penyesuaian, histori, peringatan stok minimum, stok tidak negatif.
- FR-REP: riwayat transaksi, filter, ekspor CSV, laporan harian/mingguan/bulanan, rekonsiliasi kas.
- FR-QRIS: pembayaran QRIS dinamis via adapter, webhook, rekonsiliasi.
- FR-AUDIT: komitmen blockchain via outbox, verifikasi, explorer.
- FR-OFF: PWA, katalog cache, draft offline, sinkronisasi.
- FR-ADMIN: staf, pengaturan toko, diagnostik.

## 7. Kebutuhan non-fungsional

Performa di HP low-end, 3G/tidak stabil; aksesibilitas WCAG AA dasar; keamanan sesuai THREAT_MODEL; privasi minimal data; backup harian.

## 8. Metrik keberhasilan

Waktu cari harga median < 5 detik; 100% penjualan tercatat selama 30 hari uji di warung; selisih stok sistem vs fisik < 3% pada opname; 0 duplikasi pengurangan stok pada tes konkurensi.

## 9. Asumsi dan risiko

Lihat RISK_REGISTER.md, COMPLIANCE_REVIEW.md, OPEN_DECISIONS.md.

## 10. Prinsip produk

Membuat warung lebih mudah, cepat, akurat, dan transparan. Teknologi canggih tidak boleh mempersulit checkout.
