# Privasi

Rujukan hukum: UU Pelindungan Data Pribadi (UU 27/2022), verifikasi kewajiban dengan konsultan.

## Prinsip

Minimisasi data. Pembeli anonim secara default. Label pembeli opsional dan bukan identitas terverifikasi. Tidak memaksa akun atau data pribadi pembeli.

## Data yang diproses

| Data               | Subjek   | Tujuan             | Catatan                            |
| ------------------ | -------- | ------------------ | ---------------------------------- |
| Email/nama staf    | Pengguna | Autentikasi, audit | Wajib                              |
| PIN (hash)         | Kasir    | Akses cepat        | Tidak disimpan polos               |
| Label pembeli      | Pembeli  | Catatan opsional   | Opsional, bebas dari data sensitif |
| Transaksi          | Toko     | Pembukuan          |                                    |
| Referensi provider | Toko     | Rekonsiliasi       |                                    |

## Blockchain

Tidak ada data pribadi, nama, telepon, alamat, atau struk lengkap on-chain. Data on-chain tidak dapat dihapus, jadi hanya commitment ber-nonce yang dipublikasikan. Menghapus nonce off-chain membuat commitment tidak dapat dikaitkan lagi ke data.

## Hak dan retensi

Pengguna dapat meminta ekspor/penghapusan data pribadi staf. Catatan keuangan dipertahankan sesuai kewajiban pembukuan (verifikasi masa retensi). Label pembeli bisa dihapus tanpa memengaruhi total.

## Pihak ketiga

Supabase, hosting, provider pembayaran, pelacak error. Cantumkan di kebijakan privasi publik sebelum rilis.
