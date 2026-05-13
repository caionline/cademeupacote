"use client";

import { useState } from "react";

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

  return (
    <div style={{
      background:   "var(--primary-soft)",
      border:       "1px solid var(--primary-border)",
      borderRadius: 20,
      padding:      24,
      maxWidth:     800,
      margin:       "0 auto 40px",
      textAlign:    "center",
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🔥</div>
      <h3 style={{
        fontFamily:    "var(--font-display)",
        fontSize:      24,
        fontWeight:    700,
        marginBottom:  8,
        letterSpacing: "-0.3px",
      }}>
        Plano Pro com peça pro Juizado: em breve
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
        Vamos lançar geração automática de peças prontas pra abrir Juizado Especial. Quer ser avisado quando lançar?
      </p>
      {status === "done" ? (
        <p style={{ fontWeight: 600, color: "var(--success)", fontSize: 15 }}>
          Pronto! Vamos te avisar 🎯
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              padding:      "12px 16px",
              borderRadius: 10,
              border:       "1px solid var(--primary-border)",
              fontSize:     15,
              width:        260,
              outline:      "none",
              background:   "white",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-primary"
            style={{ fontSize: 15, padding: "12px 20px" }}
          >
            {status === "loading" ? "Enviando..." : "Me avisa →"}
          </button>
        </form>
      )}
    </div>
  );
}
