import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config";

/** Cliente do servidor com a sessão do usuário (lida dos cookies). */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado de um Server Component: o proxy.ts já renova a sessão.
        }
      },
    },
  });
}

export type Perfil = {
  id: string;
  nome: string | null;
  whatsapp: string | null;
  cpf: string | null;
  termos_aceitos_em: string | null;
  marketing_ok: boolean;
  pro_ate: string | null;
  fundador: boolean;
};

/** Usuário logado + perfil, ou null. */
export async function getUsuario() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await supabase.from("perfis").select("*").eq("id", user.id).single<Perfil>();
  return { user, perfil, supabase };
}
