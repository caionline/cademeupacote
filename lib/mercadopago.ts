import { createHmac, timingSafeEqual } from "crypto";

// Integração com o Mercado Pago (Checkout Pro) via API REST.
const API = "https://api.mercadopago.com";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cademeupacote.com.br";

function token(): string {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("MP_ACCESS_TOKEN não configurado");
  return t;
}

async function mp<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Mercado Pago ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Cria o checkout (Pix ou cartão à vista). Retorna o link pra onde mandar a pessoa. */
export async function criarCheckout(p: {
  pagamentoId: string;
  titulo: string;
  valor: number;
  email: string;
}): Promise<{ preferenceId: string; url: string }> {
  const pref = await mp<{ id: string; init_point: string; sandbox_init_point: string }>("/checkout/preferences", {
    method: "POST",
    headers: { "X-Idempotency-Key": p.pagamentoId },
    body: JSON.stringify({
      items: [{ id: "pro", title: p.titulo, quantity: 1, unit_price: p.valor, currency_id: "BRL" }],
      payer: { email: p.email },
      external_reference: p.pagamentoId,
      notification_url: `${SITE}/api/pagamentos/webhook`,
      back_urls: {
        success: `${SITE}/pro/obrigado?id=${p.pagamentoId}`,
        pending: `${SITE}/pro/obrigado?id=${p.pagamentoId}`,
        failure: `${SITE}/pro?erro=pagamento`,
      },
      auto_return: "approved",
      statement_descriptor: "CADEMEUPACOTE",
      payment_methods: {
        excluded_payment_types: [{ id: "ticket" }], // sem boleto: demora e quase ninguém paga
        installments: 1,
      },
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 3600_000).toISOString(),
    }),
  });
  return { preferenceId: pref.id, url: pref.init_point };
}

export type PagamentoMP = {
  id: number;
  status: "approved" | "pending" | "in_process" | "rejected" | "cancelled" | "refunded" | "charged_back" | string;
  external_reference: string | null;
  transaction_amount: number;
  payment_type_id: string;
  currency_id: string;
};

/** Consulta o pagamento direto no Mercado Pago (fonte da verdade, nunca confia no corpo do webhook). null = não existe. */
export async function buscarPagamento(id: string): Promise<PagamentoMP | null> {
  try {
    return await mp<PagamentoMP>(`/v1/payments/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Mercado Pago 404")) return null;
    throw e;
  }
}

/**
 * Confere a assinatura do webhook (cabeçalho x-signature) com a chave secreta do painel.
 * Formato: "ts=...,v1=..." assinando "id:{data.id};request-id:{x-request-id};ts:{ts};".
 */
export function assinaturaValida(req: Request, dataId: string): boolean {
  const segredo = process.env.MP_WEBHOOK_SECRET;
  if (!segredo) return true; // sem segredo configurado, a segurança vem de consultar o pagamento na API
  const assinatura = req.headers.get("x-signature") ?? "";
  const requestId = req.headers.get("x-request-id") ?? "";
  const partes = Object.fromEntries(assinatura.split(",").map(p => p.trim().split("=") as [string, string]));
  if (!partes.ts || !partes.v1) return false;
  const manifesto = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${partes.ts};`;
  const esperado = createHmac("sha256", segredo).update(manifesto).digest("hex");
  return esperado.length === partes.v1.length && timingSafeEqual(Buffer.from(esperado), Buffer.from(partes.v1));
}
