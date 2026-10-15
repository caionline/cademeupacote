"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANOS, type Plano } from "@/lib/planos";

export default function Assinar({ logado, planos, planoInicial }: { logado: boolean; planos: Plano[]; planoInicial: Plano }) {
  const router = useRouter();
  const [plano, setPlano] = useState<Plano>(planoInicial);
  const [indo, setIndo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function assinar() {
    if (!logado) {
      router.push(`/entrar?next=${encodeURIComponent(`/pro?plano=${plano}`)}`);
      return;
    }
    setErro(null);
    setIndo(true);
    try {
      const r = await fetch("/api/pagamentos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro ao abrir o pagamento.");
      window.location.href = data.url;
    } catch (e) {
      setErro((e as Error).message);
      setIndo(false);
    }
  }

  return (
    <div className="pro-assinar">
      <div className="pro-planos" role="radiogroup" aria-label="Plano">
        {planos.map(p => (
          <button
            key={p}
            role="radio"
            aria-checked={plano === p}
            className={`pro-plano${plano === p ? " ativo" : ""}`}
            onClick={() => setPlano(p)}
          >
            {PLANOS[p].selo && <span className="pro-plano-selo">{PLANOS[p].selo}</span>}
            <span className="pro-plano-nome">{PLANOS[p].nome}</span>
            <span className="pro-plano-preco">
              {PLANOS[p].precoDe && <s className="pro-plano-de">{PLANOS[p].precoDe}</s>} {PLANOS[p].preco}
            </span>
            <span className="pro-plano-detalhe">{PLANOS[p].detalhe}</span>
          </button>
        ))}
      </div>
      <button className="btn btn-primary btn-block" onClick={assinar} disabled={indo}>
        {indo ? "Abrindo o pagamento..." : logado ? `Assinar ${PLANOS[plano].nome} · ${PLANOS[plano].preco}` : "Entrar e assinar →"}
      </button>
      <p className="pro-nota">Pix ou cartão pelo Mercado Pago. O Pro é liberado na hora em que o pagamento é aprovado.</p>
      {erro && <p className="pro-erro">{erro}</p>}
    </div>
  );
}
