import { redirect } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { getUsuario } from "@/lib/supabase/server";
import CadastroForm from "./CadastroForm";

export const metadata = { title: "Complete seu cadastro — Cadê Meu Pacote", robots: { index: false } };

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const u = await getUsuario();
  if (!u) redirect("/entrar?next=/cadastro");

  return (
    <SiteShell>
      <div className="conta-card">
        <h1 className="conta-h1">Falta pouco</h1>
        <p className="conta-sub">Esses dados assinam suas reclamações e preenchem os formulários do Consumidor.gov e do Juizado pra você.</p>
        <CadastroForm
          email={u.user.email ?? ""}
          perfil={u.perfil}
          next={next && next.startsWith("/") && !next.startsWith("//") ? next : "/meus-casos"}
        />
      </div>
    </SiteShell>
  );
}
