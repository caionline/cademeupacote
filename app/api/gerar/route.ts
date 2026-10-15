import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { PROBLEMS, STORES, type FormState } from "@/lib/constants";
import { randomUUID } from "crypto";
import { consumirUsoIa, liberarGratis, registrarCaso, registrarUsoIa, reservarGratis, usuarioEhPro } from "@/lib/db";
import { gerarTextos, IaRecusou } from "@/lib/ia";
import { MODELO } from "@/lib/ia";
import { identificar } from "@/lib/quem";
import { verificarTurnstile } from "@/lib/turnstile";
import { getValueRange } from "@/lib/value-ranges";

export const runtime = "nodejs";
export const maxDuration = 60;

// Quem não é Pro tem 1 reclamação grátis a cada 15 dias (por conta e por aparelho).
// Os limites diários seguem como freio contra abuso; o global protege a fatura da Anthropic.
const LIMITE_SEM_CONTA = 5;
const LIMITE_COM_CONTA = 15;
const LIMITE_GLOBAL    = 500;
const COOKIE_APARELHO  = "cmp_dev";

function lerCookie(req: Request, nome: string): string | null {
  const par = req.headers.get("cookie")?.split(";").map(c => c.trim()).find(c => c.startsWith(`${nome}=`));
  return par ? decodeURIComponent(par.slice(nome.length + 1)) : null;
}

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key não configurada no servidor." }, { status: 500 });
    }

    const body = (await req.json()) as FormState & { turnstile?: string };

    if (!(await verificarTurnstile(body.turnstile))) {
      return NextResponse.json({ error: "Não conseguimos confirmar que você não é um robô. Recarregue a página e tente de novo." }, { status: 403 });
    }

    if (!PROBLEMS.some(p => p.id === body.problem) || !STORES.some(s => s.id === body.store)) {
      return NextResponse.json({ error: "Problema e loja são obrigatórios." }, { status: 400 });
    }

    const { chave, logado, userId } = await identificar(req);

    // Reclamação grátis: 1 a cada 15 dias. Pro não passa por aqui.
    const aparelho = lerCookie(req, COOKIE_APARELHO) ?? randomUUID();
    const marcarAparelho = (res: NextResponse) => {
      res.cookies.set(COOKIE_APARELHO, aparelho, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 * 2 });
      return res;
    };
    const chavesGratis = [`g:d:${aparelho}`, ...(userId ? [`g:u:${userId}`] : [])];
    let gratisReservado = false;
    try {
      const pro = userId ? await usuarioEhPro(userId) : false;
      if (!pro) {
        const liberaEm = await reservarGratis(chavesGratis);
        if (liberaEm) {
          return marcarAparelho(NextResponse.json({
            error: "Você já usou sua reclamação grátis. A próxima libera em 15 dias, ou assine o Pro para gerar sem espera.",
            codigo: "gratis_usado",
            liberaEm: liberaEm.toISOString(),
          }, { status: 429 }));
        }
        gratisReservado = true;
      }
    } catch (dbErr) {
      console.error("[GRATIS] falha ao checar:", dbErr);
    }
    const devolver = async () => { if (gratisReservado) await liberarGratis(chavesGratis); };

    let limite: Awaited<ReturnType<typeof consumirUsoIa>> = "ok";
    try {
      limite = await consumirUsoIa(chave, logado ? LIMITE_COM_CONTA : LIMITE_SEM_CONTA, LIMITE_GLOBAL);
    } catch (dbErr) {
      // Se o banco falhar, não derruba o site — mas registra.
      console.error("[LIMITE] falha ao checar uso:", dbErr);
    }
    if (limite === "pessoa") {
      await devolver();
      return NextResponse.json({
        error: logado
          ? `Você chegou ao limite de ${LIMITE_COM_CONTA} reclamações por hoje. Amanhã libera de novo.`
          : `Você chegou ao limite de ${LIMITE_SEM_CONTA} reclamações por hoje sem conta. Entre na sua conta (grátis) para gerar mais.`,
      }, { status: 429 });
    }
    if (limite === "global") {
      console.error("[LIMITE] teto global diário atingido");
      await devolver();
      return NextResponse.json({
        error: "Estamos com muita procura agora. Tente de novo em algumas horas.",
      }, { status: 429 });
    }

    let textos, uso;
    try {
      ({ textos, uso } = await gerarTextos(body));
    } catch (e) {
      await devolver();
      throw e;
    }
    console.log(`[IA] in=${uso.input_tokens} out=${uso.output_tokens} cache_read=${uso.cache_read_input_tokens ?? 0}`);
    await registrarUsoIa("reclamacao", MODELO, uso);

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

    return marcarAparelho(NextResponse.json(textos));
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
