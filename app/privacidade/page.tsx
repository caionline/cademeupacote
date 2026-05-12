import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — Cadê Meu Pacote",
};

export default function PrivacidadePage() {
  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-mark">📦</div>
            Cadê meu pacote?
          </Link>
          <div className="nav-links">
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 96px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 8 }}>
          Política de Privacidade
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 48 }}>Última atualização: abril de 2026.</p>

        <p style={{ marginBottom: 32, lineHeight: 1.7, color: "var(--text-muted)" }}>
          Sua privacidade é prioridade. Esta política explica como tratamos seus dados.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>1. DADOS QUE COLETAMOS</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>Quando você usa o Cadê Meu Pacote, processamos:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Dados que você digita no formulário (nome, CPF opcional, detalhes da compra, problema relatado)</li>
            <li>E-mail (apenas se você optar por receber lembrete em 7 dias — totalmente opcional)</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>1b. ESTATÍSTICAS ANÔNIMAS</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            Ao gerar uma reclamação, coletamos dados <strong>100% anônimos</strong> para mapear quais lojas acumulam mais reclamações e que tipos de problemas são mais frequentes. Esses dados alimentam o Ranking público de lojas do site.
          </p>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>O que coletamos de forma anônima:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Identificador da loja (ex: "shein", "amazon")</li>
            <li>Tipo de problema (ex: "pedido atrasou", "produto errado")</li>
            <li>Faixa de valor da compra (ex: "R$ 200–500") — nunca o valor exato</li>
            <li>Timestamp da reclamação</li>
          </ul>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>O que <strong>não</strong> coletamos nessa etapa:</p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Seu nome ou CPF</li>
            <li>O texto da reclamação gerada</li>
            <li>Seu email (o email é coletado <em>apenas</em> se você solicitar o lembrete de 7 dias)</li>
            <li>Qualquer dado que permita identificar você individualmente</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>2. COMO USAMOS</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Os dados do formulário são enviados à API da Anthropic (Claude) para gerar o texto da reclamação. A Anthropic não treina modelos com esses dados (configuração padrão do produto).</li>
            <li>O e-mail (se fornecido) é usado exclusivamente para enviar o lembrete acordado. Não vendemos, não compartilhamos, não usamos para spam.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>3. ARMAZENAMENTO</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Dados do formulário NÃO são armazenados em nossos servidores. Ficam apenas no seu navegador (localStorage) para você não perder o rascunho, e são apagados quando você limpa os dados do site.</li>
            <li>E-mails capturados ficam armazenados em ferramenta de e-mail marketing.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>4. SEUS DIREITOS (LGPD)</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>Você pode solicitar a qualquer momento:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)" }}>
            <li>Acesso aos seus dados</li>
            <li>Correção</li>
            <li>Exclusão</li>
            <li>Portabilidade</li>
          </ul>
          <p style={{ marginTop: 12, lineHeight: 1.7, color: "var(--text-muted)" }}>
            Para exercer esses direitos, escreva para <a href="mailto:contato@cademeupacote.com.br" style={{ color: "var(--primary)" }}>contato@cademeupacote.com.br</a>.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>5. COOKIES</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            Não usamos cookies de rastreamento. Apenas armazenamento local do navegador para guardar seu rascunho.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="logo"><div className="logo-mark">📦</div>cademeupacote.com.br</div>
          <div className="footer-links">
            <a href="/termos">Termos</a>
            <a href="/privacidade">Privacidade</a>
            <a href="/contato">Contato</a>
          </div>
          <div className="footer-meta">© 2026 · feito com 🧡 e CDC</div>
        </div>
      </footer>
    </>
  );
}
