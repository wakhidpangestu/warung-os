import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "./env";

const validPublicEnv = {
  NEXT_PUBLIC_APP_NAME: "WarungOS",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
};

describe("validasi environment publik", () => {
  it("menolak URL Supabase yang tidak valid", () => {
    expect(() =>
      parsePublicEnv({ ...validPublicEnv, NEXT_PUBLIC_SUPABASE_URL: "bukan-url" }),
    ).toThrow();
  });

  it("menolak anon key kosong", () => {
    expect(() =>
      parsePublicEnv({ ...validPublicEnv, NEXT_PUBLIC_SUPABASE_ANON_KEY: "" }),
    ).toThrow();
  });
});
