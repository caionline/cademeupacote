import Link from "next/link";
import AuthNav from "./AuthNav";

/** Topo + rodapé padrão das páginas de conta. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="site-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-mark">📦</div>
            Cadê meu pacote?
          </Link>
          <div className="nav-links">
            <AuthNav />
            <Link href="/app" className="nav-cta">Resolver agora →</Link>
          </div>
        </div>
      </nav>
      <main className="conta-main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="logo"><div className="logo-mark">📦</div>cademeupacote.com.br</div>
          <div className="footer-links">
            <a href="/termos">Termos</a>
            <a href="/privacidade">Privacidade</a>
            <a href="/contato">Contato</a>
          </div>
          <div className="footer-meta">© {new Date().getFullYear()} · feito com 🧡 e CDC</div>
        </div>
      </footer>
    </>
  );
}
