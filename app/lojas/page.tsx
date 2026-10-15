import Link from "next/link";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import type { Metadata } from "next";
import { STORES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Todas as lojas — Cadê Meu Pacote",
  description:
    "Veja estatísticas de reclamações e dicas para reclamar em cada loja: Shein, Shopee, Amazon, Magalu, Mercado Livre e mais.",
};

export default function LojasPage() {
  const stores = STORES.filter(s => s.id !== "other");

  return (
    <>
      <SiteNav ativo="lojas" />

      <main className="ranking-page">
        <div style={{ marginBottom: 40 }}>
          <div className="section-kicker">Lojas</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              marginBottom: 12,
            }}
          >
            Todas as lojas suportadas
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Veja estatísticas e dicas pra reclamação em cada loja.
          </p>
        </div>

        <div className="lojas-grid">
          {stores.map(store => (
            <Link key={store.id} href={`/loja/${store.id}`} className="loja-card">
              <div className="loja-card-emoji">{store.emoji}</div>
              <div className="loja-card-name">{store.name}</div>
              <div className="loja-card-cta">Ver reclamações →</div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", padding: "16px 0 32px" }}>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 16 }}>
            Não achou a sua loja?
          </p>
          <Link href="/app" className="btn btn-primary">
            Gerar minha reclamação →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
