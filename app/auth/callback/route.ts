import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// Volta do Google ou do link no e-mail: troca o código por uma sessão.
export async function GET(req: Request) {
  const url  = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (code) {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const { data: perfil } = await supabase
        .from("perfis").select("termos_aceitos_em").eq("id", data.user.id).single();
      // Primeiro acesso: completa o cadastro antes de seguir.
      const destino = perfil?.termos_aceitos_em ? next : `/cadastro?next=${encodeURIComponent(next)}`;
      return NextResponse.redirect(new URL(destino, url.origin));
    }
  }
  return NextResponse.redirect(new URL("/entrar?erro=link", url.origin));
}

// Só aceita caminhos internos (evita redirecionar pra site de terceiros).
function safeNext(n: string | null): string {
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/meus-casos";
}
