import { NextResponse } from "next/server";
import { reservarBoasVindas } from "@/lib/db";
import { enviarBoasVindas } from "@/lib/lembrete-email";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Chamado ao concluir o cadastro. Só envia uma vez por conta, e só depois do aceite dos termos.
export async function POST() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    if (await reservarBoasVindas(user.id)) {
      const { data: perfil } = await supabase.from("perfis").select("nome").eq("id", user.id).single();
      await enviarBoasVindas({ email: user.email, nome: perfil?.nome ?? null });
    }
  } catch (e) {
    console.error("[BOAS-VINDAS] falha:", e instanceof Error ? e.message : e);
  }
  return NextResponse.json({ ok: true });
}
