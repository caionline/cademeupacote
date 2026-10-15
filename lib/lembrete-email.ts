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

// ---------------------------------------------------------------------------
// Ciclo de vida: compra, pagamento não concluído, Pro venceu, boas-vindas
// ---------------------------------------------------------------------------

/** Moldura padrão dos e-mails (mesmo visual de todos). */
function moldura(p: { selo?: string; titulo: string; corpo: string; botao?: { texto: string; url: string }; rodape: string }): string {
  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#1C1917">
<div style="max-width:520px;margin:0 auto;padding:32px 24px">
  <p style="font-size:14px;color:#F97316;font-weight:bold;margin:0 0 24px">📦 Cadê Meu Pacote${p.selo ? ` · ${p.selo}` : ""}</p>
  <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px">${p.titulo}</h1>
  ${p.corpo}
  ${p.botao ? `<a href="${p.botao.url}" style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:10px;margin-top:8px">${p.botao.texto}</a>` : ""}
  <p style="font-size:12px;line-height:1.5;color:#78716C;margin:32px 0 0">${p.rodape}</p>
</div></body></html>`;
}

const par = (t: string) => `<p style="font-size:16px;line-height:1.6;margin:0 0 16px">${t}</p>`;
const primeiroNome = (n: string | null) => (n ? escapar(n.trim().split(/\s+/)[0]) : "");
const dataBR = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

/** 1) Compra aprovada: confirma o pagamento e mostra como começar. */
export async function enviarConfirmacaoCompra(c: { email: string; nome: string | null; plano: string; valor: number; proAte: string }): Promise<void> {
  const nome = primeiroNome(c.nome);
  const valor = c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const ate = dataBR(c.proAte);
  const subject = "Seu Pro está ativo ✓";
  const html = moldura({
    selo: "Pro",
    titulo: `Pagamento confirmado${nome ? `, ${nome}` : ""}!`,
    corpo:
      par(`Recebemos seu pagamento de <b>${valor}</b> (plano ${escapar(c.plano)}). Seu Pro está ativo até <b>${ate}</b>.`) +
      par("Como tirar o máximo do Pro:") +
      `<ol style="font-size:16px;line-height:1.6;margin:0 0 20px;padding-left:20px">
        <li>Gere a reclamação (ou suba os prints) e envie pelo SAC da loja.</li>
        <li>Em "Meus casos", clique em <b>Já enviei</b>: a gente conta o prazo e te avisa quando vencer.</li>
        <li>A loja respondeu? Use <b>A loja respondeu</b> e receba a análise e a sua resposta pronta.</li>
        <li>Não resolveu? Clique em <b>Não resolveram</b> e o próximo texto sai com todo o histórico.</li>
      </ol>`,
    botao: { texto: "Ir pros meus casos", url: `${SITE}/meus-casos` },
    rodape: `Não há renovação automática: avisamos antes de vencer. Desistiu em até 7 dias da compra? Devolvemos 100% (CDC, art. 49): responda este e-mail ou escreva para contato@cademeupacote.com.br.`,
  });
  const text = [
    `Pagamento confirmado${nome ? `, ${nome}` : ""}!`,
    `Recebemos ${valor} (plano ${c.plano}). Seu Pro está ativo até ${ate}.`,
    "",
    "Como usar: gere a reclamação, envie pelo SAC e clique em \"Já enviei\" em Meus casos. A gente avisa os prazos, analisa a resposta da loja e gera o próximo texto com o histórico.",
    "",
    `Meus casos: ${SITE}/meus-casos`,
    "",
    "Sem renovação automática. Desistiu em até 7 dias? Devolvemos 100% (CDC, art. 49): escreva para contato@cademeupacote.com.br.",
  ].join("\n");
  await enviarEmail(c.email, { subject, html, text });
}

/** 2) Abriu o pagamento e não concluiu: lembra com o link pra tentar de novo. */
export async function enviarPagamentoNaoConcluido(c: { email: string; nome: string | null; plano: string }): Promise<void> {
  const nome = primeiroNome(c.nome);
  const url = `${SITE}/pro?plano=${encodeURIComponent(c.plano)}`;
  const subject = "Seu Pro ficou pela metade";
  const html = moldura({
    selo: "Pro",
    titulo: `Faltou só um passo${nome ? `, ${nome}` : ""}`,
    corpo:
      par("Você começou a assinar o Pro, mas o pagamento não foi concluído. Se o Pix expirou ou o cartão deu algum problema, é só tentar de novo: leva menos de um minuto.") +
      par("Com o Pro, a gente acompanha seu caso até o fim: avisa os prazos, analisa a resposta da loja e escreve o próximo texto com todo o histórico."),
    botao: { texto: "Concluir minha assinatura", url },
    rodape: "Se você desistiu, tudo bem: não vamos insistir. Este é o único lembrete.",
  });
  const text = [
    `Faltou só um passo${nome ? `, ${nome}` : ""}.`,
    "Você começou a assinar o Pro, mas o pagamento não foi concluído. Se o Pix expirou ou o cartão falhou, tente de novo:",
    url,
    "",
    "Se você desistiu, tudo bem. Este é o único lembrete.",
  ].join("\n");
  await enviarEmail(c.email, { subject, html, text });
}

/** 3) Pro venceu: convida a continuar acompanhando os casos. */
export async function enviarProVenceu(c: { email: string; nome: string | null; proAte: string }): Promise<void> {
  const nome = primeiroNome(c.nome);
  const subject = "Seu Pro venceu";
  const html = moldura({
    selo: "Pro",
    titulo: `Seu Pro venceu em ${dataBR(c.proAte)}`,
    corpo:
      par(`Oi${nome ? `, ${nome}` : ""}! Seus casos continuam salvos em "Meus casos", mas os avisos de prazo e o próximo texto com histórico ficaram pausados.`) +
      par("Se a loja ainda não resolveu, é a hora de não deixar o caso esfriar."),
    botao: { texto: "Renovar meu Pro", url: `${SITE}/pro` },
    rodape: "Já resolveu tudo? Que bom! Não precisa fazer nada: nada é cobrado automaticamente.",
  });
  const text = [
    `Seu Pro venceu em ${dataBR(c.proAte)}.`,
    "Seus casos continuam salvos, mas os avisos de prazo e o próximo texto com histórico ficaram pausados.",
    `Renovar: ${SITE}/pro`,
    "",
    "Já resolveu? Não precisa fazer nada: nada é cobrado automaticamente.",
  ].join("\n");
  await enviarEmail(c.email, { subject, html, text });
}

/** 4) Boas-vindas ao concluir o cadastro. */
export async function enviarBoasVindas(c: { email: string; nome: string | null }): Promise<void> {
  const nome = primeiroNome(c.nome);
  const subject = "Bem-vindo ao Cadê Meu Pacote";
  const html = moldura({
    titulo: `Bem-vindo${nome ? `, ${nome}` : ""}!`,
    corpo:
      par("Sua conta está pronta. Três coisas que você já pode fazer:") +
      `<ul style="font-size:16px;line-height:1.6;margin:0 0 20px;padding-left:20px">
        <li><b>📸 Mande os prints da compra</b> e a gente preenche a reclamação pra você.</li>
        <li><b>💬 A loja respondeu?</b> Em "Meus casos", a gente diz se é enrolação e escreve sua resposta.</li>
        <li><b>🗂️ Guarde seus casos</b> com os textos pra SAC, Reclame Aqui, Consumidor.gov e Procon.</li>
      </ul>`,
    botao: { texto: "Resolver um problema", url: `${SITE}/app` },
    rodape: "Você recebeu este e-mail porque criou uma conta no Cadê Meu Pacote. Não enviamos propaganda sem a sua autorização.",
  });
  const text = [
    `Bem-vindo${nome ? `, ${nome}` : ""}! Sua conta está pronta.`,
    "- Mande os prints da compra e a gente preenche a reclamação.",
    "- A loja respondeu? Em Meus casos, a gente analisa e escreve sua resposta.",
    "- Guarde seus casos com os textos pra cada canal.",
    "",
    `Começar: ${SITE}/app`,
  ].join("\n");
  await enviarEmail(c.email, { subject, html, text });
}
