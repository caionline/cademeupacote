"use client";

import { useEffect, useRef, useState } from "react";
import { pixel } from "@/lib/meta";
import { PLANOS, PLANOS_PUBLICOS, type Plano } from "@/lib/planos";

function evento(tipo: "resultado_visto" | "oferta_clicada", problemId: string | null, storeId: string | null) {
  fetch("/api/funil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo, problemId, storeId }),
    keepalive: true,
  }).catch(() => {});
}

/** Oferta do Pro na tela de resultado: escolhe o plano e vai direto pra assinatura. */
export default function ProOferta({ problemId, storeId }: { problemId: string | null; storeId: string | null; logado: boolean }) {
  const [plano, setPlano] = useState<Plano>("trimestral");
  const contou = useRef(false);

  useEffect(() => {
    if (contou.current) return;
    contou.current = true;
    evento("resultado_visto", problemId, storeId);
  }, [problemId, storeId]);

  function assinar() {
    evento("oferta_clicada", problemId, storeId);
    pixel("InteressePro", { content_name: plano, content_category: "resultado" });
    window.location.href = `/pro?plano=${plano}`;
  }

  return (
    <div className="pro-oferta">
      <span className="pro-selo">Cadê Meu Pacote Pro</span>
      <h4>A loja não resolveu de primeira? A gente vai até o fim com você.</h4>
      <ul className="pro-lista">
        <li><span>⏰</span> Avisamos quando vence o prazo de cada etapa, pra você não perder nenhum</li>
        <li><span>✍️</span> Geramos o próximo texto com o histórico do caso: Reclame Aqui, Consumidor.gov e Procon</li>
        <li><span>💬</span> A loja respondeu? A gente diz se é enrolação e escreve sua resposta</li>
      </ul>

      <div className="pro-planos" role="radiogroup" aria-label="Plano">
        {PLANOS_PUBLICOS.map(p => (
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

      <button className="btn btn-primary btn-block" onClick={assinar}>
        Quero acompanhar meu caso · {PLANOS[plano].preco} →
      </button>
      <p className="pro-nota">Pix ou cartão · sem renovação automática · desistiu em até 7 dias, devolvemos 100%.</p>
    </div>
  );
}
