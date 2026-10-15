import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server";

// Link do e-mail de acesso. Aponta pro nosso domínio (melhor entrega que o link do Supabase)
// e funciona mesmo se a pessoa abrir em outro aparelho.
export async function GET(req: Request) {
  const url        = new URL(req.url);
  const token_hash = url.searchParams.get("token_hash");
  const type       = (url.searchParams.get("type") ?? "email") as EmailOtpType;
  const next       = nextDe(url.searchParams.get("redirect_to"));

  if (token_hash) {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error && data.user) {
      const { data: perfil } = await supabase
        .from("perfis").select("termos_aceitos_em").eq("id", data.user.id).single();
      const destino = perfil?.termos_aceitos_em ? next : `/cadastro?next=${encodeURIComponent(next)}`;
      return NextResponse.redirect(new URL(destino, url.origin));
    }
  }
  return NextResponse.redirect(new URL("/entrar?erro=link", url.origin));
}

// redirect_to vem como ".../auth/callback?next=/meus-casos": pega só o "next", e só se for caminho interno.
function nextDe(redirectTo: string | null): string {
  try {
    const n = redirectTo ? new URL(redirectTo).searchParams.get("next") : null;
    if (n && n.startsWith("/") && !n.startsWith("//")) return n;
  } catch {}
  return "/meus-casos";
}
