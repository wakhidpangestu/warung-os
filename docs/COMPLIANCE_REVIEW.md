# Tinjauan Kepatuhan dan Asumsi Regulasi

Bukan nasihat hukum. Semua butir berstatus **BELUM TERVERIFIKASI** sampai dikonfirmasi sumber resmi atau konsultan.

| # | Asumsi | Status | Sumber verifikasi |
|---|---|---|---|
| C1 | Rupiah wajib untuk transaksi pembayaran di wilayah NKRI (UU Mata Uang) | Belum | Konsultan hukum |
| C2 | Aset kripto bukan alat pembayaran sah di Indonesia, diatur sebagai aset keuangan digital/komoditas | Belum | OJK, Bappebti, BI (cek aturan terkini) |
| C3 | QRIS dinamis hanya lewat PJP berizin/QRIS resmi | Belum | BI, provider |
| C4 | Merchant UMKM wajib dokumen tertentu untuk onboarding provider (NIB, KTP, rekening) | Belum | Provider |
| C5 | Kewajiban pajak UMKM (PPh final dan lainnya) tidak ditangani aplikasi MVP | Belum | Konsultan pajak |
| C6 | Kewajiban UU PDP untuk data staf | Belum | Konsultan |
| C7 | Retensi pembukuan | Belum | Konsultan pajak |
| C8 | Struk digital sah sebagai bukti transaksi | Belum | Konsultan |
| C9 | Distribusi app (Play Store, App Store) memenuhi kebijakan toko | Belum | Kebijakan toko |

## Checklist sebelum produksi
- [ ] Legal review kripto selesai dan didokumentasikan (default: nonaktif).
- [ ] Onboarding provider QRIS selesai.
- [ ] Kebijakan privasi publik dan syarat layanan.
- [ ] Keputusan pajak/pembukuan.
- [ ] Persetujuan Owner atas risiko tersisa.

## Keputusan default
Produksi hanya tunai dan QRIS resmi. Kripto: testnet saja.
