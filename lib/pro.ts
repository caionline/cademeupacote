// Regras do acompanhamento Pro: etapas da escalada e prazos de cada uma.
// Os prazos são referências práticas (não prazos legais exatos), exceto onde indicado.

export type Etapa = "sac" | "reclameaqui" | "consumidorgov" | "jec";

export const ETAPAS: Etapa[] = ["sac", "reclameaqui", "consumidorgov", "jec"];

export const ETAPA_INFO: Record<Etapa, {
  nome: string;
  icone: string;
  prazoDias: number | null;
  prazoTexto: string;
  comoEnviar: string;
  link?: string;
}> = {
  sac: {
    nome: "SAC da loja",
    icone: "💬",
    prazoDias: 3,
    prazoTexto: "Damos 3 dias pra loja responder.",
    comoEnviar: "Mande pelo chat, WhatsApp ou e-mail de atendimento da loja e guarde o número do protocolo.",
  },
  reclameaqui: {
    nome: "Reclame Aqui",
    icone: "⚠️",
    prazoDias: 10,
    prazoTexto: "As empresas costumam responder em até 10 dias.",
    comoEnviar: "Publique em reclameaqui.com.br. A reclamação fica pública e pesa na reputação da loja.",
    link: "https://www.reclameaqui.com.br",
  },
  consumidorgov: {
    nome: "Consumidor.gov",
    icone: "🏛️",
    prazoDias: 10,
    prazoTexto: "A empresa tem 10 dias para responder no Consumidor.gov.",
    comoEnviar: "Registre em consumidor.gov.br (entra com a conta gov.br). Se a loja não estiver lá, use o Procon do seu estado.",
    link: "https://www.consumidor.gov.br",
  },
  jec: {
    nome: "Juizado Especial",
    icone: "⚖️",
    prazoDias: null,
    prazoTexto: "Causas de até 20 salários mínimos dispensam advogado.",
    comoEnviar: "Leve os documentos ao Juizado Especial Cível da sua cidade ou use o protocolo online do tribunal do seu estado.",
  },
};

/** Texto inicial (gerado na criação do caso) que serve pra cada etapa. */
export const TEXTO_INICIAL: Record<Etapa, "whatsapp" | "reclameaqui" | "consumidor" | null> = {
  sac: "whatsapp",
  reclameaqui: "reclameaqui",
  consumidorgov: "consumidor",
  jec: null,
};

export function proximaEtapa(e: Etapa): Etapa | null {
  const i = ETAPAS.indexOf(e);
  return i >= 0 && i < ETAPAS.length - 1 ? ETAPAS[i + 1] : null;
}

export function calcularPrazo(e: Etapa, desde = new Date()): Date | null {
  const dias = ETAPA_INFO[e].prazoDias;
  if (dias == null) return null;
  return new Date(desde.getTime() + dias * 86_400_000);
}

export function ehPro(proAte: string | null | undefined): boolean {
  return !!proAte && new Date(proAte).getTime() > Date.now();
}

/**
 * Prazo-limite pra reclamar de defeito (CDC art. 26): 30 dias (não durável) ou 90 dias (durável),
 * contados da entrega. Sem a data de entrega, usamos a da compra como aproximação.
 */
export function prazoDecadencia(problemId: string, dataCompra: string | null | undefined): { ate: Date; texto: string } | null {
  if (problemId !== "broken" || !dataCompra) return null;
  const base = new Date(`${dataCompra}T12:00:00`);
  if (isNaN(base.getTime())) return null;
  const ate = new Date(base.getTime() + 90 * 86_400_000);
  return {
    ate,
    texto: "Pelo CDC (art. 26), o prazo pra reclamar de defeito é de 90 dias para produtos duráveis (30 para não duráveis), contados do recebimento. A reclamação formal comprovada suspende esse prazo, então guarde os protocolos.",
  };
}
