"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export function LoginForm() {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      setError("Masukkan email yang benar dan kata sandi minimal 8 karakter.");
      return;
    }
    setPending(true);
    setError(undefined);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: loginError } = await supabase.auth.signInWithPassword(parsed.data);
      if (loginError) {
        setError("Email atau kata sandi tidak tepat.");
        setPending(false);
        return;
      }
      window.location.assign("/setup-toko");
    } catch {
      setError("Koneksi ke layanan login belum tersedia. Pastikan Supabase lokal berjalan.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" noValidate>
      <label className="field">
        <span className="field-label">Email</span>
        <input
          className="text-input"
          autoComplete="email"
          name="email"
          placeholder="nama@contoh.com"
          type="email"
          required
        />
      </label>
      <label className="field">
        <span className="field-label">Kata sandi</span>
        <input
          className="text-input"
          autoComplete="current-password"
          name="password"
          placeholder="Minimal 8 karakter"
          type="password"
          minLength={8}
          required
        />
      </label>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="primary-button" disabled={pending} type="submit">
        {pending ? "Memeriksa akses..." : "Masuk"}
      </button>
      <p className="form-note">
        Belum punya akun lokal? Buat pengguna melalui Supabase Studio, lalu kembali ke halaman ini.
      </p>
    </form>
  );
}
