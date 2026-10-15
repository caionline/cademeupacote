import { NextResponse } from "next/server";
import { PROBLEMS, STORES } from "@/lib/constants";
import { registrarEventoFunil, type EventoFunil } from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";
import { origemDaRequisicao } from "@/lib/origem";

export const runtime = "nodejs";

const TIPOS: EventoFunil[] = ["resultado_visto", "oferta_clicada"];

// Evento anônimo do funil da oferta do Pro (sem dado pessoal).
export async function POST(req: Request) {
  try {
    const { tipo, problemId, storeId } = await req.json();
    if (!TIPOS.includes(tipo)) return NextResponse.json({ error: "Evento inválido." }, { status: 400 });

    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    await registrarEventoFunil({
      tipo,
      problemId: PROBLEMS.some(p => p.id === problemId) ? problemId : null,
      storeId:   STORES.some(s => s.id === storeId) ? storeId : null,
      logado:    !!user,
      canal:     origemDaRequisicao(req),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[FUNIL] erro:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
