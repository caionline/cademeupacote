import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { MODELOS, getModelo } from "@/lib/modelos";
import { getGuia } from "@/lib/guias";
import { jsonLd, seo, SITE } from "@/lib/seo";
import CopiarModelo from "../CopiarModelo";

export function generateStaticParams() {
  return MODELOS.map(m => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getModelo(slug);
  if (!m) return {};
  return seo({ titulo: m.tituloSeo, descricao: m.descricao, caminho: `/modelos/${m.slug}`, tipo: "article" });
}

export default async function ModeloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getModelo(slug);
  if (!m) notFound();

  const guia = m.guia ? getGuia(m.guia) : undefined;
  const gerar = m.problema ? `/app?problema=${m.problema}` : "/app";
  const outros = MODELOS.filter(x => x.slug !== m.slug);

  const dados = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: m.titulo,
      description: m.descricao,
      inLanguage: "pt-BR",
      mainEntityOfPage: `${SITE}/modelos/${m.slug}`,
      publisher: { "@type": "Organization", name: "Cadê Meu Pacote", url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: m.faq.map(f => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Modelos de reclamação", item: `${SITE}/modelos` },
        { "@type": "ListItem", position: 3, name: m.titulo, item: `${SITE}/modelos/${m.slug}` },
      ],
    },
  ];

  return (
    <>
      <SiteNav ativo="dicas" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(dados) }} />

      <main className="guia">
        <nav className="guia-trilha" aria-label="Você está em">
          <Link href="/">Início</Link> › <Link href="/modelos">Modelos de reclamação</Link>
        </nav>
        <h1 className="guia-h1">{m.titulo}</h1>
        <p className="guia-intro">{m.quando} Copie o modelo abaixo e troque o que está entre [colchetes] pelos seus dados.</p>

        <div className="guia-resumo">
          <strong>Prefere pronto e personalizado?</strong>
          <p>O Cadê Meu Pacote escreve a sua reclamação com os dados do seu pedido em 3 minutos, já adaptada pro SAC, Reclame Aqui, Consumidor.gov e Procon. Dá até pra mandar só o print.</p>
        </div>
        <Link href={gerar} className="btn btn-primary guia-cta-topo">Gerar a minha reclamação grátis →</Link>

        <CopiarModelo texto={m.modelo} />

        <section className="guia-secao">
          <h2>Dicas pra reclamação funcionar</h2>
          <ul>{m.dicas.map((d, i) => <li key={i}>{d}</li>)}</ul>
        </section>

        <section className="guia-secao">
          <h2>Onde enviar, nesta ordem</h2>
          <ul>
            <li><b>SAC da loja</b>: chat, WhatsApp ou e-mail oficial. Anote o protocolo.</li>
            <li><b>Reclame Aqui</b>: reclamação pública, que pesa na reputação da loja.</li>
            <li><b>Consumidor.gov.br ou Procon</b>: canais oficiais e grátis. No Consumidor.gov a empresa tem 10 dias para responder.</li>
            <li><b>Juizado Especial Cível</b>: sem custas na 1ª instância e, até 20 salários mínimos, sem advogado.</li>
          </ul>
        </section>

        <section className="guia-secao">
          <h2>Perguntas frequentes</h2>
          {m.faq.map(f => (
            <details key={f.p} className="guia-faq">
              <summary>{f.p}</summary>
              <p>{f.r}</p>
            </details>
          ))}
        </section>

        {guia && (
          <p className="guia-intro" style={{ marginTop: 28 }}>
            Guia completo: <Link href={`/guias/${guia.slug}`}>{guia.titulo}</Link>
          </p>
        )}

        <div className="guia-cta">
          <p className="guia-cta-titulo">Quer o texto já com os seus dados?</p>
          <p>Conte o que aconteceu (ou mande o print) e receba a reclamação pronta, com o artigo certo do CDC pro seu caso. Grátis.</p>
          <Link href={gerar} className="btn btn-primary">Gerar minha reclamação →</Link>
        </div>

        <p className="guia-aviso">
          Modelo informativo, com base no Código de Defesa do Consumidor (Lei 8.078/90). Não é assessoria jurídica:
          para casos complexos, procure um advogado ou a Defensoria Pública.
        </p>

        <section className="guia-secao">
          <h2>Outros modelos</h2>
          <ul className="guia-outros">
            {outros.map(o => <li key={o.slug}><Link href={`/modelos/${o.slug}`}>{o.titulo}</Link></li>)}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
