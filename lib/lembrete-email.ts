import { createHmac } from "crypto";
import { PROBLEMS, STORES } from "@/lib/constants";
import type { Lembrete } from "@/lib/kv";

const SITE = "https://www.cademeupacote.com.br";
const FROM = process.env.LEMBRETE_FROM || "Cadê Meu Pacote <lembrete@cademeupacote.com.br>";

/** Assinatura do link de cancelamento — impede que alguém cancele o lembrete de outra pessoa. */
export function tokenCancelamento(hash: string): string {
  return createHmac("sha256", process.env.CRON_SECRET || "").update(hash).digest("hex").slice(0, 32);
}

function montarEmail(l: Lembrete): { subject: string; html: string; text: string } {
  const loja     = STORES.find(s => s.id === l.storeId)?.name;
  const problema = PROBLEMS.find(p => p.id === l.problemId)?.title.toLowerCase();
  const comLoja  = loja ? ` com a ${loja}` : "";
  const cancelar = `${SITE}/api/cancelar-lembrete?id=${l.hash}&t=${tokenCancelamento(l.hash)}`;

  const subject = loja ? `E aí, a ${loja} resolveu?` : "E aí, a loja resolveu?";

  const text = [
    "Oi! Faz 7 dias que você gerou sua reclamação no Cadê Meu Pacote" + (problema ? ` (${problema}${comLoja}).` : "."),
    "",
    "Se a loja já resolveu: ótimo! Não precisa fazer mais nada.",
    "",
    "Se ainda não resolveu, o próximo passo é subir o tom:",
    "1. Registre no Consumidor.gov.br (a loja tem até 10 dias pra responder): https://www.consumidor.gov.br",
    "2. Sem solução lá, dá pra entrar no Juizado Especial Cível — até 20 salários mínimos não precisa de advogado.",
    "",
    `Gere um novo texto, já focado no próximo canal: ${SITE}/app`,
    "",
    "Este é o único lembrete que vamos te mandar.",
    `Não quer receber? ${cancelar}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="pt-BR"><body style="margin:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#1C1917">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
  <p style="font-size:14px;color:#F97316;font-weight:bold;margin:0 0 24px">📦 Cadê Meu Pacote</p>
  <h1 style="font-size:24px;line-height:1.3;margin:0 0 16px">${subject}</h1>
  <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
    Faz 7 dias que você gerou sua reclamação${problema ? ` (<b>${problema}</b>${comLoja})` : ""}.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
    <b>Se a loja já resolveu:</b> ótimo! Não precisa fazer mais nada.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 8px"><b>Se ainda não resolveu</b>, é hora de subir o tom:</p>
  <ol style="font-size:16px;line-height:1.6;margin:0 0 24px;padding-left:20px">
    <li>Registre no <a href="https://www.consumidor.gov.br" style="color:#F97316">Consumidor.gov.br</a> — a loja tem até 10 dias pra responder.</li>
    <li>Sem solução lá, dá pra entrar no Juizado Especial Cível. Até 20 salários mínimos, não precisa de advogado.</li>
  </ol>
  <a href="${SITE}/app" style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:10px">Gerar texto pro próximo passo</a>
  <p style="font-size:12px;line-height:1.5;color:#78716C;margin:32px 0 0">
    Este é o único lembrete que vamos te mandar. Você recebeu porque pediu no site.
    <a href="${cancelar}" style="color:#78716C">Não quero receber</a>.
  </p>
</div></body></html>`;

  return { subject, html, text };
}

export async function enviarLembrete(l: Lembrete): Promise<void> {
  const { subject, html, text } = montarEmail(l);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [l.email], subject, html, text }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}
