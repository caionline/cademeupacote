import Link from "next/link";
import { redirect } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { getUsuario } from "@/lib/supabase/server";
import type { CasoEvento, Reclamacao } from "@/lib/casos";
import { ehPro } from "@/lib/pro";
import { getAdmin } from "@/lib/admin";
import ListaCasos from "./ListaCasos";

export const metadata = { title: "Meus casos — Cadê Meu Pacote", robots: { index: false } };

export default async function MeusCasosPage() {
  const u = await getUsuario();
  if (!u) redirect("/entrar?next=/meus-casos");
  if (!u.perfil?.termos_aceitos_em) redirect("/cadastro?next=/meus-casos");

  const { data } = await u.supabase
    .from("reclamacoes")
    .select("id, created_at, store_id, store_nome, problem_id, produto, valor, numero_pedido, textos, status, resolvido_em, etapa, enviado_em, prazo_em, dados")
    .order("created_at", { ascending: false });

  const pro = ehPro(u.perfil.pro_ate);
  const { data: eventos } = pro
    ? await u.supabase.from("caso_eventos").select("id, caso_id, created_at, tipo, etapa, nota").order("created_at")
    : { data: [] };

  const primeiroNome = u.perfil.nome?.split(" ")[0] ?? "";
  const admin = !!(await getAdmin());

  return (
    <SiteShell>
      <div className="casos-wrap">
        <div className="casos-head">
          <div>
            <h1 className="conta-h1">Meus casos{pro && <span className="selo-pro">PRO</span>}</h1>
            <p className="conta-sub" style={{ marginBottom: 0 }}>Olá{primeiroNome ? `, ${primeiroNome}` : ""}! Aqui ficam todas as suas reclamações.</p>
          </div>
          <div className="casos-head-acoes">
            {admin && <Link href="/admin" className="btn btn-ghost btn-sm">📊 Painel</Link>}
            <Link href="/cadastro?next=/meus-casos" className="btn btn-ghost btn-sm">Meus dados</Link>
            <form action="/auth/sair" method="post">
              <button className="btn btn-ghost btn-sm">Sair</button>
            </form>
          </div>
        </div>
        <ListaCasos inicial={(data ?? []) as Reclamacao[]} eventos={(eventos ?? []) as CasoEvento[]} pro={pro} />
      </div>
    </SiteShell>
  );
}
