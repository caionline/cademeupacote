// Turnstile (Cloudflare): prova de que é uma pessoa antes de gastar IA.
// O navegador gera um token; o nosso servidor confere no verificador (Worker) publicado na conta Cloudflare do site.

export const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || "0x4AAAAAAFX52GudKxQSolDP";
const VERIFICADOR = process.env.TURNSTILE_VERIFY_URL || "https://turnstile-siteverify-cademeupacote.cademeupacote.workers.dev/";

/**
 * Confere o token no servidor. Se o verificador estiver fora do ar, deixa passar (o site não pode parar por isso)
 * e os limites diários continuam protegendo a conta.
 */
export async function verificarTurnstile(token: unknown): Promise<boolean> {
  if (typeof token !== "string" || token.length < 10 || token.length > 4096) return false;
  try {
    const r = await fetch(VERIFICADOR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000),
    });
    const d = await r.json() as { success?: boolean; "error-codes"?: string[] };
    if (!d.success) console.warn("[TURNSTILE] recusado:", d["error-codes"]);
    return d.success === true;
  } catch (e) {
    console.error("[TURNSTILE] verificador indisponível, liberando:", e instanceof Error ? e.message : e);
    return true;
  }
}
