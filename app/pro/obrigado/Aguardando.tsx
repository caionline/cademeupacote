"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** Recarrega a página a cada 3s por até 2 min, esperando o aviso do Mercado Pago. */
export default function Aguardando() {
  const router = useRouter();
  const [tentativas, setTentativas] = useState(0);

  useEffect(() => {
    if (tentativas >= 40) return;
    const t = setTimeout(() => { router.refresh(); setTentativas(n => n + 1); }, 3000);
    return () => clearTimeout(t);
  }, [tentativas, router]);

  return tentativas >= 40 ? (
    <p className="conta-sub">
      Está demorando mais que o normal. Se você pagou, o Pro é liberado assim que o Mercado Pago confirmar e te avisamos.{" "}
      <Link href="/meus-casos">Ir pros meus casos</Link>
    </p>
  ) : (
    <div className="loading-spinner" style={{ margin: "8px auto 0" }} />
  );
}
