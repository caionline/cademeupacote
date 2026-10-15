import { NextResponse, after } from "next/server";
import { enviarEventoMeta } from "@/lib/meta-capi";
import type { EventoMeta } from "@/lib/meta";

export const runtime = "nodejs";

// InteressePro sai direto de /api/pro/interesse (lá o servidor tem o e-mail).
const PERMITIDOS: EventoMeta[] = ["PageView", "ViewContent", "ReclamacaoGerada"];
const CHAVES = ["content_name", "content_category", "store_id", "problem_id"];

// Cópia pelo servidor (Conversions API) de um evento que o Pixel já mandou do navegador.
export async function POST(req: Request) {
  try {
    const { evento, eventId, url, dados } = await req.json();
    if (!PERMITIDOS.includes(evento) || typeof eventId !== "string" || !/^[\w-]{8,64}$/.test(eventId)) {
      return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
    }
    const limpos: Record<string, string> = {};
    for (const k of CHAVES) {
      if (typeof dados?.[k] === "string") limpos[k] = dados[k].slice(0, 100);
    }
    after(() => enviarEventoMeta(req, {
      evento,
      eventId,
      url: typeof url === "string" ? url.slice(0, 500) : null,
      dados: limpos,
    }));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
