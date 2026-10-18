import { expect, test } from "@playwright/test";

test("pengguna baru diarahkan ke setup toko setelah login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@warung.local");
  await page.getByLabel("Kata sandi").fill("Demo12345!");
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/setup-toko$/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Beri nama toko Anda." })).toBeVisible();
});
