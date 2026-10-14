import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente do servidor (chave secreta): ignora RLS. Nunca importar em componente "use client".
let client: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY não configuradas");
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}

const SETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Casos (estatística anônima)
// ---------------------------------------------------------------------------

export async function registrarCaso(data: {
  storeId: string;
  problemId: string;
  valueRange: string | null;
}): Promise<void> {
  const { error } = await db().from("casos").insert({
    store_id:    data.storeId,
    problem_id:  data.problemId,
    value_range: data.valueRange,
  });
  if (error) throw error;
}

export async function getTotalCasos(diasAtras = 30): Promise<number> {
  const desde = new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await db()
    .from("casos")
    .select("*", { count: "exact", head: true })
    .gte("created_at", desde);
  if (error) throw error;
  return count ?? 0;
}

export async function getRankingLojas(diasAtras = 30): Promise<Array<{
  storeId: string;
  total: number;
  problemaMaisComum: string | null;
}>> {
  const { data, error } = await db().rpc("ranking_lojas", { dias: diasAtras });
  if (error) throw error;
  return (data ?? []).map((r: { store_id: string; total: number; problema_mais_comum: string | null }) => ({
    storeId:           r.store_id,
    total:             Number(r.total),
    problemaMaisComum: r.problema_mais_comum,
  }));
}

export async function getStatsLoja(storeId: string, diasAtras = 30): Promise<{
  total: number;
  porProblema: Record<string, number>;
  porValueRange: Record<string, number>;
}> {
  const { data, error } = await db().rpc("stats_loja", { p_store_id: storeId, dias: diasAtras });
  if (error) throw error;
  return {
    total:         Number(data?.total ?? 0),
    porProblema:   data?.porProblema ?? {},
    porValueRange: data?.porValueRange ?? {},
  };
}

// ---------------------------------------------------------------------------
// Lembrete de 7 dias
// ---------------------------------------------------------------------------

export type Lembrete = {
  id: string;
  email: string;
  storeId: string;
  problemId: string;
};

export async function capturarEmail(data: {
  email: string;
  storeId: string;
  problemId: string;
}): Promise<void> {
  // Mesmo e-mail de novo: o lembrete passa a ser sobre a reclamação mais recente.
  const { error } = await db().from("lembretes").upsert(
    {
      email:      data.email.toLowerCase(),
      store_id:   data.storeId,
      problem_id: data.problemId,
      created_at: new Date().toISOString(),
      enviar_em:  new Date(Date.now() + SETE_DIAS_MS).toISOString(),
      enviado_em: null,
    },
    { onConflict: "email" },
  );
  if (error) throw error;
}

/** Lembretes cujo prazo de 7 dias já venceu e ainda não foram enviados. */
export async function getLembretesVencidos(limite = 100): Promise<Lembrete[]> {
  const { data, error } = await db()
    .from("lembretes")
    .select("id, email, store_id, problem_id")
    .is("enviado_em", null)
    .lte("enviar_em", new Date().toISOString())
    .order("enviar_em")
    .limit(limite);
  if (error) throw error;
  return (data ?? []).map(r => ({
    id:        r.id,
    email:     r.email,
    storeId:   r.store_id,
    problemId: r.problem_id,
  }));
}

export async function marcarLembreteEnviado(id: string): Promise<void> {
  const { error } = await db()
    .from("lembretes")
    .update({ enviado_em: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function cancelarLembrete(id: string): Promise<void> {
  const { error } = await db().from("lembretes").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Lista de espera do Plano Pro
// ---------------------------------------------------------------------------

export async function entrarWaitlistPro(email: string): Promise<void> {
  const { error } = await db()
    .from("waitlist_pro")
    .upsert({ email: email.toLowerCase() }, { onConflict: "email", ignoreDuplicates: true });
  if (error) throw error;
}
