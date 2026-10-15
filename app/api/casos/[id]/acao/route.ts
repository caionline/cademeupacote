import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { calcularPrazo, ehPro, proximaEtapa, type Etapa } from "@/lib/pro";

export const runtime = "nodejs";

type Acao = "enviei" | "resolveram" | "nao_resolveram" | "reabrir";
const SO_PRO: Acao[] = ["enviei", "nao_resolveram"];

// Avança o caso na linha do tempo. Tudo roda com a sessão do usuário (só mexe no que é dele).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { acao } = (await req.json()) as { acao: Acao };

  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta." }, { status: 401 });

  if (SO_PRO.includes(acao)) {
    const { data: perfil } = await supabase.from("perfis").select("pro_ate").eq("id", user.id).single();
    if (!ehPro(perfil?.pro_ate)) return NextResponse.json({ error: "Recurso do Pro." }, { status: 403 });
  }

  const { data: caso } = await supabase
    .from("reclamacoes").select("id, etapa, status").eq("id", id).single<{ id: string; etapa: Etapa; status: string }>();
  if (!caso) return NextResponse.json({ error: "Caso não encontrado." }, { status: 404 });

  const agora = new Date();
  let mudanca: Record<string, unknown>;
  let evento: { tipo: string; etapa: string };

  switch (acao) {
    case "enviei":
      mudanca = { enviado_em: agora.toISOString(), prazo_em: calcularPrazo(caso.etapa, agora)?.toISOString() ?? null, prazo_avisado: false };
      evento = { tipo: "enviado", etapa: caso.etapa };
      break;
    case "nao_resolveram": {
      const prox = proximaEtapa(caso.etapa);
      if (!prox) return NextResponse.json({ error: "Este já é o último passo." }, { status: 400 });
      mudanca = { etapa: prox, enviado_em: null, prazo_em: null, prazo_avisado: false };
      evento = { tipo: "nao_resolveu", etapa: caso.etapa };
      break;
    }
    case "resolveram":
      mudanca = { status: "resolvido", resolvido_em: agora.toISOString(), prazo_em: null };
      evento = { tipo: "resolvido", etapa: caso.etapa };
      break;
    case "reabrir":
      mudanca = { status: "aberto", resolvido_em: null };
      evento = { tipo: "reaberto", etapa: caso.etapa };
      break;
    default:
      return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  }

  const { error: e1 } = await supabase.from("reclamacoes").update(mudanca).eq("id", id);
  if (e1) return NextResponse.json({ error: "Não conseguimos atualizar." }, { status: 500 });
  await supabase.from("caso_eventos").insert({ caso_id: id, ...evento });

  return NextResponse.json({ ok: true });
}
