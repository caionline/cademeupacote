"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PROBLEMS,
  STORES,
  CHANNELS,
  type Channel,
  type FormState,
  initialFormState,
} from "@/lib/constants";
import { formatCPF, validateCPF } from "@/lib/cpf";

const STORAGE_KEY = "cmp.app.v1";

type Step = 1 | 2 | 3 | 4 | 5;

export default function AppPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ whatsapp: string; reclameaqui: string; consumidor: string } | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel>("whatsapp");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [emailCaptured, setEmailCaptured] = useState(false);

  // Carrega rascunho do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm({ ...initialFormState, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // Salva rascunho enquanto preenche
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function back() {
    setError(null);
    if (step === 1) return;
    setStep((step - 1) as Step);
  }

  function next() {
    setError(null);
    setStep((step + 1) as Step);
  }

  // Gera os 3 textos via API
  async function gerar() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro ao gerar.");
      setResults(data);
      setStep(5);
    } catch (e: any) {
      setError(e.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    if (!results) return;
    try {
      await navigator.clipboard.writeText(results[activeChannel]);
      setCopied(true);
      showToast("Texto copiado! ✓");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Não consegui copiar. Selecione o texto manualmente.");
    }
  }

  function openWhatsApp() {
    if (!results) return;
    const text = encodeURIComponent(results.whatsapp);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function openReclameAqui() {
    window.open("https://www.reclameaqui.com.br", "_blank");
    showToast("Abri o Reclame Aqui — cole o texto lá");
  }

  function openConsumidorGov() {
    window.open("https://www.consumidor.gov.br", "_blank");
    showToast("Abri o Consumidor.gov — cole o texto lá");
  }

  async function captureEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) return;
    // Por enquanto só marca como capturado.
    // Próximo passo: integrar com Mailchimp/Brevo/Google Sheets.
    setEmailCaptured(true);
    showToast("Pronto! Vamos te lembrar em 7 dias 📧");
  }

  // Pode avançar?
  const canNext1 = !!form.problem;
  const canNext2 = !!form.store && (form.store !== "other" || form.storeOtherName.trim().length > 1);
  const canNext3 = form.product.trim().length > 1 && form.value.trim().length > 0;
  const canGenerate = form.name.trim().length > 1 && (form.cpf === "" || validateCPF(form.cpf));

  const totalSteps = 4;

  return (
    <div className="app-shell">
      {/* HEADER */}
      <header className="app-header">
        <div className="app-header-inner">
          {step === 1 ? (
            <Link href="/" className="app-back" aria-label="Voltar para o site">←</Link>
          ) : step < 5 ? (
            <button className="app-back" onClick={back} aria-label="Voltar">←</button>
          ) : (
            <button className="app-back" onClick={() => { setResults(null); setStep(1); }} aria-label="Reiniciar">←</button>
          )}

          {step < 5 && (
            <div className="progress-wrap">
              <div className="progress-head">
                <span>Passo {step} de {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
              </div>
            </div>
          )}

          <div className="logo" style={{ fontSize: 14 }}>
            <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 14 }}>📦</div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* STEP 1 — PROBLEMA */}
        {step === 1 && (
          <>
            <h1 className="app-h1">O que <em>aconteceu?</em></h1>
            <p className="app-sub">Escolha o problema que mais bate. Você poderá detalhar nos próximos passos.</p>
            <div className="option-list">
              {PROBLEMS.map(p => (
                <button
                  key={p.id}
                  className={`option ${p.hot ? "hot" : ""} ${form.problem === p.id ? "selected" : ""}`}
                  onClick={() => update("problem", p.id)}
                >
                  <div className="option-icon">{p.emoji}</div>
                  <div className="option-meta">
                    <div className="option-title">{p.title}</div>
                    <div className="option-sub">{p.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="app-footer-cta">
              <button className="btn btn-primary btn-block" disabled={!canNext1} onClick={next}>
                Continuar →
              </button>
            </div>
          </>
        )}

        {/* STEP 2 — LOJA */}
        {step === 2 && (
          <>
            <h1 className="app-h1">Em qual <em>loja?</em></h1>
            <p className="app-sub">Escolha a loja onde você fez a compra.</p>
            <div className="option-list">
              {STORES.map(s => (
                <button
                  key={s.id}
                  className={`option ${form.store === s.id ? "selected" : ""}`}
                  onClick={() => update("store", s.id)}
                >
                  <div className="option-icon">{s.emoji}</div>
                  <div className="option-meta">
                    <div className="option-title">{s.name}</div>
                  </div>
                </button>
              ))}
            </div>

            {form.store === "other" && (
              <div className="field" style={{ marginTop: 16 }}>
                <label>Qual o nome da loja?</label>
                <input
                  type="text"
                  placeholder="Ex: Loja XYZ"
                  value={form.storeOtherName}
                  onChange={e => update("storeOtherName", e.target.value)}
                />
              </div>
            )}

            <div className="app-footer-cta">
              <button className="btn btn-primary btn-block" disabled={!canNext2} onClick={next}>
                Continuar →
              </button>
            </div>
          </>
        )}

        {/* STEP 3 — DETALHES DA COMPRA */}
        {step === 3 && (
          <>
            <h1 className="app-h1">Detalhes da <em>compra</em></h1>
            <p className="app-sub">Quanto mais detalhes, mais forte fica o texto. Mas só o produto e valor são obrigatórios.</p>
            <div className="field-group">
              <div className="field">
                <label>Produto comprado *</label>
                <input
                  type="text"
                  placeholder="Ex: Tênis Nike Air Max 90, tamanho 42"
                  value={form.product}
                  onChange={e => update("product", e.target.value)}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Valor pago (R$) *</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 299,90"
                    value={form.value}
                    onChange={e => update("value", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Número do pedido</label>
                  <input
                    type="text"
                    placeholder="Ex: BR12345678"
                    value={form.orderNumber}
                    onChange={e => update("orderNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Data da compra</label>
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={e => update("purchaseDate", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Data prometida</label>
                  <input
                    type="date"
                    value={form.promisedDate}
                    onChange={e => update("promisedDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>Algo a mais que queira contar?</label>
                <textarea
                  placeholder="Ex: já tentei contato pelo SAC 3 vezes e ninguém retorna..."
                  value={form.details}
                  onChange={e => update("details", e.target.value)}
                />
                <span className="field-hint">Opcional, mas ajuda a personalizar a reclamação.</span>
              </div>
            </div>

            <div className="app-footer-cta">
              <button className="btn btn-primary btn-block" disabled={!canNext3} onClick={next}>
                Continuar →
              </button>
            </div>
          </>
        )}

        {/* STEP 4 — DADOS PESSOAIS + GERAR */}
        {step === 4 && (
          <>
            <h1 className="app-h1">Por último, <em>quem é você?</em></h1>
            <p className="app-sub">Vai aparecer assinando a reclamação. CPF é opcional, mas dá mais peso jurídico.</p>
            <div className="field-group">
              <div className="field">
                <label>Seu nome completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Maria Silva"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                />
              </div>
              <div className="field">
                <label>CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={e => update("cpf", formatCPF(e.target.value))}
                />
                <span className="field-hint">Opcional. Não armazenamos.</span>
                {form.cpf && !validateCPF(form.cpf) && (
                  <span style={{ color: "var(--danger)", fontSize: 13, marginTop: 4, display: "block" }}>
                    CPF inválido
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 16, padding: 14, background: "var(--hot)", border: "1px solid var(--hot-border)", borderRadius: 12, color: "var(--danger)", fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="app-footer-cta">
              <button
                className="btn btn-primary btn-block"
                disabled={!canGenerate || loading}
                onClick={gerar}
              >
                {loading ? "Gerando..." : "Gerar minha reclamação ⚡"}
              </button>
            </div>

            {loading && (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <div className="loading-text">A IA está escrevendo sua reclamação...</div>
                <div className="loading-substep">consultando o Código de Defesa do Consumidor</div>
              </div>
            )}
          </>
        )}

        {/* STEP 5 — RESULTADO */}
        {step === 5 && results && (
          <>
            <h1 className="app-h1">Suas reclamações <em>prontas</em></h1>
            <p className="app-sub">Escolha o canal, copie o texto e mande. Comece pelo SAC — se não responder em 48h, escale.</p>

            <div className="tabs">
              {(Object.keys(CHANNELS) as Channel[]).map(c => (
                <button
                  key={c}
                  className={`tab ${activeChannel === c ? "active" : ""}`}
                  onClick={() => setActiveChannel(c)}
                >
                  {CHANNELS[c].icon} {CHANNELS[c].name}
                </button>
              ))}
            </div>

            <div className="result-card">
              <div className="result-head">
                <div>
                  <div className="result-channel-name">{CHANNELS[activeChannel].name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 2 }}>
                    {CHANNELS[activeChannel].description}
                  </div>
                </div>
                <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copyText}>
                  {copied ? "✓ Copiado" : "📋 Copiar"}
                </button>
              </div>
              <div className="result-text">{results[activeChannel]}</div>
            </div>

            <div className="send-actions">
              {activeChannel === "whatsapp" && (
                <button className="btn btn-primary" onClick={openWhatsApp}>
                  Abrir no WhatsApp →
                </button>
              )}
              {activeChannel === "reclameaqui" && (
                <button className="btn btn-primary" onClick={openReclameAqui}>
                  Abrir Reclame Aqui →
                </button>
              )}
              {activeChannel === "consumidor" && (
                <button className="btn btn-primary" onClick={openConsumidorGov}>
                  Abrir Consumidor.gov →
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => { setResults(null); setStep(1); setForm(initialFormState); }}>
                Nova reclamação
              </button>
            </div>

            <div className="next-step-card">
              <h4>📬 Quer um lembrete em 7 dias?</h4>
              <p>A gente te avisa pra acompanhar a resposta da loja. Se ela não responder, mandamos o texto pronto pro próximo canal (Reclame Aqui ou Consumidor.gov).</p>
              {emailCaptured ? (
                <div style={{ color: "var(--success)", fontWeight: 600, fontSize: 14 }}>✓ Pronto! Vamos te avisar.</div>
              ) : (
                <form className="email-capture" onSubmit={captureEmail}>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                  />
                  <button type="submit">Quero o lembrete</button>
                </form>
              )}
            </div>
          </>
        )}
      </main>

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}
