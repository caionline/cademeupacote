import { createHash } from "crypto";
import { supabaseServer } from "@/lib/supabase/server";

/** Quem está pedindo: id da conta, ou hash do IP (nunca guardamos o IP puro). */
export async function identificar(req: Request): Promise<{ chave: string; logado: boolean }> {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return { chave: `u:${user.id}`, logado: true };
  } catch {}
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "desconhecido";
  const hash = createHash("sha256").update(`${ip}:${process.env.CRON_SECRET ?? ""}`).digest("hex").slice(0, 32);
  return { chave: `ip:${hash}`, logado: false };
}
