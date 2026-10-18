# Panduan Komponen

Basis: shadcn/ui, dikustom dengan token. Komponen bersama di `src/components/ui`, komponen POS di `src/components/pos`.

## Komponen inti

Button (primary, secondary, danger, ghost), Input uang, Input angka (stepper qty), SearchBox, ProductTile, CartLine, TotalBar, StatusBadge, PaymentModeBadge, EmptyState, ErrorState, Toast, Dialog konfirmasi, Table responsif.

## Status komponen

Semua punya: default, hover, fokus (ring terlihat), aktif, nonaktif, memuat, galat.

## Form

React Hook Form + Zod. Pesan galat inline berbahasa Indonesia, spesifik ("Harga tidak boleh negatif"). Fokus pindah ke kolom galat pertama.

## Memuat dan kosong

Skeleton untuk daftar, spinner di tombol aksi. Empty state menawarkan aksi ("Belum ada produk. Tambah produk pertama").

## Uang

Komponen `<Money value={12500} />` satu-satunya cara menampilkan rupiah. Input uang menyimpan integer, bukan string float.

## Aksi berbahaya

Void, refund, arsip: dialog konfirmasi dengan alasan wajib.

## Uji

Tiap komponen penting punya tes render dan interaksi dasar.
