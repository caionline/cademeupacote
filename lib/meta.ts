// Pixel da Meta no navegador. Cada evento também vai pelo servidor (Conversions API)
// com o mesmo eventId, e a Meta descarta a cópia repetida.

export const META_PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").replace(/\D/g, "");

export type EventoMeta = "PageView" | "ViewContent" | "ReclamacaoGerada" | "InteressePro" | "Purchase";

const PADRAO: EventoMeta[] = ["PageView", "ViewContent", "Purchase"];

declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

export function novoEventId(): string {
  return crypto.randomUUID();
}

/** Só o Pixel (o servidor manda a cópia por conta própria, ex.: InteressePro). */
export function pixel(evento: EventoMeta, dados: Record<string, unknown> = {}, eventId = novoEventId()): string {
  if (META_PIXEL_ID && window.fbq) {
    window.fbq(PADRAO.includes(evento) ? "track" : "trackCustom", evento, dados, { eventID: eventId });
  }
  return eventId;
}

/** Pixel + Conversions API (via /api/meta). */
export function rastrear(evento: Exclude<EventoMeta, "InteressePro" | "Purchase">, dados: Record<string, unknown> = {}): void {
  if (!META_PIXEL_ID) return;
  const eventId = pixel(evento, dados);
  fetch("/api/meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ evento, eventId, url: window.location.href, dados }),
    keepalive: true,
  }).catch(() => {});
}
