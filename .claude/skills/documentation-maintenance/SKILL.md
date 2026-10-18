---
name: documentation-maintenance
description: Jaga dokumen WarungOS tetap akurat: PRD, ADR, API, skema, traceability, changelog.
---

# documentation-maintenance

## Tujuan

Dokumen selalu sama dengan kenyataan kode.

## Kapan dipakai

Setiap PR yang mengubah perilaku, skema, API, keputusan, atau batasan.

## Konteks yang dibutuhkan

- Diff dan daftar dokumen di AGENTS.md (peta dokumen)

## Alur kerja

1. Tentukan dokumen terdampak (API, skema, ADR, traceability, limitations, changelog).
2. Perbarui isi dengan fakta, bukan harapan.
3. Tandai hal belum diverifikasi sebagai 'VERIFIKASI' atau 'BELUM TERVERIFIKASI'.
4. Perbarui OPEN_DECISIONS dan RISK_REGISTER bila berubah.
5. Hindari dokumen kosong atau placeholder.

## Batasan

- Jangan menulis klaim yang belum diuji.
- Tanpa em dash.
- ADR lama tidak dihapus.

## Output yang diharapkan

Dokumen yang diperbarui di PR yang sama dengan kode.

## Checklist validasi

- [ ] API/skema sesuai kode
- [ ] Traceability terisi path nyata
- [ ] Changelog diperbarui
- [ ] Batasan baru dicatat

## Dokumen rujukan

AGENTS.md, docs/\*
