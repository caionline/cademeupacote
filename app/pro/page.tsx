import SiteShell from "@/app/components/SiteShell";
import { getUsuario } from "@/lib/supabase/server";
import { ehPro } from "@/lib/pro";
import { PLANOS_PUBLICOS, planoValido, type Plano } from "@/lib/planos";
import Assinar from "./Assinar";
import { seo } from "@/lib/seo";

export const metadata = seo({
  titulo: "Cadê Meu Pacote Pro: acompanhamento do seu caso até resolver",
  descricao: "Prazos, lembretes, análise da resposta da loja e o próximo texto pronto em cada etapa: SAC, Reclame Aqui, Consumidor.gov, Procon e Juizado. 7 dias de garantia.",
  caminho: "/pro",
});

const FAQ = [
  { p: "E se a loja resolver logo no primeiro dia?", r: "Ótimo! Se foi na primeira semana, você pode pedir a devolução de 100% (temos 7 dias de garantia). Se preferir, o Pro continua valendo para os próximos casos até o fim do período." },
  { p: "Renova sozinho? Como cancelo?", r: "Não renova sozinho. É um pagamento único por 30 ou 90 dias. Quando estiver perto de vencer, a gente avisa por e-mail e você decide. Não há nada para cancelar." },
  { p: "Quantos casos posso acompanhar?", r: "Quantos precisar, de qualquer loja. Só existe um limite diário de uso da IA para evitar abuso, que uma pessoa normal não chega perto." },
  { p: "Vocês entram com a reclamação ou a ação por mim?", r: "Não. O Cadê Meu Pacote é uma ferramenta de autoatendimento: a gente prepara os textos, conta os prazos e orienta o próximo passo, e você envia. Não prestamos assessoria jurídica." },
  { p: "Quais formas de pagamento?", r: "Pix ou cartão, pelo Mercado Pago. O Pro é liberado na hora em que o pagamento é aprovado." },
];

export default async function ProPage({ searchParams }: { searchParams: Promise<{ plano?: string; erro?: string }> }) {
  const { plano, erro } = await searchParams;
  const u = await getUsuario();
  const proAte = ehPro(u?.perfil?.pro_ate) ? u!.perfil!.pro_ate! : null;
  const planos: Plano[] = PLANOS_PUBLICOS;
  const inicial: Plano = planoValido(plano) && planos.includes(plano) ? plano : planos[0];

  return (
    <SiteShell>
      <div className="pro-pagina">
        <span className="pro-selo">Cadê Meu Pacote Pro</span>
        <h1 className="conta-h1">A loja não resolveu de primeira? <em>A gente vai até o fim com você.</em></h1>
        <p className="conta-sub">A maioria das reclamações morre no SAC porque o consumidor cansa. O Pro acompanha cada caso, avisa os prazos e entrega o próximo texto pronto, até você ter seu dinheiro ou seu produto.</p>

        <div className="pro-garantia">🛡️ <b>7 dias de garantia:</b> não gostou, devolvemos 100%. Sem renovação automática.</div>

        {erro && <div className="conta-erro">O pagamento não foi concluído. Você pode tentar de novo, de preferência com Pix.</div>}
        {proAte && (
          <div className="pro-ativo">
            ✓ Seu Pro está ativo até <b>{new Date(proAte).toLocaleDateString("pt-BR")}</b>. Se renovar agora, os dias se somam.
          </div>
        )}

        <Assinar logado={!!u} planos={planos} planoInicial={inicial} />

        <section className="pro-bloco">
          <h2>O que você ganha</h2>
          <ul className="pro-lista pro-lista-grande">
            <li><span>🗺️</span> <b>Linha do tempo de cada caso:</b> SAC → Reclame Aqui → Consumidor.gov ou Procon → Juizado</li>
            <li><span>⏰</span> <b>Aviso por e-mail</b> quando o prazo da loja vence, pra você não deixar o caso esfriar</li>
            <li><span>✍️</span> <b>Próximo texto pronto</b>, já com o histórico do caso: cada etapa mais forte que a anterior</li>
            <li><span>💬</span> <b>A loja respondeu?</b> A gente diz se é enrolação, o que você pode exigir e escreve sua resposta</li>
            <li><span>📊</span> <b>Painel</b> com todos os casos, o valor em disputa e os prazos vencidos</li>
            <li><span>⚖️</span> <b>Em breve:</b> modelo de petição pro Juizado Especial preenchido com seus dados</li>
          </ul>
        </section>

        <section className="pro-bloco">
          <h2>Como fica na prática</h2>
          <p className="pro-exemplo-intro">Exemplo de um caso de pedido cancelado:</p>
          <ol className="pro-exemplo">
            <li><span className="pro-exemplo-dia">Dia 1</span><div><b>Reclamação no SAC</b> enviada com o art. 35 do CDC. Você clica em “Já enviei” e a gente começa a contar o prazo.</div></li>
            <li><span className="pro-exemplo-dia">Dia 2</span><div><b>A loja oferece um cupom</b> no lugar do reembolso. Você cola a resposta: a gente avisa que cupom não substitui o dinheiro e escreve a recusa.</div></li>
            <li><span className="pro-exemplo-dia">Dia 4</span><div><b>Prazo vencido sem solução.</b> Chega o e-mail e o texto do Reclame Aqui sai pronto, citando as tentativas anteriores com datas.</div></li>
            <li><span className="pro-exemplo-dia">Dia 14</span><div><b>Ainda nada?</b> Próximo degrau: Consumidor.gov ou Procon, com o histórico completo. Se precisar, o Juizado vem depois.</div></li>
          </ol>
        </section>

        <section className="pro-bloco">
          <h2>Grátis × Pro</h2>
          <div className="adm-tabela-wrap">
            <table className="pro-comparar">
              <thead><tr><th></th><th>Grátis</th><th>Pro</th></tr></thead>
              <tbody>
                <tr><td>Reclamação com base no CDC (SAC, Reclame Aqui, Consumidor.gov/Procon)</td><td>1 a cada 15 dias</td><td>Sem espera</td></tr>
                <tr><td>Preencher pelos prints da compra</td><td>3 a 5 por dia</td><td>30 por dia</td></tr>
                <tr><td>Análise da resposta da loja</td><td>2 por dia</td><td>30 por dia</td></tr>
                <tr><td>Linha do tempo e aviso de prazos</td><td>—</td><td>✓</td></tr>
                <tr><td>Próximo texto com o histórico do caso</td><td>—</td><td>✓</td></tr>
                <tr><td>Painel de casos e valor em disputa</td><td>—</td><td>✓</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="pro-bloco">
          <h2>Perguntas frequentes</h2>
          {FAQ.map(f => (
            <details key={f.p} className="guia-faq">
              <summary>{f.p}</summary>
              <p>{f.r}</p>
            </details>
          ))}
        </section>

        <section className="pro-bloco">
          <h2>Pronto pra não deixar barato?</h2>
          <Assinar logado={!!u} planos={planos} planoInicial={inicial} />
        </section>

        <p className="pro-legal">
          Pagamento único por Pix ou cartão, sem renovação automática: avisamos antes de vencer.
          Desistiu em até 7 dias da compra? Devolvemos 100% (CDC, art. 49): é só escrever para contato@cademeupacote.com.br.
          O Cadê Meu Pacote é uma ferramenta de autoatendimento e não presta assessoria jurídica.
        </p>
      </div>
    </SiteShell>
  );
}
