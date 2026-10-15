// Planos do Pro. Fonte única de preço e duração (usada no site e no checkout).

export type Plano = "mensal" | "trimestral";

export const PLANOS: Record<Plano, { nome: string; valor: number; dias: number; preco: string; detalhe: string; selo?: string }> = {
  trimestral: { nome: "Trimestral", valor: 34.9, dias: 90, preco: "R$ 34,90", detalhe: "R$ 11,63/mês · cobre o ciclo de um caso", selo: "Economize 22%" },
  mensal:     { nome: "Mensal",     valor: 14.9, dias: 30, preco: "R$ 14,90", detalhe: "30 dias de acesso" },
};

export const PLANOS_PUBLICOS: Plano[] = ["trimestral", "mensal"];

export function planoValido(p: unknown): p is Plano {
  return p === "mensal" || p === "trimestral";
}

