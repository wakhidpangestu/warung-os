import { describe, expect, it } from "vitest";
import { formatBusinessDateTime, toUtcIso } from "./time";

describe("waktu bisnis", () => {
  it("menyimpan waktu dalam UTC", () => {
    expect(toUtcIso(new Date("2026-01-01T00:00:00+07:00"))).toBe("2025-12-31T17:00:00.000Z");
  });

  it("menampilkan dalam Asia/Jakarta", () => {
    expect(formatBusinessDateTime(new Date("2025-12-31T17:00:00.000Z"))).toContain("01 Jan 2026");
  });
});
