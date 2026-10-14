import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// USO ÚNICO: copia casos e e-mails do Upstash Redis para o Supabase.
// Chamar com: Authorization: Bearer <CRON_SECRET>. Apagar esta rota depois.
export async function POST(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const redis = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! });
  const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });

  async function todasChaves(padrao: string): Promise<string[]> {
    const out: string[] = [];
    let cursor: string | number = 0;
    do {
      const [next, keys]: [string | number, string[]] = await redis.scan(cursor, { match: padrao, count: 500 });
      out.push(...keys);
      cursor = next;
    } while (String(cursor) !== "0");
    return out;
  }

  // Casos (caso:<ts>:<rand>)
  const casoKeys = await todasChaves("caso:*");
  const casos: Array<Record<string, unknown>> = [];
  for (const k of casoKeys) {
    const h = await redis.hgetall<Record<string, string | number>>(k);
    if (!h?.storeId) continue;
    casos.push({
      created_at:  new Date(Number(h.ts)).toISOString(),
      store_id:    String(h.storeId),
      problem_id:  String(h.problemId),
      value_range: h.valueRange ? String(h.valueRange) : null,
    });
  }
  for (let i = 0; i < casos.length; i += 500) {
    const { error } = await db.from("casos").insert(casos.slice(i, i + 500));
    if (error) return NextResponse.json({ etapa: "casos", error: error.message }, { status: 500 });
  }

  // E-mails (email:<md5>). Quem pediu há mais de 7 dias não recebe lembrete atrasado.
  const emailKeys = await todasChaves("email:*");
  const SETE_DIAS = 7 * 24 * 60 * 60 * 1000;
  const lembretes: Array<Record<string, unknown>> = [];
  for (const k of emailKeys) {
    const raw = await redis.get(k);
    const d = (typeof raw === "string" ? JSON.parse(raw) : raw) as { email?: string; storeId?: string; problemId?: string; ts?: number } | null;
    if (!d?.email) continue;
    const ts = Number(d.ts) || Date.now();
    const enviarEm = ts + SETE_DIAS;
    lembretes.push({
      email:      d.email.toLowerCase(),
      store_id:   d.storeId ?? "unknown",
      problem_id: d.problemId ?? "unknown",
      created_at: new Date(ts).toISOString(),
      enviar_em:  new Date(enviarEm).toISOString(),
      enviado_em: enviarEm < Date.now() ? new Date().toISOString() : null,
    });
  }
  if (lembretes.length) {
    const { error } = await db.from("lembretes").upsert(lembretes, { onConflict: "email" });
    if (error) return NextResponse.json({ etapa: "lembretes", error: error.message }, { status: 500 });
  }

  return NextResponse.json({ casos: casos.length, emails: lembretes.length });
}
