"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

/** Link do topo: "Entrar" ou "Meus casos", conforme o login. */
export default function AuthNav() {
  const [logado, setLogado] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getSession().then(({ data }) => setLogado(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setLogado(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (logado === null) return null;
  return logado
    ? <Link href="/meus-casos" className="nav-auth">Meus casos</Link>
    : <Link href="/entrar" className="nav-auth">Entrar</Link>;
}
