"use client";

import { useState } from "react";

/** Formulário da lista de espera do Pro (cartão "Pro" da landing). */
export default function ProWaitlistBanner() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/capturar-email", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, storeId: null, problemId: "pro-waitlist" }),
      });
    } catch {}
    setStatus("done");
  }

  if (status === "done") {
    return <p className="waitlist-ok">Pronto! Você está na lista e garante o preço de fundador 🎯</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="pro-email">
        <input
          type="email"
          required
          placeholder="seu@email.com"
          aria-label="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === "loading"} className="btn btn-primary">
          {status === "loading" ? "Enviando..." : "Quero o preço de fundador →"}
        </button>
      </form>
      <p className="waitlist-nota">Sem compromisso. Você só paga quando o Pro lançar, se quiser.</p>
    </>
  );
}
