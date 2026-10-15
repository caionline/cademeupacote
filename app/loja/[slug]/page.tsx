import Link from "next/link";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { GUIAS } from "@/lib/guias";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STORES, PROBLEMS } from "@/lib/constants";
import { getStatsLoja } from "@/lib/db";
import { MODELOS } from "@/lib/modelos";
import { jsonLd as ld, seo, SITE } from "@/lib/seo";

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

  return seo({
    titulo: `${store.name}: SAC, reclamações e seus direitos | Cadê Meu Pacote`,
    descricao: total > 0
      ? `${total} reclamações contra a ${store.name} no último mês. Veja como falar com o SAC, os problemas mais comuns e gere sua reclamação grátis com base no CDC.`
      : `Como falar com o SAC da ${store.name}, o que o Código de Defesa do Consumidor garante e como reclamar quando a loja não resolve. Reclamação grátis em 3 minutos.`,
    caminho: `/loja/${store.id}`,
    noindex: store.encerrada,
  });
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

/** Lojas que também vendem produtos de vendedores parceiros (marketplace). */
const MARKETPLACES = new Set(["shopee", "amazon", "magalu", "mercadolivre", "aliexpress", "americanas", "casasbahia", "shein", "netshoes", "centauro", "kabum"]);

function faqLoja(nome: string, marketplace: boolean) {
  const faq = [
    { p: `Como falar com o SAC da ${nome}?`, r: `Use o atendimento oficial da ${nome} (site ou app), sempre com o número do pedido em mãos, e anote o protocolo de cada contato. Ele é a sua prova se precisar escalar.` },
    { p: `A ${nome} atrasou meu pedido. O que posso exigir?`, r: "Pelo art. 35 do CDC, você escolhe: a entrega, um produto equivalente ou o cancelamento com devolução integral do valor pago." },
    { p: `Quanto tempo a ${nome} tem para resolver um produto com defeito?`, r: "Até 30 dias para consertar (art. 18 do CDC). Passado esse prazo, você escolhe entre troca, dinheiro de volta ou abatimento do preço." },
    { p: `Posso devolver uma compra online da ${nome} por arrependimento?`, r: "Sim. Compras fora da loja física têm 7 dias de arrependimento a partir do recebimento, sem precisar de motivo, com devolução de tudo o que foi pago (art. 49)." },
    { p: `A ${nome} não resolveu. Para onde eu vou?`, r: "Reclame Aqui (reclamação pública), depois Consumidor.gov.br ou Procon (oficiais e grátis). O último degrau é o Juizado Especial Cível: sem custas na 1ª instância e, até 20 salários mínimos, sem advogado." },
  ];
  if (marketplace) faq.splice(1, 0, { p: `Comprei de um vendedor parceiro na ${nome}. Ela responde?`, r: `O CDC prevê responsabilidade de todos na cadeia de fornecimento (art. 7º, parágrafo único). Na prática, inclua a ${nome} na reclamação, não só o vendedor.` });
  return faq;
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

  const marketplace = MARKETPLACES.has(store.id);
  const faq = faqLoja(store.name, marketplace);
  const dadosEstruturados = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(f => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Lojas", item: `${SITE}/lojas` },
        { "@type": "ListItem", position: 3, name: store.name, item: `${SITE}/loja/${store.id}` },
      ],
    },
  ];

  const guia = GUIAS.find(g => g.lojaRelacionada === slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(dadosEstruturados) }} />
      <SiteNav ativo="lojas" />

      <main className="ranking-page">

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <Link href="/lojas" className="loja-back">← Todas as lojas</Link>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{store.emoji}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>
            {store.name}
          </h1>
          {store.aviso && <div className="loja-aviso">⚠️ {store.aviso}</div>}
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
          {store.sacUrl && !store.encerrada && (
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.75, marginBottom: 12 }}>
              <strong style={{ color: "var(--text)" }}>Atendimento oficial:</strong>{" "}
              <a href={store.sacUrl} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "var(--primary)", fontWeight: 600 }}>
                central de atendimento da {store.name} ↗
              </a>
              {marketplace && <> Se a compra foi de um vendedor parceiro, abra a reclamação pelo pedido e mantenha a {store.name} na conversa.</>}
            </p>
          )}
          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.75, marginBottom: 20 }}>
            Comece pelo SAC oficial e anote o protocolo. Sem solução em 2 a 3 dias, publique no Reclame Aqui (lojas grandes cuidam da nota pública). Se ainda não resolver, use um canal oficial: no Consumidor.gov.br a empresa cadastrada tem 10 dias pra responder, e o Procon do seu estado pode notificar a loja e chamar pra conciliação. O último degrau é o Juizado Especial Cível: sem custas na 1ª instância e, até 20 salários mínimos, sem advogado.
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
              { art: "Arts. 30 e 35", texto: "a oferta anunciada obriga a loja. Se ela não cumprir (atraso, cancelamento, produto diferente), você escolhe: exigir o cumprimento, aceitar outro produto equivalente ou receber o dinheiro de volta, corrigido." },
              { art: "Art. 18", texto: "produto com defeito tem 30 dias pra ser consertado. Se não for, você escolhe: troca, reembolso ou abatimento do preço." },
              { art: "Art. 49", texto: "compras online têm 7 dias de arrependimento contados do recebimento, sem precisar de motivo, com devolução de tudo o que foi pago." },
              { art: "Art. 51", texto: "nenhuma \"política da loja\" pode tirar direitos do CDC. Cláusulas abusivas são nulas." },
            ].map(({ art, texto }) => (
              <li key={art} style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7, display: "flex", gap: 10 }}>
                <span style={{ color: "var(--primary)", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{art}:</span>
                <span>{texto}</span>
              </li>
            ))}
          </ul>
          <p style={{ marginTop: 20 }}>
            {guia ? (
              <Link href={`/guias/${guia.slug}`} style={{ color: "var(--primary)", fontWeight: 600, fontSize: 15 }}>
                Guia completo: {guia.titulo} →
              </Link>
            ) : (
              <Link href="/guias" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 15 }}>
                Veja os guias pra reclamar com força →
              </Link>
            )}
          </p>
        </div>

        <div className="loja-stat-card" style={{ marginTop: 20 }}>
          <h2>Modelos de reclamação pra usar com a {store.name}</h2>
          <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {MODELOS.map(m => (
              <li key={m.slug} style={{ fontSize: 15 }}>
                <Link href={`/modelos/${m.slug}`} style={{ color: "var(--primary)", fontWeight: 600 }}>{m.titulo}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="loja-stat-card" style={{ marginTop: 20 }}>
          <h2>Perguntas frequentes sobre a {store.name}</h2>
          {faq.map(f => (
            <details key={f.p} className="guia-faq">
              <summary>{f.p}</summary>
              <p>{f.r}</p>
            </details>
          ))}
        </div>

        <p className="ranking-footnote">
          <Link href="/ranking" style={{ color: "var(--primary)" }}>← Ver ranking completo</Link>
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
