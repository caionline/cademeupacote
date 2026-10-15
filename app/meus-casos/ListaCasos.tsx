"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CHANNELS, PROBLEMS, STORES, type Channel } from "@/lib/constants";
import { salvarPendente, type CasoEvento, type Reclamacao } from "@/lib/casos";
import CasoPro from "./CasoPro";
import { supabaseBrowser } from "@/lib/supabase/client";

function dataBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function diasDesde(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

function valorEmReais(v: string | null): number {
  if (!v) return 0;
  const n = parseFloat(v.replace(/[^\d,]/g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}

export default function ListaCasos({ inicial, eventos: eventosIniciais, pro }: { inicial: Reclamacao[]; eventos: CasoEvento[]; pro: boolean }) {
  const router = useRouter();
  const [casos, setCasos] = useState(inicial);
  const [eventos, setEventos] = useState(eventosIniciais);
  const [interesse, setInteresse] = useState(false);
  const [aberto, setAberto] = useState<string | null>(inicial[0]?.id ?? null);
  const [canal, setCanal] = useState<Channel>("whatsapp");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setCasos(inicial);
    setAberto(a => a ?? inicial[0]?.id ?? null);
  }, [inicial]);
  useEffect(() => { setEventos(eventosIniciais); }, [eventosIniciais]);

  async function acaoPro(c: Reclamacao, acao: "enviei" | "resolveram" | "nao_resolveram" | "reabrir") {
    const r = await fetch(`/api/casos/${c.id}/acao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao }),
    });
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      mostrar(d?.error || "Não conseguimos atualizar. Tente de novo.");
      return;
    }
    mostrar(
      acao === "resolveram" ? "Boa! Caso resolvido 🎉" :
      acao === "enviei" ? "Anotado! Vamos acompanhar o prazo." :
      acao === "nao_resolveram" ? "Próximo passo liberado. Bora subir o tom." : "Caso reaberto",
    );
    router.refresh();
  }

  async function quererPro(c: Reclamacao) {
    const r = await fetch("/api/pro/interesse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plano: "trimestral", problemId: c.problem_id, storeId: c.store_id, origem: "meus_casos" }),
    });
    if (r.ok) { setInteresse(true); mostrar("Você está na lista! Te avisamos no lançamento."); }
    else mostrar("Não conseguimos registrar agora. Tente de novo.");
  }

  // Caso gerado antes do login: salva agora.
  useEffect(() => {
    salvarPendente().then(salvou => {
      if (salvou) {
        mostrar("Reclamação salva na sua conta ✓");
        router.refresh();
      }
    });
  }, [router]);

  function mostrar(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      mostrar("Copiado ✓");
    } catch {
      mostrar("Não deu pra copiar. Selecione o texto manualmente.");
    }
  }

  async function alternarStatus(c: Reclamacao) {
    const novo = c.status === "aberto" ? "resolvido" : "aberto";
    const resolvido_em = novo === "resolvido" ? new Date().toISOString() : null;
    setCasos(cs => cs.map(x => x.id === c.id ? { ...x, status: novo, resolvido_em } : x));
    const { error } = await supabaseBrowser().from("reclamacoes").update({ status: novo, resolvido_em }).eq("id", c.id);
    if (error) {
      setCasos(cs => cs.map(x => x.id === c.id ? c : x));
      mostrar("Não conseguimos atualizar. Tente de novo.");
    } else {
      mostrar(novo === "resolvido" ? "Boa! Caso resolvido 🎉" : "Caso reaberto");
    }
  }

  async function apagar(c: Reclamacao) {
    if (!confirm("Apagar este caso? Não dá pra desfazer.")) return;
    const { error } = await supabaseBrowser().from("reclamacoes").delete().eq("id", c.id);
    if (error) return mostrar("Não conseguimos apagar. Tente de novo.");
    setCasos(cs => cs.filter(x => x.id !== c.id));
    mostrar("Caso apagado");
  }

  if (casos.length === 0) {
    return (
      <div className="casos-vazio">
        <div style={{ fontSize: 40 }}>📭</div>
        <strong>Nenhum caso ainda</strong>
        <p>Gere sua primeira reclamação. Ela fica salva aqui automaticamente.</p>
        <Link href="/app" className="btn btn-primary">Resolver um problema →</Link>
      </div>
    );
  }

  const abertos = casos.filter(c => c.status === "aberto");
  const emDisputa = abertos.reduce((s, c) => s + valorEmReais(c.valor), 0);
  const vencidos = abertos.filter(c => c.prazo_em && new Date(c.prazo_em).getTime() < Date.now()).length;

  return (
    <>
      {pro && (
        <div className="pro-painel">
          <div><strong>{abertos.length}</strong><span>em aberto</span></div>
          <div><strong>{emDisputa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><span>em disputa</span></div>
          <div className={vencidos ? "pro-painel-alerta" : ""}><strong>{vencidos}</strong><span>prazo{vencidos === 1 ? "" : "s"} vencido{vencidos === 1 ? "" : "s"}</span></div>
        </div>
      )}
      <div className="casos-lista">
        {casos.map(c => {
          const loja = c.store_nome ?? STORES.find(s => s.id === c.store_id)?.name ?? "Loja";
          const emoji = STORES.find(s => s.id === c.store_id)?.emoji ?? "🏬";
          const problema = PROBLEMS.find(p => p.id === c.problem_id)?.title ?? "Problema";
          const dias = diasDesde(c.created_at);
          const expandido = aberto === c.id;

          return (
            <div key={c.id} className={`caso-card${c.status === "resolvido" ? " caso-resolvido" : ""}`}>
              <button className="caso-topo" onClick={() => setAberto(expandido ? null : c.id)} aria-expanded={expandido}>
                <span className="caso-emoji">{emoji}</span>
                <span className="caso-info">
                  <span className="caso-titulo">{loja} · {problema}</span>
                  <span className="caso-meta">
                    {c.produto ? `${c.produto} · ` : ""}{dataBR(c.created_at)}
                    {c.status === "aberto" && dias > 0 ? ` · há ${dias} dia${dias > 1 ? "s" : ""}` : ""}
                  </span>
                </span>
                <span className={`caso-status caso-status-${c.status}`}>
                  {c.status === "resolvido" ? "Resolvido" : pro ? (c.prazo_em && new Date(c.prazo_em).getTime() < Date.now() ? "Prazo vencido" : c.enviado_em ? "Aguardando loja" : "Enviar agora") : "Em aberto"}
                </span>
              </button>

              {expandido && pro && (
                <div className="caso-corpo">
                  <CasoPro
                    caso={c}
                    eventos={eventos.filter(e => e.caso_id === c.id)}
                    onAcao={a => acaoPro(c, a)}
                    onCopiar={copiar}
                    onTexto={ev => setEventos(es => [...es, ev])}
                  />
                  <div className="caso-acoes">
                    <button className="btn btn-ghost btn-sm caso-apagar" onClick={() => apagar(c)}>Apagar caso</button>
                  </div>
                </div>
              )}

              {expandido && !pro && (
                <div className="caso-corpo">
                  <div className="tabs">
                    {(Object.keys(CHANNELS) as Channel[]).map(ch => (
                      <button key={ch} className={`tab${canal === ch ? " active" : ""}`} onClick={() => setCanal(ch)}>
                        {CHANNELS[ch].icon} {CHANNELS[ch].name}
                      </button>
                    ))}
                  </div>
                  <div className="caso-texto">{c.textos[canal]}</div>
                  <div className="caso-acoes">
                    <button className="btn btn-primary btn-sm" onClick={() => copiar(c.textos[canal])}>📋 Copiar texto</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => alternarStatus(c)}>
                      {c.status === "aberto" ? "✓ Marcar como resolvido" : "↺ Reabrir caso"}
                    </button>
                    <button className="btn btn-ghost btn-sm caso-apagar" onClick={() => apagar(c)}>Apagar</button>
                  </div>
                  {c.status === "aberto" && (
                    <div className="pro-teaser">
                      <div>
                        <strong>🛡️ Quer que a gente acompanhe este caso até o fim?</strong>
                        <p>Com o Pro: aviso de cada prazo, próximo texto gerado com o histórico do caso (Reclame Aqui, Consumidor.gov, Procon) e, em breve, modelo de petição pro Juizado.</p>
                      </div>
                      {interesse
                        ? <span className="pro-teaser-ok">✓ Você está na lista</span>
                        : <button className="btn btn-primary btn-sm" onClick={() => quererPro(c)}>Quero o Pro</button>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {toast && <div className="toast show">{toast}</div>}
    </>
  );
}
