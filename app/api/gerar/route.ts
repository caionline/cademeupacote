import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { PROBLEMS, STORES, type FormState } from "@/lib/constants";
import { consumirUsoIa, registrarCaso } from "@/lib/db";
import { gerarTextos, IaRecusou } from "@/lib/ia";
import { supabaseServer } from "@/lib/supabase/server";
import { getValueRange } from "@/lib/value-ranges";

export const runtime = "nodejs";
export const maxDuration = 60;

// Reclamações por dia. O global é o freio de emergência da fatura da Anthropic.
const LIMITE_SEM_CONTA = 5;
const LIMITE_COM_CONTA = 15;
const LIMITE_GLOBAL    = 500;

/** Quem está pedindo: id da conta, ou hash do IP (nunca guardamos o IP puro). */
async function identificar(req: Request): Promise<{ chave: string; logado: boolean }> {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return { chave: `u:${user.id}`, logado: true };
  } catch {}
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "desconhecido";
  const hash = createHash("sha256").update(`${ip}:${process.env.CRON_SECRET ?? ""}`).digest("hex").slice(0, 32);
  return { chave: `ip:${hash}`, logado: false };
}

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key não configurada no servidor." }, { status: 500 });
    }

    const body = (await req.json()) as FormState;

    if (!PROBLEMS.some(p => p.id === body.problem) || !STORES.some(s => s.id === body.store)) {
      return NextResponse.json({ error: "Problema e loja são obrigatórios." }, { status: 400 });
    }

    const { chave, logado } = await identificar(req);
    let limite: Awaited<ReturnType<typeof consumirUsoIa>> = "ok";
    try {
      limite = await consumirUsoIa(chave, logado ? LIMITE_COM_CONTA : LIMITE_SEM_CONTA, LIMITE_GLOBAL);
    } catch (dbErr) {
      // Se o banco falhar, não derruba o site — mas registra.
      console.error("[LIMITE] falha ao checar uso:", dbErr);
    }
    if (limite === "pessoa") {
      return NextResponse.json({
        error: logado
          ? `Você chegou ao limite de ${LIMITE_COM_CONTA} reclamações por hoje. Amanhã libera de novo.`
          : `Você chegou ao limite de ${LIMITE_SEM_CONTA} reclamações por hoje sem conta. Entre na sua conta (grátis) para gerar mais.`,
      }, { status: 429 });
    }
    if (limite === "global") {
      console.error("[LIMITE] teto global diário atingido");
      return NextResponse.json({
        error: "Estamos com muita procura agora. Tente de novo em algumas horas.",
      }, { status: 429 });
    }

    const { textos, uso } = await gerarTextos(body);
    console.log(`[IA] in=${uso.input_tokens} out=${uso.output_tokens} cache_read=${uso.cache_read_input_tokens ?? 0}`);

    // Coleta anônima — nunca quebra a resposta principal
    try {
      await registrarCaso({
        storeId:    body.store ?? "unknown",
        problemId:  body.problem ?? "unknown",
        valueRange: getValueRange(body.value),
      });
    } catch (dbErr) {
      console.error("registrarCaso error:", dbErr);
    }

    return NextResponse.json(textos);
  } catch (err) {
    if (err instanceof IaRecusou) {
      return NextResponse.json({ error: "Não conseguimos gerar esse texto. Revise os detalhes e tente de novo." }, { status: 422 });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Muita gente usando agora. Tente de novo em 1 minuto." }, { status: 503 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`[IA] erro ${err.status}:`, err.message);
      return NextResponse.json({ error: "A IA está instável agora. Tente de novo em instantes." }, { status: 502 });
    }
    console.error("Erro na API /api/gerar:", err);
    return NextResponse.json({ error: "Erro interno. Tente de novo." }, { status: 500 });
  }
}
