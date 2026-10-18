import { describe, expect, it } from "vitest";
import { can } from "./roles";

describe("otorisasi peran", () => {
  it("hanya owner dapat mengelola toko", () => {
    expect(can("owner", "manage_shop")).toBe(true);
    expect(can("cashier", "manage_shop")).toBe(false);
    expect(can("inventory", "manage_shop")).toBe(false);
    expect(can("auditor", "manage_shop")).toBe(false);
  });
});
