"use client";

import { useRef, useState } from "react";
import { reduzirImagem } from "@/lib/imagem";

type Analise = {
  veredito: "resolve" | "parcial" | "enrolacao" | "negativa" | "sem_resposta_util";
  resumo: string;
  direitos: string;
  recomendacao: "aceitar" | "negociar" | "escalar";
  proximo_passo: string;
  alertas: string[];
  resposta: string;
  pro: boolean;
};

const VEREDITO: Record<Analise["veredito"], { icone: string; texto: string; classe: string }> = {
  resolve:           { icone: "✅", texto: "Resolve o seu problema", classe: "ok" },
  parcial:           { icone: "⚠️", texto: "Resolve só em parte", classe: "meio" },
  enrolacao:         { icone: "🚩", texto: "Enrolação", classe: "ruim" },
  negativa:          { icone: "❌", texto: "A loja negou", classe: "ruim" },
  sem_resposta_util: { icone: "❔", texto: "Não dá pra avaliar", classe: "meio" },
};

const RECOMENDACAO: Record<Analise["recomendacao"], string> = {
  aceitar: "Pode aceitar",
  negociar: "Negocie antes de aceitar",
  escalar: "Hora de subir o tom",
};

/** "A loja respondeu. E agora?": cola o texto ou sobe o print da resposta. */
export default function AnaliseResposta({
  casoId, onCopiar, onAnalisado,
}: {
  casoId: string;
  onCopiar: (texto: string) => void;
  onAnalisado?: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState("");
  const [prints, setPrints] = useState<File[]>([]);
  const [analisando, setAnalisando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [analise, setAnalise] = useState<Analise | null>(null);

  async function analisar() {
    setErro(null);
    setAnalisando(true);
    try {
      const imagens = await Promise.all(prints.map(reduzirImagem));
      const r = await fetch(`/api/casos/${casoId}/resposta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resposta: texto, imagens }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Não conseguimos analisar agora.");
      setAnalise(data as Analise);
      onAnalisado?.();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setAnalisando(false);
    }
  }

  if (!aberto) {
    return (
      <button className="btn btn-ghost btn-sm" onClick={() => setAberto(true)}>💬 A loja respondeu</button>
    );
  }

  if (analise) {
    const v = VEREDITO[analise.veredito];
    return (
      <div className="analise">
        <div className={`analise-veredito analise-${v.classe}`}>{v.icone} {v.texto}</div>
        <p className="analise-item"><b>O que a loja disse:</b> {analise.resumo}</p>
        <p className="analise-item"><b>Seus direitos:</b> {analise.direitos}</p>
        <p className="analise-item"><b>{RECOMENDACAO[analise.recomendacao]}:</b> {analise.proximo_passo}</p>
        {analise.alertas.length > 0 && (
          <ul className="analise-alertas">{analise.alertas.map((a, i) => <li key={i}>⚠️ {a}</li>)}</ul>
        )}
        <div className="analise-resposta-titulo">Sua resposta pra loja</div>
        <div className="caso-texto">{analise.resposta}</div>
        <div className="caso-acoes">
          <button className="btn btn-primary btn-sm" onClick={() => onCopiar(analise.resposta)}>📋 Copiar resposta</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setAnalise(null); setTexto(""); setPrints([]); }}>Analisar outra resposta</button>
        </div>
        <p className="analise-nota">
          Orientação geral com base no CDC, não é assessoria jurídica.
          {analise.pro ? " A resposta da loja entrou no histórico do caso." : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="analise">
      <div className="analise-titulo">💬 O que a loja respondeu?</div>
      <p className="analise-sub">Cole a resposta ou mande o print. A gente diz se resolve, o que você pode exigir e escreve sua resposta.</p>
      <textarea
        className="analise-campo"
        rows={4}
        placeholder="Ex.: Olá! Informamos que seu pedido está em análise. Como compensação, oferecemos um cupom de R$ 20..."
        value={texto}
        onChange={e => setTexto(e.target.value)}
        maxLength={4000}
      />
      <input ref={input} type="file" accept="image/*" multiple hidden
             onChange={e => { setPrints(p => [...p, ...Array.from(e.target.files ?? [])].slice(0, 2)); e.target.value = ""; }} />
      {prints.length > 0 && (
        <ul className="prints-lista">
          {prints.map((f, i) => (
            <li key={i}>
              <span>🖼️ {f.name.length > 28 ? `${f.name.slice(0, 25)}...` : f.name}</span>
              <button aria-label="Remover" onClick={() => setPrints(p => p.filter((_, j) => j !== i))}>×</button>
            </li>
          ))}
        </ul>
      )}
      <div className="caso-acoes">
        {prints.length < 2 && <button className="btn btn-ghost btn-sm" onClick={() => input.current?.click()} disabled={analisando}>📸 Enviar print</button>}
        <button className="btn btn-primary btn-sm" onClick={analisar} disabled={analisando || (texto.trim().length < 10 && prints.length === 0)}>
          {analisando ? "Analisando..." : "Analisar resposta →"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setAberto(false)} disabled={analisando}>Cancelar</button>
      </div>
      {erro && <p className="pro-erro">{erro}</p>}
    </div>
  );
}
