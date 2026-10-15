// Planos do Pro. Fonte única de preço e duração (usada no site e no checkout).

export type Plano = "mensal" | "trimestral" | "fundador";

export const PLANOS: Record<Plano, { nome: string; valor: number; dias: number; preco: string; precoDe?: string; detalhe: string; selo?: string }> = {
  trimestral: { nome: "Trimestral", valor: 34.9, dias: 90, preco: "R$ 34,90", detalhe: "R$ 11,63/mês · cobre o ciclo de um caso", selo: "Economize 22%" },
  mensal:     { nome: "Mensal",     valor: 14.9, dias: 30, preco: "R$ 14,90", detalhe: "30 dias de acesso" },
  // Copping: R$ 9,90 a cada 30 dias, pra sempre, só para os 100 primeiros.
  fundador:   { nome: "Fundador",   valor: 9.9,  dias: 30, preco: "R$ 9,90", precoDe: "R$ 14,90", detalhe: "a cada 30 dias, pra sempre", selo: "Preço de fundador" },
};

export const PLANOS_PUBLICOS: Plano[] = ["trimestral", "mensal"];
export const LIMITE_FUNDADORES = 100;
export const CANAL_FUNDADOR = "copping";

export function planoValido(p: unknown): p is Plano {
  return p === "mensal" || p === "trimestral" || p === "fundador";
}

/** Vendas abertas ao público? Até lá, a oferta só capta interessados (e /pro funciona pra teste). */
export const VENDAS_ABERTAS = process.env.NEXT_PUBLIC_PRO_VENDAS === "1";
