import { STORES, type FormState } from "@/lib/constants";
import { supabaseBrowser } from "@/lib/supabase/client";

export type Textos = { whatsapp: string; reclameaqui: string; consumidor: string };

export type Reclamacao = {
  id: string;
  created_at: string;
  store_id: string;
  store_nome: string | null;
  problem_id: string;
  produto: string | null;
  valor: string | null;
  numero_pedido: string | null;
  textos: Textos;
  status: "aberto" | "resolvido";
  resolvido_em: string | null;
  etapa: "sac" | "reclameaqui" | "consumidorgov" | "jec";
  enviado_em: string | null;
  prazo_em: string | null;
  dados: { purchaseDate?: string } | null;
};

export type CasoEvento = {
  id: number;
  caso_id: string;
  created_at: string;
  tipo: "enviado" | "resolvido" | "nao_resolveu" | "reaberto" | "texto_gerado" | "prazo_vencido";
  etapa: string;
  nota: string | null;
};

// Caso gerado sem login, guardado até a pessoa entrar na conta.
const PENDENTE_KEY = "cmp.pendente.v1";

type CasoPendente = { form: FormState; textos: Textos };

/** Salva o caso na conta do usuário logado. */
export async function salvarCaso(form: FormState, textos: Textos): Promise<{ id: string } | null> {
  const store = STORES.find(s => s.id === form.store);
  // CPF e e-mail ficam no perfil, não em cada caso.
  const { cpf: _cpf, email: _email, ...dados } = form;
  const { data, error } = await supabaseBrowser()
    .from("reclamacoes")
    .insert({
      store_id:      form.store ?? "other",
      store_nome:    form.store === "other" ? form.storeOtherName || "Outra loja" : store?.name ?? null,
      problem_id:    form.problem ?? "other",
      produto:       form.product || null,
      valor:         form.value || null,
      numero_pedido: form.orderNumber || null,
      dados,
      textos,
    })
    .select("id")
    .single();
  if (error) {
    console.error("Erro ao salvar caso:", error.message);
    return null;
  }
  return data;
}

export function guardarPendente(form: FormState, textos: Textos) {
  try { localStorage.setItem(PENDENTE_KEY, JSON.stringify({ form, textos })); } catch {}
}

/** Se houver caso gerado antes do login, salva na conta e limpa. */
export async function salvarPendente(): Promise<boolean> {
  let p: CasoPendente | null = null;
  try {
    const raw = localStorage.getItem(PENDENTE_KEY);
    if (raw) p = JSON.parse(raw);
  } catch {}
  if (!p) return false;
  // Tira da fila antes de salvar, pra não salvar duas vezes se a tela rodar isso em dobro.
  try { localStorage.removeItem(PENDENTE_KEY); } catch {}
  const ok = await salvarCaso(p.form, p.textos);
  if (!ok) guardarPendente(p.form, p.textos);
  return !!ok;
}
