"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";
import { TERMOS_VERSAO } from "@/lib/supabase/config";
import { formatCPF, validateCPF } from "@/lib/cpf";
import { formatPhone, validPhone } from "@/lib/phone";
import type { Perfil } from "@/lib/supabase/server";

export default function CadastroForm({ email, perfil, next }: { email: string; perfil: Perfil | null; next: string }) {
  const router = useRouter();
  const [nome, setNome]           = useState(perfil?.nome ?? "");
  const [whatsapp, setWhatsapp]   = useState(perfil?.whatsapp ? formatPhone(perfil.whatsapp) : "");
  const [cpf, setCpf]             = useState(perfil?.cpf ? formatCPF(perfil.cpf) : "");
  const [termos, setTermos]       = useState(!!perfil?.termos_aceitos_em);
  const [marketing, setMarketing] = useState(perfil?.marketing_ok ?? false);
  const [salvando, setSalvando]   = useState(false);
  const [erro, setErro]           = useState<string | null>(null);

  const cpfInvalido = cpf !== "" && !validateCPF(cpf);
  const ok = nome.trim().split(/\s+/).length >= 2 && validPhone(whatsapp) && !cpfInvalido && termos;

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!ok) return;
    setSalvando(true);
    setErro(null);
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/entrar?next=/cadastro"); return; }
    const { error } = await supabase.from("perfis").update({
      nome:              nome.trim(),
      whatsapp:          whatsapp.replace(/\D/g, ""),
      cpf:               cpf ? cpf.replace(/\D/g, "") : null,
      marketing_ok:      marketing,
      termos_aceitos_em: perfil?.termos_aceitos_em ?? new Date().toISOString(),
      termos_versao:     TERMOS_VERSAO,
    }).eq("id", user.id);
    if (error) {
      setSalvando(false);
      setErro("Não conseguimos salvar. Tente de novo.");
      return;
    }
    // Primeiro cadastro: e-mail de boas-vindas (o servidor garante que sai uma vez só).
    if (!perfil?.termos_aceitos_em) {
      fetch("/api/conta/boas-vindas", { method: "POST", keepalive: true }).catch(() => {});
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={salvar} className="field-group">
      <div className="field">
        <label>E-mail</label>
        <input value={email} disabled />
      </div>
      <div className="field">
        <label htmlFor="nome">Nome completo *</label>
        <input id="nome" autoComplete="name" placeholder="Ex: Maria Silva Souza" value={nome} onChange={e => setNome(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="whats">WhatsApp *</label>
        <input id="whats" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" value={whatsapp}
               onChange={e => setWhatsapp(formatPhone(e.target.value))} />
        <span className="field-hint">Pra avisar dos prazos do seu caso.</span>
      </div>
      <div className="field">
        <label htmlFor="cpf">CPF</label>
        <input id="cpf" inputMode="numeric" placeholder="000.000.000-00" value={cpf}
               onChange={e => setCpf(formatCPF(e.target.value))} />
        <span className="field-hint">Opcional agora. Necessário pra Consumidor.gov e Juizado.</span>
        {cpfInvalido && <span className="conta-campo-erro">CPF inválido</span>}
      </div>

      <label className="conta-check">
        <input type="checkbox" checked={termos} onChange={e => setTermos(e.target.checked)} />
        <span>Li e aceito os <Link href="/termos" target="_blank">Termos de uso</Link> e a <Link href="/privacidade" target="_blank">Política de privacidade</Link>. *</span>
      </label>
      <label className="conta-check">
        <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
        <span>Quero receber dicas sobre direitos do consumidor e novidades (pode cancelar quando quiser).</span>
      </label>

      {erro && <div className="conta-erro">{erro}</div>}
      <button className="btn btn-primary btn-block" disabled={!ok || salvando}>
        {salvando ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
