"use client";

import { useEffect, useRef, useState } from "react";

type Plano = "mensal" | "trimestral";

const PLANOS: Record<Plano, { nome: string; preco: string; detalhe: string; selo?: string }> = {
  trimestral: { nome: "Trimestral", preco: "R$ 34,90", detalhe: "R$ 11,63/mês · cobre o ciclo de um caso", selo: "Economize 22%" },
  mensal:     { nome: "Mensal",     preco: "R$ 14,90", detalhe: "por mês · cancele quando quiser" },
};

function evento(tipo: "resultado_visto" | "oferta_clicada", problemId: string | null, storeId: string | null) {
  fetch("/api/funil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, problemId, storeId }),
    keepalive: true,
  }).catch(() => {});
}

/** Oferta do Pro na tela de resultado. Enquanto o Pro não lança, captura interessados. */
export default function ProOferta({ problemId, storeId, logado }: { problemId: string | null; storeId: string | null; logado: boolean }) {
  const [plano, setPlano]   = useState<Plano>("trimestral");
  const [etapa, setEtapa]   = useState<"oferta" | "email" | "enviando" | "ok">("oferta");
  const [email, setEmail]   = useState("");
  const [erro, setErro]     = useState<string | null>(null);
  const contou = useRef(false);

  useEffect(() => {
    if (contou.current) return;
    contou.current = true;
    evento("resultado_visto", problemId, storeId);
  }, [problemId, storeId]);

  async function enviar(emailInformado?: string) {
    setErro(null);
    setEtapa("enviando");
    try {
      const r = await fetch("/api/pro/interesse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano, problemId, storeId, email: emailInformado }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro");
      setEtapa("ok");
    } catch (e) {
      setErro((e as Error).message || "Não conseguimos registrar agora. Tente de novo.");
      setEtapa(logado ? "oferta" : "email");
    }
  }

  function quero() {
    evento("oferta_clicada", problemId, storeId);
    if (logado) enviar();
    else setEtapa("email");
  }

  if (etapa === "ok") {
    return (
      <div className="pro-oferta pro-ok">
        <div style={{ fontSize: 32 }}>🎉</div>
        <h4>Você está entre os primeiros!</h4>
        <p>O Pro está na reta final. Assim que lançar, te avisamos por e-mail com o <b>preço de fundador</b>. Enquanto isso, mande o texto acima pra loja: é o primeiro passo.</p>
      </div>
    );
  }

  return (
    <div className="pro-oferta">
      <span className="pro-selo">Lançamento em breve · preço de fundador</span>
      <h4>A loja não resolveu de primeira? A gente vai até o fim com você.</h4>
      <ul className="pro-lista">
        <li><span>⏰</span> Avisamos cada prazo legal, pra você não perder nenhum</li>
        <li><span>✍️</span> Geramos o próximo texto com o histórico do caso: Reclame Aqui, Procon e Consumidor.gov</li>
        <li><span>⚖️</span> Chegou no limite? Modelo de petição pro Juizado Especial preenchido com seus dados</li>
      </ul>

      <div className="pro-planos" role="radiogroup" aria-label="Plano">
        {(Object.keys(PLANOS) as Plano[]).map(p => (
          <button
            key={p}
            role="radio"
            aria-checked={plano === p}
            className={`pro-plano${plano === p ? " ativo" : ""}`}
            onClick={() => setPlano(p)}
          >
            {PLANOS[p].selo && <span className="pro-plano-selo">{PLANOS[p].selo}</span>}
            <span className="pro-plano-nome">{PLANOS[p].nome}</span>
            <span className="pro-plano-preco">{PLANOS[p].preco}</span>
            <span className="pro-plano-detalhe">{PLANOS[p].detalhe}</span>
          </button>
        ))}
      </div>

      {etapa === "email" || (etapa === "enviando" && !logado) ? (
        <form className="pro-email" onSubmit={e => { e.preventDefault(); enviar(email); }}>
          <input type="email" required autoFocus placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn btn-primary" disabled={etapa === "enviando"}>
            {etapa === "enviando" ? "Enviando..." : "Garantir minha vaga"}
          </button>
        </form>
      ) : (
        <button className="btn btn-primary btn-block" onClick={quero} disabled={etapa === "enviando"}>
          {etapa === "enviando" ? "Enviando..." : "Quero acompanhar meu caso →"}
        </button>
      )}
      {erro && <p className="pro-erro">{erro}</p>}
      <p className="pro-nota">Sem compromisso agora. Você só paga quando o Pro lançar, se quiser.</p>
    </div>
  );
}
