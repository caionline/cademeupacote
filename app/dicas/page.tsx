import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como reclamar e dar certo — 7 dicas práticas | Cadê Meu Pacote",
  description:
    "Dicas práticas pra reclamar de compra online: protocolo, CDC, prazos, escalada. Aumente suas chances de resolver rápido.",
};

const dicas = [
  {
    titulo: "Sempre pegue protocolo",
    texto:
      "Toda vez que falar com SAC, anote o número do protocolo. É a prova de que você tentou, e prazos só correm depois disso. Sem protocolo, a loja pode dizer que você nunca contatou.",
  },
  {
    titulo: "Guarde TODOS os comprovantes",
    texto:
      "Print da página do produto, do pedido, dos e-mails trocados, do chat com SAC, da nota fiscal. Tudo. Crie uma pasta no celular ou Drive. Se o caso escalar pro Procon ou JEC, essas evidências valem ouro.",
  },
  {
    titulo: "Dê prazo escrito, sempre",
    texto:
      "Em vez de 'estou aguardando uma solução', escreva 'aguardo retorno em até 7 dias úteis, sob pena de escalar pra órgãos competentes'. Prazo concreto + consequência = pressão real.",
  },
  {
    titulo: "Cite o artigo do CDC",
    texto:
      "Art. 18 (vício do produto), Art. 35 (descumprimento de oferta), Art. 49 (direito de arrependimento). Mencionar artigo específico mostra que você sabe seus direitos. Loja respeita mais.",
  },
  {
    titulo: "Não aceite a primeira resposta",
    texto:
      "O primeiro atendente é treinado pra fechar o caso rápido, geralmente com solução pior pra você. Se a proposta não te atende, peça pra falar com supervisor ou recuse e escale.",
  },
  {
    titulo: "Reclame Aqui resolve mais do que parece",
    texto:
      "Lojas grandes (Magalu, Amazon, Mercado Livre) monitoram o score público obsessivamente. Uma reclamação bem feita no Reclame Aqui geralmente é respondida em 24–48h, e bem.",
  },
  {
    titulo: "Quando ir pro Juizado Especial",
    texto:
      "Se passou 30 dias sem solução e o valor é até 20 salários mínimos, abre JEC. Não precisa advogado, não tem custas iniciais. A loja é obrigada a comparecer ou perde por revelia. É menos assustador do que parece.",
  },
];

export default function DicasPage() {
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
            <Link href="/dicas" style={{ color: "var(--primary)", fontWeight: 600 }}>Dicas</Link>
            <a href="/#faq">FAQ</a>
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px 80px" }}>
        <div className="section-kicker" style={{ marginBottom: 16 }}>Guia prático</div>
        <h1 style={{
          fontFamily:    "var(--font-display)",
          fontSize:      "clamp(28px, 5vw, 40px)",
          fontWeight:    700,
          letterSpacing: "-0.5px",
          lineHeight:    1.2,
          marginBottom:  20,
        }}>
          Como reclamar e dar certo: 7 dicas que ninguém te ensina
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 52 }}>
          Saber escrever a reclamação é metade da batalha. Estas são as práticas que separam quem resolve em 1 semana de quem fica meses dando voltas.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          {dicas.map((dica, i) => (
            <div key={i}>
              <h2 style={{
                fontFamily:    "var(--font-display)",
                fontSize:      22,
                fontWeight:    700,
                letterSpacing: "-0.3px",
                marginBottom:  10,
                display:       "flex",
                alignItems:    "baseline",
                gap:           10,
              }}>
                <span style={{
                  color:      "var(--primary)",
                  fontFamily: "var(--font)",
                  fontSize:   14,
                  fontWeight: 700,
                  minWidth:   24,
                }}>
                  {i + 1}.
                </span>
                {dica.titulo}
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.75, paddingLeft: 34 }}>
                {dica.texto}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background:    "var(--primary-soft)",
          border:        "1px solid var(--primary-border)",
          borderRadius:  20,
          padding:       32,
          textAlign:     "center",
          marginTop:     64,
        }}>
          <p style={{
            fontFamily:    "var(--font-display)",
            fontSize:      22,
            fontWeight:    700,
            letterSpacing: "-0.3px",
            marginBottom:  8,
          }}>
            Pronto pra escrever a sua?
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 24 }}>
            3 minutos, sem cadastro.
          </p>
          <Link href="/app" className="btn btn-primary" style={{ fontSize: 16, padding: "14px 28px" }}>
            Gerar minha reclamação →
          </Link>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="logo"><div className="logo-mark">📦</div>cademeupacote.com.br</div>
          <div className="footer-links">
            <a href="/sobre">Sobre</a>
            <a href="/dicas">Dicas</a>
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
