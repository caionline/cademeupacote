import Link from "next/link";
import { getTotalCasos } from "@/lib/db";
import { PROBLEMS, STORES } from "@/lib/constants";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { GUIAS } from "@/lib/guias";
import { jsonLd, seo, SITE } from "@/lib/seo";

export const revalidate = 300;

export const metadata = seo({
  titulo: "Cadê Meu Pacote: reclamação contra loja online com base no CDC, grátis",
  descricao: "Pedido atrasado, não entregue, cancelado, com defeito ou estorno que não caiu? Gere em 3 minutos a reclamação pronta pro SAC, Reclame Aqui, Consumidor.gov e Procon. Grátis.",
  caminho: "/",
});

const FAQ_HOME: { p: string; r: string }[] = [
  { p: "É grátis mesmo?", r: "É. A primeira reclamação, com os textos para SAC, Reclame Aqui e Consumidor.gov (ou Procon), é grátis e sem cadastro, e uma nova libera a cada 15 dias. O Pro (a partir de R$ 11,63/mês) é opcional: serve pra quem quer gerar sem esperar, ter o caso acompanhado, os prazos avisados e os próximos passos escritos." },
  { p: "Quem escreve a reclamação? É uma IA?", r: "É uma IA (o Claude, da Anthropic), orientada a escrever textos formais com base no Código de Defesa do Consumidor, usando os dados do seu pedido e o tipo de problema. A decisão de enviar é sempre sua: revise o texto antes de mandar." },
  { p: "A loja cancelou meu pedido (ou a promoção). Tem jeito?", r: "Às vezes sim. A oferta anunciada obriga a loja (art. 30 e 35 do CDC), e o site te ajuda a cobrar do jeito certo. Mas quando o erro de preço é muito absurdo, a Justiça costuma dar razão à loja. Ninguém pode garantir o resultado." },
  { p: "Preciso de CPF ou de conta?", r: "Não. O CPF é opcional no texto, mas é pedido em canais formais como Consumidor.gov, Procon e Juizado. A conta também é opcional: ela serve pra guardar seus casos em “Meus casos” e acompanhar cada um." },
  { p: "Vocês guardam meus dados?", r: "Sem conta, o rascunho fica no seu navegador e os dados do caso só passam pela IA pra gerar o texto. Com conta, guardamos seus casos pra você acompanhar. Não vendemos seus dados. Usamos alguns serviços pra funcionar (IA, envio de e-mail, medição de anúncios) e seguimos a LGPD. Os detalhes estão na política de privacidade." },
  { p: "E se a loja não responder?", r: "Você sobe um degrau: SAC, depois Reclame Aqui, depois os canais oficiais (Consumidor.gov.br ou o Procon do seu estado) e, por último, o Juizado Especial Cível. No Juizado não há custas na 1ª instância, e causas de até 20 salários mínimos dispensam advogado. Cada etapa aperta mais. No Pro, a gente conta os prazos e escreve o próximo texto pra você." },
  { p: "Qual a diferença entre Procon e Consumidor.gov?", r: "Os dois são gratuitos e oficiais. O Consumidor.gov.br é uma plataforma online do governo federal: você fala direto com a empresa, que tem 10 dias pra responder, mas só vale pra empresas cadastradas. O Procon é o órgão de defesa do consumidor do seu estado ou cidade: atende reclamações contra qualquer empresa, pode notificá-la, chamar pra uma audiência de conciliação e aplicar multas. Muitos Procons recebem reclamações pela internet. Se a loja não estiver no Consumidor.gov, vá direto ao Procon." },
  { p: "Vocês são advogados?", r: "Não. O Cadê meu pacote? é uma ferramenta de autoatendimento, não assessoria jurídica. Pra casos complexos, procure um advogado ou a Defensoria Pública." },
  { p: "Funciona pra lojas internacionais (Shein, AliExpress)?", r: "Funciona, com nuances. Quem vende para consumidores no Brasil, especialmente com operação aqui (como Shein e Shopee), segue o CDC. Com vendedores de fora em marketplaces, a reclamação ainda tem peso (a plataforma costuma intermediar), mas cobrar na Justiça pode ser mais difícil." },
];

const GUIAS_DESTAQUE = GUIAS.filter(g => [
  "loja-cancelou-pedido-promocao", "como-reclamar-da-shopee", "mercado-livre-compra-nao-chegou",
  "estorno-nao-caiu-prazo", "produto-com-defeito-troca-conserto-ou-dinheiro", "procon-como-reclamar",
].includes(g.slug));

