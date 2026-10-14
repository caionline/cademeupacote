"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/config";

export default function EntrarForm({ next }: { next: string }) {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "enviado">("idle");
  const [erro, setErro]     = useState<string | null>(null);
  const [google, setGoogle] = useState(false);

  // Só mostra o botão do Google quando ele estiver ativado no Supabase.
  useEffect(() => {
    fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_PUBLISHABLE_KEY } })
      .then(r => r.json())
      .then(s => setGoogle(!!s?.external?.google))
      .catch(() => {});
  }, []);

  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function entrarGoogle() {
    setErro(null);
    const { error } = await supabaseBrowser().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback() },
    });
    if (error) setErro("O login com Google ainda não está disponível. Use o e-mail abaixo.");
  }

  async function entrarEmail(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setStatus("enviando");
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback() },
    });
    if (error) {
      setStatus("idle");
      setErro(error.status === 429
        ? "Muitas tentativas. Espere alguns minutos e tente de novo."
        : "Não conseguimos enviar o link. Confira o e-mail e tente de novo.");
      return;
    }
    setStatus("enviado");
  }

  if (status === "enviado") {
    return (
      <div className="conta-ok">
        <div style={{ fontSize: 32 }}>📬</div>
        <strong>Confira seu e-mail</strong>
        <p>Mandamos um link de acesso para <b>{email}</b>. Abra no mesmo aparelho e navegador. Não chegou? Olhe o spam.</p>
        <button className="btn btn-ghost" onClick={() => setStatus("idle")}>Usar outro e-mail</button>
      </div>
    );
  }

  return (
    <>
      {google && (<>
      <button className="btn btn-google btn-block" onClick={entrarGoogle}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
        </svg>
        Entrar com Google
      </button>

      <div className="conta-ou"><span>ou</span></div>
      </>)}

      <form onSubmit={entrarEmail} className="field-group">
        <div className="field">
          <label htmlFor="email">Seu e-mail</label>
          <input id="email" type="email" required autoComplete="email" placeholder="voce@email.com"
                 value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" disabled={status === "enviando"}>
          {status === "enviando" ? "Enviando..." : "Receber link de acesso"}
        </button>
      </form>

      {erro && <div className="conta-erro" style={{ marginTop: 16 }}>{erro}</div>}
      <p className="conta-nota">Sem senha. Ao entrar pela primeira vez, criamos sua conta.</p>
    </>
  );
}
