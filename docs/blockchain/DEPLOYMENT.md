# Deployment Kontrak

## Prasyarat
Foundry, akun deployer, RPC testnet, saldo testnet (faucet), akun explorer untuk verifikasi.

## Langkah testnet
1. `forge build && forge test`
2. Simpan kunci deployer di keystore terenkripsi lokal (`cast wallet import`), bukan file teks.
3. `forge script script/Deploy.s.sol --rpc-url $BLOCKCHAIN_RPC_URL --account deployer --broadcast`
4. Verifikasi: `forge verify-contract <addr> AuditAnchor --chain-id <id>`
5. Beri `WRITER_ROLE` ke alamat signer aplikasi dari akun admin.
6. Isi `BLOCKCHAIN_CONTRACT_ADDRESS` dan `BLOCKCHAIN_CHAIN_ID` di secret manager.
7. Uji `recordRoot` satu kali, cek di explorer, jalankan verifikasi dari aplikasi.

## Mainnet (jika diputuskan)
Checklist: review kode, tes lengkap, keputusan audit eksternal (opsional tetapi dianjurkan), admin pakai multisig/hardware wallet, saldo gas kecil untuk signer, alert saldo rendah, rencana pause dan migrasi.

## Kepemilikan dan pemulihan
- Admin kehilangan kunci: role tidak bisa diubah. Mitigasi: multisig, cadangan kunci offline.
- Signer bocor: admin cabut role, beri ke signer baru, rotasi secret.
- Kontrak bermasalah: pause, deploy kontrak baru, simpan referensi kontrak lama per batch (kolom `contract_address` di batch).

## Dicatat per deployment
Alamat, chain id, versi commit kode, hash tx deploy, tanggal, pemilik admin.
