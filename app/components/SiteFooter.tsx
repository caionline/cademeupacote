import Link from "next/link";

/** Rodapé padrão de todas as páginas. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="logo"><div className="logo-mark">📦</div>Cadê meu pacote?</Link>
          <p>
            Reclamação com base no Código de Defesa do Consumidor em 3 minutos. E, se a loja enrolar,
            acompanhamento do caso até o fim.
          </p>
        </div>
        <div className="footer-cols">
          <div>
            <div className="footer-col-titulo">Produto</div>
            <Link href="/app">Gerar reclamação</Link>
            <Link href="/meus-casos">Meus casos</Link>
            <a href="/#pro">Acompanhamento (Pro)</a>
          </div>
          <div>
            <div className="footer-col-titulo">Conteúdo</div>
            <Link href="/dicas">Dicas</Link>
            <Link href="/guias">Guias</Link>
            <Link href="/lojas">Lojas</Link>
            <Link href="/ranking">Ranking</Link>
          </div>
          <div>
            <div className="footer-col-titulo">Sobre</div>
            <Link href="/sobre">Nossa história</Link>
            <Link href="/contato">Contato</Link>
            <Link href="/termos">Termos</Link>
            <Link href="/privacidade">Privacidade</Link>
          </div>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} Cadê meu pacote? · feito com 🧡 e CDC</span>
        <span>Ferramenta de autoatendimento. Não é assessoria jurídica.</span>
      </div>
    </footer>
  );
}
