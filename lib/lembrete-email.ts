import { createHmac } from "crypto";
import { PROBLEMS, STORES } from "@/lib/constants";
import type { Lembrete } from "@/lib/db";

const SITE = "https://www.cademeupacote.com.br";
const FROM = process.env.LEMBRETE_FROM || "Cadê Meu Pacote <lembrete@cademeupacote.com.br>";

/** Assinatura do link de cancelamento — impede que alguém cancele o lembrete de outra pessoa. */
export function tokenCancelamento(id: string): string {
  return createHmac("sha256", process.env.CRON_SECRET || "").update(id).digest("hex").slice(0, 32);
}

function montarEmail(l: Lembrete): { subject: string; html: string; text: string } {
  const loja     = STORES.find(s => s.id === l.storeId)?.name;
  const problema = PROBLEMS.find(p => p.id === l.problemId)?.title.toLowerCase();
  const comLoja  = loja ? ` com a ${loja}` : "";
  const cancelar = `${SITE}/api/cancelar-lembrete?id=${l.id}&t=${tokenCancelamento(l.id)}`;

  const subject = loja ? `E aí, a ${loja} resolveu?` : "E aí, a loja resolveu?";

  const text = [
    "Oi! Faz 7 dias que você gerou sua reclamação no Cadê Meu Pacote" + (problema ? ` (${problema}${comLoja}).` : "."),
    "",
    "Se a loja já resolveu: ótimo! Não precisa fazer mais nada.",
    "",
    "Se ainda não resolveu, o próximo passo é subir o tom:",
    "1. Registre no Consumidor.gov.br (a loja tem até 10 dias pra responder): https://www.consumidor.gov.br",
    "   Se a loja não estiver lá, use o Procon do seu estado.",
    "2. Sem solução, dá pra entrar no Juizado Especial Cível: sem custas na 1ª instância e, até 20 salários mínimos, sem advogado.",
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
    <li>Registre no <a href="https://www.consumidor.gov.br" style="color:#F97316">Consumidor.gov.br</a> (a loja tem até 10 dias pra responder). Se a loja não estiver lá, use o Procon do seu estado.</li>
    <li>Sem solução, dá pra entrar no Juizado Especial Cível: sem custas na 1ª instância e, até 20 salários mínimos, sem advogado.</li>
  </ol>
  <a href="${SITE}/app" style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:10px">Gerar texto pro próximo passo</a>
  <p style="font-size:12px;line-height:1.5;color:#78716C;margin:32px 0 0">
    Este é o único lembrete que vamos te mandar. Você recebeu porque pediu no site.
    <a href="${cancelar}" style="color:#78716C">Não quero receber</a>.
  </p>
</div></body></html>`;

  return { subject, html, text };
}

async function enviarEmail(to: string, m: { subject: string; html: string; text: string }): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], ...m }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

export async function enviarLembrete(l: Lembrete): Promise<void> {
  await enviarEmail(l.email, montarEmail(l));
}

// ---------------------------------------------------------------------------
// Pro: aviso de prazo vencido
// ---------------------------------------------------------------------------

const escapar = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const ETAPA_NOME: Record<string, string> = {
  sac: "SAC da loja", reclameaqui: "Reclame Aqui", consumidorgov: "Consumidor.gov ou Procon", jec: "Juizado Especial",
};
const PROXIMA: Record<string, string> = { sac: "reclameaqui", reclameaqui: "consumidorgov", consumidorgov: "jec" };

export async function enviarAvisoPrazo(c: {
  email: string; nome: string | null; storeId: string; storeNome: string | null; etapa: string;
}): Promise<void> {
  const loja = escapar(c.storeNome ?? STORES.find(s => s.id === c.storeId)?.name ?? "a loja");
  const nome = c.nome ? escapar(c.nome.split(" ")[0]) : "";
  const etapa = ETAPA_NOME[c.etapa] ?? c.etapa;
  const proxima = ETAPA_NOME[PROXIMA[c.etapa]] ?? null;
  const subject = `O prazo da ${loja.replace(/&[a-z#0-9]+;/g, "")} venceu`;

  const text = [
    `Oi${nome ? `, ${nome}` : ""}! O prazo que demos pra ${loja} responder pelo ${etapa} venceu.`,
    "",
    "Se a loja já resolveu, marque o caso como resolvido.",
    proxima ? `Se não resolveu, o próximo passo é o ${proxima}. O texto já pode ser gerado com todo o histórico do caso.` : "",
    "",
    `Abrir meus casos: ${SITE}/meus-casos`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="pt-BR"><body style="margin:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#1C1917">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
  <p style="font-size:14px;color:#F97316;font-weight:bold;margin:0 0 24px">📦 Cadê Meu Pacote · Pro</p>
  <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px">⏰ O prazo da ${loja} venceu</h1>
  <p style="font-size:16px;line-height:1.6;margin:0 0 16px">
    Oi${nome ? `, ${nome}` : ""}! O prazo que demos pra ${loja} responder pelo <b>${etapa}</b> terminou.
  </p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 24px">
    Se já resolveram, é só marcar o caso como resolvido.${proxima ? ` Se não, o próximo passo é o <b>${proxima}</b>: o texto sai pronto, com todo o histórico do caso.` : ""}
  </p>
  <a href="${SITE}/meus-casos" style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:10px">Ver meu caso</a>
  <p style="font-size:12px;line-height:1.5;color:#78716C;margin:32px 0 0">Você recebe este aviso porque acompanha este caso no plano Pro.</p>
</div></body></html>`;

  await enviarEmail(c.email, { subject, html, text });
}

// ---------------------------------------------------------------------------
// Pro: aviso de renovação (3 dias antes de vencer)
// ---------------------------------------------------------------------------

export async function enviarAvisoRenovacao(c: { email: string; nome: string | null; proAte: string }): Promise<void> {
  const nome = c.nome ? escapar(c.nome.split(" ")[0]) : "";
  const data = new Date(c.proAte).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const subject = `Seu Pro vence em ${data}`;

  const text = [
    `Oi${nome ? `, ${nome}` : ""}! Seu Cadê Meu Pacote Pro vence em ${data}.`,
    "",
    "Renovando, você continua com a linha do tempo dos casos, os avisos de prazo e o próximo texto pronto. Os dias se somam ao que ainda falta.",
    "",
    `Renovar: ${SITE}/pro`,
    "",
    "Não quer renovar? Não precisa fazer nada: nada é cobrado automaticamente.",
  ].join("\n");

  const html = `<!doctype html>
<html lang="pt-BR"><body style="margin:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#1C1917">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
  <p style="font-size:14px;color:#F97316;font-weight:bold;margin:0 0 24px">📦 Cadê Meu Pacote · Pro</p>
  <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px">Seu Pro vence em ${data}</h1>
  <p style="font-size:16px;line-height:1.6;margin:0 0 24px">
    Oi${nome ? `, ${nome}` : ""}! Renovando, você continua com a linha do tempo dos casos, os avisos de prazo e o próximo texto pronto. Os dias se somam ao que ainda falta.
  </p>
  <a href="${SITE}/pro" style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:10px">Renovar meu Pro</a>
  <p style="font-size:12px;line-height:1.5;color:#78716C;margin:32px 0 0">Não quer renovar? Não precisa fazer nada: nada é cobrado automaticamente.</p>
</div></body></html>`;

  await enviarEmail(c.email, { subject, html, text });
}
