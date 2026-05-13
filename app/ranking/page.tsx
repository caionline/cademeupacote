import Link from "next/link";
import type { Metadata } from "next";
import { getRankingLojas } from "@/lib/kv";
import { STORES, PROBLEMS } from "@/lib/constants";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ranking das lojas mais reclamadas — Cadê Meu Pacote",
  description:
    "Veja em tempo real quais lojas têm mais reclamações de consumidores brasileiros. Dados anônimos atualizados nos últimos 30 dias.",
};

function problemLabel(id: string | null): string {
  if (!id) return "—";
  return PROBLEMS.find(p => p.id === id)?.title ?? id;
}

export default async function RankingPage() {
  let ranking: Awaited<ReturnType<typeof getRankingLojas>> = [];
  try {
    ranking = await getRankingLojas(30);
  } catch (err) {
    console.error("[KV ERROR] getRankingLojas falhou:", err instanceof Error ? err.message : err, err);
  }

  const top10      = ranking.slice(0, 10);
  const totalGeral = top10.reduce((sum, r) => sum + r.total, 0);
  const hasData    = totalGeral >= 10;
  const maxTotal   = top10[0]?.total ?? 1;

  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-mark">📦</div>
            Cadê meu pacote?
          </Link>
          <div className="nav-links">
            <a href="/#como-funciona">Como funciona</a>
            <a href="/#escalada">Escalada</a>
            <a href="/ranking" style={{ color: "var(--primary)" }}>Ranking</a>
            <a href="/#faq">FAQ</a>
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>

      <main className="ranking-page">

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-kicker">Transparência</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.15 }}>
            Ranking das lojas{" "}
            <em style={{ fontStyle: "italic", color: "var(--primary)" }}>mais reclamadas</em>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>
            Top 10 dos últimos 30 dias. Atualizado em tempo real conforme reclamações são geradas.
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-subtle)" }}>
            {totalGeral} reclamações analisadas neste período
          </p>
        </div>

        {/* Info box */}
        <div className="ranking-info-box">
          <span>ℹ️</span>
          <span>
            <strong>Como funciona este ranking:</strong> dados 100% anônimos das reclamações geradas
            no site — loja, tipo de problema e faixa de valor. Sem identificação de usuários.{" "}
            <Link href="/privacidade" style={{ color: "var(--primary)" }}>Ver metodologia completa.</Link>
          </span>
        </div>

        {/* Estado vazio */}
        {!hasData && (
          <div className="ranking-empty">
            <div style={{ fontSize: 64, marginBottom: 16 }}>👀</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
              Coletando dados
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 32px" }}>
              Estamos coletando os primeiros casos. Volte em alguns dias pra ver o ranking completo.
            </p>
            <Link href="/app" className="btn btn-primary">
              Gerar minha reclamação →
            </Link>
          </div>
        )}

        {/* Lista do ranking */}
        {hasData && (
          <div className="ranking-list">
            {top10.map((item, idx) => {
              const store  = STORES.find(s => s.id === item.storeId);
              if (!store) return null;
              const barPct = Math.round((item.total / maxTotal) * 100);

              return (
                <div key={item.storeId} className="ranking-item">
                  <div className="ranking-item-inner">
                    <span className="ranking-position">{idx + 1}</span>

                    <div className="ranking-meta">
                      <div className="ranking-store-row">
                        <span className="ranking-store-name">{store.emoji} {store.name}</span>
                        <span className="ranking-badge">{item.total} casos</span>
                      </div>
                      <div className="ranking-problem">
                        Problema mais comum: {problemLabel(item.problemaMaisComum)}
                      </div>
                    </div>

                    <Link href={`/app?store=${item.storeId}`} className="ranking-cta">
                      Eu também →
                    </Link>
                  </div>

                  <div className="ranking-bar-track">
                    <div className="ranking-bar-fill" style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="ranking-footnote">
          Esses dados são públicos e atualizados continuamente.{" "}
          <Link href="/privacidade" style={{ color: "var(--primary)" }}>
            Veja a metodologia em /privacidade.
          </Link>
        </p>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="logo"><div className="logo-mark">📦</div>cademeupacote.com.br</div>
          <div className="footer-links">
            <a href="/termos">Termos</a>
            <a href="/privacidade">Privacidade</a>
            <a href="/ranking">Ranking</a>
            <a href="/contato">Contato</a>
          </div>
          <div className="footer-meta">© 2026 · feito com 🧡 e CDC</div>
        </div>
      </footer>
    </>
  );
}
