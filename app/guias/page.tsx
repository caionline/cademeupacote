import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { GUIAS } from "@/lib/guias";
import { seo } from "@/lib/seo";

export const metadata = seo({
  titulo: "Guias: como reclamar de compra online e conhecer seus direitos | Cadê Meu Pacote",
  descricao: "Passo a passo para reclamar de Shopee, Mercado Livre, Shein, Amazon e outras lojas: atraso, defeito, estorno, pedido cancelado, Procon e Juizado Especial.",
  caminho: "/guias",
});

export default function GuiasPage() {
  return (
    <>
      <SiteNav ativo="dicas" />
      <main className="guia">
        <div className="section-kicker" style={{ marginBottom: 16 }}>Guias</div>
        <h1 className="guia-h1">Seus direitos em compras online, explicados sem juridiquês</h1>
        <p className="guia-intro">Respostas diretas para os problemas mais comuns, com o que diz o Código de Defesa do Consumidor e o passo a passo pra resolver.</p>
        <ul className="guias-lista">
          {GUIAS.map(g => (
            <li key={g.slug}>
              <Link href={`/guias/${g.slug}`}>
                <strong>{g.titulo}</strong>
                <span>{g.descricao}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="guia-intro" style={{ marginTop: 40 }}>
          Quer dicas rápidas? Veja também <Link href="/dicas">8 dicas pra reclamar e dar certo</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
