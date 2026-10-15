import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { initialFormState, type FormState } from "@/lib/constants";
import { consumirUsoIa, registrarUsoIa } from "@/lib/db";
import { analisarResposta, IaRecusou, type ImagemPrint } from "@/lib/ia";
import { MODELO } from "@/lib/ia";
import { montarHistorico } from "@/lib/historico";
import { ehPro, ETAPA_INFO, type Etapa } from "@/lib/pro";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// Análises por dia: grátis pra quem tem conta, mais folga no Pro.
const LIMITE_GRATIS = 5;
const LIMITE_PRO = 30;
const LIMITE_GLOBAL = 1000;

const MAX_IMAGENS = 2;
const MAX_BASE64 = 1_400_000;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

// "A loja respondeu. E agora?" — analisa a resposta e guarda o resumo no histórico do caso.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });

  const body = await req.json().catch(() => null) as { resposta?: string; imagens?: ImagemPrint[] } | null;
  const resposta = typeof body?.resposta === "string" ? body.resposta.trim().slice(0, 4000) : "";
  const imagens = Array.isArray(body?.imagens) ? body!.imagens.slice(0, MAX_IMAGENS) : [];
  for (const img of imagens) {
    if (!TIPOS.includes(img?.mediaType) || typeof img?.base64 !== "string" || img.base64.length > MAX_BASE64 || !/^[A-Za-z0-9+/=]+$/.test(img.base64)) {
      return NextResponse.json({ error: "O print está num formato que não conseguimos ler. Use JPG ou PNG." }, { status: 400 });
    }
  }
  if (resposta.length < 10 && imagens.length === 0) {
    return NextResponse.json({ error: "Cole a resposta da loja ou envie um print dela." }, { status: 400 });
  }

  // RLS: só encontra se o caso for desta pessoa.
  const { data: caso } = await supabase
    .from("reclamacoes").select("id, created_at, etapa, dados").eq("id", id)
    .single<{ id: string; created_at: string; etapa: Etapa; dados: Partial<FormState> }>();
  if (!caso) return NextResponse.json({ error: "Caso não encontrado." }, { status: 404 });

  const { data: perfil } = await supabase.from("perfis").select("nome, pro_ate").eq("id", user.id).single();
  const pro = ehPro(perfil?.pro_ate);

  try {
    const r = await consumirUsoIa(`r:u:${user.id}`, pro ? LIMITE_PRO : LIMITE_GRATIS, LIMITE_GLOBAL);
    if (r !== "ok") {
      return NextResponse.json({
        error: pro ? "Limite de análises de hoje atingido. Amanhã libera de novo." : `Você usou as ${LIMITE_GRATIS} análises grátis de hoje. Amanhã libera de novo, ou assine o Pro.`,
      }, { status: 429 });
    }
  } catch (e) {
    console.error("[LIMITE] falha ao checar uso:", e);
  }

  const { data: eventos } = await supabase
    .from("caso_eventos").select("created_at, tipo, etapa, nota").eq("caso_id", id).order("created_at");

  const dados: FormState = { ...initialFormState, ...caso.dados, name: perfil?.nome || caso.dados.name || "", cpf: "" };

  try {
    const { analise, uso } = await analisarResposta({
      dados,
      canal: ETAPA_INFO[caso.etapa]?.nome ?? caso.etapa,
      historico: montarHistorico(caso.created_at, eventos ?? []),
      resposta,
      imagens,
    });
    console.log(`[IA resposta] imgs=${imagens.length} in=${uso.input_tokens} out=${uso.output_tokens}`);
    await registrarUsoIa("analise", MODELO, uso);

    // Guarda só o resumo (não a resposta inteira da loja) — alimenta o próximo texto.
    await supabase.from("caso_eventos").insert({
      caso_id: id,
      tipo: "loja_respondeu",
      etapa: caso.etapa,
      nota: analise.resumo_historico.slice(0, 300),
    });

    return NextResponse.json({ ...analise, pro });
  } catch (err) {
    if (err instanceof IaRecusou) return NextResponse.json({ error: "Não conseguimos analisar essa resposta." }, { status: 422 });
    if (err instanceof Anthropic.APIError) {
      console.error(`[IA resposta] erro ${err.status}:`, err.message);
      return NextResponse.json({ error: "A IA está instável agora. Tente de novo em instantes." }, { status: 502 });
    }
    console.error("[IA resposta] erro:", err);
    return NextResponse.json({ error: "Erro interno. Tente de novo." }, { status: 500 });
  }
}
