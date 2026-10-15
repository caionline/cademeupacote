import Link from "next/link";
import { redirect } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { getUsuario } from "@/lib/supabase/server";
import Aguardando from "./Aguardando";

export const metadata = { title: "Pagamento — Cadê Meu Pacote Pro", robots: { index: false } };

export default async function ObrigadoPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const u = await getUsuario();
  if (!u) redirect("/entrar?next=/meus-casos");

  // RLS: só encontra se o pagamento for desta pessoa.
  const { data: pg } = id
    ? await u.supabase.from("pagamentos").select("status, plano").eq("id", id).maybeSingle()
    : { data: null };

  const aprovado = pg?.status === "aprovado";
  const recusado = pg?.status === "recusado";

  return (
    <SiteShell>
      <div className="conta-card" style={{ textAlign: "center" }}>
        {aprovado ? (
          <>
            <div style={{ fontSize: 44 }}>🎉</div>
            <h1 className="conta-h1">Pro ativado!</h1>
            <p className="conta-sub">
              Seu acesso vai até <b>{u.perfil?.pro_ate ? new Date(u.perfil.pro_ate).toLocaleDateString("pt-BR") : "—"}</b>.
              Agora cada caso tem linha do tempo, prazos e o próximo texto pronto.
            </p>
            <Link href="/meus-casos" className="btn btn-primary btn-block">Ir pros meus casos →</Link>
          </>
        ) : recusado ? (
          <>
            <div style={{ fontSize: 44 }}>😕</div>
            <h1 className="conta-h1">Pagamento não aprovado</h1>
            <p className="conta-sub">Nada foi cobrado. Você pode tentar de novo com outra forma de pagamento.</p>
            <Link href="/pro" className="btn btn-primary btn-block">Tentar de novo</Link>
          </>
        ) : (
          <>
            <div style={{ fontSize: 44 }}>⏳</div>
            <h1 className="conta-h1">Confirmando seu pagamento</h1>
            <p className="conta-sub">No Pix costuma levar segundos. Esta página atualiza sozinha.</p>
            <Aguardando />
          </>
        )}
      </div>
    </SiteShell>
  );
}
