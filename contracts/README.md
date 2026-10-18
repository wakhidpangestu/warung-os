# AuditAnchor

`AuditAnchor` menyimpan commitment opaque dan root Merkle audit. Kontrak tidak menyimpan data pembeli atau data bisnis, tidak dapat di-upgrade, dan belum diaudit independen.

## Prasyarat

- Foundry `1.8.3`
- Solidity dipin ke `0.8.30` dalam `foundry.toml`
- OpenZeppelin Contracts tersedia pada `lib/openzeppelin-contracts`

## Perintah lokal

```sh
cd contracts
forge build
forge test
forge snapshot
```

## Deploy testnet

Admin dan writer dibaca dari environment, bukan dari kode atau repo. Kunci tetap berada dalam keystore Forge lokal dan dipilih dengan `--account`.

```sh
cd contracts
$env:ADMIN = "0x..."
$env:WRITER = "0x..."
forge script script/Deploy.s.sol:DeployAuditAnchor --rpc-url $env:BLOCKCHAIN_RPC_URL --account deployer --broadcast
```

Skrip memberikan `DEFAULT_ADMIN_ROLE` kepada `ADMIN`, memberikan `WRITER_ROLE` kepada `WRITER`, lalu memverifikasi kedua role tersebut pada kontrak yang baru dibuat. Jangan deploy ke mainnet tanpa keputusan terpisah.

## Ukur gas

Hasil `forge snapshot` pada lingkungan ini:

| Fungsi                                                                                 |     Gas |
| -------------------------------------------------------------------------------------- | ------: |
| `recordCommitment` melalui `test_RecordCommitmentByWriterStoresTimestampAndEmitsEvent` |  85,663 |
| `recordRoot` melalui `test_RecordRootByWriterStoresRecordAndEmitsEvent`                | 112,315 |

Snapshot lengkap berada di `.gas-snapshot`.
