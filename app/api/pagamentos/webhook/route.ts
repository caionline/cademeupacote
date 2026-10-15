import { NextResponse } from "next/server";
import { aprovarPagamento, dadosConfirmacao, getPagamento, marcarPagamento } from "@/lib/db";
import { enviarConfirmacaoCompra } from "@/lib/lembrete-email";
import { enviarEventoMeta } from "@/lib/meta-capi";
import { assinaturaValida, buscarPagamento } from "@/lib/mercadopago";

export const runtime = "nodejs";

// Aviso do Mercado Pago. Nunca confiamos no corpo: consultamos o pagamento na API
// e conferimos referência e valor antes de liberar o Pro.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = await req.json().catch(() => ({}));
  const tipo = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = String(body?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "");

  if (tipo !== "payment" || !/^\d+$/.test(dataId)) return NextResponse.json({ ok: true }); // outros avisos: ignora
  if (!assinaturaValida(req, dataId)) {
    console.warn("[WEBHOOK] assinatura inválida");
    return NextResponse.json({ error: "assinatura" }, { status: 401 });
  }

  try {
    const mp = await buscarPagamento(dataId);
    if (!mp) return NextResponse.json({ ok: true, aviso: "pagamento inexistente" });
    const ref = mp.external_reference;
    const nosso = ref ? await getPagamento(ref) : null;
    if (!nosso) {
      console.warn(`[WEBHOOK] pagamento ${dataId} sem referência conhecida`);
      return NextResponse.json({ ok: true });
    }

    if (mp.status === "approved") {
      if (mp.currency_id !== "BRL" || Math.abs(mp.transaction_amount - nosso.valor) > 0.01) {
        console.error(`[WEBHOOK] valor divergente no pagamento ${dataId}: ${mp.transaction_amount} vs ${nosso.valor}`);
        return NextResponse.json({ ok: true });
      }
      const liberou = await aprovarPagamento(nosso.id, String(mp.id), mp.payment_type_id);
      console.log(`[WEBHOOK] pagamento ${dataId} aprovado (${mp.payment_type_id}) — Pro ${liberou ? "liberado" : "já estava liberado"}`);
      if (liberou) {
        // Confirmação da compra (Decreto 7.962/2013). Falha no e-mail nunca derruba a liberação.
        try {
          const c = await dadosConfirmacao(nosso.id);
          if (c) {
            await enviarConfirmacaoCompra(c);
            await enviarEventoMeta(null, {
              evento: "Purchase",
              eventId: `compra-${nosso.id}`,
              url: "https://www.cademeupacote.com.br/pro/obrigado",
              email: c.email,
              dados: { value: c.valor, currency: "BRL", content_name: c.plano },
              contexto: c.metaContexto,
            });
          }
        } catch (e) {
          console.error("[WEBHOOK] falha ao enviar confirmação:", e instanceof Error ? e.message : e);
        }
      }
    } else if (mp.status === "rejected" || mp.status === "cancelled") {
      await marcarPagamento(nosso.id, "recusado", String(mp.id));
    } else if (mp.status === "refunded" || mp.status === "charged_back") {
      // Reembolso/contestação: registra; retirar o Pro é decisão manual por enquanto.
      console.warn(`[WEBHOOK] pagamento ${dataId} ${mp.status} — revisar acesso Pro do usuário ${nosso.user_id}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Erro nosso: devolve 500 pro Mercado Pago tentar de novo depois.
    console.error("[WEBHOOK] erro:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "erro" }, { status: 500 });
  }
}
