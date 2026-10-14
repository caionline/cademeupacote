import { redirect } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { getUsuario } from "@/lib/supabase/server";
import EntrarForm from "./EntrarForm";

export const metadata = { title: "Entrar — Cadê Meu Pacote", robots: { index: false } };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams;
  const destino = next && next.startsWith("/") && !next.startsWith("//") ? next : "/meus-casos";
  if (await getUsuario()) redirect(destino);

  return (
    <SiteShell>
      <div className="conta-card">
        <h1 className="conta-h1">Entre na sua conta</h1>
        <p className="conta-sub">Guarde suas reclamações, acompanhe cada caso e receba os próximos passos na hora certa.</p>
        {erro && <div className="conta-erro">O link expirou ou já foi usado. Peça um novo abaixo.</div>}
        <EntrarForm next={destino} />
      </div>
    </SiteShell>
  );
}
