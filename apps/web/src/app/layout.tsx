import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "WarungOS", description: "POS praktis untuk warung" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Beberapa ekstensi browser menambahkan atribut pada body sebelum React menghidrasi.
  // Batas ini hanya menekan mismatch pada body, bukan pada komponen aplikasi.
  return <html lang="id"><body suppressHydrationWarning>{children}</body></html>;
}
