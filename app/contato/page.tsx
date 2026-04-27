import Link from "next/link";

export const metadata = {
  title: "Contato — Cadê Meu Pacote",
};

export default function ContatoPage() {
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
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 48 }}>
          Contato
        </h1>

        <p style={{ lineHeight: 1.7, color: "var(--text-muted)", marginBottom: 32 }}>
          Precisa falar com a gente? Estamos aqui.
        </p>

        <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 32 }}>
          📧 <a href="mailto:contato@cademeupacote.com.br" style={{ color: "var(--primary)" }}>contato@cademeupacote.com.br</a>
        </p>

        <p style={{ lineHeight: 1.7, color: "var(--text-muted)", marginBottom: 16 }}>Use este canal para:</p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.9, color: "var(--text-muted)", marginBottom: 32 }}>
          <li>Reportar bugs</li>
          <li>Sugerir melhorias ou novas lojas</li>
          <li>Tirar dúvidas sobre o serviço</li>
          <li>Imprensa e parcerias</li>
        </ul>

        <p style={{ lineHeight: 1.7, color: "var(--text-muted)" }}>
          Respondemos normalmente em até 48h úteis.
        </p>
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
