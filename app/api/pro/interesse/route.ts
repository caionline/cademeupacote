import { NextResponse } from "next/server";
import { PROBLEMS, STORES } from "@/lib/constants";
import { registrarEventoFunil, registrarInteressePro } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Quero acompanhar meu caso": entra na lista dos primeiros do Pro.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const plano = body.plano === "mensal" ? "mensal" : "trimestral";
    const problemId = PROBLEMS.some(p => p.id === body.problemId) ? body.problemId : null;
    const storeId   = STORES.some(s => s.id === body.storeId) ? body.storeId : null;

    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email ?? String(body.email ?? "").trim();

    if (!EMAIL_REGEX.test(email) || email.length > 200) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const origem = body.origem === "meus_casos" ? "meus_casos" : "resultado";
    await registrarInteressePro({ email, plano, userId: user?.id ?? null, problemId, storeId, origem });
    try {
      await registrarEventoFunil({ tipo: "oferta_lead", problemId, storeId, logado: !!user });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PRO] erro ao registrar interesse:", err);
    return NextResponse.json({ error: "Não conseguimos registrar agora. Tente de novo." }, { status: 500 });
  }
}
