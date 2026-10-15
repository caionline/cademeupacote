"use client";

import { useState } from "react";
import type { CasoEvento, Reclamacao } from "@/lib/casos";
import { ETAPA_INFO, ETAPAS, TEXTO_INICIAL, prazoDecadencia, proximaEtapa } from "@/lib/pro";

function dataBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function diasAte(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

const DESCRICAO_EVENTO: Record<CasoEvento["tipo"], string> = {
  enviado:       "Você enviou pelo",
  nao_resolveu:  "Não resolveram pelo",
  resolvido:     "Resolvido no",
  reaberto:      "Caso reaberto no",
  texto_gerado:  "Novo texto gerado pro",
  prazo_vencido: "Prazo venceu no",
};

/** Linha do tempo do caso (Pro): etapa atual, prazo, ações e próximo texto. */
export default function CasoPro({
  caso, eventos, onAcao, onCopiar, onTexto,
}: {
  caso: Reclamacao;
  eventos: CasoEvento[];
  onAcao: (acao: "enviei" | "resolveram" | "nao_resolveram" | "reabrir") => Promise<void>;
  onCopiar: (texto: string) => void;
  onTexto: (evento: CasoEvento) => void;
}) {
  const [gerando, setGerando] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const resolvido = caso.status === "resolvido";
  const atual = ETAPAS.indexOf(caso.etapa);
  const info = ETAPA_INFO[caso.etapa];
  const prox = proximaEtapa(caso.etapa);

  // Texto da etapa atual: o último gerado com histórico, ou o inicial.
  const gerado = [...eventos].reverse().find(e => e.tipo === "texto_gerado" && e.etapa === caso.etapa)?.nota;
  const inicial = TEXTO_INICIAL[caso.etapa] ? caso.textos[TEXTO_INICIAL[caso.etapa]!] : null;
  const texto = gerado ?? inicial;
  const temHistorico = eventos.some(e => e.tipo === "enviado" || e.tipo === "nao_resolveu");

  const decadencia = prazoDecadencia(caso.problem_id, caso.dados?.purchaseDate);

  async function acao(a: Parameters<typeof onAcao>[0]) {
    setOcupado(true);
    try { await onAcao(a); } finally { setOcupado(false); }
  }

  async function gerar() {
    setErro(null);
    setGerando(true);
    try {
      const r = await fetch(`/api/casos/${caso.id}/proximo-texto`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro ao gerar.");
      onTexto({
        id: Date.now(), caso_id: caso.id, created_at: new Date().toISOString(),
        tipo: "texto_gerado", etapa: caso.etapa, nota: data.texto,
      });
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="pro-caso">
      <ol className="pro-trilha">
        {ETAPAS.map((e, i) => {
          const estado = resolvido ? (i <= atual ? "feito" : "pulado") : i < atual ? "feito" : i === atual ? "atual" : "futuro";
          return (
            <li key={e} className={`pro-passo pro-passo-${estado}`}>
              <span className="pro-passo-icone">{estado === "feito" ? "✓" : ETAPA_INFO[e].icone}</span>
              <span className="pro-passo-nome">{ETAPA_INFO[e].nome}</span>
            </li>
          );
        })}
      </ol>

      {resolvido ? (
        <div className="pro-agora pro-agora-ok">
          <strong>🎉 Caso resolvido</strong>
          <button className="btn btn-ghost btn-sm" disabled={ocupado} onClick={() => acao("reabrir")}>↺ Reabrir caso</button>
        </div>
      ) : (
        <div className="pro-agora">
          <div className="pro-agora-titulo">Agora: {info.icone} {info.nome}</div>

          {caso.etapa === "jec" ? (
            <>
              <p className="pro-agora-texto">{info.prazoTexto} {info.comoEnviar}</p>
              <p className="pro-agora-texto"><b>Separe:</b> documento com foto, comprovante de endereço, nota fiscal ou comprovante da compra, prints das conversas e os protocolos do SAC, Reclame Aqui e Consumidor.gov.</p>
              <div className="pro-em-breve">⚖️ Modelo de petição preenchido com seus dados: <b>chega em breve</b>.</div>
            </>
          ) : !caso.enviado_em ? (
            <>
              <p className="pro-agora-texto">
                {info.comoEnviar}{" "}
                {info.link && <a href={info.link} target="_blank" rel="noreferrer">Abrir {info.nome} →</a>}
              </p>
              {texto && <div className="caso-texto">{texto}</div>}
              <div className="caso-acoes">
                {texto && <button className="btn btn-primary btn-sm" onClick={() => onCopiar(texto)}>📋 Copiar texto</button>}
                {(temHistorico || !texto) && (
                  <button className="btn btn-ghost btn-sm" disabled={gerando} onClick={gerar}>
                    {gerando ? "Gerando..." : gerado ? "↻ Gerar de novo" : "✨ Gerar texto com o histórico"}
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" disabled={ocupado} onClick={() => acao("enviei")}>✓ Já enviei</button>
              </div>
              {erro && <p className="pro-erro">{erro}</p>}
            </>
          ) : (
            <>
              <p className="pro-agora-texto">
                Enviado em {dataBR(caso.enviado_em)}. {info.prazoTexto}{" "}
                {caso.prazo_em && (
                  diasAte(caso.prazo_em) > 0
                    ? <b>Prazo: {dataBR(caso.prazo_em)} (faltam {diasAte(caso.prazo_em)} dia{diasAte(caso.prazo_em) > 1 ? "s" : ""}).</b>
                    : <b className="pro-vencido">O prazo venceu em {dataBR(caso.prazo_em)}.</b>
                )}
              </p>
              <p className="pro-agora-texto">
                {caso.prazo_em && diasAte(caso.prazo_em) <= 0
                  ? "Se a loja não resolveu, é hora do próximo passo."
                  : "Vamos te avisar por e-mail quando o prazo vencer."}{" "}
                A loja respondeu?
              </p>
              <div className="caso-acoes">
                <button className="btn btn-primary btn-sm" disabled={ocupado} onClick={() => acao("resolveram")}>🎉 Resolveram</button>
                {prox && (
                  <button className="btn btn-ghost btn-sm" disabled={ocupado} onClick={() => acao("nao_resolveram")}>
                    Não resolveram → {ETAPA_INFO[prox].nome}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {decadencia && !resolvido && (
        <div className="pro-alerta">
          ⏳ <b>Atenção ao prazo pra reclamar de defeito:</b> se o produto é durável, vai até por volta de {decadencia.ate.toLocaleDateString("pt-BR")}. {decadencia.texto}
        </div>
      )}

      {eventos.length > 0 && (
        <details className="pro-historico">
          <summary>Histórico do caso ({eventos.length})</summary>
          <ul>
            {eventos.map(e => (
              <li key={e.id}>
                <span>{dataBR(e.created_at)}</span> {DESCRICAO_EVENTO[e.tipo]} {ETAPA_INFO[e.etapa as keyof typeof ETAPA_INFO]?.nome ?? e.etapa}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
