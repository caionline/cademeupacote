import { NextResponse } from "next/server";
import { criarPagamento, reservarFundador, salvarPreferencia } from "@/lib/db";
import { origemDaRequisicao } from "@/lib/origem";
import { criarCheckout } from "@/lib/mercadopago";
import { CANAL_FUNDADOR, LIMITE_FUNDADORES, PLANOS, planoValido } from "@/lib/planos";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Cria o pagamento e devolve o link do checkout do Mercado Pago.
export async function POST(req: Request) {
  const { plano } = await req.json().catch(() => ({}));
  if (!planoValido(plano)) return NextResponse.json({ error: "Plano inválido." }, { status: 400 });

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Entre na sua conta para assinar." }, { status: 401 });

  const p = PLANOS[plano];
  try {
    if (plano === "fundador") {
      const { data: perfil } = await supabase.from("perfis").select("fundador").eq("id", user.id).single();
      const veioDaCopping = origemDaRequisicao(req) === CANAL_FUNDADOR;
      if (!perfil?.fundador && !veioDaCopping) {
        return NextResponse.json({ error: "O preço de fundador é exclusivo da comunidade Copping." }, { status: 403 });
      }
      if (!(await reservarFundador(user.id, LIMITE_FUNDADORES))) {
        return NextResponse.json({ error: "As 100 vagas de fundador acabaram. Escolha outro plano." }, { status: 409 });
      }
    }

    const pagamentoId = await criarPagamento({ userId: user.id, plano, valor: p.valor, dias: p.dias });
    const { preferenceId, url } = await criarCheckout({
      pagamentoId,
      titulo: `Cadê Meu Pacote Pro · ${p.nome}`,
      valor: p.valor,
      email: user.email,
    });
    await salvarPreferencia(pagamentoId, preferenceId);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[CHECKOUT] erro:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Não conseguimos abrir o pagamento. Tente de novo." }, { status: 502 });
  }
}
