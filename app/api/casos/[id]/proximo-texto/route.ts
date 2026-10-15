import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { initialFormState, type FormState } from "@/lib/constants";
import { consumirUsoIa } from "@/lib/db";
import { gerarProximoTexto, IaRecusou } from "@/lib/ia";
import { ehPro, ETAPA_INFO, type Etapa } from "@/lib/pro";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const LIMITE_PRO = 30;
const LIMITE_GLOBAL = 500;

function dataBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const DESCRICAO: Record<string, (etapa: string) => string> = {
  enviado:      e => `Consumidor enviou a reclamação pelo ${ETAPA_INFO[e as Etapa]?.nome ?? e}.`,
  nao_resolveu: e => `A loja não resolveu pelo ${ETAPA_INFO[e as Etapa]?.nome ?? e}.`,
  prazo_vencido:e => `Prazo de resposta pelo ${ETAPA_INFO[e as Etapa]?.nome ?? e} venceu sem solução.`,
  reaberto:     () => "Caso reaberto pelo consumidor.",
};

// Gera o texto da etapa atual com o histórico do caso (Pro).
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });

  const { data: perfil } = await supabase.from("perfis").select("nome, cpf, pro_ate").eq("id", user.id).single();
  if (!ehPro(perfil?.pro_ate)) return NextResponse.json({ error: "Recurso do Pro." }, { status: 403 });

  const { data: caso } = await supabase
    .from("reclamacoes").select("id, created_at, etapa, dados").eq("id", id)
    .single<{ id: string; created_at: string; etapa: Etapa; dados: Partial<FormState> }>();
  if (!caso) return NextResponse.json({ error: "Caso não encontrado." }, { status: 404 });
  if (caso.etapa === "jec") return NextResponse.json({ error: "A petição do Juizado chega em breve." }, { status: 400 });

  try {
    const limite = await consumirUsoIa(`u:${user.id}`, LIMITE_PRO, LIMITE_GLOBAL);
    if (limite !== "ok") return NextResponse.json({ error: "Limite diário de textos atingido. Amanhã libera de novo." }, { status: 429 });
  } catch (e) {
    console.error("[LIMITE] falha ao checar uso:", e);
  }

  const { data: eventos } = await supabase
    .from("caso_eventos").select("created_at, tipo, etapa").eq("caso_id", id).order("created_at");

  const historico = [
    { data: dataBR(caso.created_at), descricao: "Caso aberto: reclamação inicial gerada." },
    ...(eventos ?? [])
      .filter(e => DESCRICAO[e.tipo])
      .map(e => ({ data: dataBR(e.created_at), descricao: DESCRICAO[e.tipo](e.etapa) })),
  ];

  const dados: FormState = {
    ...initialFormState,
    ...caso.dados,
    name: perfil?.nome || caso.dados.name || "",
    cpf:  perfil?.cpf ?? "",
  };

  try {
    const { texto, uso } = await gerarProximoTexto({ dados, etapa: caso.etapa, historico });
    console.log(`[IA proximo] in=${uso.input_tokens} out=${uso.output_tokens}`);
    await supabase.from("caso_eventos").insert({ caso_id: id, tipo: "texto_gerado", etapa: caso.etapa, nota: texto });
    return NextResponse.json({ texto });
  } catch (err) {
    if (err instanceof IaRecusou) return NextResponse.json({ error: "Não conseguimos gerar esse texto." }, { status: 422 });
    if (err instanceof Anthropic.APIError) {
      console.error(`[IA proximo] erro ${err.status}:`, err.message);
      return NextResponse.json({ error: "A IA está instável agora. Tente de novo em instantes." }, { status: 502 });
    }
    console.error("[IA proximo] erro:", err);
    return NextResponse.json({ error: "Erro interno. Tente de novo." }, { status: 500 });
  }
}
