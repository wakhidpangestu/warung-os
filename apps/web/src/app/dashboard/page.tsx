import { redirect } from "next/navigation";
import { getSessionAndMembership } from "@/lib/auth";
import { Brand } from "@/components/brand";

export default async function DashboardPage() {
  const { memberships } = await getSessionAndMembership();
  if (memberships.length === 0) redirect("/setup-toko");
  const shop = memberships[0]?.shops[0];

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <Brand />
        <span className="status-badge">Toko aktif</span>
      </header>
      <section className="dashboard-hero">
        <p className="eyebrow">{shop?.name ?? "Toko Anda"}</p>
        <h1 className="dashboard-title">Fondasi toko sudah siap.</h1>
        <p>
          Anda telah masuk sebagai pemilik. Data toko terlindungi dan siap untuk tahap katalog,
          stok, serta kasir berikutnya.
        </p>
        <div className="hero-actions">
          <a className="hero-link" href="#mulai">
            Lihat langkah berikutnya <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <section className="dashboard-section" id="mulai">
        <div>
          <p className="eyebrow">Status awal</p>
          <h2>Mulai dari fondasi yang benar.</h2>
        </div>
        <span className="dashboard-caption">Sprint 1</span>
      </section>
      <section className="progress-grid" aria-label="Status pengembangan">
        <div className="progress-item">
          <span className="item-number">01</span>
          <strong>Akses toko</strong>
          <span>Login dan peran pemilik siap dipakai.</span>
        </div>
        <div className="progress-item">
          <span className="item-number">02</span>
          <strong>Data terpisah</strong>
          <span>Setiap toko dilindungi oleh isolasi tenant.</span>
        </div>
        <div className="progress-item">
          <span className="item-number">03</span>
          <strong>Selanjutnya</strong>
          <span>Tambahkan katalog produk pada Sprint 2.</span>
        </div>
      </section>
    </main>
  );
}
