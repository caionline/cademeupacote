"use client";

import { useCallback, useEffect, useRef } from "react";
import { TURNSTILE_SITEKEY } from "@/lib/turnstile";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
  getResponse: (id: string) => string | undefined;
};
declare global {
  interface Window { turnstile?: TurnstileApi }
}

let carregando: Promise<void> | null = null;
function carregarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  carregando ??= new Promise((ok, erro) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => ok();
    s.onerror = () => erro(new Error("turnstile"));
    document.head.appendChild(s);
  });
  return carregando;
}

/**
 * Verificação "sou humano" quase invisível (só aparece se a Cloudflare desconfiar).
 * `obterToken()` espera o token ficar pronto; depois de usar, o token é renovado sozinho.
 */
export function useTurnstile() {
  const caixa = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | null>(null);

  useEffect(() => {
    let vivo = true;
    carregarScript().then(() => {
      if (!vivo || !caixa.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(caixa.current, {
        sitekey: TURNSTILE_SITEKEY,
        action: "turnstile-spin-v1",
        appearance: "interaction-only",
        language: "pt-br",
        callback: (t: string) => { token.current = t; },
        "expired-callback": () => { token.current = null; },
        "error-callback": () => { token.current = null; },
      });
    }).catch(() => {});
    return () => {
      vivo = false;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  /** Devolve um token (espera até 15s por ele) e já pede um novo pro próximo uso. */
  const obterToken = useCallback(async (): Promise<string | null> => {
    for (let i = 0; i < 30 && !token.current; i++) await new Promise(r => setTimeout(r, 500));
    const t = token.current;
    token.current = null;
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    return t;
  }, []);

  return { caixa, obterToken };
}
