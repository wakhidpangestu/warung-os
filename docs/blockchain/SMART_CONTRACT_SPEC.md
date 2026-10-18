# Spesifikasi Smart Contract

Status: **spesifikasi, belum diimplementasikan.** Kontrak ini belum diaudit independen. Jangan klaim sebaliknya.

## Tujuan

Menyimpan commitment atau Merkle root yang diterbitkan penulis berizin, tanpa data bisnis.

## Kontrak `AuditAnchor`

Basis: OpenZeppelin `AccessControl` (atau `Ownable2Step` untuk MVP sederhana), `Pausable`.

```solidity
// Antarmuka (draf)
event CommitmentRecorded(bytes32 indexed commitment, uint64 timestamp);
event RootRecorded(uint64 indexed batchId, bytes32 root, uint32 count, uint64 timestamp);

function recordCommitment(bytes32 commitment) external onlyRole(WRITER_ROLE);
function recordRoot(uint64 batchId, bytes32 root, uint32 count) external onlyRole(WRITER_ROLE);
function commitmentTime(bytes32 commitment) external view returns (uint64);
function rootOf(uint64 batchId) external view returns (bytes32 root, uint32 count, uint64 timestamp);
```

## Aturan

- Duplikat: `recordCommitment` revert jika sudah ada. `recordRoot` revert jika `batchId` sudah dipakai.
- `root != 0`, `count > 0`.
- Hanya `WRITER_ROLE`. Admin role terpisah, dipegang kunci Owner (idealnya multisig/hardware wallet).
- `Pausable` untuk keadaan darurat. Tanpa upgradeability di MVP (kontrak baru bila perlu, referensi lama tetap valid).
- Tidak menyimpan data pembeli.

## Tes Foundry

Penulis berizin berhasil, tidak berizin revert, duplikat revert, event keluar, pause, role grant/revoke, fuzz untuk batchId dan root, snapshot gas (`forge snapshot`).

## Catatan

Tambahkan verifikasi Merkle on-chain opsional (`verify(proof, root, leaf)`) hanya jika dibutuhkan, verifikasi off-chain dengan pembacaan root sudah cukup untuk MVP.
