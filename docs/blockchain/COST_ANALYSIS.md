# Analisis Biaya dan Jaringan

**Angka harga gas dan token berubah cepat. Isi tabel dari sumber resmi dan hasil ukur `forge snapshot` sebelum memutuskan. Jangan memakai angka di bawah sebagai fakta.**

## Rumus
```
biaya_per_tx_IDR = gas_used x gas_price(gwei) x 1e-9 x harga_token_native_IDR
mode single  = N transaksi/hari x biaya_per_commit
mode batch   = jumlah batch/hari x biaya_per_root
```
Perkiraan kasar gas (ukur ulang): tx dasar 21.000 + penulisan satu slot storage baru sekitar 20.000-25.000 + overhead event/kontrak, jadi satu commit kira-kira puluhan ribu gas. `recordRoot` mirip satu commit. Batch menghemat dengan faktor sekitar N (jumlah transaksi per batch).

## Contoh simulasi (parametrik, isi sendiri)
| Skenario | Transaksi/hari | Mode | Tx on-chain/hari |
|---|---|---|---|
| Warung kecil | 100 | single | 100 |
| Warung kecil | 100 | batch harian | 1 |
| Ramai | 500 | batch per 100 | 5 |

## Perbandingan jaringan (kualitatif)
Tanggal akses semua sumber pada tabel: 18 Oktober 2026. Klaim biaya tidak menggantikan pengukuran `forge snapshot` dan kuotasi gas saat keputusan dibuat.
| Kriteria | Polygon PoS | Base | Catatan |
|---|---|---|---|
| Biaya per tx | tidak ditemukan tarif biaya tetap resmi. Biaya harus dihitung dari gas aktual dan harga POL saat eksekusi; dokumentasi Polygon mengharuskan saldo POL untuk gas. [Polygon Amoy/PoS](https://docs.polygon.technology/tools/dApp-development/common-tools/remix/) (akses 18 Oktober 2026) | tidak ditemukan tarif biaya tetap resmi. Dokumentasi Base menyatakan deployment memerlukan ETH untuk gas. [Deploy dengan Foundry](https://docs.base.org/cookbook/use-case-guides/finance/access-real-time-asset-data-pyth-price-feeds/) (akses 18 Oktober 2026) | Jangan jadikan klaim biaya rendah sebagai angka keputusan. |
| Finalitas/reorg | tidak ditemukan parameter finalitas/reorg terkini yang eksplisit pada dokumentasi resmi yang ditinjau. | Base membedakan head `unsafe`, `safe`, dan `finalized`; reorg L1 pasca-merge dibatasi penundaan finalitas L1, kira-kira 13 menit dalam kondisi normal yang dijelaskan dokumentasi. [Base derivation](https://docs.base.org/base-chain/specs/protocol/consensus/derivation) (akses 18 Oktober 2026) | Gunakan blok `finalized` untuk bukti audit yang membutuhkan ketahanan reorg. |
| Keandalan RPC/penyedia | Endpoint publik Polygon dan Amoy telah dihentikan pada 2026; Polygon menyarankan migrasi ke alternatif dan menyediakan daftar penyedia publik/berbayar. [Penghentian public RPC](https://forum.polygon.technology/t/deprecation-of-polygons-public-rpc-endpoints-mainnet-amoy/22014) (akses 18 Oktober 2026) | RPC Base Sepolia resmi `https://sepolia.base.org` didokumentasikan; SLA dan cadangan penyedia tidak ditemukan pada sumber resmi yang ditinjau. [Deploy dengan Foundry](https://docs.base.org/cookbook/use-case-guides/finance/access-real-time-asset-data-pyth-price-feeds/) (akses 18 Oktober 2026) | Kontrak SLA dan failover tetap keputusan operasional. |
| Explorer + verifikasi kontrak | Ya, Polygon mendokumentasikan Polygonscan dan proses `Verify and Publish`; Amoy: `amoy.polygonscan.com`. [Polygon tools](https://docs.polygon.technology/tools/dApp-development/common-tools/remix/) (akses 18 Oktober 2026) | Explorer untuk deployment disebut dalam tutorial Base, tetapi URL/prosedur verifikasi kontrak tidak ditemukan pada sumber resmi yang ditinjau. [Deploy dengan Foundry](https://docs.base.org/cookbook/use-case-guides/finance/access-real-time-asset-data-pyth-price-feeds/) (akses 18 Oktober 2026) | |
| Dukungan ekosistem/alat | Foundry didokumentasikan untuk jaringan Polygon yang kompatibel EVM; dukungan viem khusus Polygon tidak ditemukan pada sumber resmi yang ditinjau. [Deploy Foundry Polygon](https://docs.polygon.technology/zkEVM/how-to/using-foundry/) (akses 18 Oktober 2026) | Ya untuk Foundry: tutorial Base memakai `forge create` dan `cast`; dukungan viem khusus Base tidak ditemukan pada sumber resmi yang ditinjau. [Deploy dengan Foundry](https://docs.base.org/cookbook/use-case-guides/finance/access-real-time-asset-data-pyth-price-feeds/) (akses 18 Oktober 2026) | |
| Testnet dan faucet | Ya, Amoy adalah testnet Polygon PoS (chain ID 80002); Polygon mendokumentasikan faucet dan explorer Amoy. [Polygon testnet](https://polygon.technology/blog/polygon-pos-and-polygon-zkevm-new-testnets-for-polygon-protocols) (akses 18 Oktober 2026) | Ya, Base Sepolia (chain ID 84532); dokumentasi mengarahkan ke daftar faucet Base Network. [Base chain ID](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_chainId) dan [faucet Base](https://docs.base.org/cookbook/use-case-guides/finance/access-real-time-asset-data-pyth-price-feeds/) (akses 18 Oktober 2026) | |

Rekomendasi kerja: mulai di testnet salah satu jaringan di atas dengan mode batch. Putuskan jaringan produksi setelah tabel terisi dan setelah ada ukur gas nyata. Konfigurasi, bukan hardcode.

## Trade-off mode
| Aspek | Single | Batch Merkle |
|---|---|---|
| Biaya | Linear dengan transaksi | Hampir tetap per periode |
| Latensi bukti | Menit | Sampai batch ditutup |
| Verifikasi | Baca satu commitment | Proof + root |
| Kompleksitas | Rendah | Sedang |
| Keamanan | Sama (hash on-chain) | Sama, tergantung integritas proof |
Konsekuensi memilih single: biaya dan beban operasional naik seiring volume, dan kegagalan chain memengaruhi banyak job kecil. Arsitektur mendukung keduanya tanpa mengubah logika POS karena hanya adapter dan konfigurasi yang berbeda.
