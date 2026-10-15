import Link from "next/link";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { seo } from "@/lib/seo";

export const metadata = seo({
  titulo: "Termos de Uso | Cadê Meu Pacote",
  descricao: "Termos de uso do Cadê Meu Pacote: o que a ferramenta faz, limites de uso, plano Pro, direito de arrependimento e uso adequado.",
  caminho: "/termos",
});

const secoes: { titulo: string; paragrafos: string[] }[] = [
  {
    titulo: "1. O que o Cadê Meu Pacote faz",
    paragrafos: [
      "O Cadê Meu Pacote é uma ferramenta de autoatendimento que ajuda consumidores a escrever reclamações com base no Código de Defesa do Consumidor (Lei 8.078/90) e a acompanhar seus casos.",
      "Não somos escritório de advocacia, não prestamos assessoria ou consultoria jurídica, não representamos ninguém perante empresas, órgãos ou a Justiça e não garantimos o resultado de nenhuma reclamação. Para casos complexos, procure um advogado ou a Defensoria Pública.",
    ],
  },
  {
    titulo: "2. Textos gerados por inteligência artificial",
    paragrafos: [
      "Os textos são sugestões geradas por inteligência artificial a partir das informações que você fornece. Eles podem conter erros ou imprecisões.",
      "Você é responsável por conferir as informações, revisar o texto e decidir se e onde enviá-lo (SAC, Reclame Aqui, Consumidor.gov, Procon, Juizado ou outro canal).",
    ],
  },
  {
    titulo: "3. Uso grátis e limites",
    paragrafos: [
      "Gerar reclamações é grátis. Para evitar abuso e manter o serviço no ar, há um limite diário de uso: hoje, 5 reclamações por dia sem conta e 15 com conta. Os limites podem mudar.",
    ],
  },
  {
    titulo: "4. Conta",
    paragrafos: [
      "A conta é opcional e serve para guardar e acompanhar seus casos. O acesso é feito por link enviado ao seu e-mail (ou login com Google, quando disponível). Mantenha o acesso ao seu e-mail seguro.",
      "Você pode apagar seus casos a qualquer momento em \"Meus casos\" e pedir a exclusão da conta pelo e-mail de contato.",
    ],
  },
  {
    titulo: "5. Plano Pro",
    paragrafos: [
      "O Pro é um plano pago e opcional de acompanhamento de casos (linha do tempo, avisos de prazo e próximo texto com o histórico). Os planos, preços e duração aparecem na página do Pro no momento da compra.",
      "O pagamento é único, por Pix ou cartão, processado pelo Mercado Pago. Não há renovação automática: avisamos por e-mail antes do vencimento, e você decide se quer renovar. Renovando antes do fim, os dias se somam.",
      "Direito de arrependimento: se desistir em até 7 dias da compra, devolvemos 100% do valor (CDC, art. 49). Basta escrever para o e-mail de contato.",
      "Funcionalidades anunciadas como \"em breve\" ainda não fazem parte do plano até serem lançadas.",
    ],
  },
  {
    titulo: "6. Uso adequado",
    paragrafos: [
      "É proibido usar a plataforma para gerar reclamações falsas, difamatórias ou com o objetivo de causar dano injusto a empresas ou pessoas, assim como tentar burlar os limites de uso ou atacar o serviço. O CDC protege o consumidor real, não a má-fé.",
      "Podemos suspender o acesso de quem descumprir estes termos.",
    ],
  },
  {
    titulo: "7. Privacidade",
    paragrafos: [
      "O tratamento dos seus dados segue a Lei Geral de Proteção de Dados (LGPD) e está descrito na Política de Privacidade.",
    ],
  },
  {
    titulo: "8. Alterações",
    paragrafos: [
      "Estes termos podem ser atualizados. A versão vigente fica sempre nesta página, com a data da última atualização. Mudanças relevantes para quem tem conta serão avisadas por e-mail.",
    ],
  },
];

export default function TermosPage() {
  return (
    <>
      <SiteNav />
      <main className="guia">
        <h1 className="guia-h1">Termos de Uso</h1>
        <p className="guia-data">Última atualização: 15 de outubro de 2026.</p>
        <p className="guia-intro">Ao usar o Cadê Meu Pacote, você concorda com os termos abaixo. Escrevemos em linguagem simples de propósito.</p>
        {secoes.map(s => (
          <section key={s.titulo} className="guia-secao">
            <h2>{s.titulo}</h2>
            {s.paragrafos.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}
        <p className="guia-intro" style={{ marginTop: 32 }}>
          Dúvidas? Escreva para <a href="mailto:contato@cademeupacote.com.br" style={{ color: "var(--primary)" }}>contato@cademeupacote.com.br</a>.
          Veja também a <Link href="/privacidade" style={{ color: "var(--primary)" }}>Política de Privacidade</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
