import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSessionAndMembership } from "@/lib/auth";
import { Brand } from "@/components/brand";
import { SetupForm } from "./setup-form";

export default async function SetupShopPage() {
  const { memberships } = await getSessionAndMembership();
  if (memberships.length > 0) redirect("/dashboard");
  return <main className="setup-page"><header className="topbar"><Brand /><span className="status-badge">Langkah 1 dari 1</span></header><div className="setup-layout"><section className="setup-intro"><p className="eyebrow">Mulai menggunakan WarungOS</p><h1 className="setup-title">Beri nama toko Anda.</h1><p className="lead">Nama ini akan menjadi penanda utama untuk data dan pengaturan toko Anda.</p><ul className="setup-points"><li><CheckCircle2 aria-hidden="true" />Zona waktu Asia/Jakarta</li><li><CheckCircle2 aria-hidden="true" />Mata uang Rupiah</li><li><CheckCircle2 aria-hidden="true" />Anda menjadi pemilik toko</li></ul></section><section className="setup-card"><SetupForm /></section></div></main>;
}
