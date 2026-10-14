import Link from "next/link";
import { redirect } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { getUsuario } from "@/lib/supabase/server";
import type { Reclamacao } from "@/lib/casos";
import ListaCasos from "./ListaCasos";

export const metadata = { title: "Meus casos — Cadê Meu Pacote", robots: { index: false } };

export default async function MeusCasosPage() {
  const u = await getUsuario();
  if (!u) redirect("/entrar?next=/meus-casos");
  if (!u.perfil?.termos_aceitos_em) redirect("/cadastro?next=/meus-casos");

  const { data } = await u.supabase
    .from("reclamacoes")
    .select("id, created_at, store_id, store_nome, problem_id, produto, valor, numero_pedido, textos, status, resolvido_em")
    .order("created_at", { ascending: false });

  const primeiroNome = u.perfil.nome?.split(" ")[0] ?? "";

  return (
    <SiteShell>
      <div className="casos-wrap">
        <div className="casos-head">
          <div>
            <h1 className="conta-h1">Meus casos</h1>
            <p className="conta-sub" style={{ marginBottom: 0 }}>Olá{primeiroNome ? `, ${primeiroNome}` : ""}! Aqui ficam todas as suas reclamações.</p>
          </div>
          <div className="casos-head-acoes">
            <Link href="/cadastro?next=/meus-casos" className="btn btn-ghost btn-sm">Meus dados</Link>
            <form action="/auth/sair" method="post">
              <button className="btn btn-ghost btn-sm">Sair</button>
            </form>
          </div>
        </div>
        <ListaCasos inicial={(data ?? []) as Reclamacao[]} />
      </div>
    </SiteShell>
  );
}
