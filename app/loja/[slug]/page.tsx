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

  const notaImpacto = Math.min(4.0, stats.total / 25);
  const ratingValue = parseFloat((5 - notaImpacto).toFixed(1));
  const jsonLd = stats.total >= 5
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: `Reclamações ${store.name}`,
        description: `${stats.total} reclamações registradas contra ${store.name} nos últimos 30 dias. Gere sua reclamação grátis com base no Código de Defesa do Consumidor.`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue,
          bestRating: 5,
          worstRating: 1,
          ratingCount: stats.total,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
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
          <div style={{
            maxWidth:     600,
            margin:       "0 auto 40px",
            background:   "var(--primary-soft)",
            border:       "1px solid var(--primary-border)",
            borderRadius: 20,
            padding:      40,
            textAlign:    "center",
          }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🌟</div>
            <h2 style={{
              fontFamily:    "var(--font-display)",
              fontSize:      28,
              fontWeight:    700,
              letterSpacing: "-0.4px",
              marginBottom:  12,
            }}>
              Seja o primeiro
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 28 }}>
              Ainda não temos reclamações registradas contra {store.name}. Teve algum problema com essa loja? Sua reclamação vira o primeiro caso público — e ajuda outros consumidores a se prepararem.
            </p>
            <Link href={`/app?store=${slug}`} className="btn btn-primary" style={{ fontSize: 16, padding: "16px 28px" }}>
              Gerar reclamação contra {store.name} →
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

        {/* Seção educativa: como reclamar */}
        <div className="loja-stat-card" style={{ marginTop: 40 }}>
          <h2>Como reclamar da {store.name}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.75, marginBottom: 20 }}>
            Antes de partir pro Reclame Aqui, tente primeiro o SAC oficial. Se não resolverem em 48h, escale pro Reclame Aqui (lojas grandes monitoram score). Se passar de 5 dias sem solução, abra no Consumidor.gov.br — empresa cadastrada tem 10 dias por lei pra responder.
          </p>
          <Link href={`/app?store=${slug}`} className="btn btn-primary" style={{ fontSize: 15, padding: "12px 22px" }}>
            Gerar reclamação contra {store.name} →
          </Link>
        </div>

        {/* Seção educativa: direitos do consumidor */}
        <div className="loja-stat-card" style={{ marginTop: 20 }}>
          <h2>Seus direitos como consumidor</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.75, marginBottom: 16 }}>
            Independente da loja, o Código de Defesa do Consumidor (Lei 8.078/90) te garante:
          </p>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { art: "Art. 35", texto: "a loja é obrigada a cumprir a oferta como anunciada. Atraso ou cancelamento dá direito a reembolso integral com correção." },
              { art: "Art. 18", texto: "produto com defeito tem 30 dias pra ser consertado. Se não for, você escolhe: troca, reembolso ou abatimento do preço." },
              { art: "Art. 49", texto: "compras online têm 7 dias de arrependimento contados do recebimento — sem motivo, sem multa." },
              { art: "Direito básico", texto: "NÃO existe \"política da loja\" que invalide o CDC. Cláusula contratual contra a lei é nula." },
            ].map(({ art, texto }) => (
              <li key={art} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7, display: "flex", gap: 10 }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{art}:</span>
                <span>{texto}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 20 }}>
            <Link href="/dicas" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 15 }}>
              Veja todas as dicas pra reclamar com força →
            </Link>
          </p>
        </div>

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
          <div className="footer-meta">© {new Date().getFullYear()} · feito com 🧡 e CDC</div>
        </div>
      </footer>
    </>
  );
}
