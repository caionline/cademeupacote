import Link from "next/link";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import type { Metadata } from "next";
import { GUIAS } from "@/lib/guias";
import { seo } from "@/lib/seo";

export const metadata = seo({
  titulo: "Como reclamar de uma loja e dar certo: 8 dicas práticas | Cadê Meu Pacote",
  descricao: "Protocolo, prazo por escrito, artigo certo do CDC, Reclame Aqui, Consumidor.gov, Procon e Juizado: 8 dicas pra resolver sua reclamação mais rápido.",
  caminho: "/dicas",
});

const dicas = [
  {
    titulo: "Sempre pegue protocolo",
    texto:
      "Toda vez que falar com o SAC, anote o número do protocolo e a data. É a prova de que você tentou resolver. Em caso de defeito, a reclamação comprovada ainda suspende o prazo pra reclamar (CDC, art. 26, § 2º).",
  },
  {
    titulo: "Guarde TODOS os comprovantes",
    texto:
      "Print da página do produto, do pedido, dos e-mails trocados, do chat com SAC, da nota fiscal. Tudo. Crie uma pasta no celular ou Drive. Se o caso escalar pro Procon ou JEC, essas evidências valem ouro.",
  },
  {
    titulo: "Dê prazo escrito, sempre",
    texto:
      "Em vez de 'estou aguardando uma solução', escreva 'aguardo retorno em até 48 horas; sem solução, vou registrar no Consumidor.gov e no Procon'. Prazo concreto + consequência = pressão real.",
  },
  {
    titulo: "Cite o artigo do CDC",
    texto:
      "Art. 18 (produto com defeito), Arts. 30 e 35 (oferta não cumprida, atraso, cancelamento), Art. 49 (direito de arrependimento). Citar o artigo certo mostra que você conhece seus direitos.",
  },
  {
    titulo: "Não aceite a primeira resposta",
    texto:
      "O primeiro atendente é treinado pra fechar o caso rápido, geralmente com solução pior pra você. Se a proposta não te atende, peça pra falar com supervisor ou recuse e escale.",
  },
  {
    titulo: "Reclame Aqui resolve mais do que parece",
    texto:
      "Lojas grandes acompanham de perto a nota pública no Reclame Aqui. Uma reclamação objetiva, com datas e o que você quer, costuma ser respondida rápido. Não é órgão oficial, mas a pressão da reputação funciona.",
  },
  {
    titulo: "Use os canais oficiais: Consumidor.gov e Procon",
    texto:
      "Os dois são grátis. No Consumidor.gov.br a empresa cadastrada tem 10 dias pra responder. O Procon do seu estado atende qualquer empresa, pode notificar a loja, marcar audiência de conciliação e aplicar multa. Se a loja não estiver no Consumidor.gov, vá ao Procon.",
  },
  {
    titulo: "Quando ir pro Juizado Especial",
    texto:
      "Se os outros canais não resolveram, o Juizado Especial Cível é o último degrau. Não há custas na 1ª instância e, em causas de até 20 salários mínimos, não precisa de advogado. Se a loja não comparecer à audiência, pode ser julgada à revelia. É menos assustador do que parece.",
  },
];

export default function DicasPage() {
  return (
    <>
      <SiteNav ativo="dicas" />

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
          Como reclamar e dar certo: 8 dicas que ninguém te ensina
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
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Guias completos</h2>
          <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {GUIAS.map(g => (
              <li key={g.slug}><Link href={`/guias/${g.slug}`} style={{ color: "var(--primary)", fontWeight: 600 }}>{g.titulo}</Link></li>
            ))}
          </ul>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
