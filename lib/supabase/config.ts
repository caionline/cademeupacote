// Chaves PÚBLICAS do Supabase (podem ir pro navegador). A chave secreta fica só em SUPABASE_SECRET_KEY.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aolyvifrskdhdftgrbkd.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_EOKxuEJk8FgA5qDw0nvnMA_6cyHqdMs";

// Versão dos termos aceitos no cadastro. Trocar quando /termos ou /privacidade mudarem.
export const TERMOS_VERSAO = "2026-10-15";
