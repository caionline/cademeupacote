import { ETAPA_INFO, type Etapa } from "@/lib/pro";

function dataBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });
}

const nome = (e: string) => ETAPA_INFO[e as Etapa]?.nome ?? e;

/** Converte os eventos do caso em linhas de histórico para a IA (sem textos gerados, que são longos). */
export function montarHistorico(
  criadoEm: string,
  eventos: { created_at: string; tipo: string; etapa: string; nota: string | null }[],
): { data: string; descricao: string }[] {
  const linhas = [{ data: dataBR(criadoEm), descricao: "Caso aberto: reclamação inicial gerada." }];
  for (const e of eventos) {
    const d = dataBR(e.created_at);
    switch (e.tipo) {
      case "enviado":        linhas.push({ data: d, descricao: `Consumidor enviou a reclamação pelo ${nome(e.etapa)}.` }); break;
      case "nao_resolveu":   linhas.push({ data: d, descricao: `A loja não resolveu pelo ${nome(e.etapa)}.` }); break;
      case "prazo_vencido":  linhas.push({ data: d, descricao: `Prazo de resposta pelo ${nome(e.etapa)} venceu sem solução.` }); break;
      case "reaberto":       linhas.push({ data: d, descricao: "Caso reaberto pelo consumidor." }); break;
      case "loja_respondeu": linhas.push({ data: d, descricao: `Resposta da loja pelo ${nome(e.etapa)}: ${e.nota ?? "sem detalhes"}` }); break;
    }
  }
  return linhas;
}
