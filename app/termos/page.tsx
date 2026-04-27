import Link from "next/link";

export const metadata = {
  title: "Termos de Uso — Cadê Meu Pacote",
};

export default function TermosPage() {
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
          Termos de Uso
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 48 }}>Última atualização: abril de 2026.</p>

        <p style={{ marginBottom: 32, lineHeight: 1.7, color: "var(--text-muted)" }}>
          Bem-vindo ao Cadê Meu Pacote. Ao usar este serviço, você concorda com os termos abaixo.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>1. O QUE OFERECEMOS</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            O Cadê Meu Pacote é uma ferramenta gratuita que ajuda consumidores a redigir reclamações com base no Código de Defesa do Consumidor. Não somos um escritório de advocacia, não oferecemos representação jurídica e não garantimos resolução do seu caso.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>2. RESPONSABILIDADE</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            Os textos gerados são sugestões automatizadas baseadas nos dados que você fornece. Você é responsável por revisar o conteúdo antes de enviar à loja, ao Reclame Aqui, ao Consumidor.gov ou a qualquer outro canal.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>3. USO ADEQUADO</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            É proibido usar a plataforma para gerar reclamações falsas, difamatórias ou com intuito de causar dano injusto a empresas. O CDC protege o consumidor real, não a má-fé.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>4. PLANO PRO (FUTURO)</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            Funcionalidades premium podem ser oferecidas no futuro mediante pagamento, com termos específicos no momento da contratação.
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.2px" }}>5. ALTERAÇÕES</h2>
          <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
            Estes termos podem ser atualizados a qualquer momento. A versão vigente está sempre nesta página.
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
