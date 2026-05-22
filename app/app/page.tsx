"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { formatBRL, parseBRL } from "@/lib/currency";

const LOADING_MSGS = [
  "Analisando seu caso...",
  "Consultando o CDC...",
  "Escrevendo pra SAC da loja...",
  "Adaptando pra Reclame Aqui...",
  "Formalizando pra Consumidor.gov...",
  "Quase pronto...",
];

const STORAGE_KEY = "cmp.app.v1";

type Step = 1 | 2 | 3 | 4 | 5;

function SearchParamEffect({ onStore }: { onStore: (id: string) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    const storeParam = params.get("store");
    if (storeParam && STORES.find(s => s.id === storeParam)) {
      onStore(storeParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

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
  const [shareOpen, setShareOpen] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const selectedStore = STORES.find(s => s.id === form.store) ?? null;

  const storeName = form.store === "other"
    ? (form.storeOtherName.trim() || null)
    : (selectedStore?.name ?? null);
  const shareText = storeName
    ? `Acabei de gerar uma reclamação contra ${storeName} no Cadê Meu Pacote. Site bom demais, gera tudo com base no CDC em 3 minutos. 👀\n\nhttps://www.cademeupacote.com.br`
    : "Achei esse site que gera reclamação com base no CDC em 3 minutos. Tava precisando! 👀\n\nhttps://www.cademeupacote.com.br";

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

  useEffect(() => {
    if (!shareOpen) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setShareOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shareOpen]);

  useEffect(() => {
    if (!loading) return;
    setLoadingMsgIdx(0);
    const id = setInterval(() => {
      setLoadingMsgIdx(i => (i + 1) % LOADING_MSGS.length);
    }, 2500);
    return () => clearInterval(id);
  }, [loading]);

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

  async function openSAC() {
    if (!results || !selectedStore?.sacUrl) return;
    try {
      await navigator.clipboard.writeText(results.whatsapp);
    } catch {}
    window.open(selectedStore.sacUrl, "_blank");
    showToast("Texto copiado! Cole no chat da loja ✓");
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
    setEmailCaptured(true);
    showToast("Pronto! Vamos te lembrar em 7 dias 📧");
    try {
      await fetch("/api/capturar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:     form.email,
          storeId:   form.store,
          problemId: form.problem,
        }),
      });
    } catch (err) {
      console.error("Erro ao capturar email:", err);
    }
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  function shareTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  }

  async function shareLink() {
    try { await navigator.clipboard.writeText(shareText); } catch {}
    showToast("Link copiado! ✓");
    setShareOpen(false);
  }

  // Pode avançar?
  const canNext1 = !!form.problem;
  const canNext2 = !!form.store && (form.store !== "other" || form.storeOtherName.trim().length > 1);
  const dateError = form.purchaseDate && form.promisedDate && form.promisedDate < form.purchaseDate
    ? "A data prometida não pode ser anterior à data da compra"
    : null;
  const canNext3 = form.product.trim().length > 1 && form.value.trim().length > 0 && !dateError;
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

          <Link href="/" className="logo" style={{ fontSize: 14, cursor: "pointer" }} title="Voltar para home">
            <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 14 }}>📦</div>
          </Link>
        </div>
      </header>

      <main className="app-main">
        <Suspense>
          <SearchParamEffect onStore={(id) => update("store", id)} />
        </Suspense>

        {/* STEP 1 — PROBLEMA */}
        {step === 1 && (
          <>
            <div className="section-kicker" style={{ fontFamily: "var(--mono)", fontSize: 13, marginBottom: 12 }}>4 passos · sem cadastro · menos de 3 minutos</div>
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
                    inputMode="numeric"
                    placeholder="R$ 0,00"
                    value={form.value ? `R$ ${form.value}` : ""}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, "");
                      if (!digits) { update("value", ""); return; }
                      update("value", parseBRL(formatBRL(digits)));
                    }}
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
              {dateError && (
                <span style={{ color: "var(--danger)", fontSize: 13, marginTop: -8, display: "block" }}>
                  {dateError}
                </span>
              )}

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

            <p style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 12, lineHeight: 1.6 }}>
              📊 Dados anônimos (loja + tipo de problema) nos ajudam a mapear lojas problemáticas. Não coletamos seu nome, CPF ou email.
            </p>

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
                <div key={loadingMsgIdx} className="loading-text loading-fade">
                  {LOADING_MSGS[loadingMsgIdx]}
                </div>
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
                selectedStore?.sacUrl ? (
                  <button
                    className="btn btn-primary"
                    onClick={openSAC}
                    title="Copia o texto e abre o atendimento oficial"
                  >
                    Abrir SAC da {selectedStore.name} →
                  </button>
                ) : (
                  <>
                    <button className="btn btn-primary" onClick={copyText}>
                      📋 Copiar texto
                    </button>
                    <p style={{ fontSize: 13, color: "var(--text-subtle)", marginTop: 4, textAlign: "center" }}>
                      Copie o texto e cole no canal de atendimento da sua loja
                    </p>
                  </>
                )
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
              <button className="btn btn-ghost" onClick={() => { setResults(null); setStep(1); }}>
                ← Editar dados
              </button>
            </div>

            {activeChannel === "whatsapp" && (
              <p style={{ fontSize: 12, color: "var(--text-subtle)", textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
                Se o canal direto não abrir, copie o texto acima e procure o atendimento da loja diretamente.
              </p>
            )}

            <div className="next-step-card">
              <h4 style={{ fontFamily: "Fraunces, serif" }}>🚀 Conhece alguém que precisa disso?</h4>
              <p>Compartilha o site. Você pode ajudar muita gente.</p>
              <button className="btn btn-ghost" onClick={() => setShareOpen(true)}>
                Compartilhar →
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

      {shareOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setShareOpen(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 20, padding: 28,
              width: "100%", maxWidth: 420,
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              autoFocus
              aria-label="Fechar"
              onClick={() => setShareOpen(false)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "none", border: "none", cursor: "pointer",
                fontSize: 22, color: "#78716C", lineHeight: 1, padding: "4px 8px",
              }}
            >
              ×
            </button>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "0 0 20px" }}>
              Compartilhar com...
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "WhatsApp", icon: "💚", action: shareWhatsApp },
                { label: "Twitter / X", icon: "🐦", action: shareTwitter },
                { label: "Copiar link", icon: "🔗", action: shareLink },
              ].map(({ label, icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    height: 56, borderRadius: 14,
                    border: "1px solid #E7E5E4", background: "#fff",
                    cursor: "pointer", fontSize: 16, fontWeight: 500,
                    padding: "0 20px", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}
