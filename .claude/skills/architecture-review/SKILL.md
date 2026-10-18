---
name: architecture-review
description: Tinjau perubahan arsitektur WarungOS: batas modul, ADR, state machine, outbox. Pakai saat ada fitur lintas modul atau keputusan teknis besar.
---

# architecture-review

## Tujuan

Menjaga modular monolith tetap bersih dan keputusan terdokumentasi.

## Kapan dipakai

Fitur lintas modul, penambahan dependensi besar, perubahan state machine, adapter baru, atau keputusan yang butuh ADR.

## Konteks yang dibutuhkan

- ADR terkait dan ARCHITECTURE.md
- Diff atau rencana perubahan

## Alur kerja

1. Baca ADR dan ARCHITECTURE.md terkait.
2. Petakan modul yang terdampak dan arah dependensi (UI → API → domain → DB; adapter terisolasi).
3. Periksa konsistensi state machine (sale, payment, inventory, audit).
4. Pastikan efek eksternal lewat outbox, bukan di transaksi checkout.
5. Nilai kebutuhan ADR baru dan tulis bila perlu (konteks, keputusan, alternatif, trade-off, keamanan, biaya, tinjau ulang).
6. Catat risiko dan keputusan terbuka.

## Batasan

- Tidak menambah microservice atau abstraksi tanpa kebutuhan terdokumentasi.
- Tidak mengubah keputusan ADR tanpa ADR pengganti.

## Output yang diharapkan

Daftar temuan berprioritas, ADR baru/pembaruan, rekomendasi go/no-go.

## Checklist validasi

- [ ] Dependensi mengikuti arah yang ditetapkan
- [ ] Transisi status valid dan dites
- [ ] Tidak ada I/O eksternal lambat dalam transaksi DB
- [ ] ADR dan docs diperbarui

## Dokumen rujukan

docs/ARCHITECTURE.md, docs/ADR/\*, docs/TECH_STACK.md
