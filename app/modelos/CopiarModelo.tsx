"use client";

import { useState } from "react";

/** Caixa com o texto do modelo e botão de copiar. */
export default function CopiarModelo({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  }

  return (
    <div className="modelo-caixa">
      <div className="modelo-caixa-topo">
        <span>Modelo para copiar</span>
        <button className="btn btn-primary btn-sm" onClick={copiar}>{copiado ? "✓ Copiado" : "📋 Copiar modelo"}</button>
      </div>
      <pre className="modelo-texto">{texto}</pre>
    </div>
  );
}
