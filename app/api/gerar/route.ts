import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { PROBLEMS, STORES, type FormState } from "@/lib/constants";

export const runtime = "nodejs";
export const maxDuration = 30;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildPrompt(data: FormState) {
  const problem = PROBLEMS.find(p => p.id === data.problem);
  const store = STORES.find(s => s.id === data.store);
  const storeName =
    data.store === "other" ? (data.storeOtherName || "a loja") : (store?.name || "a loja");

  return `Você é um especialista em direito do consumidor brasileiro. Vai gerar TRÊS versões de uma reclamação para um consumidor, cada uma adaptada a um canal diferente.

DADOS DO CASO:
- Loja: ${storeName}
- Problema: ${problem?.title ?? "Problema com a compra"}
- Data da compra: ${data.purchaseDate || "não informada"}
- Data prometida de entrega: ${data.promisedDate || "não informada"}
- Produto: ${data.product || "não especificado"}
- Valor pago: ${data.value ? `R$ ${data.value}` : "não informado"}
- Número do pedido: ${data.orderNumber || "não informado"}
- Detalhes adicionais do consumidor: ${data.details || "(nenhum detalhe extra fornecido)"}
- Nome do consumidor: ${data.name || "[NOME DO CONSUMIDOR]"}
- CPF do consumidor: ${data.cpf || "[CPF DO CONSUMIDOR]"}

CANAIS:

1) WHATSAPP/SAC — Tom: direto, firme mas educado, em português coloquial. Curto (até 8 linhas). Sem juridiquês pesado, mas mencionando UMA vez "Código de Defesa do Consumidor" pra dar peso. Termina pedindo retorno em prazo claro (48h ou 7 dias).

2) RECLAME AQUI — Tom: público, indignado mas profissional. Pra ser lido por outros consumidores. Médio (até 12 linhas). Inclui fatos cronológicos e demanda específica. Cita CDC art. 35 ou art. 18 conforme o caso.

3) CONSUMIDOR.GOV — Tom: formal, jurídico, embasado. Pra órgão oficial. Longo (até 18 linhas). Cita artigos específicos do CDC (Lei 8.078/90), prazos legais, e exige resolução em prazo formal (10 dias úteis). Tom de quem sabe seus direitos.

REGRAS IMPORTANTES:
- Use SOMENTE as informações fornecidas. Se faltar dado importante, escreva "[informar]" no lugar.
- Não invente datas, valores, ou detalhes.
- Cada versão deve ser autocontida (não dependa das outras).
- Formato de saída: JSON estrito, sem nenhum texto antes ou depois, sem markdown, sem \`\`\`. Apenas o JSON.

FORMATO DE SAÍDA (responda APENAS com este JSON):
{
  "whatsapp": "texto completo do whatsapp aqui",
  "reclameaqui": "texto completo do reclame aqui aqui",
  "consumidor": "texto completo do consumidor.gov aqui"
}`;
}

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key não configurada no servidor." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as FormState;

    // Validação mínima
    if (!body.problem || !body.store) {
      return NextResponse.json(
        { error: "Problema e loja são obrigatórios." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2500,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const textBlock = message.content.find(b => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "Resposta inesperada da IA." }, { status: 502 });
    }

    let raw = textBlock.text.trim();
    // Remove eventuais blocos de markdown se a IA decidir devolver
    raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");

    let parsed: { whatsapp: string; reclameaqui: string; consumidor: string };
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Erro de parse JSON da IA:", raw);
      return NextResponse.json({ error: "Não foi possível interpretar a resposta da IA." }, { status: 502 });
    }

    if (!parsed.whatsapp || !parsed.reclameaqui || !parsed.consumidor) {
      return NextResponse.json({ error: "Resposta da IA incompleta." }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Erro na API /api/gerar:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno." },
      { status: 500 }
    );
  }
}
