import Link from "next/link";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { MODELOS } from "@/lib/modelos";
import { seo } from "@/lib/seo";

export const metadata = seo({
  titulo: "Modelos de reclamação prontos pra copiar (atraso, defeito, estorno...) | Cadê Meu Pacote",
  descricao: "Modelos de reclamação com base no CDC para copiar e enviar: atraso na entrega, produto não entregue, defeito, pedido cancelado, estorno, produto errado e arrependimento.",
  caminho: "/modelos",
});

export default function ModelosPage() {
  return (
    <>
      <SiteNav ativo="dicas" />
      <main className="guia">
        <div className="section-kicker" style={{ marginBottom: 16 }}>Modelos</div>
        <h1 className="guia-h1">Modelos de reclamação prontos pra copiar</h1>
        <p className="guia-intro">
          Escolha o seu problema, copie o modelo e troque o que está entre [colchetes] pelos seus dados. Cada modelo cita o
          artigo certo do Código de Defesa do Consumidor. Se preferir, a gente escreve a sua já personalizada, grátis.
        </p>
        <ul className="guias-lista">
          {MODELOS.map(m => (
            <li key={m.slug}>
              <Link href={`/modelos/${m.slug}`}>
                <strong>{m.titulo}</strong>
                <span>{m.quando}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="guia-cta">
          <p className="guia-cta-titulo">Prefere pronto e personalizado?</p>
          <p>Conte o que aconteceu (ou mande o print) e receba em 3 minutos a reclamação pronta pro SAC, Reclame Aqui, Consumidor.gov e Procon.</p>
          <Link href="/app" className="btn btn-primary">Gerar minha reclamação grátis →</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
