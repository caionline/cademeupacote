"use client";

import { useRef, useState } from "react";
import { reduzirImagem } from "@/lib/imagem";
import { useTurnstile } from "@/app/components/useTurnstile";

export type DadosExtraidos = {
  loja_id: string | null;
  loja_nome: string | null;
  problema_id: string | null;
  produto: string | null;
  valor: string | null;
  data_compra: string | null;
  data_prometida: string | null;
  numero_pedido: string | null;
  fatos: string | null;
};

const MAX = 4;
/** "Tem prints da compra?": a IA lê e preenche o formulário. As imagens não são guardadas. */
export default function PrintsUpload({ onPreencher }: { onPreencher: (d: DadosExtraidos) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [lendo, setLendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const humano = useTurnstile();

  function escolher(lista: FileList | null) {
    setErro(null);
    if (!lista) return;
    const imgs = Array.from(lista).filter(f => f.type.startsWith("image/"));
    const junto = [...arquivos, ...imgs].slice(0, MAX);
    if (arquivos.length + imgs.length > MAX) setErro(`Usamos até ${MAX} prints. Escolha os mais importantes.`);
    setArquivos(junto);
  }

  async function ler() {
    setErro(null);
    setLendo(true);
    try {
      const imagens = await Promise.all(arquivos.map(reduzirImagem));
      const r = await fetch("/api/extrair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagens, turnstile: await humano.obterToken() }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Não conseguimos ler os prints.");
      onPreencher(data as DadosExtraidos);
      setArquivos([]);
    } catch (e) {
      setErro((e as Error).message || "Não conseguimos ler os prints.");
    } finally {
      setLendo(false);
    }
  }

  return (
    <div className="prints">
      <div className="prints-topo">
        <span className="prints-icone">📸</span>
        <div>
          <strong>Tem prints da compra? A gente preenche pra você.</strong>
          <p>Pedido, rastreio, e-mail da loja ou conversa com o vendedor. Você confere tudo antes de gerar.</p>
        </div>
      </div>

      {arquivos.length > 0 && (
        <ul className="prints-lista">
          {arquivos.map((f, i) => (
            <li key={i}>
              <span>🖼️ {f.name.length > 28 ? `${f.name.slice(0, 25)}...` : f.name}</span>
              <button aria-label="Remover" onClick={() => setArquivos(a => a.filter((_, j) => j !== i))} disabled={lendo}>×</button>
            </li>
          ))}
        </ul>
      )}

      <input ref={input} type="file" accept="image/*" multiple hidden onChange={e => { escolher(e.target.files); e.target.value = ""; }} />

      <div className="prints-acoes">
        {arquivos.length < MAX && (
          <button className="btn btn-ghost btn-sm" onClick={() => input.current?.click()} disabled={lendo}>
            {arquivos.length ? "+ Adicionar print" : "Escolher prints"}
          </button>
        )}
        {arquivos.length > 0 && (
          <button className="btn btn-primary btn-sm" onClick={ler} disabled={lendo}>
            {lendo ? "Lendo os prints..." : `Ler ${arquivos.length} print${arquivos.length > 1 ? "s" : ""} →`}
          </button>
        )}
      </div>
      {erro && <p className="prints-erro">{erro}</p>}
      <div ref={humano.caixa} className="turnstile-caixa" />
      <p className="prints-nota">Os prints não ficam guardados: a IA lê, preenche e descarta. Até {MAX} por vez.</p>
    </div>
  );
}
