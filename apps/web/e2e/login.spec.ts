import { expect, test } from "@playwright/test";

test("pengguna baru diarahkan ke setup toko setelah login", async ({ page }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
  const email = `e2e-${crypto.randomUUID()}@warung.local`;
  const password = "Demo12345!";
  const response = await page.request.post(`${supabaseUrl}/auth/v1/signup`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" },
    data: { email, password },
  });
  expect(response.ok()).toBe(true);
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Kata sandi").fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/setup-toko$/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Beri nama toko Anda." })).toBeVisible();
});
