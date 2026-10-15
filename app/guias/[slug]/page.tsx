import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { GUIAS, getGuia } from "@/lib/guias";
import { STORES } from "@/lib/constants";
import { seo } from "@/lib/seo";
import { MODELOS } from "@/lib/modelos";

const SITE = "https://www.cademeupacote.com.br";

export function generateStaticParams() {
  return GUIAS.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) return {};
  return seo({ titulo: g.tituloSeo, descricao: g.descricao, caminho: `/guias/${g.slug}`, tipo: "article" });
}

function linkApp(cta: { problema?: string; loja?: string }) {
  const q = new URLSearchParams();
  if (cta.problema) q.set("problema", cta.problema);
  if (cta.loja) q.set("store", cta.loja);
  const s = q.toString();
  return s ? `/app?${s}` : "/app";
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuia(slug);
  if (!g) notFound();

  const diretos = MODELOS.filter(m => m.guia === g.slug);
  const modelos = diretos.length > 0 ? diretos : MODELOS.filter(m => g.cta.problema && m.problema === g.cta.problema).slice(0, 2);

  const loja = g.lojaRelacionada ? STORES.find(s => s.id === g.lojaRelacionada) : null;
  const outros = GUIAS.filter(x => x.slug !== g.slug).slice(0, 4);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: g.titulo,
      description: g.descricao,
      dateModified: g.atualizado,
      inLanguage: "pt-BR",
      mainEntityOfPage: `${SITE}/guias/${g.slug}`,
      publisher: { "@type": "Organization", name: "Cadê Meu Pacote", url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: g.faq.map(f => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Guias", item: `${SITE}/guias` },
        { "@type": "ListItem", position: 3, name: g.titulo, item: `${SITE}/guias/${g.slug}` },
      ],
    },
  ];

  return (
    <>
      <SiteNav ativo="dicas" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <main className="guia">
        <nav className="guia-trilha" aria-label="Você está em">
          <Link href="/">Início</Link> › <Link href="/guias">Guias</Link>
        </nav>
        <h1 className="guia-h1">{g.titulo}</h1>
        <p className="guia-data">Atualizado em {new Date(`${g.atualizado}T12:00:00`).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="guia-resumo">
          <strong>Resposta rápida</strong>
          <p>{g.resumo}</p>
        </div>

        <Link href={linkApp(g.cta)} className="btn btn-primary guia-cta-topo">{g.cta.texto} →</Link>

        {g.secoes.map(s => (
          <section key={s.titulo} className="guia-secao">
            <h2>{s.titulo}</h2>
            {s.paragrafos?.map((p, i) => <p key={i}>{p}</p>)}
            {s.lista && <ul>{s.lista.map((li, i) => <li key={i}>{li}</li>)}</ul>}
          </section>
        ))}

        <section className="guia-secao">
          <h2>Perguntas frequentes</h2>
          {g.faq.map(f => (
            <details key={f.p} className="guia-faq">
              <summary>{f.p}</summary>
              <p>{f.r}</p>
            </details>
          ))}
        </section>

        <div className="guia-cta">
          <p className="guia-cta-titulo">Pronto pra resolver?</p>
          <p>A gente escreve a reclamação com base no CDC em 3 minutos, pronta pra SAC, Reclame Aqui e Consumidor.gov. Grátis.</p>
          <Link href={linkApp(g.cta)} className="btn btn-primary">{g.cta.texto} →</Link>
          {loja && <p className="guia-cta-loja"><Link href={`/loja/${loja.id}`}>Ver reclamações e direitos sobre a {loja.name}</Link></p>}
        </div>

        {modelos.length > 0 && (
          <section className="guia-secao">
            <h2>Modelo pronto pra copiar</h2>
            <ul className="guia-outros">
              {modelos.map(m => <li key={m.slug}><Link href={`/modelos/${m.slug}`}>{m.titulo}</Link></li>)}
            </ul>
          </section>
        )}

        <p className="guia-aviso">
          Conteúdo informativo, com base no Código de Defesa do Consumidor (Lei 8.078/90). Não é assessoria jurídica:
          para casos complexos, procure um advogado ou a Defensoria Pública.
        </p>

        <section className="guia-secao">
          <h2>Outros guias</h2>
          <ul className="guia-outros">
            {outros.map(o => <li key={o.slug}><Link href={`/guias/${o.slug}`}>{o.titulo}</Link></li>)}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
