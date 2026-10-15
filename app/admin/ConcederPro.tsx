"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConcederPro() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [dias, setDias] = useState(30);
  const [status, setStatus] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function liberar(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm(`Liberar ${dias} dias de Pro para ${email}?`)) return;
    setEnviando(true);
    setStatus(null);
    const r = await fetch("/api/admin/pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, dias }),
    });
    const d = await r.json();
    setEnviando(false);
    if (!r.ok) { setStatus(`❌ ${d.error ?? "Erro"}`); return; }
    setStatus(`✓ Pro liberado até ${new Date(d.ate).toLocaleDateString("pt-BR")}`);
    setEmail("");
    router.refresh();
  }

  return (
    <form className="adm-form" onSubmit={liberar}>
      <input type="email" required placeholder="email@da.pessoa" value={email} onChange={e => setEmail(e.target.value)} />
      <select value={dias} onChange={e => setDias(Number(e.target.value))}>
        <option value={7}>7 dias</option>
        <option value={30}>30 dias</option>
        <option value={90}>90 dias</option>
        <option value={365}>1 ano</option>
      </select>
      <button className="btn btn-primary btn-sm" disabled={enviando}>{enviando ? "Liberando..." : "Liberar Pro"}</button>
      {status && <p className="adm-nota" style={{ width: "100%" }}>{status}</p>}
    </form>
  );
}
