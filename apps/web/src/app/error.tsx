"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="error-page"><div><p className="eyebrow">Ada kendala</p><h1 className="error-title">Halaman belum dapat dimuat.</h1><p className="lead">Periksa bahwa Supabase lokal masih berjalan, lalu coba lagi. Jika masalah berlanjut, masuk ulang dari halaman login.</p><button className="primary-button" onClick={reset} type="button">Coba lagi</button><a className="secondary-link" href="/login">Kembali ke login</a></div></main>;
}
