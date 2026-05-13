import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STORES, PROBLEMS } from "@/lib/constants";
import { getStatsLoja } from "@/lib/kv";

export const revalidate = 300;

export async function generateStaticParams() {
  return STORES.filter(s => s.id !== "other").map(s => ({ slug: s.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const store = STORES.find(s => s.id === slug);
  if (!store) return {};

  let total = 0;
  try {
    const stats = await getStatsLoja(slug, 30);
    total = stats.total;
  } catch (err) {
    console.error("[KV ERROR] getStatsLoja (metadata) falhou:", err instanceof Error ? err.message : err, err);
  }

  return {
    title: `Reclamações ${store.name} — Estatísticas e Direitos`,
    description: total > 0
      ? `${total} reclamações registradas. Veja os problemas mais comuns e gere sua reclamação grátis com base no CDC.`
      : `Veja estatísticas de reclamações da ${store.name} e gere sua reclamação grátis com base no Código de Defesa do Consumidor.`,
  };
}

const VALUE_RANGE_LABELS: Record<string, string> = {
  "ate-50":  "até R$ 50",
  "50-200":  "R$ 50–200",
  "200-500": "R$ 200–500",
  "500-1k":  "R$ 500–1.000",
  "1k-5k":   "R$ 1.000–5.000",
  "5k+":     "acima de R$ 5.000",
};

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="stat-bar-row">
      <div className="stat-bar-labels">
        <span className="label">{label}</span>
        <span className="value">{value} ({pct}%)</span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function LojaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = STORES.find(s => s.id === slug);
  if (!store) notFound();

  let stats = {
    total: 0,
    porProblema:   {} as Record<string, number>,
    porValueRange: {} as Record<string, number>,
  };
  try {
    stats = await getStatsLoja(slug, 30);
  } catch (err) {
    console.error("[KV ERROR] getStatsLoja (page) falhou:", err instanceof Error ? err.message : err, err);
  }

  const hasData     = stats.total > 0;
  const problems    = Object.entries(stats.porProblema).sort((a, b) => b[1] - a[1]);
  const valueRanges = Object.entries(stats.porValueRange).sort((a, b) => b[1] - a[1]);
  const maxProb     = problems[0]?.[1] ?? 1;
  const maxVal      = valueRanges[0]?.[1] ?? 1;

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
            <Link href="/ranking" style={{ color: "var(--primary)", fontWeight: 600 }}>Ranking</Link>
            <a href="/#faq">FAQ</a>
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>

      <main className="ranking-page">

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <Link href="/ranking" className="loja-back">← Voltar ao ranking</Link>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{store.emoji}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>
            {store.name}
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.6 }}>
            {hasData ? (
              <><strong style={{ color: "var(--primary)" }}>{stats.total} reclamações</strong> registradas nos últimos 30 dias.</>
            ) : (
              "Sem reclamações registradas nos últimos 30 dias."
            )}
          </p>
        </div>

        {/* Estado vazio */}
        {!hasData && (
          <div className="ranking-empty" style={{ marginBottom: 32 }}>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 24 }}>
              Sem reclamações registradas ainda pra esta loja. Foi o primeiro? Use o app pra registrar.
            </p>
            <Link href={`/app?store=${slug}`} className="btn btn-primary">
              Tive problema com {store.name} →
            </Link>
          </div>
        )}

        {/* Dados */}
        {hasData && (
          <>
            {problems.length > 0 && (
              <div className="loja-stat-card">
                <h2>Tipos de problema</h2>
                {problems.map(([id, count]) => {
                  const prob = PROBLEMS.find(p => p.id === id);
                  return (
                    <BarRow
                      key={id}
                      label={prob ? `${prob.emoji} ${prob.title}` : id}
                      value={count}
                      max={maxProb}
                    />
                  );
                })}
              </div>
            )}

            {valueRanges.length > 0 && (
              <div className="loja-stat-card">
                <h2>Faixas de valor</h2>
                {valueRanges.map(([range, count]) => (
                  <BarRow
                    key={range}
                    label={VALUE_RANGE_LABELS[range] ?? range}
                    value={count}
                    max={maxVal}
                  />
                ))}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Link href={`/app?store=${slug}`} className="btn btn-primary" style={{ fontSize: 16, padding: "16px 28px" }}>
                Tive problema com {store.name} também →
              </Link>
            </div>
          </>
        )}

        <p className="ranking-footnote">
          <Link href="/ranking" style={{ color: "var(--primary)" }}>← Ver ranking completo</Link>
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
