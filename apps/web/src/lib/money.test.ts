import { describe, expect, it } from "vitest";
import { formatRupiah, rupiah } from "./money";

describe("uang Rupiah", () => {
  it("menyimpan dan memformat nilai integer", () => {
    expect(rupiah(12500n)).toBe(12500n);
    expect(formatRupiah(12500n)).toMatch(/^Rp\s12\.500$/u);
  });

  it("menolak nilai negatif", () => {
    expect(() => rupiah(-1n)).toThrow("tidak boleh negatif");
  });
});
