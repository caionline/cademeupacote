import { timingSafeEqual } from "crypto";
import { cancelarLembrete } from "@/lib/kv";
import { tokenCancelamento } from "@/lib/lembrete-email";

export const runtime = "nodejs";

function pagina(titulo: string, msg: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title></head>
<body style="font-family:Arial,sans-serif;background:#FAF7F2;color:#1C1917;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px">
<div style="max-width:420px;text-align:center"><h1 style="font-size:22px">${titulo}</h1><p style="line-height:1.6">${msg}</p>
<p><a href="/" style="color:#F97316">Voltar pro site</a></p></div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id  = url.searchParams.get("id") ?? "";
  const t   = url.searchParams.get("t") ?? "";
  const esperado = tokenCancelamento(id);

  const valido = /^[a-f0-9]{32}$/.test(id) && t.length === esperado.length &&
    timingSafeEqual(Buffer.from(t), Buffer.from(esperado));
  if (!valido) {
    return pagina("Link inválido", "Esse link de cancelamento não é válido.", 400);
  }

  await cancelarLembrete(id);
  return pagina("Pronto, cancelado", "Você não vai receber nenhum e-mail nosso. Apagamos seu endereço.");
}
