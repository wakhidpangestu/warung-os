# Keputusan Terbuka dan Default

| ID | Keputusan | Default sementara | Butuh dari luar? |
|---|---|---|---|
| D1 | Provider QRIS | Mock, evaluasi Xendit dan Midtrans (lihat payments/QRIS_INTEGRATION) | Akun merchant, dokumen usaha |
| D2 | Jaringan blockchain | Testnet EVM (Base Sepolia atau Polygon Amoy), verifikasi dokumen jaringan terkini | Tidak |
| D3 | Mode commitment | Batch Merkle harian (default), single sebagai opsi | Tidak |
| D4 | Hosting | Vercel + Supabase, cron untuk job | Akun |
| D5 | Lisensi | Proprietary | Keputusan bisnis |
| D6 | Status hukum kripto sebagai pembayaran | Dilarang di produksi | **Konsultan hukum** |
| D7 | Printer struk | Share/print browser dulu, Bluetooth ESC/POS di Sprint 8 | Perangkat |
| D8 | Email kontak keamanan | TODO | Pemilik |
| D9 | Pajak (PPN/PPh final UMKM) | Tidak dihitung di MVP, ada kolom tax disiapkan | Konsultan pajak |
| D10 | Nama produk final | WarungOS | Branding |
| D11 | Onboarding toko pertama | Pengguna terautentikasi membuat tepat satu toko melalui RPC `create_shop_for_owner`; penambahan staf ditunda ke sprint berikutnya | Tidak |
