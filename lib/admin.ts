import { db } from "@/lib/db";
import { getUsuario } from "@/lib/supabase/server";

// Só estes e-mails entram no painel. Pode trocar pela variável ADMIN_EMAILS (separados por vírgula).
const ADMINS = (process.env.ADMIN_EMAILS || "caioreal@yahoo.com.br")
  .split(",").map(e => e.trim().toLowerCase()).filter(Boolean);

/** Usuário logado, se for admin. Caso contrário, null. */
export async function getAdmin() {
  const u = await getUsuario();
  const email = u?.user.email?.toLowerCase();
  return email && ADMINS.includes(email) ? u : null;
}

// Preços do Claude Haiku 5.5 (US$ por milhão de tokens) e câmbio de referência.
const PRECO_IN = 0.10;
const PRECO_OUT = 0.50;
export const DOLAR = Number(process.env.DOLAR_REF || 5.5);

const desde = (dias: number) => new Date(Date.now() - dias * 86_400_000).toISOString();

export type PainelDados = Awaited<ReturnType<typeof carregarPainel>>;

/** Tudo que o painel mostra, para os últimos `dias`. */
export async function carregarPainel(dias: number) {
  const d = db();
  const inicio = desde(dias);
  const agora = new Date().toISOString();
  const em7 = new Date(Date.now() + 7 * 86_400_000).toISOString();

  const [
    casos, funil, perfisNovos, cadastros, interessados, pagamentos,
    proAtivos, vencendo, iaLog, ranking, lembretes, serie,
  ] = await Promise.all([
    d.from("casos").select("*", { count: "exact", head: true }).gte("created_at", inicio),
    d.from("funil_eventos").select("tipo, canal").gte("created_at", inicio).limit(50000),
    d.from("perfis").select("*", { count: "exact", head: true }).gte("created_at", inicio),
    d.from("perfis").select("*", { count: "exact", head: true }).gte("termos_aceitos_em", inicio),
    d.from("waitlist_pro").select("email, plano, origem, canal, created_at").gte("created_at", inicio).order("created_at", { ascending: false }).limit(200),
    d.from("pagamentos").select("id, user_id, plano, valor, status, metodo, created_at, aprovado_em").gte("created_at", inicio).order("created_at", { ascending: false }).limit(200),
    d.from("perfis").select("*", { count: "exact", head: true }).gt("pro_ate", agora),
    d.from("perfis").select("id, nome, pro_ate").gt("pro_ate", agora).lte("pro_ate", em7).order("pro_ate").limit(50),
    d.from("ia_uso_log").select("tipo, input_tokens, output_tokens").gte("created_at", inicio).limit(100000),
    d.rpc("ranking_lojas", { dias }),
    d.from("lembretes").select("*", { count: "exact", head: true }).is("enviado_em", null),
    d.from("casos").select("created_at").gte("created_at", desde(30)).limit(50000),
  ]);

  // Funil por canal
  const contagem: Record<string, Record<string, number>> = {};
  for (const e of funil.data ?? []) {
    const canal = e.canal || "direto";
    contagem[canal] ??= {};
    contagem[canal][e.tipo] = (contagem[canal][e.tipo] ?? 0) + 1;
  }
  const total = (tipo: string) => Object.values(contagem).reduce((s, c) => s + (c[tipo] ?? 0), 0);

  // Receita
  const aprovados = (pagamentos.data ?? []).filter(p => p.status === "aprovado");
  const receita = aprovados.reduce((s, p) => s + Number(p.valor), 0);
  const porPlano: Record<string, { qtd: number; valor: number }> = {};
  for (const p of aprovados) {
    porPlano[p.plano] ??= { qtd: 0, valor: 0 };
    porPlano[p.plano].qtd++;
    porPlano[p.plano].valor += Number(p.valor);
  }

  // Custo de IA real
  const ia: Record<string, { chamadas: number; reais: number }> = {};
  let iaTotal = 0;
  for (const r of iaLog.data ?? []) {
    const usd = (r.input_tokens * PRECO_IN + r.output_tokens * PRECO_OUT) / 1e6;
    ia[r.tipo] ??= { chamadas: 0, reais: 0 };
    ia[r.tipo].chamadas++;
    ia[r.tipo].reais += usd * DOLAR;
    iaTotal += usd * DOLAR;
  }

  // Reclamações por dia (30 dias, horário de Brasília)
  const porDia = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const dia = new Date(Date.now() - i * 86_400_000).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" });
    porDia.set(dia, 0);
  }
  for (const c of serie.data ?? []) {
    const dia = new Date(c.created_at).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" });
    if (porDia.has(dia)) porDia.set(dia, porDia.get(dia)! + 1);
  }

  // E-mails dos pagamentos recentes (só os 10 primeiros)
  const ultimosPag = await Promise.all((pagamentos.data ?? []).slice(0, 10).map(async p => {
    const { data } = await d.auth.admin.getUserById(p.user_id);
    return { ...p, email: data.user?.email ?? "—" };
  }));

  return {
    dias,
    reclamacoes: casos.count ?? 0,
    funil: {
      resultado_visto: total("resultado_visto"),
      oferta_clicada: total("oferta_clicada"),
      oferta_lead: total("oferta_lead"),
      porCanal: contagem,
    },
    contasNovas: perfisNovos.count ?? 0,
    cadastrosCompletos: cadastros.count ?? 0,
    interessados: interessados.data ?? [],
    receita,
    porPlano,
    vendas: aprovados.length,
    ultimosPag,
    proAtivos: proAtivos.count ?? 0,
    checkouts: (pagamentos.data ?? []).length,
    vencendo: vencendo.data ?? [],
    ia,
    iaTotal,
    ranking: (ranking.data ?? []) as { store_id: string; total: number; problema_mais_comum: string | null }[],
    lembretesPendentes: lembretes.count ?? 0,
    serie: [...porDia.entries()].map(([dia, n]) => ({ dia, n })),
  };
}

/** Libera (ou estende) o Pro de alguém pelo e-mail. */
export async function concederPro(email: string, dias: number): Promise<{ ok: boolean; erro?: string; ate?: string }> {
  const d = db();
  const alvo = email.trim().toLowerCase();
  let pagina = 1;
  let userId: string | null = null;
  while (!userId) {
    const { data, error } = await d.auth.admin.listUsers({ page: pagina, perPage: 1000 });
    if (error) return { ok: false, erro: error.message };
    userId = data.users.find(u => u.email?.toLowerCase() === alvo)?.id ?? null;
    if (data.users.length < 1000) break;
    pagina++;
  }
  if (!userId) return { ok: false, erro: "Nenhuma conta com esse e-mail. A pessoa precisa entrar no site uma vez antes." };

  const { data: perfil } = await d.from("perfis").select("pro_ate").eq("id", userId).single();
  const base = perfil?.pro_ate && new Date(perfil.pro_ate) > new Date() ? new Date(perfil.pro_ate) : new Date();
  const ate = new Date(base.getTime() + dias * 86_400_000).toISOString();
  const { error } = await d.from("perfis").update({ pro_ate: ate }).eq("id", userId);
  return error ? { ok: false, erro: error.message } : { ok: true, ate };
}
