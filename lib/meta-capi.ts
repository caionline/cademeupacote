import { createHash } from "node:crypto";
import type { EventoMeta } from "./meta";

// Conversions API da Meta (servidor). Sem NEXT_PUBLIC_META_PIXEL_ID ou META_CAPI_TOKEN, não faz nada.
const VERSAO_GRAPH = "v23.0";

function sha256(v: string): string {
  return createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
}

function cookie(req: Request, nome: string): string | undefined {
  const m = (req.headers.get("cookie") ?? "").match(new RegExp(`(?:^|; )${nome}=([^;]*)`));
  return m?.[1];
}

export async function enviarEventoMeta(req: Request, e: {
  evento: EventoMeta;
  eventId: string;
  url?: string | null;
  email?: string | null;
  dados?: Record<string, string | number | null>;
}): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token   = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const user_data: Record<string, unknown> = {
    client_ip_address: ip || undefined,
    client_user_agent: req.headers.get("user-agent") || undefined,
    fbp: cookie(req, "_fbp"),
    fbc: cookie(req, "_fbc"),
    em: e.email ? [sha256(e.email)] : undefined,
  };

  const body: Record<string, unknown> = {
    data: [{
      event_name:       e.evento,
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         e.eventId,
      action_source:    "website",
      event_source_url: e.url || req.headers.get("referer") || undefined,
      user_data,
      custom_data:      e.dados,
    }],
  };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const r = await fetch(`https://graph.facebook.com/${VERSAO_GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) console.error("[META] CAPI recusou:", r.status, await r.text());
  } catch (err) {
    console.error("[META] CAPI falhou:", err);
  }
}
