import SiteShell from "@/app/components/SiteShell";
import { getUsuario } from "@/lib/supabase/server";
import { ehPro } from "@/lib/pro";
import { cookies } from "next/headers";
import { CANAL_FUNDADOR, PLANOS_PUBLICOS, planoValido, type Plano } from "@/lib/planos";
import { ORIGEM_COOKIE, limparOrigem } from "@/lib/origem";
import Assinar from "./Assinar";

export const metadata = {
  title: "Cadê Meu Pacote Pro — a gente acompanha seu caso até o fim",
  description: "Prazos, lembretes e o próximo texto pronto em cada etapa: SAC, Reclame Aqui, Consumidor.gov, Procon e Juizado.",
};

export default async function ProPage({ searchParams }: { searchParams: Promise<{ plano?: string; erro?: string }> }) {
  const { plano, erro } = await searchParams;
  const u = await getUsuario();
  const proAte = ehPro(u?.perfil?.pro_ate) ? u!.perfil!.pro_ate! : null;
  const canal = limparOrigem((await cookies()).get(ORIGEM_COOKIE)?.value);
  const fundador = !!u?.perfil?.fundador || canal === CANAL_FUNDADOR;
  const planos: Plano[] = fundador ? ["fundador", ...PLANOS_PUBLICOS] : PLANOS_PUBLICOS;
  const inicial: Plano = planoValido(plano) && planos.includes(plano) ? plano : planos[0];

  return (
    <SiteShell>
      <div className="pro-pagina">
        <span className="pro-selo">Cadê Meu Pacote Pro</span>
        <h1 className="conta-h1">A loja não resolveu de primeira? <em>A gente vai até o fim com você.</em></h1>
        <p className="conta-sub">A maioria das reclamações morre no SAC porque o consumidor cansa. O Pro acompanha cada caso, avisa os prazos e entrega o próximo texto pronto, até você ter seu dinheiro ou seu produto.</p>

        <ul className="pro-lista pro-lista-grande">
          <li><span>🗺️</span> Linha do tempo de cada caso: SAC → Reclame Aqui → Consumidor.gov ou Procon → Juizado</li>
          <li><span>⏰</span> Aviso por e-mail quando o prazo da loja vence</li>
          <li><span>✍️</span> Próximo texto gerado com o histórico do caso, mais forte a cada etapa</li>
          <li><span>📊</span> Painel com todos os casos, valor em disputa e prazos vencidos</li>
          <li><span>⚖️</span> Em breve: modelo de petição pro Juizado Especial preenchido com seus dados</li>
        </ul>

        {erro && <div className="conta-erro">O pagamento não foi concluído. Você pode tentar de novo.</div>}

        {proAte && (
          <div className="pro-ativo">
            ✓ Seu Pro está ativo até <b>{new Date(proAte).toLocaleDateString("pt-BR")}</b>. Se renovar agora, os dias se somam.
          </div>
        )}

        <Assinar logado={!!u} planos={planos} planoInicial={inicial} />

        <p className="pro-legal">
          Pagamento único por Pix ou cartão, sem renovação automática: avisamos antes de vencer.
          Desistiu em até 7 dias da compra? Devolvemos 100% (CDC, art. 49): é só escrever para contato@cademeupacote.com.br.
          O Cadê Meu Pacote é uma ferramenta de autoatendimento e não presta assessoria jurídica.
        </p>
      </div>
    </SiteShell>
  );
}
