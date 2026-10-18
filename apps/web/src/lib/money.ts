export type Rupiah = bigint;

export function rupiah(value: bigint): Rupiah {
  if (value < 0n) throw new RangeError("Nilai Rupiah tidak boleh negatif.");
  return value;
}

export function formatRupiah(value: Rupiah): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}
