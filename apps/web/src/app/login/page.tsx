import { LoginForm } from "./login-form";
import { CheckCircle2 } from "lucide-react";
import { Brand } from "@/components/brand";

export default function LoginPage() {
  return <main className="auth-page"><aside className="auth-aside"><Brand /><div className="aside-copy"><span className="aside-kicker">POS untuk warung</span><h1 className="aside-title">Operasi harian yang lebih rapi.</h1><p>WarungOS membantu Anda memulai pencatatan toko dengan sederhana, jelas, dan siap digunakan dari perangkat apa pun.</p><ul className="principles"><li><CheckCircle2 aria-hidden="true" />Bahasa dan Rupiah untuk kebutuhan warung</li><li><CheckCircle2 aria-hidden="true" />Akses toko dipisahkan per pengguna</li><li><CheckCircle2 aria-hidden="true" />Data toko disiapkan dengan aman</li></ul></div></aside><section className="auth-panel"><div className="auth-content"><Brand /><p className="eyebrow">Selamat datang</p><h1 className="auth-title">Masuk ke toko Anda</h1><p className="lead">Gunakan email dan kata sandi yang dibuat melalui Supabase Studio lokal.</p><LoginForm /></div></section></main>;
}
