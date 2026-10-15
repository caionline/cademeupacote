import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente do servidor (chave secreta): ignora RLS. Nunca importar em componente "use client".
let client: SupabaseClient | null = null;

export function db(): SupabaseClient {
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

// ---------------------------------------------------------------------------
// Limite diário de uso da IA
// ---------------------------------------------------------------------------

/** Conta 1 uso e diz se passou do limite da pessoa ("pessoa"), do site ("global") ou se pode ("ok"). */
export async function consumirUsoIa(chave: string, limite: number, limiteGlobal: number): Promise<"ok" | "pessoa" | "global"> {
  const { data, error } = await db().rpc("consumir_uso_ia", {
    p_chave: chave,
    p_limite: limite,
    p_limite_global: limiteGlobal,
  });
  if (error) throw error;
  return data as "ok" | "pessoa" | "global";
}

// ---------------------------------------------------------------------------
// Oferta do Pro: interessados e funil
// ---------------------------------------------------------------------------

export type EventoFunil = "resultado_visto" | "oferta_clicada" | "oferta_lead";

export async function registrarEventoFunil(e: {
  tipo: EventoFunil;
  problemId: string | null;
  storeId: string | null;
  logado: boolean;
  canal: string | null;
}): Promise<void> {
  const { error } = await db().from("funil_eventos").insert({
    tipo:       e.tipo,
    problem_id: e.problemId,
    store_id:   e.storeId,
    logado:     e.logado,
    canal:      e.canal,
  });
  if (error) throw error;
}

export async function registrarInteressePro(i: {
  email: string;
  plano: "mensal" | "trimestral";
  userId: string | null;
  problemId: string | null;
  storeId: string | null;
  origem: "resultado" | "meus_casos";
  canal: string | null;
}): Promise<void> {
  const { error } = await db().from("waitlist_pro").upsert(
    {
      email:      i.email.toLowerCase(),
      plano:      i.plano,
      user_id:    i.userId,
      problem_id: i.problemId,
      store_id:   i.storeId,
      origem:     i.origem,
      // Sem canal agora, mantém o que já estava gravado.
      ...(i.canal ? { canal: i.canal } : {}),
    },
    { onConflict: "email" },
  );
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Pro: prazos vencidos (lembrete diário)
// ---------------------------------------------------------------------------

export type CasoPrazoVencido = {
  caso_id: string; user_id: string; email: string; nome: string | null;
  store_id: string; store_nome: string | null; problem_id: string; etapa: string;
};

export async function getCasosPrazoVencido(limite = 100): Promise<CasoPrazoVencido[]> {
  const { data, error } = await db().rpc("casos_com_prazo_vencido", { limite });
  if (error) throw error;
  return (data ?? []) as CasoPrazoVencido[];
}

export async function marcarPrazoAvisado(c: CasoPrazoVencido): Promise<void> {
  const { error } = await db().from("reclamacoes").update({ prazo_avisado: true }).eq("id", c.caso_id);
  if (error) throw error;
  await db().from("caso_eventos").insert({ caso_id: c.caso_id, user_id: c.user_id, tipo: "prazo_vencido", etapa: c.etapa });
}

// ---------------------------------------------------------------------------
// Pagamentos do Pro
// ---------------------------------------------------------------------------

export async function criarPagamento(p: { userId: string; plano: string; valor: number; dias: number; metaContexto?: unknown }): Promise<string> {
  const { data, error } = await db()
    .from("pagamentos")
    .insert({ user_id: p.userId, plano: p.plano, valor: p.valor, dias: p.dias, meta_contexto: p.metaContexto ?? null })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

/** Garante a vaga de fundador (até o limite). true = é fundador. */
export async function reservarFundador(userId: string, limite: number): Promise<boolean> {
  const { data, error } = await db().rpc("reservar_fundador", { p_user: userId, p_limite: limite });
  if (error) throw error;
  return data === true;
}

export async function salvarPreferencia(id: string, preferenceId: string): Promise<void> {
  const { error } = await db().from("pagamentos").update({ mp_preference_id: preferenceId }).eq("id", id);
  if (error) throw error;
}

export async function getPagamento(id: string): Promise<{ id: string; user_id: string; valor: number; status: string } | null> {
  const { data } = await db().from("pagamentos").select("id, user_id, valor, status").eq("id", id).maybeSingle();
  return data ? { ...data, valor: Number(data.valor) } : null;
}

/** Aprova e estende o Pro. Retorna false se já estava aprovado (webhook repetido). */
export async function aprovarPagamento(id: string, mpPaymentId: string, metodo: string): Promise<boolean> {
  const { data, error } = await db().rpc("aprovar_pagamento", { p_id: id, p_mp_payment_id: mpPaymentId, p_metodo: metodo });
  if (error) throw error;
  return data === true;
}

export async function marcarPagamento(id: string, status: "recusado" | "reembolsado", mpPaymentId: string): Promise<void> {
  const { error } = await db().from("pagamentos").update({ status, mp_payment_id: mpPaymentId }).eq("id", id).neq("status", "aprovado");
  if (error) throw error;
}

export async function getProVencendo(limite = 100): Promise<{ user_id: string; email: string; nome: string | null; pro_ate: string }[]> {
  const { data, error } = await db().rpc("pro_vencendo", { limite });
  if (error) throw error;
  return data ?? [];
}

export async function marcarLembretePro(userId: string, proAte: string): Promise<void> {
  const { error } = await db().from("perfis").update({ pro_lembrete_para: proAte }).eq("id", userId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Custo real da IA (só tokens; nunca o conteúdo)
// ---------------------------------------------------------------------------

export type TipoUsoIa = "reclamacao" | "prints" | "analise" | "proximo_texto";

/** Registra os tokens de uma chamada. Nunca derruba a resposta principal. */
export async function registrarUsoIa(tipo: TipoUsoIa, modelo: string, uso: { input_tokens: number; output_tokens: number }): Promise<void> {
  try {
    await db().from("ia_uso_log").insert({ tipo, modelo, input_tokens: uso.input_tokens, output_tokens: uso.output_tokens });
  } catch (e) {
    console.error("[IA log] falha ao registrar uso:", e);
  }
}

// ---------------------------------------------------------------------------
// E-mails do ciclo de vida (compra, pagamento não concluído, Pro venceu, boas-vindas)
// ---------------------------------------------------------------------------

/** Dados pro e-mail de confirmação de uma compra aprovada. */
export async function dadosConfirmacao(pagamentoId: string): Promise<{ email: string; nome: string | null; plano: string; valor: number; proAte: string; metaContexto: Record<string, string> | null } | null> {
  const d = db();
  const { data: pg } = await d.from("pagamentos").select("user_id, plano, valor, meta_contexto").eq("id", pagamentoId).single();
  if (!pg) return null;
  const [{ data: u }, { data: perfil }] = await Promise.all([
    d.auth.admin.getUserById(pg.user_id),
    d.from("perfis").select("nome, pro_ate").eq("id", pg.user_id).single(),
  ]);
  if (!u.user?.email || !perfil?.pro_ate) return null;
  return { email: u.user.email, nome: perfil.nome, plano: pg.plano, valor: Number(pg.valor), proAte: perfil.pro_ate, metaContexto: pg.meta_contexto ?? null };
}

export async function getPagamentosAbandonados(): Promise<{ pagamento_id: string; email: string; nome: string | null; plano: string }[]> {
  const { data, error } = await db().rpc("pagamentos_abandonados", { limite: 100 });
  if (error) throw error;
  return data ?? [];
}

export async function marcarLembretePagamento(pagamentoId: string): Promise<void> {
  const { error } = await db().from("pagamentos").update({ lembrete_enviado_em: new Date().toISOString() }).eq("id", pagamentoId);
  if (error) throw error;
}

export async function getProExpirados(): Promise<{ user_id: string; email: string; nome: string | null; pro_ate: string }[]> {
  const { data, error } = await db().rpc("pro_expirados", { limite: 100 });
  if (error) throw error;
  return data ?? [];
}

export async function marcarAvisoExpirou(userId: string, proAte: string): Promise<void> {
  const { error } = await db().from("perfis").update({ pro_expirou_aviso_para: proAte }).eq("id", userId);
  if (error) throw error;
}

/** Marca as boas-vindas como enviadas. Devolve false se já tinham sido (evita e-mail repetido). */
export async function reservarBoasVindas(userId: string): Promise<boolean> {
  const { data, error } = await db()
    .from("perfis")
    .update({ boas_vindas_em: new Date().toISOString() })
    .eq("id", userId)
    .is("boas_vindas_em", null)
    .not("termos_aceitos_em", "is", null)
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}
