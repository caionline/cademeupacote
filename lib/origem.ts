// Canal de onde veio a visita (?ref=copping, ?utm_source=meta...).
// Fica num cookie próprio do site, então o servidor lê sozinho em qualquer rota.

export const ORIGEM_COOKIE = "cmp_origem";
const NOVENTA_DIAS_S = 90 * 24 * 60 * 60;

/** Normaliza o valor (minúsculo, só letras/números/-/_, até 40 caracteres). Inválido → null. */
export function limparOrigem(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  return s || null;
}

/** Navegador: se a URL trouxer ?ref= ou ?utm_source=, guarda (o mais recente vence). */
export function capturarOrigem(): void {
  const q = new URLSearchParams(window.location.search);
  const origem = limparOrigem(q.get("ref")) ?? limparOrigem(q.get("utm_source"));
  if (!origem) return;
  document.cookie = `${ORIGEM_COOKIE}=${origem}; Max-Age=${NOVENTA_DIAS_S}; Path=/; SameSite=Lax`;
}

/** Navegador: canal guardado, ou null. */
export function lerOrigem(): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${ORIGEM_COOKIE}=([^;]*)`));
  return m ? limparOrigem(m[1]) : null;
}

/** Servidor: canal guardado no cookie da requisição. */
export function origemDaRequisicao(req: Request): string | null {
  const m = (req.headers.get("cookie") ?? "").match(new RegExp(`(?:^|; )${ORIGEM_COOKIE}=([^;]*)`));
  return m ? limparOrigem(m[1]) : null;
}
