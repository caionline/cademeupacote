import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { consumirUsoIa, registrarUsoIa, usuarioEhPro } from "@/lib/db";
import { extrairDePrints, IaRecusou, type ImagemPrint } from "@/lib/ia";
import { MODELO } from "@/lib/ia";
import { identificar } from "@/lib/quem";
import { verificarTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const maxDuration = 60;

// Leituras de prints por dia (são baratas, mas têm limite). O global protege a fatura.
const LIMITE_SEM_CONTA = 3;
const LIMITE_COM_CONTA = 5;
const LIMITE_PRO = 30;
const LIMITE_GLOBAL = 1000;

const MAX_IMAGENS = 4;
const MAX_BASE64 = 1_400_000; // ~1 MB por imagem (o navegador já reduz antes de enviar)
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

// Recebe prints da compra e devolve os campos do formulário preenchidos.
// As imagens não são guardadas: passam pela IA e são descartadas.
export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Leitura de prints indisponível agora." }, { status: 500 });
    }

    const body = await req.json().catch(() => null) as { imagens?: ImagemPrint[]; turnstile?: string } | null;

    if (!(await verificarTurnstile(body?.turnstile))) {
      return NextResponse.json({ error: "Não conseguimos confirmar que você não é um robô. Recarregue a página e tente de novo." }, { status: 403 });
    }
    const imagens = Array.isArray(body?.imagens) ? body!.imagens : [];
    if (imagens.length === 0 || imagens.length > MAX_IMAGENS) {
      return NextResponse.json({ error: `Envie de 1 a ${MAX_IMAGENS} prints.` }, { status: 400 });
    }
    for (const img of imagens) {
      if (!TIPOS.includes(img?.mediaType) || typeof img?.base64 !== "string" || img.base64.length > MAX_BASE64 || !/^[A-Za-z0-9+/=]+$/.test(img.base64)) {
        return NextResponse.json({ error: "Algum print está num formato que não conseguimos ler. Use JPG ou PNG." }, { status: 400 });
      }
    }

    const { chave, logado, userId } = await identificar(req);
    try {
      const pro = userId ? await usuarioEhPro(userId) : false;
      const r = await consumirUsoIa(`x:${chave}`, pro ? LIMITE_PRO : logado ? LIMITE_COM_CONTA : LIMITE_SEM_CONTA, LIMITE_GLOBAL);
      if (r === "pessoa") {
        return NextResponse.json({ error: "Você chegou ao limite de leituras de prints por hoje. Preencha os dados à mão, que funciona igual." }, { status: 429 });
      }
      if (r === "global") {
        return NextResponse.json({ error: "Muita procura agora. Preencha os dados à mão, que funciona igual." }, { status: 429 });
      }
    } catch (e) {
      console.error("[LIMITE] falha ao checar uso de prints:", e);
    }

    const { dados, uso } = await extrairDePrints(imagens);
    console.log(`[IA prints] n=${imagens.length} in=${uso.input_tokens} out=${uso.output_tokens}`);
    await registrarUsoIa("prints", MODELO, uso);

    if (!dados.eh_compra) {
      return NextResponse.json({ error: "Não encontramos dados de uma compra nesses prints. Tente o print do pedido, do rastreio ou do e-mail da loja." }, { status: 422 });
    }
    return NextResponse.json(dados);
  } catch (err) {
    if (err instanceof IaRecusou) {
      return NextResponse.json({ error: "Não conseguimos ler esses prints. Preencha os dados à mão." }, { status: 422 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`[IA prints] erro ${err.status}:`, err.message);
      return NextResponse.json({ error: "A leitura está instável agora. Tente de novo ou preencha à mão." }, { status: 502 });
    }
    console.error("[IA prints] erro:", err);
    return NextResponse.json({ error: "Erro ao ler os prints. Preencha os dados à mão." }, { status: 500 });
  }
}
