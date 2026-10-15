import Link from "next/link";
import AuthNav from "./AuthNav";

type Ativo = "como-funciona" | "pro" | "lojas" | "dicas" | "sobre" | "ranking";

/** Topo padrão de todas as páginas. `ativo` destaca o link da página atual. */
export default function SiteNav({ ativo, showRanking = false }: { ativo?: Ativo; showRanking?: boolean }) {
  const cls = (id: Ativo) => (ativo === id ? "nav-ativo" : undefined);
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link href="/" className="logo">
          <div className="logo-mark">📦</div>
          Cadê meu pacote?
        </Link>
        <div className="nav-links">
          <a href="/#como-funciona" className={cls("como-funciona")}>Como funciona</a>
          <a href="/#pro" className={cls("pro")}>Acompanhamento</a>
          <Link href="/lojas" className={cls("lojas")}>Lojas</Link>
          <Link href="/dicas" className={cls("dicas")}>Dicas</Link>
          {(showRanking || ativo === "ranking") && <Link href="/ranking" className={cls("ranking")}>Ranking</Link>}
          <Link href="/sobre" className={cls("sobre")}>Sobre</Link>
          <AuthNav />
          <Link href="/app" className="nav-cta">Gerar reclamação →</Link>
        </div>
      </div>
    </nav>
  );
}
