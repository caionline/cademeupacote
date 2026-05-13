import Link from "next/link";

export const metadata = {
  title: "Sobre — Cadê Meu Pacote",
  description:
    "A história, o manifesto e os princípios por trás do Cadê Meu Pacote. Ferramenta gratuita pra gerar reclamações com força de lei.",
};

const h2Style = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(22px, 3.5vw, 28px)",
  fontWeight: 700,
  letterSpacing: "-0.5px",
  marginTop: 48,
  marginBottom: 16,
};

const bodyStyle = {
  lineHeight: 1.7,
  color: "var(--text-muted)",
  fontSize: 16,
};

export default function SobrePage() {
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
            <a href="/ranking">Ranking</a>
            <a href="/#faq">FAQ</a>
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 96px" }}>

        {/* Título */}
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 20 }}>
          Sobre
        </h1>

        {/* Lead */}
        <p style={{ fontSize: 19, lineHeight: 1.5, color: "var(--text-muted)", marginBottom: 8 }}>
          O Cadê Meu Pacote nasceu da raiva. Mas virou ferramenta.
        </p>

        {/* Seção 1 */}
        <h2 style={h2Style}>A história</h2>
        <p style={bodyStyle}>
          Era pra ser uma compra simples. Várias unidades de um produto bacana, uma das maiores varejistas online do país. Aí veio o atraso. Depois o silêncio. Depois a promessa de reembolso que demorou semanas. Depois o cancelamento. Depois um atendente mal-educado que conseguiu, em algum lugar, me banir do app e do site. Foram meses entre SAC, Reclame Aqui (que prometeu cupom e desbanimento, fechou o caso sem entregar nada), Procon sem conciliação. No fim, abri Juizado Especial sozinho — sem advogado — e ganhei: ressarcimento + danos morais. Demorou. Cansou. Funcionou.
        </p>

        {/* Seção 2 */}
        <h2 style={h2Style}>O que aprendi com isso</h2>
        <p style={bodyStyle}>
          Que o consumidor brasileiro tem direito. Que existe um Código (CDC) bem feito do nosso lado. Que existe um sistema gratuito (Consumidor.gov, JEC) que funciona. E que 90% das pessoas não sabem disso, ou desistem no meio do caminho, porque ninguém te ensina como escrever uma reclamação que tem peso, e o tempo joga contra. A loja conta com seu cansaço.
        </p>

        {/* Seção 3 */}
        <h2 style={h2Style}>Por que esse site existe</h2>
        <p style={bodyStyle}>
          Porque ninguém deveria precisar de meses e de processo pra ter o que pagou. Porque escrever uma boa reclamação é metade da batalha — e a maioria das pessoas nem sabe por onde começar. O Cadê Meu Pacote pega seus dados básicos e a IA monta o texto em segundos: com base legal real, no tom certo pra cada canal, prontíssimo pra colar. SAC, Reclame Aqui, Consumidor.gov, e (em breve) peças prontas pro JEC.
        </p>

        {/* Seção 4 — Cards */}
        <h2 style={h2Style}>No que a gente acredita</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            {
              emoji: "🆓",
              title: "Grátis enquanto der",
              text: "O básico vai ser sempre grátis. Plano Pro existirá pra quem quiser peças mais robustas (JEC), mas reclamar nunca pode custar.",
            },
            {
              emoji: "🔒",
              title: "Sem cadastro, sem coleta abusiva",
              text: "Seus dados ficam no seu navegador. Só guardamos estatísticas anônimas pra mapear lojas problemáticas — nunca seu nome, CPF ou histórico.",
            },
            {
              emoji: "⚖️",
              title: "CDC na veia",
              text: "Cada texto gerado tem base legal real. Não é firula de ChatGPT — é Lei 8.078/90 aplicada ao seu caso concreto.",
            },
            {
              emoji: "📊",
              title: "Transparência radical",
              text: "Em breve, ranking público das lojas mais reclamadas. Dado é poder. O consumidor merece saber.",
            },
          ].map(({ emoji, title, text }) => (
            <div
              key={title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{emoji}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", marginBottom: 8 }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Seção 5 */}
        <h2 style={h2Style}>Quem está por trás</h2>
        <p style={bodyStyle}>
          Um projeto independente, sem investidor, sem agência, sem CNPJ por trás. Só alguém que se cansou de ver gente boa sendo passada pra trás por loja grande. Se quiser falar, manda email pra{" "}
          <a href="mailto:contato@cademeupacote.com.br" style={{ color: "var(--primary)" }}>
            contato@cademeupacote.com.br
          </a>{" "}
          — leio tudo.
        </p>

        {/* CTA Final */}
        <div style={{ marginTop: 48, background: "var(--primary-soft)", border: "1px solid var(--primary-border)", borderRadius: 18, padding: 32, textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 }}>
            Tá com problema agora?
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 16 }}>
            Bora resolver. 3 minutos, sem cadastro.
          </p>
          <Link href="/app" className="btn btn-primary" style={{ fontSize: 17, padding: "16px 32px" }}>
            Começar minha reclamação →
          </Link>
        </div>

      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="logo"><div className="logo-mark">📦</div>cademeupacote.com.br</div>
          <div className="footer-links">
            <a href="/sobre">Sobre</a>
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
