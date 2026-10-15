import { NextResponse } from "next/server";
import { getCasosPrazoVencido, getLembretesVencidos, marcarLembreteEnviado, marcarPrazoAvisado } from "@/lib/db";
import { enviarAvisoPrazo, enviarLembrete } from "@/lib/lembrete-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Chamado 1x por dia pela Vercel Cron (ver vercel.json).
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("[LEMBRETES] RESEND_API_KEY não configurada");
    return NextResponse.json({ error: "RESEND_API_KEY ausente." }, { status: 500 });
  }

  const vencidos = await getLembretesVencidos();
  let enviados = 0;
  let falhas   = 0;

  for (const l of vencidos) {
    try {
      await enviarLembrete(l);
      await marcarLembreteEnviado(l.id);
      enviados++;
    } catch (err) {
      // Fica na fila e tenta de novo amanhã.
      falhas++;
      console.error("[LEMBRETES] falha ao enviar:", err instanceof Error ? err.message : err);
    }
  }

  // Pro: prazos de resposta que venceram
  const prazos = await getCasosPrazoVencido();
  let avisados = 0;
  for (const c of prazos) {
    try {
      await enviarAvisoPrazo({ email: c.email, nome: c.nome, storeId: c.store_id, storeNome: c.store_nome, etapa: c.etapa });
      await marcarPrazoAvisado(c);
      avisados++;
    } catch (err) {
      falhas++;
      console.error("[PRAZOS] falha ao avisar:", err instanceof Error ? err.message : err);
    }
  }

  console.log(`[LEMBRETES] vencidos=${vencidos.length} enviados=${enviados} prazos=${prazos.length} avisados=${avisados} falhas=${falhas}`);
  return NextResponse.json({ vencidos: vencidos.length, enviados, prazos: prazos.length, avisados, falhas });
}
