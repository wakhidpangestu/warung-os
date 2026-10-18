# ADR 002: Abstraksi Pembayaran

Status: Diterima

## Konteks
QRIS dinamis butuh provider berizin. Kripto punya risiko regulasi. Kasus pakai berbeda dalam perilaku dan status.

## Keputusan
Interface `PaymentAdapter` (createPaymentRequest, getPaymentStatus, verifyWebhook, expirePaymentRequest, reconcilePayment, refundPayment opsional) dengan implementasi: cash, mock, qris-provider, testnet-crypto. Metode diaktifkan oleh feature flag dan setting shop, ditegakkan di server. Tiap adapter menyatakan `capabilities` (mis. refund, expiry).

## Alternatif
Hardcode satu provider (cepat tapi terkunci), integrasi langsung ke infrastruktur QRIS nasional (tidak realistis tanpa izin).

## Kelebihan
Ganti provider tanpa ubah inti POS, mock memudahkan tes, pemisahan jelas sandbox/nyata.

## Kekurangan
Provider berbeda semantik, abstraksi bisa bocor. Harus ada `capabilities`.

## Implikasi keamanan
Satu titik verifikasi webhook dan idempotensi. Metode nonaktif ditolak server.

## Implikasi biaya
Biaya adapter per provider. Fee provider dicatat per transaksi (`payment_fee_idr`).

## Konsekuensi
Status internal dipetakan dari status provider lewat tabel pemetaan per adapter dan diuji.

## Tinjau ulang jika
Ada provider kedua yang semantiknya tidak cocok dengan interface.