const DADOS_ESTRUTURADOS = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cadê Meu Pacote",
    url: SITE,
    logo: `${SITE}/apple-icon`,
    email: "contato@cademeupacote.com.br",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cadê Meu Pacote",
    url: SITE,
    inLanguage: "pt-BR",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_HOME.map(f => ({ "@type": "Question", name: f.p, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  },
];


const LOJAS = STORES.filter(s => s.id !== "other" && !s.encerrada);
const PROBLEMAS = PROBLEMS.filter(p => p.id !== "other");

export default async function HomePage() {
  let totalCasos = 0;
  try {
    totalCasos = await getTotalCasos(30);
  } catch {}

  return (
    <>
      <a href="#pro" className="announce">
        <span className="announce-pill">Novo</span>
        <span className="announce-full">Acompanhamento do caso: a gente avisa cada prazo e escreve o próximo passo.</span>
        <span className="announce-short">Acompanhamento do caso, com aviso de prazo.</span>
        <span className="announce-link">Conhecer →</span>
      </a>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(DADOS_ESTRUTURADOS) }} />
      <SiteNav showRanking={totalCasos >= 50} />

      <header className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            Reclamação com base no CDC
          </div>
          <h1 className="hero-title">
            A loja não cumpriu?<br />
            <em>Cobre do jeito certo.</em>
          </h1>
          <p className="hero-sub">
            Em 3 minutos sua reclamação fica pronta, com base no Código de Defesa do Consumidor.
            Se a loja enrolar, a gente acompanha o caso, avisa cada prazo e escreve o próximo passo.
          </p>
          <ul className="hero-checks">
            <li>Atraso, extravio, defeito, estorno e pedido cancelado</li>
            <li>Tem print da compra? A IA lê e preenche pra você</li>
            <li>Grátis e sem cadastro pra começar</li>
            <li>Você revisa tudo antes de enviar</li>
          </ul>
          <div className="cta-row">
            <Link href="/app" className="btn btn-primary btn-lg">Gerar minha reclamação grátis →</Link>
            <a href="#como-funciona" className="btn btn-ghost btn-lg">Ver como funciona</a>
          </div>
          <p className="cta-micro">Leva 3 minutos · Shein, Shopee, Amazon, Mercado Livre e mais {LOJAS.length - 4} lojas, ou qualquer outra</p>
          <Link href="/sobre" className="founder">
            <span className="founder-avatar">⚖️</span>
            <span>
              <strong>Feito por quem venceu uma grande varejista no Juizado</strong>
              <span>Sozinho, sem advogado. Ler a história →</span>
            </span>
          </Link>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="mock-card">
            <div className="mock-head">
              <span className="mock-store">🛒</span>
              <div>
                <div className="mock-title">Pedido cancelado · Shopee</div>
                <div className="mock-sub">Caso aberto há 3 dias</div>
              </div>
              <span className="mock-status">Em andamento</span>
            </div>
            <ol className="mock-trilha">
              <li className="feito"><span>✓</span><div><strong>Reclamação enviada ao SAC</strong><small>com o Art. 35 do CDC</small></div></li>
              <li className="atual"><span>2</span><div><strong>Prazo do SAC vence em 2 dias</strong><small>A gente te avisa por e-mail</small></div></li>
              <li><span>3</span><div><strong>Reclame Aqui</strong><small>Texto pronto com o histórico</small></div></li>
              <li><span>4</span><div><strong>Consumidor.gov, Procon e Juizado</strong><small>Se ainda não resolver</small></div></li>
            </ol>
            <div className="mock-texto">
              <div className="mock-texto-label">Trecho gerado</div>
              “…nos termos do art. 35 do Código de Defesa do Consumidor, exijo o cumprimento da oferta
              no prazo de 10 dias…”
            </div>
          </div>
          <div className="float-chip float-chip-1">⚡ Texto pronto em segundos</div>
          <div className="float-chip float-chip-2">⏰ Lembrete: prazo vence amanhã</div>
        </div>
      </header>

      <section className="stats">
        <div className="stats-inner">
          <div><div className="stat-num">3 min</div><div className="stat-label">do problema à reclamação pronta</div></div>
          {totalCasos >= 100 ? (
            <div><div className="stat-num">{totalCasos.toLocaleString("pt-BR")}</div><div className="stat-label">reclamações geradas no último mês</div></div>
          ) : (
            <div><div className="stat-num">{PROBLEMS.length}</div><div className="stat-label">tipos de problema cobertos</div></div>
          )}
          <div><div className="stat-num">{LOJAS.length}</div><div className="stat-label">lojas com dicas específicas</div></div>
          <div><div className="stat-num">4</div><div className="stat-label">etapas de escalada, do SAC ao Juizado</div></div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-inner">
          <div className="section-kicker">O que a gente resolve</div>
          <h2 className="section-title">Escolha o seu problema. <em>A&nbsp;gente escreve o resto.</em></h2>
          <p className="section-sub">Cada tipo de problema tem um texto próprio, com os artigos do CDC certos pra ele.</p>
          <div className="prob-grid">
            {PROBLEMAS.map(p => (
              <Link key={p.id} href="/app" className="prob-card">
                <span className="prob-icon">{p.emoji}</span>
                <span className="prob-meta">
                  <strong>{p.title}</strong>
                  <small>{p.sub}</small>
                </span>
                <span className="prob-arrow">→</span>
              </Link>
            ))}
          </div>
          <Link href="/app" className="link-mais">Outro problema? Também dá pra resolver →</Link>
        </div>
      </section>

      <section className="sec sec-alt" id="como-funciona">
        <div className="sec-inner">
          <div className="section-kicker">Como funciona</div>
          <h2 className="section-title">Três passos. <em>Sem juridiquês.</em></h2>
          <p className="section-sub">Você conta o que aconteceu. A gente transforma em um texto firme, com base na lei.</p>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <h3>Conte o que aconteceu</h3>
              <ul>
                <li>Escolha a loja e o problema</li>
                <li>Data, valor e número do pedido</li>
                <li>Perguntas simples, sem jargão</li>
              </ul>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3>Receba o texto pronto</h3>
              <ul>
                <li>Artigos do CDC certos pro seu caso</li>
                <li>Prazo e exigência claros</li>
                <li>Um texto pra cada canal</li>
              </ul>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3>Envie e acompanhe</h3>
              <ul>
                <li>SAC, Reclame Aqui, Consumidor.gov ou Procon</li>
                <li>Salve o caso em “Meus casos”</li>
                <li>No Pro, a gente avisa cada prazo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="escalada">
        <div className="sec-inner escalation-inner">
          <div>
            <div className="section-kicker">Escalada</div>
            <h2 className="section-title">A loja conta com você desistir. <em>Não desista.</em></h2>
            <p className="section-sub">
              Comece leve e suba um degrau só se precisar. A maioria dos casos se resolve antes do último.
            </p>
            <Link href="/app" className="btn btn-primary">Começar pelo SAC →</Link>
          </div>
          <div className="ladder">
            <div className="rung hot">
              <div className="rung-dot">1</div>
              <div>
                <div className="rung-day">Hoje</div>
                <div className="rung-title">💬 SAC da loja</div>
                <div className="rung-meta">Começa leve. Muitos casos param aqui.</div>
              </div>
            </div>
            <div className="rung">
              <div className="rung-dot">2</div>
              <div>
                <div className="rung-day">Sem solução em 2 a 3 dias</div>
                <div className="rung-title">⚠️ Reclame Aqui</div>
                <div className="rung-meta">Reclamação pública. Lojas grandes cuidam da nota e costumam responder.</div>
              </div>
            </div>
            <div className="rung">
              <div className="rung-dot">3</div>
              <div>
                <div className="rung-day">Sem solução no Reclame Aqui (cerca de 10 dias)</div>
                <div className="rung-title">🏛️ Consumidor.gov.br ou Procon</div>
                <div className="rung-meta">Canais oficiais e grátis. No Consumidor.gov a empresa tem 10 dias pra responder. O Procon pode notificar a loja, chamar pra conciliação e aplicar multa.</div>
              </div>
            </div>
            <div className="rung">
              <div className="rung-dot">4</div>
              <div>
                <div className="rung-day">Último recurso</div>
                <div className="rung-title">⚖️ Juizado Especial Cível (JEC)</div>
                <div className="rung-meta">Sem custas na 1ª instância. Causas de até 20 salários mínimos dispensam advogado.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-alt" id="pro">
        <div className="sec-inner">
          <div className="section-kicker">Grátis × Pro</div>
          <h2 className="section-title">O primeiro texto é grátis. <em>O acompanhamento vai até o fim.</em></h2>
          <p className="section-sub">Use o grátis pra começar. O Pro é pra quando a loja enrola e você não quer perder nenhum prazo.</p>
          <div className="planos">
            <div className="plano">
              <div className="plano-nome">Grátis</div>
              <div className="plano-preco">R$ 0</div>
              <p className="plano-desc">Pra resolver na primeira tentativa. Uma nova a cada 15 dias.</p>
              <ul className="plano-lista">
                <li>1 reclamação completa com base no CDC em 3 minutos (nova a cada 15 dias)</li>
                <li>Textos para SAC, Reclame Aqui e Consumidor.gov ou Procon</li>
                <li>Casos salvos em “Meus casos” (com conta)</li>
                <li>Guia da escalada passo a passo</li>
              </ul>
              <Link href="/app" className="btn btn-ghost btn-block">Gerar minha reclamação →</Link>
            </div>
            <div className="plano plano-pro">
              <div className="plano-selo">A partir de R$ 11,63/mês</div>
              <div className="plano-nome">Pro · acompanhamento do caso</div>
              <p className="plano-desc">Pra quando a loja não resolve de primeira.</p>
              <ul className="plano-lista">
                <li>Reclamações sem espera de 15 dias</li>
                <li>A gente conta os prazos de cada etapa e te avisa quando vencem</li>
                <li>Próximo texto pronto, já com o histórico do caso</li>
                <li>Linha do tempo do caso: SAC, Reclame Aqui, Consumidor.gov ou Procon, Juizado</li>
                <li>Em breve: modelo de petição pro Juizado preenchido com seus dados</li>
              </ul>
              <Link href="/pro" className="btn btn-primary btn-block">Assinar o Pro →</Link>
              <p className="cta-micro" style={{ marginTop: 8 }}>Pix ou cartão · sem renovação automática · 7 dias pra desistir</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-inner sec-center">
          <div className="section-kicker">Lojas</div>
          <h2 className="section-title">A loja que te deixou <em>na mão.</em></h2>
          <p className="section-sub">{LOJAS.length} lojas com dicas específicas. A sua não está aqui? Funciona com qualquer loja.</p>
          <div className="store-grid">
            {LOJAS.map(s => (
              <Link key={s.id} href={`/loja/${s.id}`} className="store-chip">{s.emoji} {s.name}</Link>
            ))}
          </div>
          <Link href="/lojas" className="link-mais">Ver todas as lojas →</Link>
        </div>
      </section>

      <section className="sec">
        <div className="sec-inner">
          <div className="section-kicker">Guias e modelos</div>
          <h2 className="section-title">Seus direitos, <em>sem juridiquês.</em></h2>
          <p className="section-sub">Respostas diretas para os problemas mais comuns, com o que diz o CDC e o passo a passo.</p>
          <ul className="home-guias">
            {GUIAS_DESTAQUE.map(g => (
              <li key={g.slug}><Link href={`/guias/${g.slug}`}>{g.titulo} →</Link></li>
            ))}
          </ul>
          <div className="home-guias-links">
            <Link href="/guias" className="link-mais">Todos os guias →</Link>
            <Link href="/modelos" className="link-mais">Modelos de reclamação →</Link>
          </div>
        </div>
      </section>

      <section className="sec sec-alt" id="faq">
        <div className="sec-inner faq">
          <div className="section-kicker">Perguntas frequentes</div>
          <h2 className="section-title">Antes de começar, <em>tire suas dúvidas.</em></h2>
          {FAQ_HOME.map((f, i) => (
            <details key={f.p} open={i === 0}>
              <summary>{f.p}</summary>
              <p>{f.r}{f.p === "Vocês guardam meus dados?" && <> Veja a <Link href="/privacidade">política de privacidade</Link>.</>}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta-band" id="resolver">
        <h2>Pacote sumiu? Pedido cancelado? <em>Não deixe barato.</em></h2>
        <p>Sua reclamação com base no CDC, pronta em 3 minutos. Grátis e sem cadastro.</p>
        <Link href="/app" className="btn btn-primary btn-lg">Gerar minha reclamação grátis →</Link>
        <p className="cta-micro cta-micro-dark">Não é assessoria jurídica · você revisa antes de enviar</p>
      </section>

      <SiteFooter />
    </>
  );
}
